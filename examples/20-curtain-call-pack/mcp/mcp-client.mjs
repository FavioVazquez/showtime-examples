// A small MCP client: starts showtime's MCP server over stdio (one JSON-RPC message per line), calls a list
// of tools in order, and writes a transcript. Usage: node mcp-client.mjs <server.mjs> <calls.json> <transcript.jsonl>
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import readline from 'node:readline';

const [serverPath, callsPath, outPath] = process.argv.slice(2);
const calls = JSON.parse(fs.readFileSync(callsPath, 'utf8'));
const out = fs.createWriteStream(outPath);
const log = (dir, msg) => out.write(JSON.stringify({ t: new Date().toISOString(), dir, msg }) + '\n');

const srv = spawn(process.execPath, [serverPath], { stdio: ['pipe', 'pipe', 'inherit'], env: process.env });
const rl = readline.createInterface({ input: srv.stdout });
const pending = new Map();
rl.on('line', (line) => {
  if (!line.trim()) return;
  const msg = JSON.parse(line);
  log('in', msg);
  if (msg.id !== undefined && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); }
  else if (msg.method === 'notifications/progress') process.stderr.write(`  progress ${msg.params.progress}/${msg.params.total ?? '?'} ${msg.params.message ?? ''}\n`);
});
let nextId = 1;
const send = (method, params, notify = false) => {
  const msg = { jsonrpc: '2.0', method, ...(params ? { params } : {}) };
  if (!notify) msg.id = nextId++;
  log('out', msg);
  srv.stdin.write(JSON.stringify(msg) + '\n');
  return notify ? Promise.resolve() : new Promise((res) => pending.set(msg.id, res));
};

const init = await send('initialize', { protocolVersion: '2025-11-25', capabilities: {}, clientInfo: { name: 'curtain-call-pack-client', version: '1.0' } });
console.log(`server: ${init.result.serverInfo.name} ${init.result.serverInfo.version} (protocol ${init.result.protocolVersion})`);
await send('notifications/initialized', null, true);
const list = await send('tools/list', {});
console.log(`tools: ${list.result.tools.length}`);
const summary = [];
for (const c of calls) {
  const t0 = Date.now();
  const r = await send('tools/call', { name: c.name, arguments: c.arguments, _meta: { progressToken: `p${nextId}` } });
  const text = (r.result?.content || []).map((x) => x.text || '').join('\n');
  const status = r.error ? `ERROR ${r.error.message}` : (r.result?.isError ? 'FAILED' : text.split('\n')[0]);
  const secs = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`\n=== ${c.name} (${secs}s): ${status}\n${text}`);
  summary.push({ tool: c.name, arguments: c.arguments, status, seconds: Number(secs) });
}
fs.writeFileSync(outPath.replace(/\.jsonl$/, '.summary.json'), JSON.stringify(summary, null, 2));
srv.stdin.end();
srv.kill();

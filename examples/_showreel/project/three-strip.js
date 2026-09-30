// three.js · ST.three: 60,000 seeded points fly in and zip into a Möbius film strip.
import * as THREE from '/_lib/three/build/three.module.js';

const T0 = 10, N = 60000, R = 2.35, W = 0.7;
const canvas = document.getElementById('gl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1); renderer.setSize(1920, 1080, false); renderer.setClearColor(0x0a1224, 1);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(36, 16 / 9, 0.05, 100);

const r = ST.rand('mobius-strip');
const strip = (u, v) => {                       // Möbius band, tilted towards the camera
  const c = R + v * Math.cos(u / 2);
  return [c * Math.cos(u), v * Math.sin(u / 2), c * Math.sin(u)];
};
const start = new Float32Array(N * 3), target = new Float32Array(N * 3);
const delay = new Float32Array(N), bright = new Float32Array(N), uu = new Float32Array(N), tint = new Float32Array(N), psz = new Float32Array(N);
const HOLES = 72, FRAMES = 36;
const picture = (f, a, b) => {                  // a, b in 0..1 inside frame f: a tiny "shot" per frame
  switch (f % 4) {
    case 0: { const d = Math.hypot(a - 0.5, (b - 0.5) * 1.3); return d < 0.26 ? 0.95 : 0.14 + 0.2 * (1 - d); }
    case 1: return b < 0.42 ? 0.85 - b : 0.16;
    case 2: return ((a + b) * 3.2) % 1 < 0.45 ? 0.8 : 0.14;
    default: return a > 0.55 && b > 0.5 ? 0.9 : 0.15 + 0.3 * a;
  }
};
for (let i = 0; i < N; i++) {
  let u, v, b, tn = 0, sz = 0.05;
  const kind = r();
  for (;;) {
    u = r() * Math.PI * 2;
    if (kind < 0.42) {                             // the two rails with sprocket holes
      v = (r() < 0.5 ? -1 : 1) * (0.74 + 0.26 * r()) * W;
      const ph = (u / (Math.PI * 2) * HOLES) % 1, av = Math.abs(v) / W;
      if (ph > 0.3 && ph < 0.7 && av > 0.8 && av < 0.93) continue;
      b = 1.0; sz = 0.058;
    } else if (kind < 0.54) {                      // frame dividers
      const f = Math.floor(r() * FRAMES); u = (f + (r() - 0.5) * 0.05) / FRAMES * Math.PI * 2;
      v = (r() * 2 - 1) * 0.72 * W; b = 1.0; sz = 0.05;
    } else {                                       // inside the frames: each frame holds a small picture
      v = (r() * 2 - 1) * 0.7 * W;
      const x = u / (Math.PI * 2) * FRAMES, f = Math.floor(x), a = x - f;
      if (a < 0.05 || a > 0.95) continue;
      b = picture(f, a, (v / (0.7 * W) + 1) / 2);
      tn = f % 6 === 2 ? 1 : 0; sz = 0.046;
    }
    break;
  }
  const p = strip(u, v);
  target.set(p, i * 3);
  const a = r() * Math.PI * 2, rad = 2.6 + 5.2 * Math.sqrt(r()), y = (r() - 0.5) * 4.2 * (1 - 0.4 * r());
  start.set([Math.cos(a) * rad, y, Math.sin(a) * rad], i * 3);
  delay[i] = 0.1 + 1.95 * (u / (Math.PI * 2)) + 0.35 * r();
  bright[i] = b; uu[i] = u; tint[i] = tn; psz[i] = sz;
}
const geo = new THREE.BufferGeometry();
const pos = new Float32Array(N * 3), col = new Float32Array(N * 3), size = new Float32Array(N);
geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
geo.setAttribute('size', new THREE.BufferAttribute(size, 1));
const mat = new THREE.ShaderMaterial({
  transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  vertexShader: `attribute float size; attribute vec3 color; varying vec3 vC; varying float vF;
    void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0); gl_Position = projectionMatrix * mv;
      gl_PointSize = size * (520.0 / -mv.z); vC = color; vF = clamp(1.25 - (-mv.z - 3.0) / 14.0, 0.25, 1.0); }`,
  fragmentShader: `varying vec3 vC; varying float vF;
    void main(){ vec2 d = gl_PointCoord - 0.5; float r = length(d); if (r > 0.5) discard;
      float a = smoothstep(0.5, 0.0, r); gl_FragColor = vec4(vC * vF, a * vF); }`,
});
const points = new THREE.Points(geo, mat);
points.frustumCulled = false;                    // positions change every frame: never cull on a stale bound
scene.add(points);
// the strip's centre line in mint, drawn on once the points arrive
const lineGeo = new THREE.BufferGeometry();
const LN = 720, lp = new Float32Array((LN + 1) * 3);
for (let k = 0; k <= LN; k++) lp.set(strip((k / LN) * Math.PI * 4, 0), k * 3);
lineGeo.setAttribute('position', new THREE.BufferAttribute(lp, 3));
const lineMat = new THREE.LineBasicMaterial({ color: 0x7bf5c0, transparent: true, opacity: 0.0 });
const line = new THREE.Line(lineGeo, lineMat); line.frustumCulled = false; scene.add(line);

const ICE = [0.90, 0.93, 0.97], MINT = [0.48, 0.96, 0.75];
const clamp = (x) => Math.min(1, Math.max(0, x));
const easeIO = (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);

ST.three(renderer, scene, camera, (t) => {
  if (t < T0 - 0.05 || t > 16.6) return;          // off screen: skip the work
  const lt = Math.max(0, t - T0);
  const pulse = lt - 3.95;                        // the music's peak at 14.0: a mint wave runs the loop
  for (let i = 0; i < N; i++) {
    const p = easeIO(clamp((lt + 0.55 - delay[i]) / 1.45));   // already streaming at the cut
    const sw = (1 - p) * 2.4;                     // swirl: the cloud turns as it collapses
    const sx = start[i * 3], sy = start[i * 3 + 1], sz = start[i * 3 + 2];
    const cs = Math.cos(sw), sn = Math.sin(sw);
    const rx = sx * cs - sz * sn, rz = sx * sn + sz * cs;
    pos[i * 3] = rx + (target[i * 3] - rx) * p;
    pos[i * 3 + 1] = sy + (target[i * 3 + 1] - sy) * p;
    pos[i * 3 + 2] = rz + (target[i * 3 + 2] - rz) * p;
    const front = p > 0.02 && p < 0.97 ? 1 : 0;
    let m = Math.max(front * 0.85, tint[i] * p);
    if (pulse > 0) {
      const d = Math.abs(((uu[i] / (Math.PI * 2)) - pulse * 0.62) % 1);
      m = Math.max(m, Math.exp(-Math.pow(Math.min(d, 1 - d) * 9, 2)) * clamp(1.6 - pulse));
    }
    const b = bright[i] * (0.7 + 0.3 * p);
    col[i * 3] = (ICE[0] + (MINT[0] - ICE[0]) * m) * b;
    col[i * 3 + 1] = (ICE[1] + (MINT[1] - ICE[1]) * m) * b;
    col[i * 3 + 2] = (ICE[2] + (MINT[2] - ICE[2]) * m) * b;
    size[i] = psz[i] * (1 + 0.5 * m);
  }
  geo.attributes.position.needsUpdate = true; geo.attributes.color.needsUpdate = true; geo.attributes.size.needsUpdate = true;
  lineMat.opacity = 0.35 * clamp((lt - 3.3) / 0.6);
  points.rotation.y = line.rotation.y = 0.1 * lt;
  if (lt < 4) {                                    // shot 10: orbit and dolly in
    const e = easeIO(clamp(lt / 4));
    const a = 0.75 + 0.2 * lt, rad = 10.8 - 3.5 * e, hgt = 3.7 - 1.8 * e;
    camera.position.set(Math.cos(a) * rad, hgt, Math.sin(a) * rad);
    camera.lookAt(0, -0.25 + 0.15 * e, 0);
  } else {                                         // shot 11: a second camera riding along the strip
    const k = lt - 4, u = 0.55 + 0.32 * k;
    const [x, y, z] = strip(u, 0), [x2, y2, z2] = strip(u + 0.9, 0);
    const out = 2.9;
    camera.position.set(x * (1 + out / R) * 0.98, y + 1.6, z * (1 + out / R) * 0.98);
    camera.lookAt(x2 * 0.92, y2 - 0.1, z2 * 0.92);
  }
});

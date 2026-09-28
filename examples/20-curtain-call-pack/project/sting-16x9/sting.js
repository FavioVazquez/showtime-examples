// Curtain Call motion pack sting (C1 "Velvet curtain", 3D). One scene, three native layouts.
// Every value is a closed-form function of t: no physics stepping, no state between frames.
//
// Beats (seconds)
//   0.0-0.15 stage dark, curtains almost closed, the gold pool already lit through the gap
//   0.15-2.3 the curtains part (the bottom hem trails the top), the camera dollies in ~7 %
//   2.05-2.8 the mark is flown in from the flies and lands in the pool at HIT (sound-logo tonic)
//   3.05-5.0  the wordmark wipes up under the mark (logo-reveal mask in the page) and holds
import * as THREE from '/_lib/three/build/three.module.js';

const HIT = 2.8;
const C = {
  stage: [0x15, 0x10, 0x0e], velvet: [0xb3, 0x12, 0x1f], deep: [0x6e, 0x0b, 0x16],
  shadow: [0x3a, 0x0a, 0x0f], sheen: [0xd0, 0x41, 0x3a], gold: [0xe9, 0xb9, 0x49], cream: [0xf5, 0xeb, 0xdc],
};
const v3 = (c) => new THREE.Vector3(c[0] / 255, c[1] / 255, c[2] / 255);
const glsl = (c) => `vec3(${(c[0] / 255).toFixed(4)}, ${(c[1] / 255).toFixed(4)}, ${(c[2] / 255).toFixed(4)})`;

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const seg = (t, a, b) => clamp((t - a) / (b - a));
const inOutCubic = (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
const outCubic = (p) => 1 - Math.pow(1 - p, 3);
const inOutQuad = (p) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);
const inOutSine = (p) => -(Math.cos(Math.PI * p) - 1) / 2;

// Per-layout camera and framing. wvis = visible width (world units) at the mark's plane; slit = the half gap
// at t = 0 as a share of the half width, so frame 0 is the same ~11-12 % slit in every layout (wide: 0.22 units).
const LAYOUTS = {
  wide:   { wvis: 6.0, D: 7.4, camY: 0.95, tgtY: 0.22 },
  square: { wvis: 3.7, D: 7.4, camY: 1.25, tgtY: 0.20, slit: 0.107 },
  tall:   { wvis: 2.0, D: 7.8, camY: 1.15, tgtY: 0.20, slit: 0.100 },
};

export function build(layoutName) {
  const L = LAYOUTS[layoutName];
  const W = ST.cfg.width, H = ST.cfg.height, aspect = W / H;
  const canvas = document.getElementById('gl');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true, alpha: false });
  renderer.setPixelRatio(window.devicePixelRatio || 1);
  renderer.setSize(W, H, false);
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace; // colours below are written as sRGB values, passed through
  renderer.setClearColor(new THREE.Color(C.stage[0] / 255, C.stage[1] / 255, C.stage[2] / 255), 1);

  const scene = new THREE.Scene();
  const fov = (2 * Math.atan((L.wvis / aspect / 2) / L.D) * 180) / Math.PI;
  const camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 60);

  // visible half sizes at the curtain plane (z = CZ), for the widest camera (t = 0)
  const CZ = 2.6;
  const distC = L.D - CZ;
  const halfH = Math.tan((fov * Math.PI) / 360) * distC;
  const halfW = halfH * aspect;
  const top = L.camY + (L.tgtY - L.camY) * (distC / L.D) + halfH + 0.3;

  const beamTop = new THREE.Vector3(0.0, top + 2.5, 0.6);
  const POOL = new THREE.Vector3(0, 0, 0.05);
  const POOL_R = 1.05;
  const U = { uT: { value: 0 }, uLit: { value: 1 }, uPulse: { value: 0 }, uShadow: { value: 0 } };

  // ---------------------------------------------------------------- floor (boards + gold pool)
  const floorMat = new THREE.ShaderMaterial({
    uniforms: U,
    vertexShader: `varying vec3 vW; void main(){ vec4 w = modelMatrix*vec4(position,1.); vW = w.xyz; gl_Position = projectionMatrix*viewMatrix*w; }`,
    fragmentShader: `
      varying vec3 vW; uniform float uT; uniform float uPulse; uniform float uShadow;
      float h(float n){ return fract(sin(n*127.1)*43758.5453); }
      void main(){
        vec3 stage = ${glsl(C.stage)};
        // boards: faint planks running upstage, each a slightly different tone
        float plank = floor(vW.x*3.2);
        float tone = 1.25 + 0.18*h(plank);
        float seam = smoothstep(0.0, 0.035, abs(fract(vW.x*3.2)-0.5)*2.0-0.93);
        vec3 col = stage*tone*(1.0-0.35*(1.0-seam));
        // pool: an ellipse of warm light, hot centre, soft rim
        vec2 d = vec2(vW.x-${POOL.x.toFixed(3)}, (vW.z-${POOL.z.toFixed(3)})*1.08);
        float r = length(d)/${POOL_R.toFixed(3)};
        float pool = smoothstep(1.0, 0.55, r);
        float hot = smoothstep(0.75, 0.0, r);
        float spill = exp(-r*r*0.55)*0.10;
        vec3 gold = ${glsl(C.gold)};
        vec3 cream = ${glsl(C.cream)};
        float k = 1.0 + 0.22*uPulse;
        col += (gold*pool*0.62 + mix(gold, cream, 0.5)*hot*0.30)*k + gold*spill;
        // contact shadow of the mark (falls upstage, away from the light)
        vec2 sd = vec2(vW.x/0.62, (vW.z + 0.18)/0.26);
        col *= 1.0 - uShadow*0.55*smoothstep(1.0, 0.2, length(sd));
        // the apron fades to the house dark toward the camera; footlights warm the lip
        col *= mix(1.0, 0.55, smoothstep(0.8, 3.5, vW.z));
        col += ${glsl(C.gold)}*0.035*smoothstep(2.0, 5.0, vW.z);   // footlight warmth on the apron
        gl_FragColor = vec4(col, 1.0);
      }`,
  });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 30), floorMat);
  floor.rotation.x = -Math.PI / 2; floor.position.set(0, 0, 0);
  scene.add(floor);

  // ---------------------------------------------------------------- back wall (dark cyclorama)
  const wallMat = new THREE.ShaderMaterial({
    uniforms: U,
    vertexShader: `varying vec3 vW; void main(){ vec4 w = modelMatrix*vec4(position,1.); vW = w.xyz; gl_Position = projectionMatrix*viewMatrix*w; }`,
    fragmentShader: `
      varying vec3 vW;
      void main(){
        vec3 stage = ${glsl(C.stage)};
        float glow = exp(-(vW.x*vW.x)/3.2 - pow(max(vW.y-0.6,0.0),2.0)/5.0);
        vec3 col = stage*0.95 + ${glsl(C.gold)}*glow*0.045 + ${glsl(C.deep)}*glow*0.05;
        gl_FragColor = vec4(col, 1.0);
      }`,
  });
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(40, 30), wallMat);
  wall.position.set(0, 10, -3.0);
  scene.add(wall);

  // ---------------------------------------------------------------- beam (volumetric fake) + dust
  const beamH = beamTop.y - 0.0;
  const beamGeo = new THREE.CylinderGeometry(0.06, POOL_R * 0.98, beamH, 64, 24, true);
  beamGeo.translate(0, beamH / 2, 0);
  const beamMat = new THREE.ShaderMaterial({
    uniforms: U, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.FrontSide,
    vertexShader: `
      varying vec3 vN; varying vec3 vV; varying float vY; varying vec3 vW;
      void main(){ vec4 w = modelMatrix*vec4(position,1.); vW = w.xyz; vY = position.y;
        vN = normalize(mat3(modelMatrix)*normal); vV = normalize(cameraPosition - w.xyz);
        gl_Position = projectionMatrix*viewMatrix*w; }`,
    fragmentShader: `
      varying vec3 vN; varying vec3 vV; varying float vY; varying vec3 vW; uniform float uT;
      float hash(vec2 p){ return fract(sin(dot(p, vec2(41.3, 289.1)))*43758.5453); }
      float noise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
        return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y); }
      void main(){
        float facing = abs(dot(normalize(vN), normalize(vV)));
        float core = pow(facing, 1.6);
        float hNorm = clamp(vY/${beamH.toFixed(3)}, 0.0, 1.0);
        float fade = smoothstep(1.0, 0.55, hNorm) * (0.55 + 0.45*smoothstep(0.0, 0.25, hNorm));
        float haze = 0.75 + 0.5*noise(vec2(vW.x*2.2 + uT*0.07, vW.y*1.1 - uT*0.12));
        vec3 col = ${glsl(C.gold)}*core*fade*haze*0.22;
        gl_FragColor = vec4(col, 1.0);
      }`,
  });
  const beam = new THREE.Mesh(beamGeo, beamMat);
  beam.position.copy(POOL); beam.position.y = 0;
  // tilt so the apex sits at beamTop
  const dir = new THREE.Vector3().subVectors(beamTop, new THREE.Vector3(POOL.x, 0, POOL.z));
  beam.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
  beam.scale.y = dir.length() / beamH;
  scene.add(beam);

  const N = 260, r = ST.rand('dust');
  const dustPos = new Float32Array(N * 3), seeds = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) { seeds[i * 3] = r(); seeds[i * 3 + 1] = r(); seeds[i * 3 + 2] = r(); }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  dustGeo.setAttribute('seed', new THREE.BufferAttribute(seeds, 3));
  const dustMat = new THREE.ShaderMaterial({
    uniforms: { ...U, uScale: { value: H * (window.devicePixelRatio || 1) } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `
      attribute vec3 seed; uniform float uT; uniform float uScale; uniform float uShadow; varying float vA;
      void main(){
        float y = mod(seed.y*3.2 + uT*(0.05 + 0.08*seed.z), 3.2);            // slow rise, wraps
        // motes stay inside the beam's cone (axis tilts from the pool to the lamp), so none drift in the dark
        float f = y / ${beamTop.y.toFixed(3)};
        vec2 ax = mix(vec2(${POOL.x.toFixed(3)}, ${POOL.z.toFixed(3)}), vec2(${beamTop.x.toFixed(3)}, ${beamTop.z.toFixed(3)}), f);
        float rr = sqrt(seed.x) * mix(${(POOL_R * 0.98).toFixed(3)}, 0.06, f) * 0.82;
        float a = seed.z*6.2831 + uT*(0.15 + 0.2*seed.x) + sin(uT*0.7 + seed.y*9.0)*0.3;
        vec3 p = vec3(ax.x + cos(a)*rr, y, ax.y + sin(a)*rr*0.8);
        vec4 mv = viewMatrix*vec4(p,1.);
        gl_PointSize = (1.4 + 2.2*seed.y) * uScale / 1080.0 * (7.0 / -mv.z);
        vA = (0.35 + 0.65*seed.x) * (0.6 + 0.4*sin(uT*2.0 + seed.z*20.0)) * smoothstep(3.2, 2.2, y) * smoothstep(0.0, 0.3, y);
        // no motes over the face of the landed mark (no effects on the mark): fade those in front of it
        float onFace = (1.0 - smoothstep(0.48, 0.62, abs(p.x))) * (1.0 - smoothstep(1.0, 1.12, y)) * smoothstep(0.08, 0.2, p.z);
        vA *= 1.0 - uShadow*onFace;
        gl_Position = projectionMatrix*mv; }`,
    fragmentShader: `
      varying float vA;
      void main(){ vec2 c = gl_PointCoord - 0.5; float d = length(c);
        float a = smoothstep(0.5, 0.0, d) * vA;
        gl_FragColor = vec4(mix(${glsl(C.gold)}, ${glsl(C.cream)}, 0.5)*a*0.55, 1.0); }`,
  });
  const dust = new THREE.Points(dustGeo, dustMat);
  scene.add(dust);

  // ---------------------------------------------------------------- curtains (velvet, closed-form folds)
  const curtainW = halfW + 0.9;                 // from the centre line to past the frame edge
  const curtainTop = top + 0.2, curtainBot = 0.03;   // the hem clears the boards
  const G0 = L.slit ? L.slit * halfW : 0.22;    // half gap at t = 0: a slit of light
  const GFULL = halfW * 0.80;                   // half gap when open: the drapes gather at the sides
  const curtainVS = `
    uniform float uT; uniform float uSide; uniform float uOpen0; uniform float uOpenLag;
    varying vec3 vN; varying vec3 vW; varying float vU; varying float vV; varying float vFold;
    const float PI = 3.14159265;
    void main(){
      float u = uv.x;            // 0 = inner (centre) edge, 1 = outer edge
      float v = uv.y;            // 0 = hem, 1 = top
      float outer = ${curtainW.toFixed(3)};
      // the hem trails the top while the curtain travels (inertia, closed form)
      float g = mix(uOpenLag, uOpen0, v);
      float w = outer - g;                       // current width of this drape
      float L = outer - ${G0.toFixed(3)};        // width when closed
      float gather = clamp(L / max(w, 0.2), 1.0, 6.0);
      float x = g + w*u;
      float folds = 11.0;
      float ph = u*folds*2.0*PI + v*0.6 + uSide*1.3;
      float irregular = 0.75 + 0.25*sin(u*folds*1.3 + uSide*2.1) + 0.12*sin(u*37.0 + v*2.0);
      float amp = 0.055*pow(gather, 0.8) * irregular * (0.6 + 0.4*u) * (1.0 + 0.3*(1.0-v));
      float z = amp*sin(ph);
      x += 0.35*amp*cos(ph)*(1.0 - smoothstep(0.0, 0.08, u)) + 0.018*sin(v*7.0 + uSide)*(1.0 - u); // the leading edge follows its folds
      float dzdx = amp*cos(ph)*folds*2.0*PI / max(w, 0.2);
      vec3 p = vec3(uSide*x, mix(${curtainBot.toFixed(3)}, ${curtainTop.toFixed(3)}, v), ${CZ.toFixed(3)} + z);
      vec3 n = normalize(vec3(-dzdx*uSide, 0.0, 1.0));
      vN = n; vU = u; vV = v; vFold = sin(ph);
      vec4 wp = modelMatrix*vec4(p,1.); vW = wp.xyz;
      gl_Position = projectionMatrix*viewMatrix*wp;
    }`;
  const curtainFS = `
    uniform float uT; uniform float uSide; uniform float uOpen0;
    varying vec3 vN; varying vec3 vW; varying float vU; varying float vV; varying float vFold;
    void main(){
      vec3 N = normalize(vN);
      vec3 V = normalize(cameraPosition - vW);
      vec3 key = normalize(vec3(-uSide*0.2, 0.8, 0.6));
      float diff = clamp(dot(N, key), 0.0, 1.0);
      float occl = 0.55 + 0.45*(0.5 + 0.5*vFold);
      float trough = smoothstep(-0.2, -1.0, vFold);
      vec3 base = mix(${glsl(C.shadow)}, ${glsl(C.velvet)}, pow(diff*occl, 1.3));
      base = mix(base, ${glsl(C.shadow)}*0.6, trough*0.55);
      float rim = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 1.8);
      vec3 col = base*0.78 + ${glsl(C.sheen)}*rim*0.75*occl;
      // light from the stage: the edge near the gap and the footlights near the hem
      float nearGap = exp(-vU*9.0);
      col += ${glsl(C.gold)}*nearGap*0.18*(0.6 + 0.4*vV);
      col += ${glsl(C.gold)}*pow(1.0 - vV, 6.0)*0.16;
      // gold hem braid
      float hem = 1.0 - smoothstep(0.010, 0.015, vV);
      col = mix(col, ${glsl(C.gold)}*(0.55 + 0.45*diff), hem*0.9);
      // top of the drapes falls into the dark of the flies
      col *= mix(1.0, 0.45, smoothstep(0.7, 1.0, vV));
      gl_FragColor = vec4(col, 1.0);
    }`;
  const curtains = [-1, 1].map((side) => {
    const u = { uT: U.uT, uSide: { value: side }, uOpen0: { value: G0 }, uOpenLag: { value: G0 } };
    const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 220, 48), new THREE.ShaderMaterial({ uniforms: u, vertexShader: curtainVS, fragmentShader: curtainFS, side: THREE.DoubleSide }));
    m.frustumCulled = false;
    scene.add(m);
    return m;
  });

  // ---------------------------------------------------------------- valance (pleated border, gold fringe)
  const valH = Math.min(0.75, halfH * 0.32);
  const valance = new THREE.Mesh(new THREE.PlaneGeometry(curtainW * 2 + 1, valH, 400, 8), new THREE.ShaderMaterial({
    uniforms: U, side: THREE.DoubleSide,
    vertexShader: `varying vec2 vUv; varying float vS; void main(){ vUv = uv; vec3 p = position;
      float s = sin(uv.x*190.0); vS = s; p.z += 0.03*s; p.y -= 0.05*pow(abs(sin(uv.x*9.0)), 2.0)*(1.0-uv.y);
      gl_Position = projectionMatrix*modelViewMatrix*vec4(p,1.); }`,
    fragmentShader: `varying vec2 vUv; varying float vS; void main(){
      vec3 col = mix(${glsl(C.shadow)}, ${glsl(C.velvet)}, 0.45 + 0.35*vS);
      col += ${glsl(C.sheen)}*pow(max(vS,0.0), 6.0)*0.25;
      float fringe = smoothstep(0.075, 0.05, vUv.y);
      col = mix(col, ${glsl(C.gold)}*(0.7 + 0.3*vS), fringe);
      col *= mix(0.55, 1.0, smoothstep(1.0, 0.2, vUv.y));
      gl_FragColor = vec4(col, 1.0); }`,
  }));
  valance.position.set(0, curtainTop - valH / 2 - 0.35, CZ + 0.12);
  scene.add(valance);

  // ---------------------------------------------------------------- the mark: extruded tile, official artwork on its face
  const S = 1.0, R = 21 / 92;                   // tile 92 x 92 with r 21 in the SVG, scaled to 1 unit
  const shape = new THREE.Shape();
  const hs = S / 2, rr2 = R * S;
  shape.moveTo(-hs + rr2, -hs);
  shape.lineTo(hs - rr2, -hs); shape.absarc(hs - rr2, -hs + rr2, rr2, -Math.PI / 2, 0, false);
  shape.lineTo(hs, hs - rr2); shape.absarc(hs - rr2, hs - rr2, rr2, 0, Math.PI / 2, false);
  shape.lineTo(-hs + rr2, hs); shape.absarc(-hs + rr2, hs - rr2, rr2, Math.PI / 2, Math.PI, false);
  shape.lineTo(-hs, -hs + rr2); shape.absarc(-hs + rr2, -hs + rr2, rr2, Math.PI, 1.5 * Math.PI, false);
  const depth = 0.14;
  const markGeo = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: 0.018, bevelSize: 0.012, bevelSegments: 4, curveSegments: 48 });
  markGeo.translate(0, 0, -depth / 2);

  const tex = new THREE.CanvasTexture(document.createElement('canvas'));
  tex.colorSpace = THREE.NoColorSpace;
  tex.offset.set(0.5, 0.5);
  tex.anisotropy = 8;
  const faceMat = new THREE.ShaderMaterial({
    uniforms: { map: { value: tex }, uK: { value: 1 } },
    vertexShader: `varying vec2 vUv; uniform sampler2D map; void main(){ vUv = uv + 0.5; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
    fragmentShader: `varying vec2 vUv; uniform sampler2D map; uniform float uK; void main(){ vec4 c = texture2D(map, vUv); gl_FragColor = vec4(c.rgb*uK, 1.0); }`,
  });
  const sideMat = new THREE.ShaderMaterial({
    uniforms: { uK: faceMat.uniforms.uK },
    vertexShader: `varying vec3 vN; void main(){ vN = normalize(normalMatrix*normal); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
    fragmentShader: `varying vec3 vN; uniform float uK; void main(){ float l = clamp(dot(normalize(vN), normalize(vec3(0.0, 0.9, 0.5))), 0.0, 1.0);
      vec3 col = mix(${glsl(C.shadow)}, ${glsl(C.deep)}, 0.35 + 0.65*l) + ${glsl(C.gold)}*pow(l, 8.0)*0.25; gl_FragColor = vec4(col*uK, 1.0); }`,
  });
  const mark = new THREE.Mesh(markGeo, [faceMat, sideMat]);
  scene.add(mark);

  // the official hero mark, drawn once into the face texture (cropped to the tile: 4..96 of the 100 viewBox)
  const ready = new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const cv = tex.image; const PX = 1024; cv.width = cv.height = PX;
      const g = cv.getContext('2d');
      const k = PX / 92; g.drawImage(img, -4 * k, -4 * k, 100 * k, 100 * k);
      tex.needsUpdate = true; resolve();
    };
    img.onerror = () => reject(new Error('mark-hero.svg failed to load'));
    img.src = 'assets/mark-hero.svg';
  });
  ST.waitFor(ready, 'mark texture');

  // ---------------------------------------------------------------- the clock
  function update(t) {
    U.uT.value = t;
    // curtains: part between 0.15 and 2.3 (a slow ease-in, so the slit is alive from the first second), the hem trails by 0.14 s
    const openAt = (tt) => G0 + (GFULL - G0) * inOutQuad(seg(tt, 0.15, 2.3));
    curtains.forEach((m) => { m.material.uniforms.uOpen0.value = openAt(t); m.material.uniforms.uOpenLag.value = openAt(t - 0.14); });

    // camera: dolly in ~7 % while the curtains part, then a slow 1.5 % drift to the end
    const dolly = 1 - 0.07 * inOutSine(seg(t, 0.2, 2.8)) - 0.015 * seg(t, 2.8, 5.0);
    const D = L.D * dolly;
    camera.position.set(0, L.tgtY + (L.camY - L.tgtY) * dolly, D);
    camera.lookAt(0, L.tgtY, 0);

    // the mark: flown in from the flies, lands in the pool at HIT, settles
    const REST = 0.5 + 0.018;                        // bottom bevel just touching the boards
    const T0 = 2.05;
    let y, rotY, rotX;
    if (t < T0) { y = top + 3; rotY = 0.55; rotX = -0.12; }
    else if (t < HIT) {
      const p = seg(t, T0, HIT);
      const e = 1 - Math.pow(1 - p, 2.2);             // fast in, easing into the floor
      y = REST + (top + 1.2 - REST) * (1 - e);
      rotY = 0.55 * (1 - outCubic(p)); rotX = -0.12 * (1 - outCubic(p));
    } else {
      const q = t - HIT;
      y = REST + 0.035 * Math.abs(Math.sin(q * 11)) * Math.exp(-q * 9);   // one small settle, then still
      rotY = 0; rotX = 0;
    }
    mark.position.set(0, y, 0.05);
    mark.rotation.set(rotX, rotY, 0);
    // in the dark above the beam the face is dimmer; in the pool it shows its true colours
    faceMat.uniforms.uK.value = 0.62 + 0.38 * clamp(1 - (y - REST) / 2.0);
    U.uShadow.value = clamp(1 - (y - REST) / 1.2);
    U.uPulse.value = t >= HIT ? Math.exp(-(t - HIT) * 4) : 0;
  }

  ST.three(renderer, scene, camera, update);
  return { HIT };
}

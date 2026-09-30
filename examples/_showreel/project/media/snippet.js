const renderer = new THREE.WebGLRenderer({ canvas, preserveDrawingBuffer: true });
const points = new THREE.Points(geo, mat);
scene.add(points);

// every frame is a pure function of t
ST.three(renderer, scene, camera, (t) => {
  const lt = Math.max(0, t - T0);
  for (let i = 0; i < N; i++) {
    const p = easeIO(clamp((lt - delay[i]) / 1.45));
    pos[i * 3] = rx + (target[i * 3] - rx) * p;
  }
});

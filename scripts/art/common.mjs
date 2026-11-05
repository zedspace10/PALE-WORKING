// eslint-disable-next-line import/no-unresolved -- three.js is copied in beside this file when rendering
import * as THREE from "three";
export const q = new URLSearchParams(location.search);
export const W = +q.get("w"),
  H = +q.get("h");
export function makeRenderer() {
  const r = new THREE.WebGLRenderer({
    antialias: true,
    preserveDrawingBuffer: true,
  });
  r.setSize(W, H);
  r.setPixelRatio(1);
  r.outputColorSpace = THREE.SRGBColorSpace;
  r.toneMapping = THREE.ACESFilmicToneMapping;
  r.toneMappingExposure = 1.0;
  r.shadowMap.enabled = true;
  r.shadowMap.type = THREE.PCFSoftShadowMap;
  document.body.appendChild(r.domElement);
  return r;
}
export function rng(seed) {
  let x = seed % 2147483647 || 1;
  return () => (x = (x * 16807) % 2147483647) / 2147483647;
}
const tl = new THREE.TextureLoader();
export const load = (f, srgb = true) =>
  new Promise((res) =>
    tl.load(f, (t) => {
      if (srgb) t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 16;
      res(t);
    }),
  );

// Background stars drawn as soft round points, a power law in brightness like a real exposure.
export function stars(n, radius, seed = 1, sizeScale = 1) {
  const rnd = rng(seed);
  const g = new THREE.BufferGeometry();
  const p = [],
    c = [],
    s = [];
  for (let i = 0; i < n; i++) {
    const u = rnd() * 2 - 1,
      th = rnd() * Math.PI * 2,
      r = Math.sqrt(1 - u * u);
    p.push(radius * r * Math.cos(th), radius * u, radius * r * Math.sin(th));
    const b = Math.pow(rnd(), 5);
    const t = rnd();
    const col =
      t < 0.18 ? [1, 0.82, 0.62] : t > 0.8 ? [0.72, 0.82, 1] : [1, 0.97, 0.92];
    const lum = 0.1 + b * 1.1;
    c.push(col[0] * lum, col[1] * lum, col[2] * lum);
    s.push((1.2 + b * 3.2) * sizeScale);
  }
  g.setAttribute("position", new THREE.Float32BufferAttribute(p, 3));
  g.setAttribute("color", new THREE.Float32BufferAttribute(c, 3));
  g.setAttribute("size", new THREE.Float32BufferAttribute(s, 1));
  const m = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
    vertexShader: `attribute float size; varying vec3 vC; void main(){ vC = color; gl_PointSize = size; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
    fragmentShader: `varying vec3 vC; void main(){ float d = length(gl_PointCoord-.5)*2.; float a = exp(-d*d*4.); gl_FragColor = vec4(vC*a, a); }`,
  });
  return new THREE.Points(g, m);
}

// Atmosphere: an outer halo that is brightest at the planet's limb and fades to nothing, only on the lit side,
// plus a thin haze over the disc's edge.
export function atmosphere(radius, thickness, color, strength, lightDir) {
  const group = new THREE.Group();
  const uni = {
    c: { value: new THREE.Color(color) },
    k: { value: strength },
    L: { value: lightDir.clone().normalize() },
    t: { value: thickness },
  };
  const vs = `varying vec3 n; varying vec3 v; varying vec3 wn; void main(){ wn = normalize(mat3(modelMatrix)*normal); n = normalize(normalMatrix*normal); vec4 mv = modelViewMatrix*vec4(position,1.); v = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }`;
  const halo = new THREE.Mesh(
    new THREE.SphereGeometry(radius * (1 + thickness), 128, 128),
    new THREE.ShaderMaterial({
      uniforms: uni,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      vertexShader: vs,
      fragmentShader: `uniform vec3 c; uniform float k; uniform vec3 L; uniform float t; varying vec3 n; varying vec3 v; varying vec3 wn;
      void main(){ float d = -dot(n, v); float edge = sqrt(1.0 - 1.0/((1.0+t)*(1.0+t)));
        float x = clamp(d/edge, 0., 1.); float a = pow(x, 2.6);
        float lit = smoothstep(-0.25, 0.6, dot(wn, L)); gl_FragColor = vec4(c*a*k*lit, 1.); }`,
    }),
  );
  const haze = new THREE.Mesh(
    new THREE.SphereGeometry(radius * 1.002, 128, 128),
    new THREE.ShaderMaterial({
      uniforms: uni,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: vs,
      fragmentShader: `uniform vec3 c; uniform float k; uniform vec3 L; varying vec3 n; varying vec3 v; varying vec3 wn;
      void main(){ float f = pow(1.0 - max(dot(n, v), 0.), 3.0); float lit = smoothstep(-0.2, 0.7, dot(wn, L)); gl_FragColor = vec4(c*f*k*0.7*lit, 1.); }`,
    }),
  );
  group.add(halo, haze);
  return group;
}

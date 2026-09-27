import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const app = document.getElementById('app');
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
app.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0xbfe0f4, 28, 160);   // colour/range driven by env each frame

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 500);
camera.position.set(0, 1.5, 14);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 25, 0);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enablePan = false;
controls.minDistance = 4;
controls.maxDistance = 60;
controls.minPolarAngle = 1.9;
controls.maxPolarAngle = 3.0;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.22;
controls.update();

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shapeFromPoints(pts) {
  const s = new THREE.Shape();
  s.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) s.lineTo(pts[i][0], pts[i][1]);
  s.closePath();
  return s;
}

function pointInPolygon(pts, x, y) {
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const xi = pts[i][0], yi = pts[i][1];
    const xj = pts[j][0], yj = pts[j][1];
    const intersect = ((yi > y) !== (yj > y)) && (x < ((xj - xi) * (y - yi)) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

const SHAPE_POINTS = {
  ginkgo: [
    [0, -1.0], [-0.10, -0.70], [-0.30, -0.52], [-0.50, -0.28], [-0.68, 0.02],
    [-0.74, 0.38], [-0.60, 0.62], [-0.34, 0.72], [-0.16, 0.60], [-0.10, 0.34],
    [-0.03, 0.44], [0.0, 0.28], [0.03, 0.44], [0.10, 0.34], [0.16, 0.60],
    [0.34, 0.72], [0.60, 0.62], [0.74, 0.38], [0.68, 0.02], [0.50, -0.28],
    [0.30, -0.52], [0.10, -0.70], [0, -1.0],
  ],
  maple: [
    [0, -1.0], [-0.10, -0.72], [-0.52, -0.70], [-0.28, -0.46], [-0.72, -0.34],
    [-0.30, -0.02], [-0.56, 0.34], [-0.22, 0.55], [-0.03, 0.62], [0.0, 1.0],
    [0.03, 0.62], [0.22, 0.55], [0.56, 0.34], [0.30, -0.02], [0.72, -0.34],
    [0.28, -0.46], [0.52, -0.70], [0.10, -0.72], [0, -1.0],
  ],
  smoketree: [
    [0, -1.0], [-0.35, -0.80], [-0.60, -0.45], [-0.70, 0.0], [-0.62, 0.45],
    [-0.38, 0.72], [-0.12, 0.86], [0.0, 0.90], [0.12, 0.86], [0.38, 0.72],
    [0.62, 0.45], [0.70, 0.0], [0.60, -0.45], [0.35, -0.80], [0, -1.0],
  ],
  plane: [
    [0, -1.0], [-0.15, -0.72], [-0.55, -0.55], [-0.40, -0.25], [-0.70, -0.10],
    [-0.45, 0.20], [-0.60, 0.55], [-0.25, 0.70], [-0.05, 0.55], [0.0, 0.85],
    [0.05, 0.55], [0.25, 0.70], [0.60, 0.55], [0.45, 0.20], [0.70, -0.10],
    [0.40, -0.25], [0.55, -0.55], [0.15, -0.72], [0, -1.0],
  ],
  camphor: [
    [0, -1.0], [-0.30, -0.78], [-0.55, -0.40], [-0.62, 0.05], [-0.48, 0.48],
    [-0.24, 0.72], [0.0, 0.82], [0.24, 0.72], [0.48, 0.48], [0.62, 0.05],
    [0.55, -0.40], [0.30, -0.78], [0, -1.0],
  ],
  mask: [
    [0.694, 0.243], [0.661, 0.232], [0.578, 0.166], [0.434, 0.105], [0.302, -0.006],
    [0.274, -0.011], [0.257, 0.039], [0.291, 0.066], [0.313, 0.144], [0.285, 0.138],
    [0.274, 0.149], [0.268, 0.266], [0.224, 0.243], [0.191, 0.271], [0.086, 0.498],
    [0.047, 0.664], [-0.025, 0.465], [-0.069, 0.415], [-0.097, 0.432], [-0.102, 0.354],
    [-0.147, 0.266], [-0.180, 0.249], [-0.230, 0.282], [-0.208, 0.144], [-0.230, 0.044],
    [-0.224, 0.011], [-0.241, -0.017], [-0.285, 0.000], [-0.368, 0.072], [-0.418, 0.127],
    [-0.418, 0.116], [-0.440, 0.105], [-0.479, 0.127], [-0.567, 0.149], [-0.700, 0.238],
    [-0.634, 0.011], [-0.634, -0.017], [-0.650, -0.039], [-0.611, -0.072], [-0.595, -0.111],
    [-0.595, -0.144], [-0.639, -0.160], [-0.556, -0.260], [-0.523, -0.382], [-0.523, -0.409],
    [-0.551, -0.443], [-0.617, -0.487], [-0.672, -0.504], [-0.423, -0.609], [-0.407, -0.625],
    [-0.412, -0.658], [-0.185, -0.625], [-0.113, -0.603], [-0.030, -0.603], [-0.019, -0.614],
    [-0.003, -0.598], [0.158, -0.603], [0.291, -0.620], [0.335, -0.642], [0.351, -0.642],
    [0.368, -0.609], [0.445, -0.614], [0.434, -0.587], [0.468, -0.559], [0.661, -0.476],
    [0.562, -0.426], [0.528, -0.393], [0.528, -0.371], [0.562, -0.304], [0.600, -0.149],
    [0.667, -0.050], [0.634, -0.050], [0.623, -0.039], [0.623, 0.017], [0.656, 0.166],
  ],
};

const SHAPES = {};
for (const k in SHAPE_POINTS) SHAPES[k] = shapeFromPoints(SHAPE_POINTS[k]);

const PALETTES = {
  ginkgo:    { inner: '#f6d365', outer: '#e0a10f', stem: '#7a9a3a', edge: '#fbe79a' },
  maple:     { inner: '#e2451f', outer: '#8f1208', stem: '#a8552a', edge: '#f0803a' },
  smoketree: { inner: '#c14b9a', outer: '#5e2457', stem: '#7a3b69', edge: '#e79ac4' },
  plane:     { inner: '#cfa876', outer: '#9a7144', stem: '#7d5f38', edge: '#e8d0a8' },
  camphor:   { inner: '#8fbf5a', outer: '#3f7a2f', stem: '#5a7a3a', edge: '#d4e88a' },
  mask:      { inner: '#c0392b', outer: '#7b241c', stem: '#6e2c00', edge: '#e67e22' },
};

const HALF_W = 0.7;
const HALF_L = 0.9;
const SAG = 0;

function leafSagY(x, y) {
  const nn = Math.sqrt((x / HALF_W) * (x / HALF_W) + (y / HALF_L) * (y / HALF_L));
  return -SAG * Math.max(0, 1 - nn * nn);
}
// --- Time of day -----------------------------------------------------------
// Each preset paints the whole environment: where the sun sits, its colour and
// strength, the three sky zones (zenith / mid / horizon), horizon haze, fog,
// the two scene lights, ambient fill, cloud tint, and how "night" it is (which
// fades in stars + the moon). Everything downstream reads from `env`, a live
// copy that we smoothly interpolate toward the chosen preset.
function dir(azDeg, elevDeg) {
  const az = azDeg * Math.PI / 180, el = elevDeg * Math.PI / 180;
  // direction FROM the sun toward the scene (light travel direction)
  return new THREE.Vector3(
    -Math.cos(el) * Math.cos(az),
    -Math.sin(el),
    -Math.cos(el) * Math.sin(az)
  ).normalize();
}

const TIMES = {
  dawn: {
    label: 'Dawn',
    sunDir: dir(70, 6),
    sunColor: '#ffb26b', sunInt: 1.6,
    zenith: '#243b6b', mid: '#6d6fa0', horizon: '#f2a9702', // note: fixed below
    haze: '#f6b98a', hazePow: 3.2,
    fog: '#c9b6c8', fogNear: 26, fogFar: 150,
    hemiSky: '#8fa6d8', hemiGround: '#3a2f38', hemiInt: 0.7,
    dirColor: '#ffd0a0', dirInt: 1.8,
    ambient: '#8f8fb8', cloud: '#f3cdb0', night: 0.35,
  },
  morning: {
    label: 'Morning',
    sunDir: dir(60, 26),
    sunColor: '#fff0cf', sunInt: 1.9,
    zenith: '#2f6fb8', mid: '#79aede', horizon: '#dff0f4',
    haze: '#eae2c8', hazePow: 4.0,
    fog: '#cfe4f0', fogNear: 30, fogFar: 165,
    hemiSky: '#bfe0ff', hemiGround: '#20242a', hemiInt: 0.95,
    dirColor: '#fff3da', dirInt: 2.3,
    ambient: '#a9cbe8', cloud: '#ffffff', night: 0.0,
  },
  noon: {
    label: 'Noon',
    sunDir: dir(35, 78),
    sunColor: '#fffdf6', sunInt: 2.2,
    zenith: '#1f66c8', mid: '#5ba0e6', horizon: '#d3ecfb',
    haze: '#eaf4ff', hazePow: 5.0,
    fog: '#cfe7fb', fogNear: 34, fogFar: 180,
    hemiSky: '#cfe8ff', hemiGround: '#22262c', hemiInt: 1.05,
    dirColor: '#ffffff', dirInt: 2.7,
    ambient: '#bcd8f2', cloud: '#ffffff', night: 0.0,
  },
  golden: {
    label: 'Afternoon',
    sunDir: dir(48, 16),
    sunColor: '#ffd89e', sunInt: 2.0,
    zenith: '#2b63a8', mid: '#8fa9c8', horizon: '#ffcf9a',
    haze: '#ffb877', hazePow: 3.0,
    fog: '#e6cbb0', fogNear: 28, fogFar: 160,
    hemiSky: '#bcd2ee', hemiGround: '#2b2622', hemiInt: 0.9,
    dirColor: '#ffdcab', dirInt: 2.5,
    ambient: '#c2b79e', cloud: '#ffe4c4', night: 0.0,
  },
  dusk: {
    label: 'Dusk',
    sunDir: dir(40, 3),
    sunColor: '#ff5230', sunInt: 2.0,
    zenith: '#241a63', mid: '#d76a86', horizon: '#ffb24d',
    haze: '#ff7038', hazePow: 1.8,
    fog: '#9a6a72', fogNear: 26, fogFar: 155,
    hemiSky: '#9a80b8', hemiGround: '#2a1e26', hemiInt: 0.65,
    dirColor: '#ff9a5a', dirInt: 1.8,
    ambient: '#b08698', cloud: '#ffab63', night: 0.0,
  },
  night: {
    label: 'Night',
    sunDir: dir(30, 40),          // this becomes the moon's position
    sunColor: '#bcd0ff', sunInt: 0.8,
    zenith: '#050a1e', mid: '#0c1636', horizon: '#243056',
    haze: '#33406a', hazePow: 3.5,
    fog: '#0c1330', fogNear: 30, fogFar: 150,
    hemiSky: '#38507f', hemiGround: '#05070d', hemiInt: 0.45,
    dirColor: '#aec4ff', dirInt: 0.7,
    ambient: '#3a4a72', cloud: '#4a5578', night: 1.0,
  },
};
// fix the one typo'd value cleanly
TIMES.dawn.horizon = '#f2a970';

const TIME_ORDER = ['dawn', 'morning', 'noon', 'golden', 'dusk', 'night'];

// Live, mutable environment we interpolate. Colours are THREE.Color, scalars
// are plain numbers; a Vector3 for the sun direction.
function makeEnv(p) {
  return {
    sunDir: p.sunDir.clone(),
    sunColor: new THREE.Color(p.sunColor), sunInt: p.sunInt,
    zenith: new THREE.Color(p.zenith), mid: new THREE.Color(p.mid), horizon: new THREE.Color(p.horizon),
    haze: new THREE.Color(p.haze), hazePow: p.hazePow,
    fog: new THREE.Color(p.fog), fogNear: p.fogNear, fogFar: p.fogFar,
    hemiSky: new THREE.Color(p.hemiSky), hemiGround: new THREE.Color(p.hemiGround), hemiInt: p.hemiInt,
    dirColor: new THREE.Color(p.dirColor), dirInt: p.dirInt,
    ambient: new THREE.Color(p.ambient), cloud: new THREE.Color(p.cloud), night: p.night,
  };
}

let currentTime = 'golden';               // matches the original low-afternoon mood
const env = makeEnv(TIMES[currentTime]);
let targetPreset = TIMES[currentTime];

// Convenience aliases so the rest of the file keeps reading naturally.
const sunDir = env.sunDir;                 // updated in place each frame
const sunColor = env.sunColor;
const ambient = env.ambient;

const skyUniforms = {
  uZenith: { value: env.zenith },
  uMid: { value: env.mid },
  uHorizon: { value: env.horizon },
  uHaze: { value: env.haze },
  uHazePow: { value: env.hazePow },
  uToSun: { value: sunDir.clone().negate() },   // direction toward the sun
  uSunColor: { value: env.sunColor },
  uNight: { value: env.night },
  uTime: { value: 0 },
};
{
  const geo = new THREE.SphereGeometry(300, 48, 32);
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    uniforms: skyUniforms,
    vertexShader: `
      varying vec3 vDir;
      void main() {
        vDir = normalize(position);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: `
      varying vec3 vDir;
      uniform vec3 uZenith, uMid, uHorizon, uHaze, uSunColor, uToSun;
      uniform float uHazePow, uNight, uTime;

      // hash for stars
      float hash(vec2 p){ p = fract(p*vec2(443.897,441.423)); p += dot(p,p+37.29); return fract(p.x*p.y); }

      void main() {
        vec3 d = normalize(vDir);
        float h = clamp(d.y, -0.1, 1.0);              // height above horizon

        // Three-zone vertical gradient with an eased curve: horizon -> mid ->
        // zenith. Two smoothsteps blended so the band transitions feel soft and
        // atmospheric rather than a single linear ramp.
        float lowT = smoothstep(0.0, 0.28, h);
        float hiT  = smoothstep(0.18, 0.9, h);
        vec3 col = mix(uHorizon, uMid, lowT);
        col = mix(col, uZenith, hiT);

        // Sun/scatter geometry
        vec3 toSun = normalize(uToSun);
        float mu = max(dot(d, toSun), 0.0);

        // Mie forward-scatter halo: bright tight core fading into a broad glow,
        // so the air around the sun blooms the way a real sky does.
        float halo = pow(mu, 8.0) * 0.35 + pow(mu, 2200.0) * 4.0 + pow(mu, 64.0) * 0.12;
        col += uSunColor * halo * (1.0 - uNight * 0.6);

        // Horizon haze band: warm/pale light pooling low near the sun's side.
        float horizonBand = pow(1.0 - clamp(h, 0.0, 1.0), uHazePow);
        float sunSide = 0.5 + 0.5 * dot(normalize(vec3(d.x, 0.0, d.z)), normalize(vec3(toSun.x, 0.0, toSun.z)));
        col = mix(col, uHaze, horizonBand * (0.35 + 0.5 * sunSide));

        // Subtle vertical banding relief so large flat areas aren't dead.
        col += 0.012 * sin(h * 40.0 + uTime * 0.1);

        // --- Night: round, soft stars + a gentle high-sky brightening.
        if (uNight > 0.01) {
          vec2 uv = d.xz / max(0.15, d.y + 0.2) * 55.0; // project onto a plane above
          vec2 cell = floor(uv);
          vec2 f = fract(uv);
          float stars = 0.0;
          // check this cell and neighbours so stars near edges stay whole/round
          for (int oy = -1; oy <= 1; oy++) {
            for (int ox = -1; ox <= 1; ox++) {
              vec2 o = vec2(float(ox), float(oy));
              float rnd = hash(cell + o);
              if (rnd > 0.972) {                          // sparse
                // random position inside the neighbour cell
                vec2 pos = o + vec2(hash(cell + o + 3.1), hash(cell + o + 7.7));
                float dist = length(f - pos);
                float mag = fract(rnd * 91.7);            // varied brightness
                float core = smoothstep(0.09 + mag * 0.06, 0.0, dist); // round dot + soft halo
                float tw = 0.55 + 0.45 * sin(uTime * 2.5 + rnd * 60.0);
                stars += core * (0.4 + 0.6 * mag) * tw;
              }
            }
          }
          stars *= smoothstep(0.04, 0.4, d.y);            // fade toward horizon
          col += vec3(0.9, 0.95, 1.0) * stars * uNight * 1.6;
          col += vec3(0.01, 0.015, 0.03) * smoothstep(0.3, 1.0, d.y) * uNight;
        }

        gl_FragColor = vec4(col, 1.0);
        #include <colorspace_fragment>
      }`,
  });
  scene.add(new THREE.Mesh(geo, mat));
}

// A billboarded shader disc: a limb-darkened bright core with a soft, layered
// corona that blooms outward and tints with the time of day. A separate moon
// disc fades in at night. Both track the sun direction.
const sunUniforms = {
  uCore: { value: new THREE.Color('#fff7e0') },
  uGlow: { value: new THREE.Color('#ffdca0') },
  uMoon: { value: 0 },      // 0 = sun, 1 = moon look
  uNight: { value: env.night },
};
const sunSprite = (() => {
  const geo = new THREE.PlaneGeometry(46, 46);   // big; mostly transparent corona
  const mat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, depthTest: false,
    blending: THREE.AdditiveBlending, fog: false,
    uniforms: sunUniforms,
    vertexShader: `
      varying vec2 vUv;
      void main(){ vUv = uv - 0.5; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: `
      varying vec2 vUv;
      uniform vec3 uCore, uGlow;
      uniform float uMoon, uNight;
      void main(){
        float r = length(vUv) * 2.0;                 // 0 at centre, ~1 at edge
        // Bright disc with a soft limb, then two corona falloffs stacked.
        float disc  = smoothstep(0.16, 0.10, r);     // crisp-ish core
        float inner = exp(-r * 6.0) * 0.9;           // tight bloom
        float outer = exp(-r * 2.2) * 0.5;           // wide halo
        vec3 col = uCore * disc + uGlow * (inner + outer);

        // Moon: cool, with a faint darkened maria and a thin bright limb.
        if (uMoon > 0.5) {
          float limb = smoothstep(0.17, 0.13, r);
          float mottle = 0.85 + 0.15 * sin(vUv.x*40.0)*sin(vUv.y*38.0);
          col = uCore * limb * mottle + uGlow * (exp(-r*4.0)*0.5 + exp(-r*1.8)*0.25);
        }
        float a = clamp(disc + inner + outer, 0.0, 1.0);
        gl_FragColor = vec4(col, a);
        #include <colorspace_fragment>
      }`,
  });
  const m = new THREE.Mesh(geo, mat);
  m.renderOrder = -1;
  scene.add(m);
  return m;
})();
function placeSun() {
  const p = sunDir.clone().negate().multiplyScalar(240);
  sunSprite.position.copy(p);
  sunSprite.quaternion.copy(camera.quaternion);   // always face camera
}

const lightShafts = [];
const shaftMaterial = new THREE.ShaderMaterial({
  transparent: true,
  depthWrite: false,
  side: THREE.DoubleSide,
  blending: THREE.AdditiveBlending,
  uniforms: {
    uColor: { value: sunColor },
    uOpacity: { value: 0.2 },
  },
  vertexShader: `
    varying float vH;
    void main() {
      vH = uv.y;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`,
  fragmentShader: `
    varying float vH;
    uniform vec3 uColor;
    uniform float uOpacity;
    void main() {
      float a = uOpacity * vH;
      gl_FragColor = vec4(uColor, a);
      #include <colorspace_fragment>
    }`,
});

{
  const toSun = sunDir.clone().negate();
  const rand = mulberry32(99);
  for (let i = 0; i < 6; i++) {
    const geo = new THREE.CylinderGeometry(2.5, 20, 62, 24, 1, true);
    const mesh = new THREE.Mesh(geo, shaftMaterial);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), toSun);
    const center = new THREE.Vector3(0, 26, 0).add(toSun.clone().multiplyScalar(36));
    center.x += (rand() - 0.5) * 26;
    center.z += (rand() - 0.5) * 26;
    center.y += (rand() - 0.5) * 12;
    mesh.position.copy(center);
    mesh.userData.phase = rand() * Math.PI * 2;
    scene.add(mesh);
    lightShafts.push(mesh);
  }
}

function cloudTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d');
  function puff(x, y, r, a) {
    const grd = g.createRadialGradient(x, y, 0, x, y, r);
    grd.addColorStop(0, 'rgba(255,255,255,' + a + ')');
    grd.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grd;
    g.fillRect(0, 0, 256, 256);
  }
  puff(110, 120, 72, 0.9);
  puff(150, 132, 62, 0.7);
  puff(82, 142, 52, 0.62);
  puff(164, 110, 46, 0.5);
  puff(120, 92, 44, 0.52);
  puff(72, 108, 40, 0.4);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const clouds = [];
{
  const tex = cloudTexture();
  const rand = mulberry32(1234);
  for (let i = 0; i < 30; i++) {
    const mat = new THREE.SpriteMaterial({
      map: tex, transparent: true, opacity: 0.35 + rand() * 0.5,
      depthWrite: false, fog: false,
    });
    const sp = new THREE.Sprite(mat);
    const s = 5 + rand() * 13;
    sp.scale.set(s, s * (0.45 + rand() * 0.3), 1);
    sp.position.set(-45 + rand() * 90, 25 + rand() * 30, -8 - rand() * 52);
    const ang = rand() * Math.PI * 2;
    const spd = 0.1 + rand() * 0.4;
    sp.userData.vx = Math.cos(ang) * spd;
    sp.userData.vz = Math.sin(ang) * spd * 0.4;
    scene.add(sp);
    clouds.push(sp);
  }
}

const hemiLight = new THREE.HemisphereLight(0xbfe0ff, 0x101418, 0.9);
const dirLight = new THREE.DirectionalLight(0xfff1d6, 2.4);
{
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(400, 400),
    new THREE.MeshStandardMaterial({ color: 0x10181f, roughness: 0.95 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.5;
  scene.add(ground);

  scene.add(hemiLight);
  dirLight.position.copy(sunDir).negate().multiplyScalar(60);
  scene.add(dirLight);
}

const leafMaterial = new THREE.ShaderMaterial({
  side: THREE.DoubleSide,
  transparent: true,
  vertexColors: true,
  uniforms: {
    uSunDir: { value: sunDir },
    uSunColor: { value: sunColor },
    uAmbient: { value: ambient },
    uOpacity: { value: 0.3 },
  },
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vColor;
    void main() {
      vNormal = normalize(mat3(modelMatrix) * normal);
      vColor = color;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`,
  fragmentShader: `
    varying vec3 vNormal;
    varying vec3 vColor;
    uniform vec3 uSunDir;
    uniform vec3 uSunColor;
    uniform vec3 uAmbient;
    uniform float uOpacity;
    void main() {
      vec3 n = normalize(vNormal) * (gl_FrontFacing ? 1.0 : -1.0);
      vec3 sd = normalize(uSunDir);
      float direct = max(dot(n, -sd), 0.0);
      float trans = pow(max(dot(n, sd), 0.0), 1.2);
      vec3 col = vColor * (0.22 + 0.85 * direct) * uSunColor;
      col += vColor * trans * 1.15 * uSunColor;
      col += vColor * uAmbient * 0.5;
      gl_FragColor = vec4(col, uOpacity);
      #include <colorspace_fragment>
    }`,
});

function buildLeafGeometry(type, palette, scale) {
  const geo = new THREE.ShapeGeometry(SHAPES[type], 40);
  const pos = geo.attributes.position;
  const colors = [];
  const inner = new THREE.Color(palette.inner);
  const outer = new THREE.Color(palette.outer);
  const stem = new THREE.Color(palette.stem);
  const edge = new THREE.Color(palette.edge);
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const nn = Math.sqrt((x / HALF_W) * (x / HALF_W) + (y / HALF_L) * (y / HALF_L));
    const t = Math.min(1, nn);
    const sag = leafSagY(x, y);
    pos.setXYZ(i, x * scale, sag, y * scale);
    const c = inner.clone().lerp(outer, t);
    const green = THREE.MathUtils.clamp((-y - 0.55) / 0.45, 0, 1);
    c.lerp(stem, green * 0.55 * (1 - t * 0.5));
    if (t > 0.7) c.lerp(edge, ((t - 0.7) / 0.3) * 0.35);
    colors.push(c.r, c.g, c.b);
  }
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geo.computeVertexNormals();
  return geo;
}

const STRIPE_HALF_W = 0.0192;
const WIND_SPEED = 0.3;    // global wind pace multiplier (1.0 = original, 0.3 = ~70% slower)
const WIND_STRENGTH = 0.2; // global sway amplitude (1.0 = original) — gentle/mild wind

function makeStripeMaterial() {
  return new THREE.ShaderMaterial({
  side: THREE.DoubleSide,
  transparent: true,
  depthWrite: false,
  uniforms: {
    uTime: { value: 0 },
    uWind: { value: 0.6 },
    uWindDir: { value: new THREE.Vector3(1, 0, 0.2).normalize() },
    uGustPhase: { value: 0 },
    uStripeWidth: { value: STRIPE_HALF_W },
    uSunDir: { value: sunDir },
    uSunColor: { value: sunColor },
    uCameraPos: { value: new THREE.Vector3() },
    uShine: { value: 16.0 },
  },
  vertexShader: `
    attribute float aT;
    attribute float aSide;
    attribute float aOrient;
    attribute float aPhase;
    attribute float aSeed;
    attribute vec3 aColor;
    attribute float aAlpha;
    uniform float uTime;
    uniform float uWind;
    uniform vec3 uWindDir;
    uniform float uGustPhase;
    uniform float uStripeWidth;
    varying vec3 vColor;
    varying float vAlpha;
    varying vec3 vNormal;
    varying vec3 vWorldPos;
    varying float vT;
    varying float vPhase;
    varying float vGust;
    varying float vSide;

    float hash21(vec2 p) {
      p = fract(p * vec2(234.34, 435.345));
      p += dot(p, p + 34.23);
      return fract(p.x * p.y);
    }
    float vnoise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      float a = hash21(i);
      float b = hash21(i + vec2(1.0, 0.0));
      float c = hash21(i + vec2(0.0, 1.0));
      float d = hash21(i + vec2(1.0, 1.0));
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    void main() {
      float t = aT;
      float ph = aPhase * 6.28318;

      // Anchor point of this ribbon (constant along its length) -> gives each
      // ribbon its own local weather, decorrelated from its neighbours.
      vec2 a = vec2(position.x, position.z);
      vec2 wdir = normalize(vec2(uWindDir.x, uWindDir.z));
      float coord = dot(a, wdir);

      // The whole texture DRIFTS downwind over time, so the pockets of motion
      // travel across the leaf instead of sitting on the same ribbons forever.
      vec2 drift = wdir * uTime * 0.55;

      // --- Gust field: layered so a handful of ribbons gust while others rest.
      float slow   = vnoise(a * 1.0 + drift + uTime * vec2(0.20, -0.15));  // broad breathing
      float pocket = vnoise(a * 3.3 + drift * 1.6 + uTime * vec2(0.55, 0.40)); // handful-of-ribbons pockets
      float fine   = vnoise(a * 6.5 + drift * 2.4 - uTime * vec2(0.9, 0.7));   // fine shiver
      float awake = smoothstep(0.32, 0.78, pocket);                 // some pockets rest entirely
      float gust = 0.9 * slow + 1.35 * pocket * awake + 0.45 * fine;

      // --- Gust front: a band that sweeps across the whole field, then passes,
      // leaving stillness behind it. uGustPhase travels along the wind axis.
      float sweep = exp(-pow((coord - uGustPhase) * 1.6, 2.0));
      gust += 1.8 * sweep;

      // --- Rest mask: art needs stillness as much as motion. A drifting field
      // holds 30-50% of ribbons at rest at any moment; because it drifts, the
      // resting and moving zones keep migrating -- no ribbon is stuck moving.
      float restField = vnoise(a * 1.7 + drift * 1.2 + uTime * vec2(0.28, 0.22));
      float move = smoothstep(0.40, 0.62, restField);               // ~40% below threshold rest
      gust *= move;
      // A gust front can still stir resting ribbons a little as it passes by.
      gust += 0.6 * sweep * (1.0 - move);

      // --- Swirl: rotate the local wind direction, varying down the ribbon and
      // in time, so the curtain twists rather than sliding flat.
      float sw = vnoise(a * 1.6 + vec2(uTime * 0.22, t * 1.7)) - 0.5;
      float ang = sw * 1.3 * (0.35 + gust * 0.4);
      float cs = cos(ang), sn = sin(ang);
      vec2 dir = mat2(cs, -sn, sn, cs) * wdir;
      vec3 flow = vec3(dir.x, 0.0, dir.y);

      // --- Bend: ONE smooth arc down the ribbon (a cantilever curve, pinned at
      // the top and free at the tip), like a ribbon leaning in the wind. A slow,
      // long-wavelength undulation (well under one full wave across the length,
      // low amplitude) rides on top so it breathes gently instead of zig-zagging.
      float env = t * t;                              // smooth arc, grows to the tip
      float k = 0.7;                                  // <1 wave along length => single gentle curve
      float travel = uTime * 1.5 * (0.6 + gust * 0.4);// undulation drifts down slowly
      float phase = t * k * 6.28318 - travel + ph;
      float wave = sin(phase);
      float waveD = cos(phase) * k * 6.28318;         // d(wave)/dt

      float base = uWind * gust;
      float sway  = base * (0.42 * env + 0.07 * env * wave);
      float dsway = base * (0.42 * 2.0 * t + 0.07 * (2.0 * t * wave + env * waveD));

      vec3 widthDir = aOrient > 0.5 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
      vec3 pos = position + flow * sway + widthDir * aSide * uStripeWidth;
      pos.y += base * env * 0.06 * wave;              // tip lifts a little on gusts

      // --- Normal from the actual curl tangent, so as the bend travels the
      // surface tilts toward and away from the sun -> glints slide along it.
      vec3 tangent = normalize(vec3(flow.x * dsway, -0.5625, flow.y * dsway));
      vec3 n = normalize(cross(tangent, widthDir));

      vColor = aColor;
      vAlpha = aAlpha;
      vT = t;
      vPhase = aPhase;
      vGust = gust;
      vSide = aSide;
      vNormal = normalize(mat3(modelMatrix) * n);
      vec4 wp = modelMatrix * vec4(pos, 1.0);
      vWorldPos = wp.xyz;
      gl_Position = projectionMatrix * viewMatrix * wp;
    }`,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uSunDir;
    uniform vec3 uSunColor;
    uniform vec3 uCameraPos;
    uniform float uShine;
    varying vec3 vColor;
    varying float vAlpha;
    varying vec3 vNormal;
    varying vec3 vWorldPos;
    varying float vT;
    varying float vPhase;
    varying float vGust;
    varying float vSide;
    void main() {
      vec3 n = normalize(vNormal) * (gl_FrontFacing ? 1.0 : -1.0);
      vec3 V = normalize(uCameraPos - vWorldPos);
      vec3 L = normalize(-uSunDir);
      float ndl = dot(n, L);
      float diff = max(ndl, 0.0);
      vec3 H = normalize(L + V);
      float ndh = max(dot(n, H), 0.0);

      // Two-lobe highlight: a broad silky sheen plus a tight, bright glint.
      float sheen = pow(ndh, uShine * 0.35);
      float glintCore = pow(ndh, uShine * 2.2);

      // Glint comes purely from the ribbon's surface catching the sun as it
      // bends in the wind -- a smooth highlight that slides along the arc, not a
      // fast on/off twinkle. Gusting ribbons catch a little more light.
      float ph = vPhase * 6.28318;
      float excite = 0.5 + 0.5 * smoothstep(0.4, 1.4, vGust);
      float glint = glintCore * excite;

      // Glow-through: sun behind the thin ribbon lights it like stained glass.
      float trans = pow(max(-ndl, 0.0), 1.3);

      // Fresnel rim: grazing angles go bright and cool, edges shimmer.
      float fres = pow(1.0 - abs(dot(n, V)), 3.0);

      // Iridescence: hue slides with view/wind so the sheen isn't a dead gold.
      float irid = 0.5 + 0.5 * sin(fres * 6.0 + vT * 4.0 + uTime * 0.6 + ph);
      vec3 iridCol = mix(uSunColor, vec3(0.75, 0.9, 1.1), irid * 0.6);

      vec3 col = vColor * (0.22 + 0.6 * diff) * uSunColor;
      col += vColor * trans * 1.2 * uSunColor;            // backlit glow
      col += iridCol * sheen * 0.7;                       // silky sheen
      col += uSunColor * glint * 4.5;                     // sharp moving sparkle
      col += vec3(0.8, 0.92, 1.05) * fres * 0.35;         // cool rim
      col += vColor * 0.04;

      // Feather the ribbon across its width so the edges dissolve into their
      // neighbours instead of reading as hard-edged bars.
      float edge = 1.0 - vSide * vSide;      // 1 at centre, 0 at rim
      float soft = smoothstep(0.0, 0.7, edge);
      // Fade the very top and tip too, so ribbons melt in and out of the field.
      float ends = smoothstep(0.0, 0.08, vT) * smoothstep(1.0, 0.72, vT);

      float a = vAlpha;
      a += glint * 0.7 + sheen * 0.12 + fres * 0.15 + trans * 0.1;
      a *= soft * ends;
      a = clamp(a, 0.0, 1.0);

      gl_FragColor = vec4(col, a);
      #include <colorspace_fragment>
    }`,
  });
}

function gradientColor(stops, tt) {
  const n = stops.length;
  if (n === 1) return stops[0];
  const seg = 1 / (n - 1);
  const idx = Math.min(n - 2, Math.floor(tt / seg));
  const local = (tt - idx * seg) / seg;
  return stops[idx].clone().lerp(stops[idx + 1], local);
}

function stripeStyle(palette, custom) {
  if (custom) {
    const alpha = custom.alpha !== undefined ? custom.alpha : 0.15;
    return {
      stops: custom.colors.map((c) => new THREE.Color(c)),
      aTop: alpha,
      aBot: alpha,
    };
  }
  const inner = new THREE.Color(palette.inner);
  const edge = new THREE.Color(palette.edge);
  const white = new THREE.Color('#ffffff');
  const cTop = inner.clone().lerp(edge, 0.25);
  return {
    stops: [cTop, cTop.clone().lerp(white, 0.6)],
    aTop: 0.15,
    aBot: 0.15,
  };
}

function buildStripes(type, palette, scale, seed, custom) {
  const pts = SHAPE_POINTS[type];
  const rand = mulberry32(seed);
  const SEG = 18;
  const cell = (STRIPE_HALF_W * 2) / scale;
  const samples = [];
  for (let gx = -HALF_W; gx <= HALF_W + 1e-6; gx += cell) {
    for (let gy = -HALF_L; gy <= HALF_L + 1e-6; gy += cell) {
      if (pointInPolygon(pts, gx, gy)) samples.push([gx, gy]);
    }
  }
  const N = samples.length;
  const positions = [];
  const aT = [];
  const aSide = [];
  const aOrient = [];
  const aPhase = [];
  const aSeed = [];
  const aColor = [];
  const aAlpha = [];
  const indices = [];
  const spec = stripeStyle(palette, custom);
  let stripe = 0;
  for (let i = 0; i < N; i++) {
    const lx = samples[i][0];
    const ly = samples[i][1];
    const sag = leafSagY(lx, ly);
    const x = lx * scale;
    const z = ly * scale;
    const L = 0.5625;
    for (let o = 0; o < 2; o++) {
      if (rand() < 0.25) continue;
      const ph = rand();
      const sd = rand();
      const base = stripe * (SEG + 1) * 2;
      stripe++;
      for (let j = 0; j <= SEG; j++) {
        const tt = j / SEG;
        const y = sag - tt * L;
        positions.push(x, y, z, x, y, z);
        aT.push(tt, tt);
        aSide.push(-1, 1);
        aOrient.push(o, o);
        aPhase.push(ph, ph);
        aSeed.push(sd, sd);
        const col = gradientColor(spec.stops, tt);
        const cr = col.r;
        const cg = col.g;
        const cb = col.b;
        const aa = spec.aTop + (spec.aBot - spec.aTop) * tt;
        aColor.push(cr, cg, cb, cr, cg, cb);
        aAlpha.push(aa, aa);
      }
      for (let j = 0; j < SEG; j++) {
        const a = base + j * 2;
        const b = base + (j + 1) * 2;
        const c = a + 1;
        const d = b + 1;
        indices.push(a, b, c, b, d, c);
      }
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('aT', new THREE.Float32BufferAttribute(aT, 1));
  geo.setAttribute('aSide', new THREE.Float32BufferAttribute(aSide, 1));
  geo.setAttribute('aOrient', new THREE.Float32BufferAttribute(aOrient, 1));
  geo.setAttribute('aPhase', new THREE.Float32BufferAttribute(aPhase, 1));
  geo.setAttribute('aSeed', new THREE.Float32BufferAttribute(aSeed, 1));
  geo.setAttribute('aColor', new THREE.Float32BufferAttribute(aColor, 3));
  geo.setAttribute('aAlpha', new THREE.Float32BufferAttribute(aAlpha, 1));
  geo.setIndex(indices);
  return geo;
}

const TYPE_ORDER = ['ginkgo', 'maple', 'smoketree', 'mask', 'camphor'];
const TYPE_STRIPES = {
  ginkgo: { colors: ['#e3bc5f', '#daa40e', '#bb6800'], alpha: 0.15 },
  maple: { colors: ['#ffbb75', '#f08c5a', '#b20e04'], alpha: 0.15 },
  smoketree: null,
  plane: null,
  camphor: null,
  mask: { colors: ['#e3bb8a', '#fe8238', '#d8370b'], alpha: 0.15 },
};
const LEAF_Y = 24.75;
const LEAF_ROT = Math.PI / 2;
const LEAF_POSITIONS = [
  { x: -5.4, scale: 1.9, ry: -0.1, seed: 11 },
  { x: 0.0, scale: 2.0, ry: 0.05, seed: 22 },
  { x: 5.4, scale: 1.88, ry: 0.12, seed: 33 },
];

function clearLeaves() {
  for (const { group } of leaves) {
    scene.remove(group);
    group.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) o.material.dispose();
    });
  }
}

function buildLeaves(type) {
  clearLeaves();
  return LEAF_POSITIONS.map((pos) => {
    const group = new THREE.Group();
    group.position.set(pos.x, LEAF_Y, 0);
    group.rotation.set(0, pos.ry + LEAF_ROT, 0);

    const stripeGeo = buildStripes(type, PALETTES[type], pos.scale, pos.seed, TYPE_STRIPES[type]);
    const stripes = new THREE.Mesh(stripeGeo, makeStripeMaterial());
    stripes.renderOrder = 2;
    group.add(stripes);

    scene.add(group);
    // Per-leaf gust scheduler: gusts fire occasionally, each lasting 0.5-5s,
    // with calm stretches in between. Staggered start so leaves don't sync up.
    // First gust is scheduled a calm beat AFTER the current moment, so a freshly
    // built leaf eases in from stillness rather than being hit by wind at once.
    const firstDelay = 1.5 + (pos.seed * 0.13 % 2) + LEAF_POSITIONS.indexOf(pos) * 0.6;
    const gust = { active: false, start: -100, end: -100, next: windClock + firstDelay, peak: 1, dir: 0 };
    // Spring-damped motion state: the ribbon has inertia, so it lags the wind,
    // overshoots, and keeps swinging as it settles after a gust is gone.
    const motion = { resp: 0, vel: 0, dirResp: pos.ry, dirVel: 0 };
    return { group, ry: pos.ry + LEAF_ROT, material: stripes.material, gust, motion, rand: mulberry32(pos.seed * 7 + 1) };
  });
}

let windClock = 0;            // slowed wind time, shared so rebuilds ease in
let leaves = [];
leaves = buildLeaves('maple');

window.addEventListener('keydown', (e) => {
  const n = parseInt(e.key, 10);
  if (n >= 1 && n <= 5) {
    leaves = buildLeaves(TYPE_ORDER[n - 1]);
  } else if (e.key.toLowerCase() === 't') {
    // cycle time of day forward
    const idx = TIME_ORDER.indexOf(currentTime);
    currentTime = TIME_ORDER[(idx + 1) % TIME_ORDER.length];
    targetPreset = TIMES[currentTime];
  } else if (e.key === '6' || e.key === '7' || e.key === '8' || e.key === '9' || e.key === '0') {
    const map = { '6': 'dawn', '7': 'morning', '8': 'noon', '9': 'golden', '0': 'dusk' };
    currentTime = map[e.key];
    targetPreset = TIMES[currentTime];
  }
});

// Smoothly move the live env toward the chosen preset. Colours lerp, scalars
// ease, the sun direction slerps. Rate is frame-rate independent.
function updateEnv(dt) {
  const p = targetPreset;
  const k = 1 - Math.pow(0.5, dt / 0.6);      // ~0.6s to close half the gap
  env.sunColor.lerp(new THREE.Color(p.sunColor), k);
  env.zenith.lerp(new THREE.Color(p.zenith), k);
  env.mid.lerp(new THREE.Color(p.mid), k);
  env.horizon.lerp(new THREE.Color(p.horizon), k);
  env.haze.lerp(new THREE.Color(p.haze), k);
  env.fog.lerp(new THREE.Color(p.fog), k);
  env.hemiSky.lerp(new THREE.Color(p.hemiSky), k);
  env.hemiGround.lerp(new THREE.Color(p.hemiGround), k);
  env.dirColor.lerp(new THREE.Color(p.dirColor), k);
  env.ambient.lerp(new THREE.Color(p.ambient), k);
  env.cloud.lerp(new THREE.Color(p.cloud), k);
  env.sunInt += (p.sunInt - env.sunInt) * k;
  env.hazePow += (p.hazePow - env.hazePow) * k;
  env.fogNear += (p.fogNear - env.fogNear) * k;
  env.fogFar += (p.fogFar - env.fogFar) * k;
  env.hemiInt += (p.hemiInt - env.hemiInt) * k;
  env.dirInt += (p.dirInt - env.dirInt) * k;
  env.night += (p.night - env.night) * k;
  env.sunDir.lerp(p.sunDir, k).normalize();

  // Push into everything that reads the environment.
  scene.fog.color.copy(env.fog);
  scene.fog.near = env.fogNear; scene.fog.far = env.fogFar;

  skyUniforms.uToSun.value.copy(env.sunDir).negate();
  skyUniforms.uHazePow.value = env.hazePow;
  skyUniforms.uNight.value = env.night;

  hemiLight.color.copy(env.hemiSky);
  hemiLight.groundColor.copy(env.hemiGround);
  hemiLight.intensity = env.hemiInt;
  dirLight.color.copy(env.dirColor);
  dirLight.intensity = env.dirInt;
  dirLight.position.copy(env.sunDir).negate().multiplyScalar(60);

  // Sun/moon look
  sunUniforms.uCore.value.copy(env.sunColor);
  sunUniforms.uGlow.value.copy(env.sunColor).lerp(env.haze, 0.4);
  sunUniforms.uMoon.value = env.night > 0.7 ? 1 : 0;
  sunUniforms.uNight.value = env.night;

  // Clouds tint with the sky.
  for (const c of clouds) c.material.color.copy(env.cloud);
}

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  // getElapsedTime() and getDelta() both advance the same clock, so calling one
  // starves the other. Take the delta once, accumulate our own elapsed time.
  const dt = Math.min(clock.getDelta(), 0.05);
  animate.t = (animate.t || 0) + dt;
  const t = animate.t;

  // Slowed clock driving the whole wind system (motion, sweep, sparkle) so the
  // entire effect can be paced together. 0.6 = 40% slower.
  const tw = t * WIND_SPEED;
  windClock = tw;             // expose for leaf (re)builds so they ease in calmly

  leaves.forEach(({ group, ry, material, gust, motion, rand }, i) => {
    const tLeaf = tw * 1.3 + i * 5.7;

    // Gentle baseline the curtain breathes at when no gust is passing.
    const breath = 0.35 + 0.12 * Math.sin(tLeaf * 0.23) + 0.06 * Math.sin(tLeaf * 0.15 + 1.0);

    // Discrete gust events (on the slowed clock tw): each fires after a random
    // calm gap, lasts a random 0.5-5s, ramps up and back down. Strong only now
    // and then, not always.
    if (!gust.active && tw >= gust.next) {
      gust.active = true;
      gust.start = tw;
      // Most gusts are short (0.5-5s), but now and then one lingers much longer
      // (up to ~14s), so the wind isn't always brief.
      const long = rand() < 0.3;
      gust.end = tw + (long ? 5.0 + rand() * 9.0 : 0.5 + rand() * 4.5);
      // Strength varies widely gust to gust: mostly soft puffs, occasionally a
      // strong one -- so the run reads like 1, 0.5, 0.6, then a big 2, not a
      // steady beat. (rand^2 skews low; the rare high value is the strong gust.)
      const r = rand();
      gust.peak = 0.3 + 3.2 * r * r;
      gust.dir = rand() * Math.PI * 2;             // each gust blows from its own way
    }
    let gustAmt = 0;
    if (gust.active) {
      const span = gust.end - gust.start;
      const u = (tw - gust.start) / span;          // 0..1 over the gust
      if (u >= 1) {
        gust.active = false;
        // Gaps vary too: sometimes gusts tumble one after another, sometimes a
        // long lull of stillness -- so it never feels metronomic.
        const g = rand();
        gust.next = tw + 0.3 + 11.0 * g * g;       // ~0.3s back-to-back .. ~11s lull
      } else {
        // Ease in and hold and ease out (smoothstep tails => zero slope at both
        // ends), so the gust never snaps from strong to 0. Between gusts the
        // wind rests at the gentle baseline -- that's the calm moment.
        const attack = 0.35 * span, release = 0.45 * span;
        const tIn = tw - gust.start, tOut = gust.end - tw;
        const env = Math.min(
          THREE.MathUtils.smoothstep(tIn, 0, attack),
          THREE.MathUtils.smoothstep(tOut, 0, release)
        );
        gustAmt = env * gust.peak;
      }
    }
    const windTarget = (breath + gustAmt) * WIND_STRENGTH;

    // Spring-damper: the wind is a FORCE pulling the ribbon's deflection toward
    // windTarget, but the ribbon has mass, so it lags, overshoots, and keeps
    // swinging as it settles -- it does NOT snap back when the wind is gone.
    // Under-damped (zeta < 1) so there's visible follow-through and settle.
    const OMEGA = 2.4;               // stiffness (rad/s) -- how quickly it responds
    const ZETA = 0.28;              // damping ratio -- low => swings a few times
    const accel = OMEGA * OMEGA * (windTarget - motion.resp)
                - 2.0 * ZETA * OMEGA * motion.vel;
    motion.vel += accel * dt;
    motion.resp += motion.vel * dt;
    const wind = motion.resp;

    // Direction: a calm baseline that slowly wanders the full compass, and when
    // a gust blows it swings toward that gust's own heading -- so the wind
    // genuinely arrives from different sides, not always one direction.
    const baseAngle = tw * 0.35 + i * 2.1;                  // wanders all the way round
    let angleTarget = baseAngle;
    if (gust.active) {
      // shortest-path blend from baseline toward the gust's heading
      let d = gust.dir - baseAngle;
      d = Math.atan2(Math.sin(d), Math.cos(d));
      const blend = Math.sin(((tw - gust.start) / (gust.end - gust.start)) * Math.PI);
      angleTarget = baseAngle + d * blend * 0.85;
    }
    // Direction also has inertia: spring the heading toward its target along the
    // shortest path, so it drifts and settles rather than snapping.
    let da = Math.atan2(Math.sin(angleTarget - motion.dirResp), Math.cos(angleTarget - motion.dirResp));
    const dAccel = 3.0 * 3.0 * da - 2.0 * 0.5 * 3.0 * motion.dirVel;
    motion.dirVel += dAccel * dt;
    motion.dirResp += motion.dirVel * dt;
    const windAngle = motion.dirResp;
    const windDir = new THREE.Vector3(Math.cos(windAngle), 0, Math.sin(windAngle));

    // The gust front sweeps across the leaf only while a gust is passing;
    // when calm, park it off-leaf so nothing is swept.
    let gustPhase = -10.0;
    if (gust.active) {
      const u = (tw - gust.start) / (gust.end - gust.start);
      gustPhase = -1.4 + u * 2.8;                       // travels across the leaf
    }

    material.uniforms.uTime.value = tLeaf;
    material.uniforms.uWind.value = wind;
    material.uniforms.uWindDir.value.copy(windDir);
    material.uniforms.uGustPhase.value = gustPhase;
    material.uniforms.uCameraPos.value.copy(camera.position);

    group.rotation.y = ry + Math.sin(tw * 0.32 + i * 0.9) * (0.03 + wind * 0.02);
  });

  for (const c of clouds) {
    c.position.x += c.userData.vx * dt;
    c.position.z += c.userData.vz * dt;
    if (c.position.x > 55) c.position.x = -55;
    if (c.position.x < -55) c.position.x = 55;
    if (c.position.z > -5) c.position.z = -60;
    if (c.position.z < -60) c.position.z = -5;
  }

  // Shafts fade with daylight — barely visible at night.
  const shaftBase = 0.16 * (0.25 + 0.75 * (1.0 - env.night));
  shaftMaterial.uniforms.uOpacity.value = shaftBase + 0.05 * Math.sin(t * 0.3) + 0.02 * Math.sin(t * 0.13 + 1.0);
  shaftMaterial.uniforms.uColor.value.copy(env.sunColor);

  updateEnv(dt);
  placeSun();
  skyUniforms.uTime.value = t;

  controls.update();
  renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

window.__scene = scene;
window.__getLeaves = () => leaves;

animate();

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { loadModel} from './helpers.js';

//Shader textures
const noiseTexture = new THREE.TextureLoader().load('../public/Materials/Perlin7.png');
const dudvTexture = new THREE.TextureLoader().load('../public/Materials/DrewWater.png');

noiseTexture.wrapS = noiseTexture.wrapT = THREE.RepeatWrapping;
dudvTexture.wrapS = dudvTexture.wrapT = THREE.RepeatWrapping;

//Meshes
//Importing Half Circle Mesh
const monkeyUrl = new URL('../public/Meshes/HalfSphere.glb?url', import.meta.url)
//Importing top circle 
const circleURL = new URL('../public/Meshes/TopOfSphere.glb?url', import.meta.url)
//Waterfalls
const WaterFallURL = new URL('../public/Meshes/WaterFalls.glb?url', import.meta.url)

//Materials 
const m1 = new THREE.MeshBasicMaterial({color: 0x4566})

//Shaders 

const m2 = new THREE.ShaderMaterial({
  wireframe: false,
  side: THREE.DoubleSide, // Render both sides
  uniforms: {
    tNoise: { value: noiseTexture },
    tDudv: { value: dudvTexture },
    topDarkColor: { value: new THREE.Color(0x003366) },
    bottomDarkColor: { value: new THREE.Color(0x001a33) },
    topLightColor: { value: new THREE.Color(0x4da6ff) },
    bottomLightColor: { value: new THREE.Color(0x0066cc) },
    foamColor: { value: new THREE.Color(0xffffff) },
    time: { value: 0.0 }
  },
  vertexShader: `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    precision highp float;
    
    varying vec2 vUv;
    uniform sampler2D tNoise;
    uniform sampler2D tDudv;
    uniform vec3 topDarkColor;
    uniform vec3 bottomDarkColor;
    uniform vec3 topLightColor;
    uniform vec3 bottomLightColor;
    uniform vec3 foamColor;
    uniform float time;

    float roundBand(float a) {
      return floor(a + 0.5);
    }

    void main() {
      const float strength = 0.02;
      const float foamThreshold = 0.15;
      
      vec2 displacement = texture2D(tDudv, vUv + time * 0.1).rg;
      displacement = ((displacement * 2.0) - 1.0) * strength;

      float noise = texture2D(tNoise, vec2(vUv.x, (vUv.y / 5.0) + time * 0.2) + displacement).r;
      noise = roundBand(noise * 5.0) / 5.0;

      vec3 color = mix(mix(bottomDarkColor, topDarkColor, vUv.y), mix(bottomLightColor, topLightColor, vUv.y), noise);
      color = mix(color, foamColor, step(vUv.y + displacement.y, foamThreshold));

      gl_FragColor = vec4(color, 1.0);
    }
  `
});

const renderer = new  THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

//setting background color for now
renderer.setClearColor(0x89CFF0);

//initializing scene
const scene  = new THREE.Scene(); 
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

//Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);

camera.position.set(0, 20, 50);
controls.update();



//Grid
//const gridHelper = new THREE.GridHelper(50, 50);
//scene.add(gridHelper);

//Axes 
const axesHelper = new THREE.AxesHelper(50);
scene.add(axesHelper);

//Asset Loader 
const assetLoader = new GLTFLoader();

//use the helper funciton instead! 
loadModel(assetLoader, monkeyUrl.href, {x: 0, y: 5, z: 0}, {x:5, y: 5, z: 5}, m1, scene);
loadModel(assetLoader, circleURL.href, {x: 0, y: 4.8, z: 0}, {x:5, y: 5, z: 5}, m1, scene);
loadModel(assetLoader, WaterFallURL.href, {x: 0, y: 4.8, z: 0}, {x:5.01, y: 5, z: 5}, m2, scene);


//animate function for time to pass
function animate(time){
    controls.update();
    requestAnimationFrame(animate);
    m2.uniforms.time.value += 0.02;
    renderer.render(scene, camera);
}



//setting animate
renderer.setAnimationLoop(animate);

// ==================== IMPORTS ====================
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { loadModel } from './helpers.js';

// Shaders
import vertexShader from './Shaders/Waterfall/vertex.glsl';
import fragmentShader from './Shaders/Waterfall/fragment.glsl';

// Images
import noiseTexture from '../public/Materials/Perlin7.png';


// ==================== MATERIALS ====================
const terrainMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x4c3228 
});

const waterfallMaterial = new THREE.ShaderMaterial({
    wireframe: false,
    side: THREE.DoubleSide,
    transparent: false,
    uniforms: {
        uTime: { value: 0.0 }
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
});


// ==================== MESH URLS ====================
const monkeyUrl = new URL('../public/Meshes/HalfSphere.glb?url', import.meta.url);
const circleURL = new URL('../public/Meshes/TopOfSphere.glb?url', import.meta.url);


// ==================== GEOMETRIES & MESHES ====================
const waterfallGeometry = new THREE.PlaneGeometry(6, 25);
const waterfall1 = new THREE.Mesh(waterfallGeometry, waterfallMaterial);
const waterfall2 = new THREE.Mesh(waterfallGeometry, waterfallMaterial);

waterfall1.position.set(0, -7.5, 24.5);
waterfall2.position.set(0, -7.5, -24.5);


// ==================== RENDERER SETUP ====================
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x89CFF0);
document.body.appendChild(renderer.domElement);


// ==================== SCENE & CAMERA ====================
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000
);
camera.position.set(0, 20, 50);


// ==================== CONTROLS ====================
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();


// ==================== HELPERS (Debug) ====================
const gridHelper = new THREE.GridHelper(50, 50);
const axesHelper = new THREE.AxesHelper(50);
scene.add(gridHelper);
scene.add(axesHelper);


// ==================== LOADERS ====================
const assetLoader = new GLTFLoader();


// ==================== LOAD MODELS ====================
loadModel(
    assetLoader, 
    monkeyUrl.href, 
    { x: 0, y: 4.7, z: 0 }, 
    { x: 6, y: 6, z: 6 }, 
    terrainMaterial, 
    scene
);

loadModel(
    assetLoader, 
    circleURL.href, 
    { x: 0, y: 4.7, z: 0 }, 
    { x: 6, y: 6, z: 6 }, 
    waterfallMaterial, 
    scene
);


// ==================== ADD MESHES TO SCENE ====================
scene.add(waterfall1);
scene.add(waterfall2);


// ==================== ANIMATION LOOP ====================
function animate() {
    controls.update();
    
    // Update shader time
    waterfallMaterial.uniforms.uTime.value -= 0.05;
    
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { loadModel} from './helpers.js';

//Shaders
import vertexShader from './Shaders/vertex.glsl'
import fragmentShader from './Shaders/fragment.glsl'

const m2 = new THREE.ShaderMaterial({
  vertexShader: vertexShader, 
  fragmentShader: fragmentShader
})


//Meshes
//Importing Half Circle Mesh
const monkeyUrl = new URL('../public/Meshes/HalfSphere.glb?url', import.meta.url)
//Importing top circle 
const circleURL = new URL('../public/Meshes/TopOfSphere.glb?url', import.meta.url)
//Waterfalls
const WaterFallURL = new URL('../public/Meshes/WaterFalls.glb?url', import.meta.url)

//Materials 
const m1 = new THREE.MeshBasicMaterial({color: 0x4566})



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
function animate(){
    controls.update();

    renderer.render(scene, camera);
}



//setting animate
renderer.setAnimationLoop(animate);

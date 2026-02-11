import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const renderer = new  THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const scene  = new THREE.Scene(); 
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const controls = new OrbitControls(camera, renderer.domElement);

camera.position.set(0, 20, 50);
controls.update();


//Grid
const gridHelper = new THREE.GridHelper(10, 10);

scene.add(gridHelper);

function animate(time){
    controls.update();
    renderer.render(scene, camera);
}


renderer.setAnimationLoop(animate);

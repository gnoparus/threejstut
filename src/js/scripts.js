import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const orbit = new OrbitControls(camera, renderer.domElement);
camera.position.set(2, 1, 8);
orbit.update();

const boxGeometry = new THREE.BoxGeometry(2, 1, 1.5, 5, 5, 5);
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const box = new THREE.Mesh(boxGeometry, boxMaterial);
box.position.set(1, 2, -3);
scene.add(box);

const sphereGeometry = new THREE.SphereGeometry(2, 25, 25);
const sphereMaterial = new THREE.MeshStandardMaterial({
  color: 0x00ff00,
  //   wireframe: true,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(-2, 3, 1);
scene.add(sphere);

const planeGeometry = new THREE.PlaneGeometry(10, 10, 30, 30);
const planeMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -0.5 * Math.PI;
scene.add(plane);

const gridHelper = new THREE.GridHelper(10, 10);
scene.add(gridHelper);
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const animate = (t) => {
  box.rotation.x = 0.0005 * t;
  box.rotation.y = 0.0004 * t;
  box.rotation.z = 0.0001 * t;
  renderer.render(scene, camera);
};

renderer.render(scene, camera);
renderer.setAnimationLoop(animate);

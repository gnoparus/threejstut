import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";

import space from "../img/space.jpg";
import star from "../img/star.jpg";
import dog from "../img/dog.jpg";

// setup renderer, scene and camera
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
renderer.shadowMap.enabled = true;

// control
const orbit = new OrbitControls(camera, renderer.domElement);
camera.position.set(2, 1, 8);
orbit.update();

// objects
const boxGeometry = new THREE.BoxGeometry(2, 1, 1.5, 5, 5, 5);
const boxMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const box = new THREE.Mesh(boxGeometry, boxMaterial);
box.position.set(1, 2, -3);
scene.add(box);
box.castShadow = true;

const sphereGeometry = new THREE.SphereGeometry(2, 25, 25);
const sphereMaterial = new THREE.MeshStandardMaterial({
  color: 0x00ff00,
  //   wireframe: true,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(-2, 3, 1);
scene.add(sphere);
sphere.castShadow = true;

// Plane
const planeGeometry = new THREE.PlaneGeometry(15, 15, 30, 30);
const planeMaterial = new THREE.MeshStandardMaterial({
  color: 0xff33ff,
  side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -0.5 * Math.PI;
scene.add(plane);
plane.receiveShadow = true;

// Helper
const gridHelper = new THREE.GridHelper(15, 15);
scene.add(gridHelper);
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// Lights
// const ambientLight = new THREE.AmbientLight(0x333333);
// scene.add(ambientLight);

// const directionalLight = new THREE.DirectionalLight(0x999999, 0.8);
// scene.add(directionalLight);
// directionalLight.position.set(-12, 19, 14);
// directionalLight.castShadow = true;

// const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 3);
// scene.add(dLightHelper);

// const dLightShadowHelper = new THREE.CameraHelper(
//   directionalLight.shadow.camera
// );
// scene.add(dLightShadowHelper);

const spotLight = new THREE.SpotLight(0xffffff, 0.8, 0, 0.1);
scene.add(spotLight);
spotLight.position.set(30, 50, -44);
spotLight.castShadow = true;

const sLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(sLightHelper);

// scene.fog = new THREE.Fog(0xffffff, 0, 100);
scene.fog = new THREE.FogExp2(0xffffff, 0.02);

// renderer.setClearColor(0x333366);

// const textureLoader = new THREE.TextureLoader();
// scene.background = textureLoader.load(space);
const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
  star,
  space,
  space,
  space,
  space,
  space,
]);

const box2Geometry = new THREE.BoxGeometry(1, 1, 1);
const box2Material = new THREE.MeshBasicMaterial({
  //   color: 0xffffff,
  //   map: new THREE.TextureLoader().load(dog),
});
// const box2 = new THREE.Mesh(box2Geometry, box2Material);
// box2.material.map = new THREE.TextureLoader().load(dog);
const box2MultiMaterial = [
  new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(dog) }),
  new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(dog) }),
  new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(star) }),
  new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(star) }),
  new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(space) }),
  new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(space) }),
];
const box2 = new THREE.Mesh(box2Geometry, box2MultiMaterial);
scene.add(box2);
box2.position.set(4, 1, 3);
box2.castShadow = true;

// GUI
const gui = new dat.GUI();
const options = {
  sphereColor: "#00ff00",
  wireframe: false,
  speed: 0.01,
  angle: 0.1,
  penumbra: 0.1,
  intensity: 0.8,
};
gui.addColor(options, "sphereColor").onChange((e) => {
  sphere.material.color.set(e);
});
gui.add(options, "wireframe").onChange((e) => {
  sphere.material.wireframe = e;
});
gui.add(options, "speed", 0.0, 0.1);
gui.add(options, "angle", 0.0, 0.15);
gui.add(options, "penumbra", 0.0, 1.0);
gui.add(options, "intensity", 0.0, 2.0);

// Animate
let step = 0;
const animate = (t) => {
  box.rotation.x = 0.0005 * t;
  box.rotation.y = 0.0004 * t;
  box.rotation.z = 0.0001 * t;

  step += options.speed;
  sphere.position.y = 1.5 + 5 * Math.abs(Math.sin(step));

  spotLight.angle = options.angle;
  spotLight.penumbra = options.penumbra;
  spotLight.intensity = options.intensity;
  sLightHelper.update();

  box2.scale.x = 1 - 0.5 * Math.abs(Math.sin(step));
  box2.scale.y = 1 - 0.5 * Math.abs(Math.sin(step));
  box2.scale.z = 1 - 0.5 * Math.abs(Math.sin(step));

  renderer.render(scene, camera);
};
renderer.render(scene, camera);
renderer.setAnimationLoop(animate);

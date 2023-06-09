import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import space from "../img/space.jpg";
import star from "../img/star.jpg";
import dog from "../img/dog.jpg";

// Model from https://studio.blender.org/training/stylized-character-workflow/base-meshes/
const humanUrl = new URL("../assets/human.glb", import.meta.url);

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
const planeGeometry = new THREE.PlaneGeometry(30, 30, 30, 30);
const planeMaterial = new THREE.MeshStandardMaterial({
  color: 0xff33ff,
  side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -0.5 * Math.PI;
scene.add(plane);
plane.receiveShadow = true;

const plane2Geometry = new THREE.PlaneGeometry(10, 10, 10, 10);
const plane2Material = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  wireframe: true,
});
const plane2 = new THREE.Mesh(plane2Geometry, plane2Material);
scene.add(plane2);
plane2.position.set(10, 10, 15);

plane2.geometry.attributes.position.array[0] -= 10 * Math.random();
plane2.geometry.attributes.position.array[1] -= 10 * Math.random();
plane2.geometry.attributes.position.array[2] -= 10 * Math.random();
const lastPointZ = plane2.geometry.attributes.position.array.length - 1;
plane2.geometry.attributes.position.array[lastPointZ] -= 10 * Math.random();

// Helper
const gridHelper = new THREE.GridHelper(30, 30);
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

const sphere2Geometry = new THREE.SphereGeometry(4);
// const vShader = `
//   void main() {
//     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//   }
// `;
// const fShader = `
//   void main() {
//     gl_FragColor = vec4(0.5, 0.5, 1.0, 1.0);
//   }
// `;
const sphere2Material = new THREE.ShaderMaterial({
  // vertexShader: vShader,
  // fragmentShader: fShader,
  vertexShader: document.getElementById("vertexShader").textContent,
  fragmentShader: document.getElementById("fragmentShader").textContent,
});
const sphere2 = new THREE.Mesh(sphere2Geometry, sphere2Material);
scene.add(sphere2);
sphere2.position.set(-5, 10, 10);

const assetLoader = new GLTFLoader();
assetLoader.load(
  humanUrl.href,
  (gltf) => {
    const model = gltf.scene;
    scene.add(model);
    model.position.set(2, 0, 4);
  },
  undefined,
  (error) => {
    console.error(error);
  }
);

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

const mousePosition = new THREE.Vector2();

window.addEventListener("mousemove", (e) => {
  mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
  mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
  console.log(window.innerWidth + ", " + window.innerHeight);
  console.log(e.clientX + ", " + e.clientY);
  console.log(mousePosition);
});

const rayCaster = new THREE.Raycaster();
const sphereId = sphere.id;
sphere.name = "TheSphere";
box2.name = "TheBox";

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

  rayCaster.setFromCamera(mousePosition, camera);
  const intersects = rayCaster.intersectObjects(scene.children);
  // console.log(intersects);

  // for (let i = 0; i < intersects.length; i++) {
  //   if (intersects[i].object.id === sphereId) {
  //     intersects[i].object.material.color.set(0xff0000);
  //     console.log(intersects[i]);
  //   }

  //   if (intersects[i].object.name === "TheBox") {
  //     intersects[i].object.rotation.x = t / 1000;
  //     intersects[i].object.rotation.y = t / 1000;
  //     console.log(intersects[i]);
  //   }
  // }

  intersects.map((item) => {
    if (item.object.id === sphereId) {
      item.object.material.color.set(0xff0000);
      console.log(item);
    }

    if (item.object.name === "TheBox") {
      item.object.rotation.x = t / 100;
      item.object.rotation.y = t / 1000;
      item.object.rotation.z = t / 10000;

      sphere.material.color.set(options.sphereColor);
      console.log(item);
    }
  });

  box2.scale.x = 1 - 0.5 * Math.abs(Math.sin(step));
  box2.scale.y = 1 - 0.5 * Math.abs(Math.sin(step));
  box2.scale.z = 1 - 0.5 * Math.abs(Math.sin(step));

  plane2.geometry.attributes.position.array[0] = 1 * Math.random() - 5;
  plane2.geometry.attributes.position.array[1] = 1 * Math.random() + 5;
  plane2.geometry.attributes.position.array[2] = 1 * Math.random();
  plane2.geometry.attributes.position.array[lastPointZ] = 10 * Math.random();
  plane2.geometry.attributes.position.needsUpdate = true;

  renderer.render(scene, camera);
};
renderer.render(scene, camera);
renderer.setAnimationLoop(animate);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

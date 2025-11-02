import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

/* Three.js has 3 main elements
** 1.) Scene act like a container 
** 2.) Camera, there are many types but PerspectiveCamera(fov - field of view, aspect ratio, near, far) mimics human eyeballs. Near and Far here refer to ranges in the view frustum
** 3.) Rederer
*/
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);


// need to tell the renderer as an object, what to be rendered
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

// controls
const controls = new OrbitControls(camera, renderer.domElement);

// camera setting
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight);
camera.position.setZ(50);

// Lights
const pointLight = new THREE.PointLight(0xffffff, 0.2);
pointLight.position.set(20,60,20);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add( pointLight, ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(-30, 20, 10);
scene.add(directionalLight);

// Helpers
const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add( lightHelper, gridHelper );


// Objects
const geometry = new THREE.TorusGeometry( 10, 3, 16, 100 );
const material = new THREE.MeshStandardMaterial({ 
  color: 0xFF6347,
  roughness: 0.3,   // ผิวเรียบขึ้น (สะท้อนมากขึ้น)
  metalness: 0.6,   // มีความมันวาวแบบโลหะ
});
const torus  = new THREE.Mesh( geometry, material ); // creating a mesh by combining both

// Adding to the scene
scene.add( torus );

const spaceTexture = new THREE.TextureLoader().load('public/space.jpg');
scene.background = spaceTexture;

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffde21 });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.position.y = t * -0.0002;
}
document.body.onscroll = moveCamera;


function animate() {
  requestAnimationFrame( animate );
  torus.rotation.x += 0.001;
  torus.rotation.y += 0.001;
  torus.rotation.z += 0.001;
  controls.update();
  renderer.render( scene, camera );
}

animate();
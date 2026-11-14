
import * as THREE from 'three';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ alpha: true }); 
renderer.setSize(innerWidth, innerHeight);
renderer.domElement.style.cssText =
  'position:fixed;inset:0;width:100vw;height:100vh;z-index:-1;pointer-events:none;';
document.body.appendChild(renderer.domElement);
document.body.style.margin = 0;

// 生成 5000 个顶点坐标
const starGeometry = new THREE.BufferGeometry();
const starCount = 5000;
const positions = new Float32Array(starCount * 3);

for (let i = 0; i < starCount * 3; i++) {

  positions[i] = (Math.random() - 0.5) * 20; 
}

starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));


const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05 });
const starField = new THREE.Points(starGeometry, starMaterial);
scene.add(starField);

function animate() {
  requestAnimationFrame(animate);

  starField.rotation.x += 0.0005;
  starField.rotation.y += 0.0005;
  renderer.render(scene, camera);
}
animate();
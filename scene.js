import * as THREE from "three";
import { gsap } from "gsap";
import { exhibits } from "./content.js";

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

function roundedRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function makeCardTexture(item) {
  const canvas = document.createElement("canvas");
  canvas.width = 900;
  canvas.height = 1100;
  const ctx = canvas.getContext("2d");

  const bg = ctx.createLinearGradient(0, 0, 900, 1100);
  bg.addColorStop(0, "#171a2a");
  bg.addColorStop(1, "#0b0e18");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 900, 1100);

  // Accent glow.
  const glow = ctx.createRadialGradient(700, 340, 10, 700, 340, 460);
  glow.addColorStop(0, `${item.accent}66`);
  glow.addColorStop(1, `${item.accent}00`);
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, 900, 850);

  // Thin border.
  ctx.strokeStyle = "rgba(255,255,255,.18)";
  ctx.lineWidth = 3;
  roundedRect(ctx, 22, 22, 856, 1056, 28);
  ctx.stroke();

  ctx.fillStyle = "rgba(255,255,255,.58)";
  ctx.font = "600 25px Arial, sans-serif";
  ctx.letterSpacing = "5px";
  ctx.fillText(`EXPO LAB  /  ${item.id}`, 68, 92);

  ctx.fillStyle = item.accent;
  ctx.beginPath();
  ctx.arc(812, 78, 13, 0, Math.PI * 2);
  ctx.fill();

  // Abstract graphic.
  ctx.save();
  ctx.translate(450, 440);
  ctx.rotate(-0.18);
  ctx.strokeStyle = `${item.accent}bb`;
  ctx.lineWidth = 5;
  for (let i = 0; i < 6; i++) {
    ctx.beginPath();
    ctx.ellipse(0, 0, 130 + i * 30, 95 + i * 24, i * 0.12, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.fillStyle = `${item.accent}22`;
  ctx.beginPath();
  ctx.arc(0, 0, 118, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.fillStyle = "#ffffff";
  ctx.font = "700 91px Arial, sans-serif";
  ctx.fillText(item.title, 68, 790, 760);

  ctx.fillStyle = "rgba(255,255,255,.67)";
  ctx.font = "34px Arial, sans-serif";
  ctx.fillText(item.subtitle, 72, 858, 750);

  ctx.fillStyle = item.accent;
  ctx.font = "600 23px Arial, sans-serif";
  ctx.letterSpacing = "4px";
  ctx.fillText(item.category, 72, 1000, 750);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function makeBannerTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1800;
  canvas.height = 360;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#ffffff";
  ctx.font = "800 132px Arial, sans-serif";
  ctx.letterSpacing = "12px";
  ctx.fillText("IDEAS IN MOTION", 20, 170);
  ctx.fillStyle = "rgba(255,255,255,.58)";
  ctx.font = "34px Arial, sans-serif";
  ctx.letterSpacing = "8px";
  ctx.fillText("A SPATIAL WEB EXPERIMENT", 28, 250);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createExpoScene(canvas, callbacks = {}) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance"
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#090b13");
  scene.fog = new THREE.FogExp2("#090b13", 0.012);

  const camera = new THREE.PerspectiveCamera(
    48,
    window.innerWidth / window.innerHeight,
    0.1,
    180
  );

  // 相机参数独立存放，便于 GSAP 动画和滚动逻辑共同控制。
  const cameraState = {
    y: 18,
    z: 17,
    targetZ: -7
  };

  const cameraTarget = new THREE.Vector3(0, 0, cameraState.targetZ);
  camera.position.set(0, cameraState.y, cameraState.z);
  camera.lookAt(cameraTarget);

  // Lighting.
  scene.add(new THREE.AmbientLight(0xffffff, 1.35));

  const keyLight = new THREE.DirectionalLight(0xb8c7ff, 2.4);
  keyLight.position.set(-5, 14, 8);
  scene.add(keyLight);

  const rimLight = new THREE.PointLight(0x745cff, 42, 55);
  rimLight.position.set(6, 7, -17);
  scene.add(rimLight);

  const warmLight = new THREE.PointLight(0xff8a62, 28, 42);
  warmLight.position.set(-7, 5, -30);
  scene.add(warmLight);

  // Floor: a large plane lying on the XZ ground.
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(18, 66),
    new THREE.MeshStandardMaterial({
      color: "#101321",
      roughness: 0.88,
      metalness: 0.12
    })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, -0.12, -16);
  scene.add(floor);

  // GridHelper is already aligned to the XZ plane.
  const grid = new THREE.GridHelper(66, 66, 0x4b5274, 0x252a42);
  grid.position.set(0, 0.015, -16);
  grid.material.transparent = true;
  grid.material.opacity = 0.34;
  scene.add(grid);

  // Floor rails.
  const railMaterial = new THREE.MeshStandardMaterial({
    color: "#7164ff",
    emissive: "#3d2dff",
    emissiveIntensity: 1.1,
    metalness: 0.5,
    roughness: 0.35
  });
  for (const x of [-8.5, 8.5]) {
    const rail = new THREE.Mesh(
      new THREE.BoxGeometry(0.055, 0.055, 66),
      railMaterial
    );
    rail.position.set(x, 0.025, -16);
    scene.add(rail);
  }

  // Entrance title, also lying on the floor.
  const bannerTexture = makeBannerTexture();
  const banner = new THREE.Mesh(
    new THREE.PlaneGeometry(10.5, 2.1),
    new THREE.MeshBasicMaterial({
      map: bannerTexture,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide
    })
  );
  banner.rotation.x = -Math.PI / 2;
  banner.position.set(0, 0.035, 4.3);
  scene.add(banner);

  // Small floor markers.
  for (let i = 0; i < 9; i++) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.42 + (i % 3) * 0.12, 0.012, 8, 48),
      new THREE.MeshBasicMaterial({
        color: i % 2 ? "#8d7bff" : "#ff9877",
        transparent: true,
        opacity: 0.55
      })
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.set(i % 2 ? 6.8 : -6.8, 0.035, 1 - i * 6.8);
    scene.add(ring);
  }

  // Cards are meshes with CanvasTexture maps.
  const cardMeshes = [];
  const cardWidth = 3.55;
  const cardHeight = 4.35;
  const columns = [-4.45, 0, 4.45];
  const rowGap = 7.15;

  exhibits.forEach((item, index) => {
    const row = Math.floor(index / 3);
    const col = index % 3;
    const x = columns[col];
    const z = -1.1 - row * rowGap;

    const frame = new THREE.Mesh(
      new THREE.PlaneGeometry(cardWidth + 0.12, cardHeight + 0.12),
      new THREE.MeshBasicMaterial({
        color: item.accent,
        transparent: true,
        opacity: 0.58,
        side: THREE.DoubleSide
      })
    );
    frame.rotation.x = -Math.PI / 2;
    frame.position.set(x, 0.025, z);
    scene.add(frame);

    const texture = makeCardTexture(item);
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.7,
      metalness: 0.08,
      emissive: new THREE.Color("#000000"),
      emissiveIntensity: 0.35,
      side: THREE.DoubleSide
    });

    const card = new THREE.Mesh(
      new THREE.PlaneGeometry(cardWidth, cardHeight),
      material
    );
    card.rotation.x = -Math.PI / 2;
    card.position.set(x, 0.055, z);
    card.userData.exhibit = item;
    card.userData.baseScale = 1;
    scene.add(card);
    cardMeshes.push(card);
  });

  // Decorative floating particles.
  const particleCount = 420;
  const particlePositions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    particlePositions[i * 3] = (Math.random() - 0.5) * 25;
    particlePositions[i * 3 + 1] = 0.5 + Math.random() * 7;
    particlePositions[i * 3 + 2] = 8 - Math.random() * 58;
  }
  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(particlePositions, 3)
  );
  const particles = new THREE.Points(
    particleGeometry,
    new THREE.PointsMaterial({
      color: "#b6b5ff",
      size: 0.035,
      transparent: true,
      opacity: 0.58
    })
  );
  scene.add(particles);

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2(2, 2);
  let hoveredCard = null;
  let active = false;
  let mode = "3d";
  let disposed = false;
  let targetScroll = 0;
  let currentScroll = 0;
  const maxScroll = 30.5;

  function getIntersections() {
    raycaster.setFromCamera(pointer, camera);
    return raycaster.intersectObjects(cardMeshes, false);
  }

  function setHovered(nextCard) {
    if (hoveredCard === nextCard) return;

    if (hoveredCard) {
      gsap.to(hoveredCard.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.22,
        ease: "power2.out"
      });
      hoveredCard.material.emissive.set("#000000");
    }

    hoveredCard = nextCard;

    if (hoveredCard) {
      gsap.to(hoveredCard.scale, {
        x: 1.035,
        y: 1.035,
        z: 1.035,
        duration: 0.24,
        ease: "power2.out"
      });
      hoveredCard.material.emissive.set(hoveredCard.userData.exhibit.accent);
      canvas.style.cursor = "pointer";
    } else {
      canvas.style.cursor = "grab";
    }
  }

  function onPointerMove(event) {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    if (!active) return;
    const hits = getIntersections();
    setHovered(hits.length ? hits[0].object : null);
  }

  function onPointerLeave() {
    pointer.set(2, 2);
    setHovered(null);
  }

  function onClick() {
    if (!active) return;
    const hits = getIntersections();
    if (hits.length) {
      const item = hits[0].object.userData.exhibit;
      callbacks.onSelect?.(item);
    }
  }

  function onWheel(event) {
    if (!active) return;
    event.preventDefault();
    targetScroll = clamp(targetScroll + event.deltaY * 0.018, 0, maxScroll);
  }

  let touchY = null;
  function onTouchStart(event) {
    if (event.touches.length) touchY = event.touches[0].clientY;
  }
  function onTouchMove(event) {
    if (!active || touchY === null || !event.touches.length) return;
    const nextY = event.touches[0].clientY;
    targetScroll = clamp(targetScroll + (touchY - nextY) * 0.055, 0, maxScroll);
    touchY = nextY;
  }
  function onTouchEnd() {
    touchY = null;
  }

  const inputRoot = canvas.parentElement || canvas;
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerleave", onPointerLeave);
  canvas.addEventListener("click", onClick);
  // Attach wheel/touch navigation to the whole expo layer, including HUD areas.
  inputRoot.addEventListener("wheel", onWheel, { passive: false });
  inputRoot.addEventListener("touchstart", onTouchStart, { passive: true });
  inputRoot.addEventListener("touchmove", onTouchMove, { passive: true });
  inputRoot.addEventListener("touchend", onTouchEnd, { passive: true });

  function onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
    renderer.setSize(width, height);
  }
  window.addEventListener("resize", onResize);

  function enter() {
    mode = "3d";
    active = true;
    targetScroll = 0;
    currentScroll = 0;
    gsap.killTweensOf(cameraState);
    gsap.to(cameraState, {
      y: 8.5,
      z: 13.5,
      targetZ: -7,
      duration: 1.7,
      ease: "power3.inOut"
    });
  }

  // 2D / 3D 视图切换不重置滚动值，因此返回 3D 时会回到离开时的位置。
  function setMode(nextMode) {
    if (nextMode !== "2d" && nextMode !== "3d") return;
    mode = nextMode;
    gsap.killTweensOf(cameraState);

    if (mode === "2d") {
      active = false;
      // 停止惯性滚动，确保切回 3D 时回到切换瞬间的位置。
      targetScroll = currentScroll;
      setHovered(null);
      gsap.to(cameraState, {
        y: 22,
        z: 17,
        targetZ: -7,
        duration: 0.72,
        ease: "power2.inOut"
      });
      return;
    }

    active = true;
    gsap.to(cameraState, {
      y: 8.5,
      z: 13.5,
      targetZ: -7,
      duration: 0.9,
      ease: "power3.inOut"
    });
  }

  function exit() {
    active = false;
    mode = "3d";
    setHovered(null);
    targetScroll = 0;
    gsap.killTweensOf(cameraState);
    gsap.to(cameraState, {
      y: 18,
      z: 17,
      targetZ: -7,
      duration: 1.15,
      ease: "power3.inOut"
    });
    const scrollState = { value: currentScroll };
    gsap.to(scrollState, {
      value: 0,
      duration: 0.7,
      ease: "power2.out",
      onUpdate() {
        currentScroll = scrollState.value;
      }
    });
  }

  function animate() {
    if (disposed) return;
    requestAnimationFrame(animate);

    currentScroll += (targetScroll - currentScroll) * 0.075;
    camera.position.set(0, cameraState.y, cameraState.z - currentScroll);
    cameraTarget.set(0, 0, cameraState.targetZ - currentScroll);
    camera.lookAt(cameraTarget);

    const progress = currentScroll / maxScroll;
    callbacks.onProgress?.(progress);

    particles.rotation.y += 0.00012;
    renderer.render(scene, camera);
  }
  animate();

  return {
    enter,
    exit,
    setMode,
    setActive(value) {
      active = value;
    },
    dispose() {
      disposed = true;
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("click", onClick);
      inputRoot.removeEventListener("wheel", onWheel);
      inputRoot.removeEventListener("touchstart", onTouchStart);
      inputRoot.removeEventListener("touchmove", onTouchMove);
      inputRoot.removeEventListener("touchend", onTouchEnd);
      renderer.dispose();
    }
  };
}

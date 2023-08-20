import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function ThreeDTour() {
  const containerRef = useRef(null);
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);

  // Separate useEffect for the loading timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoadingScreen(false);
    }, 9000);

    // Cleanup the timer if the component is unmounted
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    const loader = new GLTFLoader();
    loader.load("/room.glb", (gltf) => {
      scene.add(gltf.scene);
    });

    camera.position.set(-2, 1.6, 2);
    camera.lookAt(new THREE.Vector3(-2, 1.6, 2));

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(-2, 1.6, 1);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableRotate = true;
    controls.minPolarAngle = 0;
    controls.maxPolarAngle = Math.PI;

    const originalFOV = camera.fov;
    let targetFOV = originalFOV;
    let isZooming = false;

    function zoomStep() {
      if (Math.abs(camera.fov - targetFOV) > 0.1) {
        camera.fov += (targetFOV - camera.fov) * 0.1;
        camera.updateProjectionMatrix();
        requestAnimationFrame(zoomStep);
      } else {
        camera.fov = targetFOV;
        camera.updateProjectionMatrix();
        isZooming = false;
      }
    }

    function handleKeyDown(event) {
      if (event.key === "z" && !isZooming) {
        targetFOV = originalFOV * 0.25;
        isZooming = true;
        zoomStep();
      }
    }

    function handleKeyUp(event) {
      if (event.key === "z" && !isZooming) {
        targetFOV = originalFOV;
        isZooming = true;
        zoomStep();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <div className="w-full h-full relative">
      <div
        ref={containerRef}
        className="w-full h-full absolute top-0 left-0"
      ></div>
    </div>
  );
}

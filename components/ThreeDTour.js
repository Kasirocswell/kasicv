import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function ThreeDTour() {
  const containerRef = useRef(null);

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

    // Load the .glb model
    const loader = new GLTFLoader();
    loader.load("/room.glb", (gltf) => {
      scene.add(gltf.scene);
    });

    // Set camera position inside the model
    camera.position.set(-2, 1.6, 2); // Assuming 1.6 is eye level

    // Adjust camera to face the X-axis
    camera.lookAt(new THREE.Vector3(-2, 1.6, 2)); // Look towards positive X-axis

    // Add orbit controls for 360 x-axis movement
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(-2, 1.6, 1); // Set the point to look at (center of the room)
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableRotate = true;
    controls.minPolarAngle = 0; // radians
    controls.maxPolarAngle = Math.PI; // radians

    const originalFOV = camera.fov;
    let targetFOV = originalFOV;
    let isZooming = false;

    function zoomStep() {
      if (Math.abs(camera.fov - targetFOV) > 0.1) {
        camera.fov += (targetFOV - camera.fov) * 0.1; // Smooth transition effect
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
        targetFOV = originalFOV * 0.25; // Reduce FOV to 25% of original for a 75% zoom-in effect
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

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);

    // Set the camera's aspect ratio and the renderer's size
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Handle window resizing
    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Cleanup on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full"></div>;
}

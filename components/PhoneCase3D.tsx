'use client';

import { Suspense, useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { RoundedBox, Environment, Float, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// Product images to cycle through on the case front
const CASE_IMAGES = [
  '/images/black1.JPG',
  '/images/white1.JPG',
  '/images/black3.JPG',
  '/images/white2.JPG',
  '/images/black5.JPG',
];

const CYCLE_INTERVAL = 3000; // ms between image transitions

// ------- Phone Case Mesh -------
function PhoneCaseMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [gyro, setGyro] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const { viewport } = useThree();

  // Load all textures upfront
  const textures = useTexture(CASE_IMAGES);

  // Ensure textures are properly configured
  useMemo(() => {
    textures.forEach((tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
    });
  }, [textures]);

  // Cycle through images
  useEffect(() => {
    const timer = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % CASE_IMAGES.length);
    }, CYCLE_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  // Detect mobile and set up gyroscope
  useEffect(() => {
    const mobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    setIsMobile(mobile);

    if (mobile && window.DeviceOrientationEvent) {
      const handleOrientation = (e: DeviceOrientationEvent) => {
        const x = (e.gamma || 0) / 45; // left-right tilt, normalize to -1..1
        const y = (e.beta || 0) / 45;  // front-back tilt
        setGyro({ x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, y - 0.5)) });
      };
      window.addEventListener('deviceorientation', handleOrientation);
      return () => window.removeEventListener('deviceorientation', handleOrientation);
    }
  }, []);

  // Mouse tracking (desktop)
  useEffect(() => {
    if (isMobile) return;
    const handleMouse = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, [isMobile]);

  // Animation frame
  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const input = isMobile ? gyro : mousePos;

    // Smooth tilt toward input
    const targetRotX = input.y * 0.3;
    const targetRotY = input.x * 0.4;
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotX, 0.05);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotY, 0.05);

    // Update texture with crossfade via opacity (simple swap for now)
    if (materialRef.current) {
      materialRef.current.map = textures[imageIndex];
      materialRef.current.needsUpdate = true;
    }
  });

  // Responsive scale (restored to original state before 1.5x zoom)
  const scale = viewport.width < 5 ? 0.7 : 1;

  return (
    <Float
      speed={2}
      rotationIntensity={0.3}
      floatIntensity={0.8}
      floatingRange={[-0.1, 0.1]}
    >
      <group ref={meshRef} scale={scale}>
        {/* Case body */}
        <RoundedBox
          args={[2.2, 4.2, 0.35]}
          radius={0.25}
          smoothness={8}
        >
          <meshPhysicalMaterial
            color="#1a1a1a"
            roughness={0.15}
            metalness={0.7}
            clearcoat={1}
            clearcoatRoughness={0.1}
            envMapIntensity={1.5}
          />
        </RoundedBox>

        {/* Screen / front face with product image */}
        <mesh position={[0, 0, 0.176]}>
          <planeGeometry args={[1.9, 3.8]} />
          <meshPhysicalMaterial
            ref={materialRef}
            map={textures[imageIndex]}
            roughness={0.3}
            metalness={0.1}
            clearcoat={0.5}
            clearcoatRoughness={0.2}
            toneMapped={false}
          />
        </mesh>

        {/* Camera bump */}
        <group position={[-0.55, 1.55, -0.176]}>
          <RoundedBox args={[0.8, 0.8, 0.08]} radius={0.12} smoothness={4}>
            <meshPhysicalMaterial
              color="#111111"
              roughness={0.1}
              metalness={0.9}
              clearcoat={1}
            />
          </RoundedBox>
          {/* Camera lenses */}
          {[
            [-0.15, 0.15],
            [0.15, 0.15],
            [-0.15, -0.15],
          ].map(([x, y], i) => (
            <mesh key={i} position={[x, y, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.1, 0.1, 0.04, 16]} />
              <meshPhysicalMaterial
                color="#0a0a0a"
                roughness={0.05}
                metalness={1}
                clearcoat={1}
                envMapIntensity={2}
              />
            </mesh>
          ))}
        </group>

        {/* Subtle brand glow ring at bottom */}
        <mesh position={[0, -1.5, 0.176]}>
          <ringGeometry args={[0.15, 0.2, 32]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.15} />
        </mesh>
      </group>
    </Float>
  );
}

// ------- Loading Shimmer -------
function LoadingShimmer() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-32 h-56 rounded-3xl bg-gradient-to-br from-white/5 to-white/10 animate-pulse" />
    </div>
  );
}

// ------- Main Exported Component -------
export default function PhoneCase3D() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <LoadingShimmer />;
  }

  return (
    <div className="w-full h-full min-h-[500px] relative pointer-events-auto">
      <Suspense fallback={<LoadingShimmer />}>
        <Canvas
          camera={{ position: [0, 0, 7], fov: 35 }}
          dpr={[1, 1.5]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          style={{ background: 'transparent' }}
        >
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} color="#ffffff" />
          <directionalLight position={[-3, 2, 4]} intensity={0.6} color="#c4b5fd" />
          <spotLight
            position={[0, 8, 4]}
            angle={0.4}
            penumbra={1}
            intensity={0.8}
            color="#e0d5ff"
          />

          {/* Environment for reflections */}
          <Environment preset="city" environmentIntensity={0.5} />

          {/* The Phone Case */}
          <PhoneCaseMesh />
        </Canvas>
      </Suspense>
    </div>
  );
}

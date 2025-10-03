import React, { Suspense, useRef, useEffect } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { Float, Html, OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { CarouselRing } from "./components/CarouselRing";

type ModelProps = { url: string; scale?: number | [number, number, number] };

// ====== Camera tween (après 1s -> va à [0,0,65]) ======
function CameraAnimation() {
  const { camera } = useThree();
  useEffect(() => {
    const tween = gsap.to(camera.position, {
      x: 0, y: 0, z: 65,
      duration: 2,
      delay: 1,
      ease: "power2.inOut",
      onUpdate: () => camera.lookAt(0, 0, 0),
    });
    return () => tween.kill();
  }, [camera]);
  return null;
}

// ====== OrbitControls qui suit la roche + lock vertical après 5s ======
function RockFocusControls({
  rockRef,
  lockAfterMs = 5000,
  lockAt = Math.PI / 2,
}: {
  rockRef: React.RefObject<THREE.Group>;
  lockAfterMs?: number;
  lockAt?: number;
}) {
  const controlsRef = useRef<any>(null);

  useFrame(() => {
    if (controlsRef.current && rockRef.current) {
      controlsRef.current.target.lerp(rockRef.current.position, 0.2);
      controlsRef.current.update();
    }
  });

  useEffect(() => {
    const t = setTimeout(() => {
      if (!controlsRef.current) return;
      controlsRef.current.minPolarAngle = lockAt;
      controlsRef.current.maxPolarAngle = lockAt;
      controlsRef.current.update();
    }, lockAfterMs);
    return () => clearTimeout(t);
  }, [lockAfterMs, lockAt]);

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      minDistance={10}
      maxDistance={200}
      // pas de min/maxPolarAngle au départ, on les pose après lockAfterMs
    />
  );
}

function FloatingChildren({ url, scale = 1 }: ModelProps) {
  const { scene } = useGLTF(url);
  const group = useRef<THREE.Group>(null!);

  useEffect(() => {
    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const m = obj as THREE.Mesh;
        m.castShadow = true;
        m.receiveShadow = true;
      }
      if (!obj.userData.__basePos) obj.userData.__basePos = obj.position.clone();
      if (!obj.userData.__phase) obj.userData.__phase = Math.random() * Math.PI * 2;
      if (!obj.userData.__amp) obj.userData.__amp = 0.06 + Math.random() * 0.06;
    });
  }, [scene]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    scene.traverse((obj) => {
      if (!obj.userData.__basePos) return;
      const base: THREE.Vector3 = obj.userData.__basePos;
      const phase: number = obj.userData.__phase;
      const amp: number = obj.userData.__amp;
      obj.position.set(base.x, base.y + Math.sin(t * 1.2 + phase) * amp, base.z);
    });
    if (group.current) group.current.rotation.y = Math.sin(t * 0.1) * 0.05;
  });

  return (
    <group ref={group} scale={scale}>
      <primitive object={scene} />
    </group>
  );
}
useGLTF.preload("./assets/game/models/rocks.glb");

// ====== VIEW ======
const TestReactView: React.FC = () => {
  const rockRef = useRef<THREE.Group>(null);

  const images = [
    "./assets/game/images/img1.png",
    "./assets/game/images/img2.png",
    "./assets/game/images/img3.png",
    "./assets/game/images/img4.png",
    "./assets/game/images/img0.png",
    "./assets/game/images/img3.png",
    "./assets/game/images/img1.png",
    "./assets/game/images/img2.png",
    "./assets/game/images/img4.png",
    "./assets/game/images/img4.png",
    "./assets/game/images/img0.png",
    "./assets/game/images/img3.png",
    "./assets/game/images/img0.png",
    "./assets/game/images/img3.png",
    "./assets/game/images/img1.png",
    "./assets/game/images/img2.png",
    "./assets/game/images/img4.png",
    "./assets/game/images/img4.png",
    "./assets/game/images/img0.png",
    "./assets/game/images/img3.png",
  ];

  return (
    <div className="relative h-[100dvh] bg-white">
      <Canvas dpr={[1, 2]} camera={{ position: [0, 180, 0], fov: 75 }} shadows>
        <pointLight position={[0, 12, 0]} intensity={1000} />
        <pointLight position={[0, -12, 0]} intensity={1000} />
        {/* <ambientLight intensity={10} /> */}
        <CameraAnimation />
        <RockFocusControls rockRef={rockRef} lockAfterMs={5000} lockAt={Math.PI / 2} />

        <Suspense
          fallback={
            <Html center>
              <div style={{ fontFamily: "system-ui", fontSize: 14 }}>Chargement du modèle…</div>
            </Html>
          }
        >
          <CarouselRing
            images={images}
            radius={42}
            planeWidth={12}
            planeHeight={6}
            progress={0}
            rotationX={0}
            rotationZ={0}
            rotationRange={Math.PI * 2}
            initialSpin
            position={[0, 0, 0]}
          />

          <Float speed={1} rotationIntensity={2} floatIntensity={5}>
            <group ref={rockRef}>
              <FloatingChildren url="./assets/game/models/rocks.glb" scale={1} />
            </group>
          </Float>
        </Suspense>
      </Canvas>
    </div>
  );
};

export default TestReactView;
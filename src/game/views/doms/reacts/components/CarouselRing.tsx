import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";

type CarouselProps = {
  images: string[];
  radius?: number;
  planeWidth?: number;
  planeHeight?: number;
  progress?: number;
  rotationX?: number;
  rotationZ?: number;
  rotationRange?: number;
  initialSpin?: boolean;
  entry?: boolean;
  entryDuration?: number;
  position?: [number, number, number];
};

const VERT = `
  uniform float radius;
  uniform float angleOffset;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    float x = position.x;
    float y = position.y;
    float u_norm = (x + (PLANE_W / 2.0)) / PLANE_W;
    float currentAngle = u_norm * ((PLANE_W / radius)) + angleOffset;
    vec3 np;
    np.x = radius * sin(currentAngle);
    np.y = y;
    np.z = radius * cos(currentAngle);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(np, 1.0);
  }
`;

const FRAG = `
  uniform sampler2D map;
  uniform vec2 uvScale;
  uniform vec2 uvOffset;
  uniform float brightness;
  varying vec2 vUv;
  void main() {
    vec2 suv = vUv * uvScale + uvOffset;
    vec4 c = texture2D(map, suv);
    gl_FragColor = vec4(c.rgb * brightness, c.a);
  }
`;

export function CarouselRing({
  images,
  radius = 42,
  planeWidth = 12,
  planeHeight = 6,
  progress = 0,
  rotationX = 0,
  rotationZ = 0,
  rotationRange = Math.PI * 2,
  initialSpin = true,
  entry = true,
  entryDuration = 1.2,
  position = [0, 0, 0],
}: CarouselProps) {
  const group = useRef<THREE.Group>(null!);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const enteredRef = useRef(false); // anti-double-run (StrictMode)
  const { gl } = useThree();

  const textures = useTexture(images) as THREE.Texture[];
  textures.forEach((t) => {
    t.wrapS = THREE.ClampToEdgeWrapping;
    t.wrapT = THREE.ClampToEdgeWrapping;
    t.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy?.() || 8);
  });

  const angleStep = (Math.PI * 2) / images.length;

  const meshes = useMemo(() => {
    const list: THREE.Mesh[] = [];
    for (let i = 0; i < textures.length; i++) {
      const tex = textures[i];
      const angle = angleStep * i - Math.PI;

      const geo = new THREE.PlaneGeometry(planeWidth, planeHeight, 32, 32);
      geo.rotateY(Math.PI / 4);

      const imgW = (tex.image as HTMLImageElement | { width: number }).width;
      const imgH = (tex.image as HTMLImageElement | { height: number }).height;
      const imageAspect = imgW / imgH;
      const planeAspect = planeWidth / planeHeight;
      let uvScaleX = 1, uvScaleY = 1, uvOffsetX = 0, uvOffsetY = 0;
      if (imageAspect > planeAspect) {
        uvScaleX = planeAspect / imageAspect;
        uvOffsetX = (1 - uvScaleX) * 0.5;
      } else {
        uvScaleY = imageAspect / planeAspect;
        uvOffsetY = (1 - uvScaleY) * 0.5;
      }

      const mat = new THREE.ShaderMaterial({
        uniforms: {
          map: { value: tex },
          radius: { value: radius },
          angleOffset: { value: angle },
          uvScale: { value: new THREE.Vector2(uvScaleX, uvScaleY) },
          uvOffset: { value: new THREE.Vector2(uvOffsetX, uvOffsetY) },
          brightness: { value: 1 },
        },
        vertexShader: VERT.replaceAll("PLANE_W", planeWidth.toFixed(1)),
        fragmentShader: FRAG,
        side: THREE.DoubleSide,
        transparent: true,
      });

      const mesh = new THREE.Mesh(geo, mat);
      // échelle ultra petite au démarrage (évite chevauchement)
      mesh.scale.set(0.05, 0.05, 0.05);
      list.push(mesh);
    }
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textures, planeWidth, planeHeight, radius]);

  useEffect(() => {
    if (!group.current) return;
    // reset groupe
    group.current.clear();
    group.current.position.set(...position);
    group.current.rotation.set(0, 0, 0);
    group.current.scale.set(1, 1, 1);

    // add enfants
    meshes.forEach((m) => group.current.add(m));

    // reset uniforms/scale de tous les panneaux à des valeurs connues
    const startRadius = Math.max(12, radius * 0.2);
    meshes.forEach((m) => {
      const sm = m.material as THREE.ShaderMaterial;
      sm.uniforms.radius.value = entry ? startRadius : radius;
      m.scale.set(0.05, 0.05, 0.05);
    });
  }, [meshes, position, radius, entry]);

  useEffect(() => {
    if (!group.current) return;

    if (tlRef.current) {
      tlRef.current.kill();
      tlRef.current = null;
    }

    if (enteredRef.current) {
      enteredRef.current = false; 
      return;
    }
    enteredRef.current = true;

    const tl = gsap.timeline();
    tlRef.current = tl;

    if (entry) {
      group.current.rotation.set(Math.PI / 2, 0, 0);
      group.current.scale.set(0.1, 0.1, 0.1);

      tl.to(group.current.rotation, { x: rotationX, duration: entryDuration, ease: "power3.out" }, 0)
        .to(group.current.scale, { x: 1, y: 1, z: 1, duration: entryDuration, ease: "power3.out" }, 0);

      const mats = meshes.map((m) => (m.material as THREE.ShaderMaterial).uniforms.radius);
      const startRadius = Math.max(12, radius * 0.2);

      tl.to(
        { v: startRadius },
        {
          v: radius,
          duration: entryDuration,
          ease: "power2.out",
          onUpdate: function () {
            const v = (this as any).targets()[0].v;
            mats.forEach((u) => (u.value = v));
          },
        },
        0
      );

      meshes.forEach((m, i) => {
        tl.to(m.scale, { x: 1, y: 1, z: 1, duration: entryDuration, ease: "back.out(2)" }, i * 0.06);
      });

     if (initialSpin) {
      tl.set(group.current.rotation, { y: THREE.MathUtils.degToRad(360) });
      
      tl.to({}, { duration: 1 });

      tl.to(group.current.rotation, { 
        y: 0, 
        duration: 4, 
        ease: "power3.out" 
      });
    }
    } else if (initialSpin) {
  tl.set(group.current.rotation, { y: THREE.MathUtils.degToRad(360) });
  
  tl.to({}, { duration: 2 });

  tl.to(group.current.rotation, { 
    y: 0, 
    duration: 4, 
    ease: "power3.out" 
  });
}

    return () => {
      tl.kill();
      tlRef.current = null;
    };
  }, [entry, entryDuration, rotationX, initialSpin, radius, meshes]);

  useEffect(() => {
    if (!group.current) return;
    gsap.to(group.current.rotation, { y: progress * rotationRange, duration: 0.5, ease: "power2.out" });
  }, [progress, rotationRange]);

  useEffect(() => {
    if (!group.current) return;
    gsap.to(group.current.rotation, { x: rotationX, z: rotationZ, duration: 1.0, ease: "power2.inOut" });
  }, [rotationX, rotationZ]);

  return <group ref={group} />;
}
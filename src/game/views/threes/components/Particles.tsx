import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { BufferAttribute, BufferGeometry, Color, Points, PointsMaterial } from "three";


export default function Particles({
  count = 100,
  range = 20,
  speed = 0.1,
}: {
  count?: number;
  range?: number;
  speed?: number;
}) {
  const positions = useMemo(() => new Float32Array(count * 3), [count]);
  const velocities = useMemo(() => new Float32Array(count * 3), [count]);
  const points = useRef<Points>(null!);

  useEffect(() => {
    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      positions[ix + 0] = (Math.random() * 2 - 1) * range;
      positions[ix + 1] = (Math.random() * 2 - 1) * range;
      positions[ix + 2] = (Math.random() * 2 - 1) * range;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const vx = Math.sin(phi) * Math.cos(theta);
      const vy = Math.sin(phi) * Math.sin(theta);
      const vz = Math.cos(phi);
      const s = speed * (0.5 + Math.random());
      velocities[ix + 0] = vx * s;
      velocities[ix + 1] = vy * s;
      velocities[ix + 2] = vz * s;
    }
  }, [count, range, speed, positions, velocities]);

  useFrame((_, dt) => {
    const pos = points.current.geometry.getAttribute("position") as BufferAttribute;
    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      velocities[ix + 0] += (Math.random() - 0.5) * 0.1 * dt;
      velocities[ix + 1] += (Math.random() - 0.5) * 0.1 * dt;
      velocities[ix + 2] += (Math.random() - 0.5) * 0.1 * dt;
      const maxS = speed * 1.8;
      const vx = velocities[ix + 0];
      const vy = velocities[ix + 1];
      const vz = velocities[ix + 2];
      const mag = Math.sqrt(vx * vx + vy * vy + vz * vz) || 1;
      const clamp = Math.min(1, maxS / mag);
      velocities[ix + 0] = vx * clamp;
      velocities[ix + 1] = vy * clamp;
      velocities[ix + 2] = vz * clamp;
      positions[ix + 0] += velocities[ix + 0] * dt;
      positions[ix + 1] += velocities[ix + 1] * dt;
      positions[ix + 2] += velocities[ix + 2] * dt;
      for (let k = 0; k < 3; k++) {
        if (positions[ix + k] > range) positions[ix + k] = -range;
        else if (positions[ix + k] < -range) positions[ix + k] = range;
      }
      pos.array[ix + 0] = positions[ix + 0];
      pos.array[ix + 1] = positions[ix + 1];
      pos.array[ix + 2] = positions[ix + 2];
    }
    pos.needsUpdate = true;
  });

  const geom = useMemo(() => {
    const g = new BufferGeometry();
    g.setAttribute("position", new BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  const mat = useMemo(
    () =>
      new PointsMaterial({
        size: 0.04,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
        color: new Color(0x000000),
      }),
    []
  );

  return <points ref={points} geometry={geom} material={mat} />;
}
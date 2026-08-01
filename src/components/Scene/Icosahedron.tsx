import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sceneState } from "../../store/sceneState";

function computeCracks() {
  const geo = new THREE.IcosahedronGeometry(1.8, 1);
  const pos = geo.attributes.position;
  const idx = geo.index;
  if (!idx) return [];

  const cracks: {
    position: [number, number, number];
    baseOpacity: number;
  }[] = [];

  for (let i = 0; i < idx.count; i += 3) {
    if (Math.random() > 0.18) continue;

    const ia = idx.getX(i);
    const ib = idx.getX(i + 1);
    const ic = idx.getX(i + 2);

    const a = new THREE.Vector3(pos.getX(ia), pos.getY(ia), pos.getZ(ia));
    const b = new THREE.Vector3(pos.getX(ib), pos.getY(ib), pos.getZ(ib));
    const c = new THREE.Vector3(pos.getX(ic), pos.getY(ic), pos.getZ(ic));

    const centroid = new THREE.Vector3()
      .addVectors(a, b)
      .add(c)
      .divideScalar(3)
      .normalize()
      .multiplyScalar(1.85);

    cracks.push({
      position: [centroid.x, centroid.y, centroid.z] as [number, number, number],
      baseOpacity: 0.35 + Math.random() * 0.4,
    });
  }

  return cracks;
}

export default function Icosahedron() {
  const groupRef = useRef<THREE.Group>(null);
  const crackMatRefs = useRef<THREE.MeshBasicMaterial[]>([]);
  const cracks = useMemo(() => computeCracks(), []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    const t = clock.getElapsedTime();
    const {
      modelRotation,
      modelFloatY,
      modelPositionX,
      modelScale,
      glowIntensity,
    } = sceneState;

    // Horizontal position — sits on the right side for editorial balance
    groupRef.current.position.x = modelPositionX + Math.sin(t * 0.1) * 0.06;

    // Vertical floating: GSAP-driven + idle sine
    groupRef.current.position.y = modelFloatY + Math.sin(t * 0.25) * 0.04;

    // Rotation: GSAP-driven + idle wobble
    groupRef.current.rotation.x = 0.3 + Math.sin(t * 0.12) * 0.03;
    groupRef.current.rotation.y = modelRotation;

    // Scale
    groupRef.current.scale.setScalar(modelScale);

    // Dynamic crack opacity — driven by glowIntensity
    const glowFactor = 0.5 + glowIntensity * 0.5;
    for (let i = 0; i < crackMatRefs.current.length; i++) {
      const mat = crackMatRefs.current[i];
      if (mat) {
        mat.opacity = mat.userData.baseOpacity * glowFactor;
      }
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main metallic icosahedron */}
      <mesh castShadow>
        <icosahedronGeometry args={[1.8, 1]} />
        <meshStandardMaterial
          color="#444444"
          roughness={0.25}
          metalness={0.92}
          envMapIntensity={1.8}
        />
      </mesh>

      {/* Edge lines */}
      <lineSegments>
        <edgesGeometry args={[new THREE.IcosahedronGeometry(1.8, 1)]} />
        <lineBasicMaterial color="#888888" transparent opacity={0.3} />
      </lineSegments>

      {/* Red emissive cracks — dynamically updating opacity */}
      {cracks.map((crack, i) => (
        <mesh key={i} position={crack.position}>
          <planeGeometry args={[0.08, 0.04]} />
          <meshBasicMaterial
            ref={(mat) => {
              if (mat) {
                mat.userData.baseOpacity = crack.baseOpacity;
                crackMatRefs.current[i] = mat;
              }
            }}
            color="#FF3B30"
            transparent
            opacity={crack.baseOpacity}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

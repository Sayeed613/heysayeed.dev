import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function SceneLighting() {
  const rimRef = useRef<THREE.DirectionalLight>(null);

  useFrame(({ clock }) => {
    if (rimRef.current) {
      // Subtle orbit for the red rim light
      const t = clock.getElapsedTime() * 0.15;
      rimRef.current.position.x = Math.sin(t) * 4;
      rimRef.current.position.z = Math.cos(t) * 4;
    }
  });

  return (
    <>
      {/* Ambient fill */}
      <ambientLight intensity={0.4} />

      {/* Key light — white, dominant */}
      <directionalLight
        position={[4, 6, 5]}
        intensity={1.8}
        castShadow
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
        shadow-radius={4}
      />

      {/* Fill light — soft */}
      <directionalLight
        position={[-4, 1, -3]}
        intensity={0.5}
      />

      {/* Red rim light — orbiting accent */}
      <directionalLight
        ref={rimRef}
        position={[3, 1, 4]}
        intensity={0.8}
        color="#FF3B30"
      />

      {/* Hemisphere for natural fill */}
      <hemisphereLight
        args={["#ffffff", "#333333", 0.3]}
      />
    </>
  );
}

import { Canvas } from "@react-three/fiber";
import SceneLighting from "./Lighting";
import Icosahedron from "./Icosahedron";
import CameraRig from "./CameraRig";
import ScrollTimeline from "./Timeline";

export default function SceneCanvas() {
  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ background: "transparent" }}
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45, near: 0.1, far: 100 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ width: "100%", height: "100%" }}
      >
        <SceneLighting />
        <CameraRig />
        <Icosahedron />
        <ScrollTimeline />
      </Canvas>
    </div>
  );
}

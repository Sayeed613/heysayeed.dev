import { useFrame, useThree } from "@react-three/fiber";
import { sceneState } from "../../store/sceneState";

const LERP = 0.18;

export default function CameraRig() {
  const { camera } = useThree();

  useFrame(() => {
    const {
      cameraDistance,
      cameraOrbitX,
      cameraOrbitY,
      modelPositionX,
    } = sceneState;

    // Calculate target position from orbit angles + distance
    const tx = Math.sin(cameraOrbitX) * Math.cos(cameraOrbitY) * cameraDistance;
    const ty = Math.sin(cameraOrbitY) * cameraDistance * 0.5;
    const tz = Math.cos(cameraOrbitX) * Math.cos(cameraOrbitY) * cameraDistance;

    // Smooth lerp toward target
    camera.position.x += (tx - camera.position.x) * LERP;
    camera.position.y += (ty - camera.position.y) * LERP;
    camera.position.z += (tz - camera.position.z) * LERP;

    // Look toward the model — centered in the right half of the viewport
    const lookTargetX = modelPositionX * 0.45;
    camera.lookAt(lookTargetX, 0.05, 0);
  });

  return null;
}

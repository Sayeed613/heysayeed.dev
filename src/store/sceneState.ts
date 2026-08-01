/**
 * Shared mutable state for GSAP ↔ Three.js communication.
 *
 * GSAP directly tweens these `.current` values on every scroll frame.
 * Three.js `useFrame` reads them to drive the camera, model, and lights.
 *
 * No React state — no re-renders. Just raw number updates at 60fps.
 */
export const sceneState = {
  /** Accumulated model Y-axis rotation (radians) */
  modelRotation: 0,

  /** Vertical floating offset */
  modelFloatY: 0,

  /** Horizontal offset — model sits in the right half of the viewport */
  modelPositionX: 1.5,

  /** Camera distance from origin (z) */
  cameraDistance: 6,

  /** Camera horizontal orbit angle (radians) — starts looking slightly left to frame the right-side model */
  cameraOrbitX: -0.25,

  /** Camera vertical orbit angle (radians) */
  cameraOrbitY: 0.2,

  /** Model uniform scale */
  modelScale: 0.75,

  /** Red rim light intensity */
  glowIntensity: 0.4,
};

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { sceneState } from "../../store/sceneState";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollTimeline() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Create a dummy element that GSAP can scrub across the full page
    const proxy = { progress: 0 };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.2,
        invalidateOnRefresh: true,
      },
      defaults: { ease: "none" },
    });

    // Model rotation — two full rotations across the page
    tl.to(sceneState, {
      modelRotation: Math.PI * 4,
      duration: 1,
      ease: "power1.inOut",
    });

    // Camera orbit — gentle arc, starts from slight-left position
    tl.to(sceneState, {
      cameraOrbitX: Math.PI * 0.5,
      cameraDistance: 4,
      modelFloatY: -0.3,
      duration: 1,
      ease: "power2.inOut",
    }, 0);

    // Glow intensity — ramps up mid-scroll
    tl.to(sceneState, {
      glowIntensity: 1.8,
      duration: 0.5,
      ease: "power2.out",
    }, 0.3);

    // Scale pulse — subtle expand
    tl.to(sceneState, {
      modelScale: 1.08,
      duration: 0.3,
      ease: "power1.out",
    }, 0.5);

    tl.to(sceneState, {
      modelScale: 1,
      duration: 0.3,
      ease: "power1.inOut",
    }, 0.8);

    // Return glow to baseline
    tl.to(sceneState, {
      glowIntensity: 0.4,
      duration: 0.3,
      ease: "power2.in",
    }, 0.85);

    // Return camera to start
    tl.to(sceneState, {
      cameraOrbitX: 0,
      cameraDistance: 6,
      modelFloatY: 0,
      duration: 0.4,
      ease: "power3.inOut",
    }, 0.85);

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return null;
}

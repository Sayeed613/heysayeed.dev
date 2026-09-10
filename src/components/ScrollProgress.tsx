import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Fixed 2px scroll-progress line pinned to the top of the viewport.
 * Subtle, monochrome — reads as part of the HUD frame.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-[9500] h-[2px] origin-left bg-white/25"
      style={{ scaleX }}
    />
  );
}

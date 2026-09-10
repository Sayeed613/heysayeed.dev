import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

type CursorVariant = "default" | "view" | "circle" | "link" | "tap" | "hidden";

/**
 * CursorOverlay — a custom cursor that changes shape based on what
 * you're hovering. Reads `data-cursor` attributes from elements.
 * Hides the native cursor globally.
 */
export default function CursorOverlay() {
  const [variant, setVariant] = useState<CursorVariant>("default");
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 28 });
  const sy = useSpring(y, { stiffness: 500, damping: 28 });

  useEffect(() => {
    // Hide native cursor globally
    const style = document.createElement("style");
    style.textContent = `*, *::before, *::after { cursor: none !important; }`;
    document.head.appendChild(style);

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const onEnter = () => setVisible(true);
    const onLeave = () => setVisible(false);

    const onOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest?.("[data-cursor]");
      if (target) {
        setVariant(target.getAttribute("data-cursor") as CursorVariant);
      } else {
        setVariant("default");
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseenter", onEnter);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseover", onOver, { passive: true });

    return () => {
      style.remove();
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseover", onOver);
    };
  }, [x, y, visible]);

  if (variant === "hidden") return null;

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[10001]"
      style={{ x: sx, y: sy }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.15 }}
    >
      <motion.div className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
        {variant === "view" && (
          <motion.span
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="whitespace-nowrap rounded-full border border-white/40 bg-white px-5 py-2 font-mono text-[11px] font-medium tracking-[0.15em] text-black uppercase"
          >
            View
          </motion.span>
        )}

        {variant === "default" && (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M0,0 L16,10 L8,11 L5,18 Z"
              fill="white"
              stroke="rgba(0,0,0,0.2)"
              strokeWidth="0.5"
              strokeLinejoin="round"
            />
          </svg>
        )}

        {variant === "circle" && (
          <motion.div
            className="flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-white/[0.05] backdrop-blur-sm"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="10" cy="10" r="7" />
              <path d="M15 15L21 21" />
            </svg>
          </motion.div>
        )}

        {variant === "link" && (
          <motion.div
            className="h-12 w-12 rounded-full border border-white/40"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
          />
        )}

        {variant === "tap" && (
          <motion.span
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="whitespace-nowrap rounded-full border border-[#FF4A1F]/60 bg-[#FF4A1F] px-5 py-2 font-mono text-[11px] font-medium tracking-[0.15em] text-white uppercase shadow-[0_0_20px_rgba(255,74,31,0.3)]"
          >
            Tap
          </motion.span>
        )}
      </motion.div>
    </motion.div>
  );
}

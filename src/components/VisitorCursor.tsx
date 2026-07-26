import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const SPRING_CONFIG = { stiffness: 250, damping: 28, mass: 0.35 };

export default function VisitorCursor() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springX = useSpring(mx, SPRING_CONFIG);
  const springY = useSpring(my, SPRING_CONFIG);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mx, my]);

  return (
    <motion.div
      className="fixed pointer-events-none z-[9999] select-none"
      style={{ left: springX, top: springY, x: 1, y: 1 }}
    >
      {/* Triangle cursor — blue fill, white border — like a play button pointer */}
      <svg
        width="16"
        height="20"
        viewBox="0 0 16 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.4))" }}
      >
        <path
          d="M2 1L15 10L2 19Z"
          fill="#3B82F6"
          stroke="white"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>

      {/* Message-style badge — chat bubble shape, not a circle */}
      <div
        className="absolute left-4 top-full mt-1 shadow-md"
        style={{
          filter: "drop-shadow(0 2px 6px rgba(59, 130, 246, 0.35))",
        }}
      >
        {/* Bubble body */}
        <div
          className="rounded-md whitespace-nowrap h-3.5"

        >
          <span className="text-white text-[11px] px-2 py-1 rounded-md  font-bold leading-none tracking-wide"
           style={{ backgroundColor: "#3B82F6" }}>
            You
          </span>
        </div>
        {/* Small tail pointing up toward the cursor */}

      </div>
    </motion.div>
  );
}

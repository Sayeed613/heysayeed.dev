import { useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import type { MotionValue } from "framer-motion";

interface SayeedCursorProps {
  springX: MotionValue<number>;
  springY: MotionValue<number>;
  phase: "idle" | "flying-to" | "grabbing" | "returning" | "flying-back";
  message: string;
}

export default function SayeedCursor({ springX, springY, phase, message }: SayeedCursorProps) {
  const showBubble = phase === "returning";
  const isActive = phase !== "idle";

  // Velocity drift for the speech bubble
  const bubbleDriftX = useMotionValue(0);
  const bubbleDriftY = useMotionValue(0);
  const springDriftX = useSpring(bubbleDriftX, { stiffness: 80, damping: 10, mass: 0.6 });
  const springDriftY = useSpring(bubbleDriftY, { stiffness: 80, damping: 10, mass: 0.6 });
  const prevX = useRef(0);
  const prevY = useRef(0);

  useEffect(() => {
    const unsubX = springX.on("change", (latest) => {
      const dx = latest - prevX.current;
      prevX.current = latest;
      bubbleDriftX.set(dx * 2);
    });
    const unsubY = springY.on("change", (latest) => {
      const dy = latest - prevY.current;
      prevY.current = latest;
      bubbleDriftY.set(dy * 2);
    });
    return () => { unsubX(); unsubY(); };
  }, [springX, springY, bubbleDriftX, bubbleDriftY]);

  return (
    <motion.div
      className="fixed pointer-events-none z-[9998] select-none"
      style={{ left: springX, top: springY, x: 1, y: 1 }}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
    >
      {/* Outlined triangle cursor — blue border, white inside */}
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
          fill="white"
          stroke="#3B82F6"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>

      {/* Identity badge — orange #FF5A1F */}
      <div
        className="absolute left-4 top-full mt-1  shadow-md whitespace-nowrap transition-all duration-300 h-3.5"

      >
        <span
          className={`text-[11px] font-bold leading-none tracking-wide px-2 py-1 rounded-md ${
            isActive ? "text-white" : "text-text-muted"
          }`}
          style={{
          backgroundColor: isActive ? "#FF5A1F" : "rgba(107, 114, 128, 0.6)",
          boxShadow: isActive ? "0 2px 6px rgba(255, 90, 31, 0.35)" : "none",
        }}
        >
          Sayeed
        </span>
      </div>

      {/* iMessage-style speech bubble */}
      <AnimatePresence>
        {showBubble && (
          <motion.div
            key="sayeed-bubble"
            initial={{ opacity: 0, scale: 0.9, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 6 }}
            transition={{ type: "spring", stiffness: 300, damping: 22, mass: 0.6 }}
            className="absolute left-3 top-full mt-10 px-3 py-2 rounded-[14px] shadow-xl whitespace-nowrap"
            style={{
              x: springDriftX,
              y: springDriftY,
              backgroundColor: "#ffffff",
              maxWidth: "180px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.18), 0 1px 3px rgba(0,0,0,0.08)",
            }}
          >
            <span className="text-[#1a1a2e] text-[13px] font-medium leading-snug tracking-normal block">
              {message}
            </span>
            {/* Tail */}
            <div
              className="absolute top-0 left-3 -mt-[6px] w-0 h-0"
              style={{
                borderLeft: "6px solid transparent",
                borderRight: "6px solid transparent",
                borderBottom: "6px solid #ffffff",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

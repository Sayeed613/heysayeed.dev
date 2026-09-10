import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * GhostWord — a giant outlined word drifting slowly behind section
 * content, parallaxed against scroll. Purely decorative.
 */
export default function GhostWord({
  text,
  className = "",
  stroke = "rgba(255,255,255,0.06)",
}: {
  text: string;
  className?: string;
  /** CSS color for the text stroke — raise alpha to make it more visible. */
  stroke?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const x = useTransform(scrollYProgress, [0, 1], ["6%", "-6%"]);

  return (
    <div
      ref={ref}
      className={`pointer-events-none absolute select-none overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <motion.span
        className="block whitespace-nowrap font-body font-medium uppercase leading-none tracking-[-0.02em] text-transparent"
        style={{
          x,
          WebkitTextStroke: `1px ${stroke}`,
          fontSize: "clamp(4rem, 22vw, 20rem)",
        }}
      >
        {text}
      </motion.span>
    </div>
  );
}

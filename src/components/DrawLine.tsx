import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * A hairline that draws itself (scaleX 0 → 1) when scrolled into view.
 * The signature Awwwards-style section divider.
 */
export default function DrawLine({
  className = "",
  delay = 0,
  duration = 1.2,
  thickness = "h-px",
  color = "bg-white/10",
}: {
  className?: string;
  delay?: number;
  duration?: number;
  thickness?: string;
  color?: string;
}) {
  return (
    <motion.div
      className={`${thickness} ${color} origin-left ${className}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "-5%" }}
      transition={{ delay, duration, ease: EASE }}
    />
  );
}

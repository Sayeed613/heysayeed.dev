import { motion } from "framer-motion";
import { useRef, useState, type CSSProperties } from "react";

interface BorderOptions { color: string; width: number; }

interface MagneticButtonProps {
  label?: string;
  link?: string;
  newTab?: boolean;
  font?: CSSProperties;
  fill?: string;
  textColor?: string;
  sweepColor?: string;
  sweepTextColor?: string;
  radius?: number;
  paddingX?: number;
  paddingY?: number;
  border?: boolean;
  borderOptions?: BorderOptions;
  style?: CSSProperties;
}

export default function MagneticButton({
  label = "Magnetic Hover",
  link = "",
  newTab = false,
  font = { fontFamily: "Inter, system-ui, sans-serif", fontWeight: 500, fontSize: 14, lineHeight: "1em", letterSpacing: "-0.01em", textAlign: "left" },
  fill = "#FFFFFF",
  textColor = "#000000",
  sweepColor = "#0000FF",
  sweepTextColor = "#FFFFFF",
  paddingX = 48,
  paddingY = 24,
  radius = 100,
  border = true,
  borderOptions = { color: "#FFFFFF", width: 1 },
  style,
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [hover, setHover] = useState(false);
  const [origin, setOrigin] = useState({ x: 0, y: 0, d: 0 });

  const borderColor = borderOptions?.color ?? "#FFFFFF";
  const borderWidth = border ? borderOptions?.width ?? 0 : 0;

  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const lx = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const ly = Math.max(0, Math.min(rect.height, e.clientY - rect.top));
    const d = 2 * Math.hypot(rect.width, rect.height);
    setOrigin({ x: lx, y: ly, d });
    setHover(true);
  };

  return (
    <motion.a
      ref={ref}
      href={link || undefined}
      target={link && newTab ? "_blank" : undefined}
      rel={link && newTab ? "noopener noreferrer" : undefined}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center",
        boxSizing: "border-box", padding: `${paddingY}px ${paddingX}px`, borderRadius: radius,
        background: fill, border: borderWidth > 0 ? `${borderWidth}px solid ${borderColor}` : "none",
        cursor: "pointer", overflow: "hidden", textDecoration: "none", whiteSpace: "nowrap",
        boxShadow: hover ? "0 16px 40px rgba(0,0,0,0.22)" : "0 8px 22px rgba(0,0,0,0.14)",
        ...font, ...style,
      }}
    >
      <motion.span aria-hidden initial={false} animate={{ scale: hover ? 1 : 0 }}
        transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
        style={{ position: "absolute", top: origin.y, left: origin.x, width: origin.d, height: origin.d, marginLeft: -origin.d / 2, marginTop: -origin.d / 2, borderRadius: "50%", background: sweepColor, transformOrigin: "center", pointerEvents: "none" }}
      />
      <motion.span initial={false} animate={{ color: hover ? sweepTextColor : textColor }}
        transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
        style={{ position: "relative", zIndex: 1 }}
      >
        {label}
      </motion.span>
    </motion.a>
  );
}

import { useEffect, useRef } from "react";
import gsap from "gsap";

const LINES = ["BUILD.", "BREAK.", "REPEAT."];

interface HeadlineProps {
  onReady?: () => void;
}

export default function AnimatedHeadline({ onReady }: HeadlineProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const chars = el.querySelectorAll<HTMLElement>(".headline-char");

    gsap.set(chars, {
      y: 60,
      opacity: 0,
      rotateX: -40,
      filter: "blur(8px)",
    });

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: () => onReady?.(),
    });

    tl.to(chars, {
      y: 0,
      opacity: 1,
      rotateX: 0,
      filter: "blur(0px)",
      duration: 0.6,
      stagger: 0.035,
    });

    return () => tl.kill();
  }, [onReady]);

  return (
    <div
      ref={containerRef}
      className="relative w-full select-none"
      style={{ perspective: "800px" }}
    >
      <h1 className="font-display font-bold leading-[0.85] tracking-[-0.04em] text-text-primary">
        {LINES.map((line, li) => (
          <span key={li} className="block" style={{ whiteSpace: "nowrap", overflow: "hidden" }}>
            {line.split("").map((char, ci) => (
              <span
                key={ci}
                className="headline-char inline-block"
                style={{
                  fontSize: "clamp(3rem, 15vw, 10rem)",
                  color: li === 2
                    ? "var(--color-accent)"
                    : "var(--color-text-primary)",
                }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </span>
        ))}
      </h1>
    </div>
  );
}

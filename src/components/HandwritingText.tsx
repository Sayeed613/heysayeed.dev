import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const REDUCED_MOTION =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

const ORANGE = "#FF5A1F";
const PEN_TIP_COLOR = "rgba(255,90,31,0.12)";

export default function HandwritingText() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const textRef = useRef<SVGTextElement>(null);
  const textGhostRef = useRef<SVGTextElement>(null);
  const penTipRef = useRef<HTMLDivElement>(null);
  const tickerCleanup = useRef<(() => void) | null>(null);

  const [hovered, setHovered] = useState(false);
  const [drawn, setDrawn] = useState(false);
  const [svgWidth, setSvgWidth] = useState(0);

  const text = "a little about us";

  // ─── Setup: measure + animate after font loads ──────────
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const svg = svgRef.current;
    const textEl = textRef.current;
    const ghostEl = textGhostRef.current;
    if (!wrapper || !svg || !textEl || !ghostEl) return;

    let killed = false;
    let cleanupTicker: (() => void) | null = null;

    const start = async () => {
      // Wait for Caveat font
      try {
        await document.fonts.ready;
      } catch {
        await new Promise((r) => setTimeout(r, 500));
      }
      if (killed) return;

      // --- Measure ---
      const wrapperW = wrapper.getBoundingClientRect().width;
      const fontSize = Math.min(52, Math.max(26, wrapperW * 0.1));
      const padX = fontSize * 0.6;
      const padY = fontSize * 0.3;

      // Get text length
      const temp = document.createElementNS("http://www.w3.org/2000/svg", "text");
      temp.setAttribute("font-family", "Caveat");
      temp.setAttribute("font-size", `${fontSize}`);
      temp.setAttribute("font-weight", "400");
      temp.textContent = text;
      svg.appendChild(temp);
      const textLen = temp.getComputedTextLength();
      const totalW = Math.ceil(textLen + padX * 2);
      const totalH = Math.ceil(fontSize * 1.8 + padY * 2);
      svg.removeChild(temp);

      if (killed || totalW <= 0) return;

      svg.setAttribute("viewBox", `0 0 ${totalW} ${totalH}`);
      setSvgWidth(totalW);

      // Position text elements
      const yPos = totalH - padY - fontSize * 0.12;
      textEl.setAttribute("x", `${padX}`);
      textEl.setAttribute("y", `${yPos}`);
      textEl.setAttribute("font-size", `${fontSize}`);
      textEl.setAttribute("font-weight", "400");

      ghostEl.setAttribute("x", `${padX}`);
      ghostEl.setAttribute("y", `${yPos}`);
      ghostEl.setAttribute("font-size", `${fontSize}`);
      ghostEl.setAttribute("font-weight", "400");
      ghostEl.setAttribute("opacity", "0");

      // --- Estimate stroke outline length ---
      // The stroke perimeter of text (outline of all glyphs) is
      // much longer than the advance width. A multiplier of 20
      // generously covers any realistic Caveat outline at any size
      // so the entire text falls within the first dash segment.
      // This means ~95% of the animation time will show progress.
      const STROKE_MULTIPLIER = 20;
      const strokeLen = Math.max(textLen * STROKE_MULTIPLIER, 3000);

      // Set initial stroke state
      textEl.setAttribute("stroke", ORANGE);
      textEl.setAttribute("stroke-width", "2.2");
      textEl.setAttribute("stroke-linecap", "round");
      textEl.setAttribute("stroke-linejoin", "round");
      textEl.setAttribute("stroke-dasharray", `${strokeLen}`);
      textEl.setAttribute("stroke-dashoffset", `${strokeLen}`);

      if (REDUCED_MOTION) {
        textEl.setAttribute("stroke-dashoffset", "0");
        textEl.setAttribute("fill", ORANGE);
        textEl.style.stroke = "none";
        setDrawn(true);
        return;
      }

      // --- GSAP + ScrollTrigger ---
      const ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: wrapper,
          start: "top 80%",
          toggleActions: "play none none none",
          once: true,
          onEnter: () => {
            const tl = gsap.timeline({
              onComplete: () => {
                setDrawn(true);
                // Fill with color, remove stroke
                gsap.to(textEl, {
                  attr: { fill: ORANGE },
                  duration: 0.5,
                  ease: "power2.out",
                  onComplete: () => {
                    textEl.style.stroke = "none";
                    textEl.removeAttribute("stroke");
                    textEl.removeAttribute("stroke-dasharray");
                    textEl.removeAttribute("stroke-dashoffset");
                    // Fade in the ghost element with the filled text
                    gsap.to(ghostEl, {
                      attr: { opacity: 1 },
                      duration: 0.6,
                      ease: "power2.out",
                    });
                  },
                });
              },
            });

            // ─── Stroke draw animation ─────────────
            // Single custom cubic-bezier that aggressively
            // compresses the invisible "gap" phase (~36% of
            // the offset range where no stroke is visible)
            // and slow-rolls through the visible stroke.
            //
            // cubic-bezier(0.0, 0.0, 0.3, 1.0):
            //   t=0%   → progress≈0%   (beginning)
            //   t=10%  → progress≈55%  (fast through gap)
            //   t=40%  → progress≈80%  (mid-stroke, slow)
            //   t=100% → progress=100% (flourish finish)
            //
            // This ensures ink appears on screen within ~0.3s
            // instead of wasting ~1s in the invisible gap.
            tl.to(textEl, {
              strokeDashoffset: 0,
              duration: 2.6,
              ease: "cubic-bezier(0.0, 0.0, 0.3, 1.0)",
            });

            // ─── Pen tip glow follows progression ──
            const penEl = penTipRef.current;
            if (penEl) {
              const onTick = () => {
                if (killed) return;
                const offset = parseFloat(
                  textEl.getAttribute("stroke-dashoffset") || `${strokeLen}`,
                );
                const progress = Math.min(
                  1,
                  Math.max(0, 1 - offset / strokeLen),
                );
                const xPx = padX + progress * textLen;
                const containerW = wrapper.getBoundingClientRect().width;
                const scale = xPx / totalW;
                const leftPx = scale * containerW;

                penEl.style.left = `${leftPx}px`;
                penEl.style.opacity =
                  progress > 0.02 && progress < 0.98 ? "1" : "0";
              };

              gsap.ticker.add(onTick);
              cleanupTicker = () => gsap.ticker.remove(onTick);
              tickerCleanup.current = cleanupTicker;
            }
          },
        });
      });

      if (!killed) {
        // Store cleanup reference
        const origRevert = ctx.revert.bind(ctx);
        ctx.revert = () => {
          if (cleanupTicker) cleanupTicker();
          origRevert();
        };
      }
    };

    start();

    return () => {
      killed = true;
      if (cleanupTicker) cleanupTicker();
    };
  }, []);

  // ─── Hover ──────────────────────────────────────────────
  const handleMouseEnter = useCallback(() => setHovered(true), []);
  const handleMouseLeave = useCallback(() => setHovered(false), []);

  return (
    <div
      ref={wrapperRef}
      className="relative inline-block"
      style={{
        willChange: "transform",
        filter: hovered
          ? "drop-shadow(0 0 14px rgba(255,90,31,0.25))"
          : "drop-shadow(0 0 0px transparent)",
        transform: hovered
          ? "translateY(-2px) rotate(-0.5deg)"
          : "translateY(0px) rotate(0deg)",
        transition:
          "filter 0.3s cubic-bezier(0.22, 1, 0.36, 1), transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <svg
        ref={svgRef}
        className="h-auto overflow-visible select-none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          display: "block",
          width: svgWidth > 0 ? `${svgWidth}px` : "auto",
          maxWidth: "100%",
        }}
      >
        <defs>
          {/* Subtle ink spread blur at the leading edge */}
          {/* No SVG filter — pen-tip glow div handles the ink effect */}
        </defs>

        {/* Ghost text (invisible initially, fades in after draw) */}
        <text
          ref={textGhostRef}
          fontFamily="Caveat"
          fontWeight="400"
          fill={ORANGE}
          opacity="0"
          style={{ pointerEvents: "none" }}
        >
          {text}
        </text>          {/* Main text — stroke-drawn, then filled */}
        <text
          ref={textRef}
          id="handwriting-main"
          fontFamily="Caveat"
          fontWeight="400"
          fill="none"
          style={{ willChange: "stroke-dashoffset" }}
        >
          {text}
        </text>
      </svg>

      {/* ─── Pen tip ink glow ────────────────────── */}
      <div
        ref={penTipRef}
        className="absolute top-0 pointer-events-none"
        style={{
          width: "28px",
          height: "100%",
          opacity: 0,
          background: `linear-gradient(to right, transparent 0%, ${PEN_TIP_COLOR} 30%, ${PEN_TIP_COLOR} 60%, transparent 100%)`,
          filter: "blur(8px)",
          transform: "translateX(-14px)",
          willChange: "opacity, left",
        }}
      />
    </div>
  );
}

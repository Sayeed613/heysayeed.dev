  import { useEffect, useRef } from "react";
  import {
    motion,
    useInView,
    animate,
    type Transition,
  } from "framer-motion";
  import GhostWord from "./GhostWord";
  import DrawLine from "./DrawLine";

  const EASE = [0.22, 1, 0.36, 1] as const;
  const POP: Transition = { type: "spring", stiffness: 260, damping: 18 };

  const ORANGE = "#FF4A1F";
  const SURFACE = "var(--surface)";

  /* ── Count-up number that fires when scrolled into view ───────────── */
  function CountUp({
    to,
    decimals = 0,
    suffix = "",
    className,
  }: {
    to: number;
    decimals?: number;
    suffix?: string;
    className?: string;
  }) {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, margin: "-15%" });

    useEffect(() => {
      if (!inView || !ref.current) return;
      const controls = animate(0, to, {
        duration: 1.6,
        ease: EASE,
        onUpdate: (v) => {
          if (ref.current)
            ref.current.textContent = v.toFixed(decimals) + suffix;
        },
      });
      return () => controls.stop();
    }, [inView, to, decimals, suffix]);

    return (
      <span ref={ref} className={className}>
        {(0).toFixed(decimals) + suffix}
      </span>
    );
  }

  /* ── Card shell — dark surface, hairline border, staggered reveal ── */
  function Card({
    children,
    className = "",
    delay = 0,
    label,
    labelColor = "var(--text-faint)",
  }: {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    label?: string;
    labelColor?: string;
  }) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-8%" }}
        transition={{ delay, duration: 0.9, ease: EASE }}
        whileHover={{ y: -6, borderColor: "var(--border-strong)" }}
        className={`relative overflow-hidden rounded-2xl border border-white/10 p-6 transition-shadow duration-500 hover:shadow-[0_8px_40px_rgba(255,74,31,0.08)] md:p-8 ${className}`}
        style={{ backgroundColor: SURFACE }}
        data-cursor="circle"
      >
        {label && (
          <span
            className="absolute top-4 right-5 font-mono text-[10px] tracking-[0.2em] uppercase md:top-5 md:right-6"
            style={{ color: labelColor }}
          >
            {label}
          </span>
        )}
        {children}
      </motion.div>
    );
  }

  /* ── Animated capability chip icons ───────────────────────────────── */
  function ChipIcon({ name }: { name: string }) {
    const common = {
      width: 14,
      height: 14,
      viewBox: "0 0 16 16",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 1.4,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const,
    };
    switch (name) {
      case "ui":
        return (
          <svg {...common}>
            <rect x="2" y="2" width="12" height="12" rx="2" />
            <path d="M2 6h12" />
          </svg>
        );
      case "code":
        return (
          <svg {...common}>
            <path d="M5.5 5 2.5 8l3 3M10.5 5l3 3-3 3" />
          </svg>
        );
      case "brand":
        return (
          <svg {...common}>
            <path d="M12.5 3.5c-4 0-8 2-8.7 7.3-.1.9.5 1.7 1.4 1.7C10.5 12.5 12.5 8.5 12.5 3.5Z" />
            <path d="M4 12c2-3.5 4.5-5.5 7-6.5" />
          </svg>
        );
      case "proto":
        return (
          <svg {...common}>
            <path d="M8 1v3M8 12v3M1 8h3M12 8h3" />
            <circle cx="8" cy="8" r="2.2" />
          </svg>
        );
      case "motion":
        return (
          <svg {...common}>
            <path d="M4.5 2.8v10.4L13 8 4.5 2.8Z" />
          </svg>
        );
      default:
        return (
          <svg {...common}>
            <rect x="2" y="2" width="5" height="5" rx="1" />
            <rect x="9" y="2" width="5" height="5" rx="1" />
            <rect x="2" y="9" width="5" height="5" rx="1" />
            <rect x="9" y="9" width="5" height="5" rx="1" />
          </svg>
        );
    }
  }

  const CAPABILITIES = [
    { icon: "code", label: "React.js" },
    { icon: "ui", label: "TypeScript" },
    { icon: "proto", label: "Tailwind" },
    { icon: "motion", label: "GSAP" },
    { icon: "brand", label: "Three.js" },
    { icon: "grid", label: "Node.js" },
  ];

  const METRICS = [
    { to: 96, decimals: 0, suffix: "", label: "public repos", star: false },
    { to: 4, decimals: 0, suffix: "+", label: "years coding", star: false },
    { to: 15, decimals: 0, suffix: "+", label: "tech stacks\nmastered", star: false },
  ];

  /**
   * About — bento-grid "WHAT'S UP" section on the site's dark theme:
   * statement card, count-up metrics, capability chips with animated
   * icons, mini hero.frame, currently-building and a review card.
   */
  export default function About() {
    return (
      <section
        id="about"
        className="relative overflow-hidden px-6 py-28 md:px-10 md:py-44"
      >
        {/* ── Giant ghost background word ── */}
        <GhostWord
          text="About"
          stroke="var(--ghost)"
          className="top-24 right-0"
        />

        {/* ── Section header — same treatment as Work/Skills ── */}
        <div className="relative mb-10 md:mb-14">
          <div className="flex items-baseline justify-between font-mono text-[11px] tracking-[0.2em] text-white/40 uppercase">
            <span>( 01 — about )</span>
            <span className="hidden md:inline">the short version</span>
          </div>
          <DrawLine className="my-8 md:my-10" color="bg-white/[0.08]" />
          <div className="overflow-hidden">
            <motion.h2
              className="font-body text-[clamp(3rem,9vw,7.5rem)] leading-[0.95] font-bold tracking-[-0.03em] uppercase"
              style={{ color: "#FFFFFF" }}
              initial={{ y: "105%" }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: EASE }}
            >
              What's up
            </motion.h2>
          </div>
        </div>

        {/* ── Bento grid ── */}
        <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-12 md:gap-5">
          {/* Statement card */}
          <Card label="statement.txt" className="md:col-span-7" delay={0}>
            <motion.svg
              width="44"
              height="32"
              viewBox="0 0 44 32"
              fill="none"
              className="mb-6"
              initial={{ opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ ...POP, delay: 0.2 }}
            >
              <path
                d="M0 32V19.2C0 8 6.4 1.6 16.8 0l2.4 5.6c-5.6 1.6-8.4 4.8-8.8 9.6H18V32H0Zm26 0V19.2C26 8 32.4 1.6 42.8 0l1.2 5.6c-5.6 1.6-8.4 4.8-8.8 9.6H44V32H26Z"
                fill={ORANGE}
              />
            </motion.svg>

            <h3 className="font-body text-[clamp(1.7rem,3.2vw,2.6rem)] leading-[1.08] font-bold tracking-[-0.02em] text-white">
              Building interfaces that{" "}
              <span style={{ color: ORANGE }}>feel alive.</span>
            </h3>

            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/50">
              React frontend developer building modern web applications with
              clean code, smooth animations, and pixel-perfect attention to detail.
              Currently diving deep into DevOps, CI/CD pipelines, and cloud infrastructure.
            </p>

            <div className="mt-8 border-t border-white/10 pt-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="font-mono text-[11px] tracking-[0.2em] text-white/40 uppercase">
                  sayeed ahmed, since 2022
                </span>
                <span
                  className="flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] uppercase"
                  style={{ color: "#2ECC71" }}
                >
                  <motion.span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ background: "#2ECC71" }}
                    animate={{ opacity: [1, 0.25, 1], scale: [1, 0.8, 1] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                  />
                  available now
                </span>
              </div>
            </div>
          </Card>

          {/* Right column: metrics + capabilities */}
          <div className="flex flex-col gap-4 md:col-span-5 md:gap-5">
            {/* Metrics — count-ups */}
            <Card label="metrics" className="flex-1" delay={0.1}>
              <div className="flex h-full flex-col justify-center">
                {METRICS.map((m, i) => (
                  <div
                    key={m.label}
                    className={`flex items-center justify-between py-4 ${
                      i > 0 ? "border-t border-white/10" : ""
                    }`}
                  >
                    <span className="font-body text-4xl font-bold tracking-[-0.02em] text-white md:text-5xl">
                      <CountUp to={m.to} decimals={m.decimals} suffix={m.suffix} />
                      {m.star && (
                        <motion.svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          className="ml-1 inline-block"
                          style={{ color: ORANGE }}
                          fill="currentColor"
                          initial={{ scale: 0, rotate: -90 }}
                          whileInView={{ scale: 1, rotate: 0 }}
                          viewport={{ once: true }}
                          transition={{ ...POP, delay: 0.9 }}
                        >
                          <path d="M10 1l2.4 5.6 6 .5-4.6 4 1.4 5.9L10 13.9 4.8 17l1.4-5.9-4.6-4 6-.5L10 1Z" />
                        </motion.svg>
                      )}
                    </span>
                    <span className="max-w-[7rem] text-right font-mono text-[10px] leading-relaxed tracking-[0.2em] whitespace-pre-line text-white/45 uppercase">
                      {m.label}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Capabilities — chips with animated icons */}
            <Card label="capabilities" delay={0.2}>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {CAPABILITIES.map((cap, i) => (
                  <motion.span
                    key={cap.label}
                    className="flex cursor-default items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white"
                    initial={{ opacity: 0, scale: 0.7, y: 10 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ ...POP, delay: 0.25 + i * 0.07 }}
                    whileHover={{ scale: 1.06, borderColor: ORANGE, color: ORANGE }}
                  >
                    <motion.span
                      className="flex"
                      whileHover={{ rotate: 20 }}
                      transition={POP}
                    >
                      <ChipIcon name={cap.icon} />
                    </motion.span>
                    {cap.label}
                  </motion.span>
                ))}
              </div>
            </Card>
          </div>

          {/* hero.frame — mini live-design mock */}
          <Card className="md:col-span-4" delay={0.15}>
            <div className="flex h-full flex-col">
              <span className="mb-4 flex items-center gap-2 font-mono text-[10px] tracking-[0.15em] text-white/40 uppercase">
                <span className="inline-block h-2.5 w-2.5 rounded-[3px] bg-[#2F7CF6]" />
                hero.frame
              </span>
              <div className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] p-5">
                <span className="flex items-center gap-2 font-mono text-[9px] tracking-[0.2em] text-white/45 uppercase">
                  <motion.span
                    className="inline-block h-1.5 w-1.5 rounded-full"
                    style={{ background: ORANGE }}
                    animate={{ opacity: [1, 0.2, 1] }}
                    transition={{ duration: 1.4, repeat: Infinity }}
                  />
                  your brand
                </span>
                <p className="mt-3 font-body text-2xl leading-[1.05] font-bold text-white">
                  Build
                  <br />
                  bold<span style={{ color: ORANGE }}>.</span>
                </p>
                <motion.button
                  className="mt-4 flex items-center gap-2 rounded-lg px-4 py-2 font-mono text-[11px] font-medium text-white"
                  style={{ background: ORANGE }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  transition={POP}
                >
                  Start
                  <motion.span
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 1.4, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </motion.button>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="font-mono text-[9px] tracking-[0.25em] text-white/40 uppercase">
                  designed live
                </span>
                <span className="rounded bg-[#2F7CF6] px-1.5 py-0.5 font-mono text-[9px] text-white">
                  960 × 840
                </span>
              </div>
            </div>
          </Card>

          {/* Currently building */}
          <Card className="md:col-span-4" delay={0.25}>
            <span className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">
              <span style={{ color: ORANGE }}>▶</span> currently learning
            </span>
            <h4 className="mt-4 font-body text-3xl font-bold tracking-[-0.02em] text-white">
              DevOps
            </h4>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Docker", "AWS", "CI/CD"].map((t, i) => (
                <motion.span
                  key={t}
                  className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[13px] text-white/80"
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ ...POP, delay: 0.4 + i * 0.08 }}
                >
                  {t}
                </motion.span>
              ))}
            </div>
            {/* Animated equalizer */}
            <div className="mt-6 flex h-5 items-end gap-1.5">
              {[0.5, 0.9, 0.65, 1, 0.75, 0.55].map((h, i) => (
                <motion.span
                  key={i}
                  className="w-1.5 rounded-sm"
                  style={{ background: ORANGE, height: `${h * 100}%` }}
                  animate={{ scaleY: [1, 0.35, 1] }}
                  transition={{
                    duration: 1.1,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.12,
                  }}
                />
              ))}
            </div>
          </Card>

          {/* Review */}
          <Card label="review_01" className="md:col-span-4" delay={0.35}>
            <div className="mb-4 flex gap-1" style={{ color: ORANGE }}>
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.svg
                  key={i}
                  width="16"
                  height="16"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  initial={{ scale: 0, rotate: -60 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ ...POP, delay: 0.45 + i * 0.09 }}
                >
                  <path d="M10 1l2.4 5.6 6 .5-4.6 4 1.4 5.9L10 13.9 4.8 17l1.4-5.9-4.6-4 6-.5L10 1Z" />
                </motion.svg>
              ))}
            </div>
            <p className="text-[15px] leading-relaxed font-medium text-white">
              "Sayeed delivered a beautiful website for Cupid's Natural Farm.
              The design captured our brand perfectly — earthy, organic, and
              exactly what we envisioned. Highly recommend his work."
            </p>
            <div className="mt-6 flex items-center gap-3">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full font-mono text-[11px] text-white"
                style={{ background: "linear-gradient(135deg, #2ECC71, var(--surface))" }}
              >
                IK
              </span>
              <span className="font-mono text-[10px] tracking-[0.2em] text-white/50 uppercase">
                Inayathulla Khan · Cupid's Natural Farm
              </span>
            </div>
          </Card>
        </div>
      </section>
    );
  }

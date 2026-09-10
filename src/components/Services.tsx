import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import DrawLine from "./DrawLine";
import GhostWord from "./GhostWord";
import TechMarquee from "./TechMarquee";

const EASE = [0.22, 1, 0.36, 1] as const;

const SERVICES = [
  {
    id: "01",
    title: "Frontend\nEngineering",
    desc: "React, TypeScript, Next.js — fast, accessible, production-grade interfaces built to scale.",
    tags: ["React", "TypeScript", "Next.js", "Tailwind"],
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="40" height="40" rx="4" />
        <path d="M16 20L12 24L16 28" />
        <path d="M32 20L36 24L32 28" />
        <path d="M28 16L20 32" />
      </svg>
    ),
  },
  {
    id: "02",
    title: "Creative\nDevelopment",
    desc: "WebGL, shaders, motion — the expressive layer that makes a site unforgettable.",
    tags: ["Three.js", "GSAP", "Framer Motion", "GLSL"],
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="24" cy="24" r="20" strokeDasharray="4 6" />
        <circle cx="24" cy="24" r="8" />
        <path d="M24 4V12M24 36V44M4 24H12M36 24H44" />
      </svg>
    ),
  },
  {
    id: "03",
    title: "DevOps &\nInfrastructure",
    desc: "Docker, AWS, CI/CD — automating deployments and scaling applications to production.",
    tags: ["Docker", "AWS", "GitHub Actions", "Linux"],
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M24 4L4 14v20l20 10 20-10V14L24 4z" />
        <path d="M4 14l20 10 20-10" />
        <path d="M24 44V24" />
      </svg>
    ),
  },
];

function SkillCard({
  service,
  index,
}: {
  service: (typeof SERVICES)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.15, duration: 0.9, ease: EASE }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative border-t border-white/[0.08] py-12 md:py-16"
    >
      {/* Background glow on hover */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-2xl"
        animate={{
          background: hovered
            ? "radial-gradient(ellipse at 50% 50%, rgba(255,74,31,0.04), transparent 70%)"
            : "transparent",
        }}
        transition={{ duration: 0.5 }}
      />

      <div className="relative grid grid-cols-1 gap-8 md:grid-cols-[4rem_1fr_1fr_auto] md:gap-12">
        {/* Number */}
        <motion.span
          className="font-mono text-[11px] text-white/30 md:pt-2"
          animate={{ color: hovered ? "var(--text-dim)" : "var(--text-faint)" }}
          transition={{ duration: 0.4 }}
        >
          ({service.id})
        </motion.span>

        {/* Title + Icon */}
        <div className="flex items-start gap-6">
          <motion.div
            className="hidden text-white/40 md:block"
            animate={{
              color: hovered ? "#FF4A1F" : "var(--text-faint)",
              rotate: hovered ? 10 : 0,
            }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            {service.icon}
          </motion.div>
          <h3 className="whitespace-pre-line font-body text-[clamp(1.8rem,4vw,3.2rem)] font-light leading-[1.05] tracking-[-0.02em]">
            <motion.span
              animate={{ color: hovered ? "var(--text)" : "var(--text-dim)" }}
              transition={{ duration: 0.4 }}
            >
              {service.title}
            </motion.span>
          </h3>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-5">
          <motion.p
            className="max-w-md text-[15px] font-light leading-[1.7]"
            animate={{
              color: hovered ? "var(--text-dim)" : "var(--text-faint)",
            }}
            transition={{ duration: 0.4 }}
          >
            {service.desc}
          </motion.p>

          {/* Tech tags */}
          <div className="flex flex-wrap gap-2">
            {service.tags.map((tag, i) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  delay: index * 0.15 + 0.3 + i * 0.06,
                  duration: 0.6,
                  ease: EASE,
                }}
                className="rounded-full border border-white/[0.08] px-3.5 py-1.5 font-mono text-[10px] tracking-[0.1em] text-white/40 transition-all duration-300 hover:border-white/30 hover:text-white/70"
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Arrow indicator */}
        <motion.div
          className="hidden items-center md:flex"
          animate={{
            x: hovered ? 8 : 0,
            opacity: hovered ? 1 : 0.3,
          }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M5 10H15M11 6L15 10L11 14" />
          </svg>
        </motion.div>
      </div>
    </motion.div>
  );
}

/**
 * Skills — editorial service showcase with large typography,
 * animated hover states, and interactive tech tags.
 */
export default function Services() {
  return (
    <section id="services" className="relative overflow-hidden px-6 py-28 md:px-10 md:py-44">
      <GhostWord
        text="Skills"
        stroke="var(--ghost)"
        className="top-24 right-0"
      />

      {/* Section header */}
      <div className="mb-10 md:mb-14">
        <div className="flex items-baseline justify-between font-mono text-[11px] tracking-[0.2em] text-white/40 uppercase">
          <span>( 03 — capabilities )</span>
          <span className="hidden md:inline">what i do</span>
        </div>
        <DrawLine className="my-8 md:my-10" color="bg-white/[0.08]" />

        <div className="overflow-hidden">
          <motion.h2
            className="font-body text-[clamp(2.5rem,6vw,5rem)] font-light tracking-[-0.02em] text-white/80"
            initial={{ y: "110%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: EASE }}
          >
            What I bring to the table
          </motion.h2>
        </div>
      </div>

      {/* Skill cards */}
      <div>
        {SERVICES.map((service, i) => (
          <SkillCard key={service.id} service={service} index={i} />
        ))}
        <DrawLine color="bg-white/[0.08]" />
      </div>

      {/* Tech logo marquee */}
      <TechMarquee />
    </section>
  );
}

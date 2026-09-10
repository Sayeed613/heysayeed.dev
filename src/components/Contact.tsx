import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import GhostWord from "./GhostWord";
import DrawLine from "./DrawLine";

const EASE = [0.22, 1, 0.36, 1] as const;

const SOCIALS = [
  {
    label: "GitHub",
    href: "https://github.com/Sayeed613",
    external: true,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/sayeed-ahmed-13474b225",
    external: true,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: "Email",
    href: "mailto:sayeedahmed90082@gmail.com",
  },
  {
    label: "Phone",
    href: "tel:+919008299613",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
];

/**
 * Contact — full-viewport section with a massive email headline,
 * social links with hover animations, and a creative layout.
 */
export default function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-10%" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Parallax on the big email text
  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative overflow-hidden px-6 py-32 md:px-10 md:py-44"
    >
      <GhostWord
        text="Contact"
        stroke="var(--ghost)"
        className="top-16 right-0"
      />

      {/* Section header */}
      <div className="mb-16 md:mb-24">
        <div className="flex items-baseline justify-between font-mono text-[11px] tracking-[0.2em] text-white/40 uppercase">
          <span>( 04 — get in touch )</span>
          <span className="hidden md:inline">let's create something</span>
        </div>
        <DrawLine className="my-8 md:my-10" color="bg-white/[0.08]" />
      </div>

      {/* Big email headline with parallax */}
      <motion.div style={{ y }} className="relative mb-16 md:mb-24">
        <div className="overflow-hidden">
          <motion.h2
            className="font-body text-[clamp(2rem,7vw,6rem)] font-light leading-[1.05] tracking-[-0.03em]"
            initial={{ y: "110%" }}
            animate={inView ? { y: 0 } : {}}
            transition={{ duration: 1.1, ease: EASE }}
          >
            <span className="text-white/40">Have a project?</span>
          </motion.h2>
        </div>
        <div className="overflow-hidden">
          <motion.h2
            className="font-body text-[clamp(2.5rem,9vw,8rem)] font-bold leading-[0.95] tracking-[-0.04em]"
            initial={{ y: "110%" }}
            animate={inView ? { y: 0 } : {}}
            transition={{ duration: 1.1, delay: 0.15, ease: EASE }}
          >
            <a
              href="mailto:sayeedahmed90082@gmail.com"
              data-cursor="link"
              className="group inline-flex items-center gap-4 text-white transition-colors hover:text-[#FF4A1F]"
            >
              Let's talk
              <motion.svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                className="hidden md:inline-block"
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.6, duration: 0.8, ease: EASE }}
              >
                <path
                  d="M8 24H40M40 24L28 12M40 24L28 36"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-all duration-500 group-hover:translate-x-2"
                />
              </motion.svg>
            </a>
          </motion.h2>
        </div>
      </motion.div>

      {/* Contact info grid */}
      <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
        {/* Email */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.8, ease: EASE }}
        >
          <span className="mb-3 block font-mono text-[10px] tracking-[0.2em] text-white/30 uppercase">
            Email
          </span>
          <a
            href="mailto:sayeedahmed90082@gmail.com"
            data-cursor="link"
            className="text-lg text-white/70 transition-colors hover:text-[#FF4A1F]"
          >
            sayeedahmed90082@gmail.com
          </a>
          <a
            href="tel:+919008299613"
            data-cursor="link"
            className="mt-1 block text-sm text-white/50 transition-colors hover:text-[#FF4A1F]"
          >
            +91 90082 99613
          </a>
        </motion.div>

        {/* Location */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.8, ease: EASE }}
        >
          <span className="mb-3 block font-mono text-[10px] tracking-[0.2em] text-white/30 uppercase">
            Location
          </span>
          <p className="text-lg text-white/70">India</p>
          <p className="mt-1 text-sm text-white/40">Available remotely worldwide</p>
        </motion.div>

        {/* Availability */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.8, ease: EASE }}
        >
          <span className="mb-3 block font-mono text-[10px] tracking-[0.2em] text-white/30 uppercase">
            Status
          </span>
          <div className="flex items-center gap-2">
            <motion.span
              className="h-2 w-2 rounded-full bg-[#2ECC71]"
              animate={{ opacity: [1, 0.4, 1], scale: [1, 0.85, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className="text-lg text-white/70">Open to work</span>
          </div>
        </motion.div>
      </div>

      {/* Social links */}
      <motion.div
        className="mt-16 flex flex-wrap gap-4 md:mt-20"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.7, duration: 0.8, ease: EASE }}
      >
        {SOCIALS.map((social, i) => (
          <motion.a
            key={social.label}
            href={social.href}
            target={social.external ? "_blank" : undefined}
            rel={social.external ? "noopener noreferrer" : undefined}
            data-cursor="link"
            className="group flex items-center gap-3 rounded-full border border-white/10 px-6 py-3 text-white/60 transition-all duration-300 hover:border-white/30 hover:text-white"
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.8 + i * 0.1, duration: 0.6, ease: EASE }}
            whileHover={{ scale: 1.03 }}
          >
            <span className="transition-colors duration-300 group-hover:text-[#FF4A1F]">
              {social.icon}
            </span>
            <span className="font-mono text-[12px] tracking-[0.1em] uppercase">
              {social.label}
            </span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              className="opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-60"
            >
              <path d="M4 10L10 4M10 4H5M10 4V9" />
            </svg>
          </motion.a>
        ))}
      </motion.div>

      {/* Bottom divider */}
      <DrawLine className="mt-20 md:mt-28" color="bg-white/[0.06]" />
    </section>
  );
}

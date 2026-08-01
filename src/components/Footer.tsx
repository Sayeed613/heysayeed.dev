import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    gsap.set(el, { opacity: 0, y: 20 });
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 95%",
        toggleActions: "play none none none",
      },
    });
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative z-10 border-t border-white/[0.04] bg-[#0A0A0A]"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-10 md:py-14">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          {/* Left: branding */}
          <div className="flex flex-col gap-2">
            <p className="text-white text-lg font-display font-bold tracking-[-0.01em]">
              heysayeed.dev
            </p>
            <p className="text-white/20 text-[10px] font-mono uppercase tracking-[0.2em]">
              Design · Build · Ship
            </p>
          </div>

          {/* Middle: socials */}
          <div className="flex items-center gap-4">
            {[
              { label: "GitHub", href: "#" },
              { label: "Twitter", href: "#" },
              { label: "LinkedIn", href: "#" },
              { label: "Dribbble", href: "#" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                onClick={(e) => e.preventDefault()}
                className="text-white/20 text-[11px] font-mono uppercase tracking-[0.12em] hover:text-[#EF4444] transition-colors duration-200"
              >
                {s.label}
              </a>
            ))}
          </div>

          {/* Right: copyright */}
          <div className="flex flex-col items-start md:items-end gap-1">
            <span className="text-white/15 text-[10px] font-mono tabular-nums">
              © {new Date().getFullYear()} Sayeed
            </span>
            <span className="text-white/10 text-[9px] font-mono uppercase tracking-[0.15em]">
              All rights reserved
            </span>
          </div>
        </div>

        {/* Bottom accent line */}
        <div className="mt-8 pt-6 border-t border-white/[0.03] flex items-center justify-between">
          <span className="text-white/10 text-[9px] font-mono">
            Crafted with <span className="text-[#EF4444]">red</span>, precision & caffeine
          </span>
          <span className="text-white/10 text-[9px] font-mono">
            remote · worldwide
          </span>
        </div>
      </div>
    </footer>
  );
}

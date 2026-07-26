import { useState } from "react";
import { motion } from "framer-motion";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
] as const;

export default function FloatingNav() {
  const [active, setActive] = useState("Home");

  return (
    <nav
      id="floating-nav"
      className="fixed top-[52px] left-1/2 -translate-x-1/2 z-40 flex items-center justify-center w-full  px-4"
    >
      {/* Left metadata — absolutely positioned so pill stays centered */}
      <div className="absolute left-4 flex items-center gap-2 border-1 rounded-4xl px-3 py-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-accent status-dot" />
        <span className="text-text-muted text-[11px] font-mono leading-none tracking-wide">
          available for remote work
        </span>
      </div>

      {/* Nav pill with layoutId */}
      <div className="relative flex items-center gap-1 mx-auto px-2 py-1.5 rounded-full bg-[rgba(17,20,28,0.85)] backdrop-blur-md border border-border-subtle shadow-lg shadow-black/20">
        {NAV_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            onClick={(e) => {
              e.preventDefault();
              setActive(link.label);
            }}
            className={`group relative px-3.5 py-1.5 text-[13px] font-mono leading-none rounded-full transition-colors duration-200 overflow-hidden ${
              active === link.label
                ? "text-[#0B0E14]"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            {/* Animated active indicator */}
            {active === link.label && (
              <motion.span
                layoutId="active-pill"
                className="absolute inset-0 rounded-full bg-accent"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            {/* Text roll-up: inline-flex container to hold both layers */}
            <span className="relative inline-flex flex-col overflow-hidden h-[13px]">
              <span className="flex items-center justify-center transition-transform duration-200 group-hover:-translate-y-full">
                {link.label}
              </span>
              <span className="flex items-center justify-center transition-transform duration-200 translate-y-0 group-hover:-translate-y-full">
                {link.label}
              </span>
            </span>
          </a>
        ))}

        {/* Divider */}
        <span className="w-px h-4 bg-border-subtle mx-1" />

        {/* Contact CTA */}
        <a
          href="#contact"
          onClick={(e) => {
            e.preventDefault();
            setActive("Contact");
          }}
          className={`px-4 py-1.5 text-[13px] font-mono leading-none rounded-full transition-all duration-200 ${
            active === "Contact"
              ? "bg-text-primary text-editor-bg shadow-sm"
              : "bg-text-primary text-editor-bg hover:brightness-110"
          }`}
        >
          Contact
        </a>
      </div>

      {/* Right metadata — absolutely positioned so pill stays centered */}
      <div className="hidden md:absolute md:flex right-4 items-center justify-end border-1 rounded-4xl px-3 py-1.5">
        <span className="text-text-muted text-[11px]   text-center  font-mono leading-none tracking-wide">
          hey@heysayeed.dev
        </span>
      </div>
    </nav>
  );
}

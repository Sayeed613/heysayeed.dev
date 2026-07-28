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


      {/* Nav pill with layoutId */}
      <div className="relative flex items-center gap-1 mx-auto px-2 py-1.5 rounded-full bg-[#141414]/90 backdrop-blur-md border border-border-subtle shadow-lg shadow-black/40">
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
                ? "text-white"
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
          className={`relative overflow-hidden px-4 py-1.5 text-[13px] font-mono leading-none rounded-full bg-accent text-white ${
            active === "Contact" ? "shadow-sm ring-1 ring-white/20" : ""
          }`}
          style={{
            background: "linear-gradient(120deg, #DC2626 0%, #DC2626 35%, rgba(220,38,38,0.6) 50%, #DC2626 65%, #DC2626 100%)",
            backgroundSize: "250% 100%",
            backgroundPosition: "100% 0",
            transition: "background-position 0.5s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundPosition = "0% 0";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundPosition = "100% 0";
          }}
        >
          Contact
        </a>
      </div>


    </nav>
  );
}

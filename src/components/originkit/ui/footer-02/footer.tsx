"use client";

"use client";

import Tetris from "@/components/originkit/ui/footer-02/tetris";
import ScrambleLink from "@/components/ScrambleLink";
import type { LegalDoc } from "@/components/LegalModal";

function asset(file: string) {
  return `/originkit/footer-02/${file}`;
}

type FooterLink = {
  label: string;
  href: string;
  doc?: LegalDoc;
  /** External links open in a new tab. */
  external?: boolean;
};

type LinkColumn = {
  title: string;
  links: FooterLink[];
};

const LINK_COLUMNS: LinkColumn[] = [
  {
    title: "Navigate",
    links: [
      { label: "Home", href: "#top" },
      { label: "Work", href: "#work" },
      { label: "About", href: "#about" },
      { label: "Skills", href: "#services" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "GitHub", href: "https://github.com/Sayeed613", external: true },
      { label: "LinkedIn", href: "https://linkedin.com/in/sayeed-ahmed-13474b225", external: true },
      { label: "Email", href: "mailto:sayeedahmed90082@gmail.com" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Notice", href: "#", doc: "privacy" },
      { label: "License", href: "#", doc: "license" },
      { label: "Terms & Conditions", href: "#", doc: "terms" },
    ],
  },
];

const SOCIAL_LINKS = [
  {
    label: "GitHub",
    href: "https://github.com/Sayeed613",
    icon: "github.svg",
    external: true,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/sayeed-ahmed-13474b225",
    icon: "linkedin.svg",
    external: true,
  },
  {
    label: "Email",
    href: "mailto:sayeedahmed90082@gmail.com",
    icon: "mail.svg",
    external: false,
  },
] as const;

const SOCIAL_SHADOW =
  "0px 17px 2.5px rgba(0,0,0,0), 0px 11px 2px rgba(0,0,0,0.01), 0px 6px 2px rgba(0,0,0,0.05), 0px 3px 1.5px rgba(0,0,0,0.09), 0px 1px 1px rgba(0,0,0,0.1)";

interface FooterProps {
  onOpenDoc?: (doc: LegalDoc) => void;
}

export function Footer({ onOpenDoc }: FooterProps) {
  return (
    <footer
      aria-label="heysayeed.dev footer"
      className="relative isolate mx-auto w-full min-h-[778px] overflow-hidden rounded-[12px] bg-[#111111]"
    >
      {}
      <div className="relative z-10 flex flex-col gap-8 px-4 pt-10 pb-[300px] ipad:gap-12 ipad:px-12 ipad:pt-12 ipad:pb-[320px] desktop-sm:flex-row desktop-sm:items-stretch desktop-sm:justify-between desktop-sm:gap-0 desktop-sm:px-14 desktop-sm:pt-[72px] desktop-sm:pb-[300px]">
        {}
        <div className="flex w-full flex-col gap-6 ipad:gap-8 desktop-sm:w-[169px] desktop-sm:shrink-0 desktop-sm:justify-between desktop-sm:gap-0">
          <div className="flex flex-col gap-2 ipad:gap-4">
            <p className="font-hedvig text-[24px] leading-[1.1] tracking-[-0.96px] text-white/90">
              heysayeed.dev
            </p>
            <p className="font-sans text-[14px] leading-[1.4] text-[#c2c2c2]">
              Design engineer crafting bold, immersive web experiences
            </p>
          </div>

          <ul className="flex items-center gap-4" aria-label="Social links">
            {SOCIAL_LINKS.map((social, index) => (
              <li
                key={social.label}
                className="animate-social-slide-up will-change-transform"
                style={{ animationDelay: `${index * 120}ms` }}
              >
                <a
                  href={social.href}
                  target={social.external ? "_blank" : undefined}
                  rel={social.external ? "noopener noreferrer" : undefined}
                  aria-label={social.label}
                  tabIndex={0}
                  className="relative inline-flex size-10 touch-manipulation items-center justify-center rounded-full bg-[#292929] transition-opacity duration-200 ease before:absolute before:inset-[-6px] before:content-[''] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white [-webkit-tap-highlight-color:transparent] [@media(hover:hover)_and_(pointer:fine)]:hover:opacity-80"
                  style={{ boxShadow: SOCIAL_SHADOW }}
                >
                  <span className="relative size-5 overflow-clip">
                    <img
                      src={asset(social.icon)}
                      alt=""
                      width={20}
                      height={20}
                      className="size-full"
                      aria-hidden="true"
                    />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {}
        <nav
          aria-label="Footer"
          className="grid w-full grid-cols-2 gap-x-8 gap-y-8 ipad:grid-cols-3 ipad:gap-8 desktop-sm:flex desktop-sm:w-[541px] desktop-sm:shrink-0 desktop-sm:gap-14"
        >
          {LINK_COLUMNS.map((column) => (
            <div
              key={column.title}
              className="flex min-w-0 flex-col gap-4 desktop-sm:flex-1"
            >
              <p className="font-hedvig text-[18px] leading-normal text-white">
                {column.title}
              </p>
              <ul className="flex flex-col gap-4">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <ScrambleLink
                      label={link.label}
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      tabIndex={0}
                      aria-label={link.label}
                      onClick={(e) => {
                        // Only legal links open popups — everything else
                        // (anchors, GitHub, LinkedIn, mailto) navigates normally.
                        if (!link.doc) return;
                        e.preventDefault();
                        onOpenDoc?.(link.doc);
                      }}
                      className="relative inline-flex items-center font-sans text-[16px] leading-normal text-white/80 touch-manipulation transition-opacity duration-200 ease before:absolute before:-inset-y-2 before:-inset-x-1 before:content-[''] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white desktop-sm:text-[14px] [-webkit-tap-highlight-color:transparent] [@media(hover:hover)_and_(pointer:fine)]:hover:text-white"
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      {}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[268px] overflow-hidden"
      >
        <Tetris
          boardColor="#111111"
          colors={["#FF4A1F", "#FFFFFF"]}
          cellSize={20}
          gap={0}
          rounded={20}
          dropSpeed={1}
          movement={2}
          startFilled={true}
        />
      </div>
    </footer>
  );
}
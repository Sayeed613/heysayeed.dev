import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

export type LegalDoc = "privacy" | "license" | "terms";

interface LegalSection {
  heading?: string;
  paragraphs: string[];
}

interface LegalDocContent {
  title: string;
  subtitle: string;
  sections: LegalSection[];
}

const OWNER = "Sayeed Ahmed";
const SITE = "heysayeed.dev";
const EMAIL = "sayeedahmed90082@gmail.com";
const YEAR = new Date().getFullYear();

const DOCS: Record<LegalDoc, LegalDocContent> = {
  privacy: {
    title: "Privacy Notice",
    subtitle: `Last updated: ${YEAR} — ${SITE}`,
    sections: [
      {
        paragraphs: [
          `${SITE} ("the Site") is the personal portfolio of ${OWNER}, a design engineer. This Privacy Notice explains what information is collected when you visit the Site and how it is used.`,
        ],
      },
      {
        heading: "1. Information I collect",
        paragraphs: [
          "The Site does not require accounts or logins. The information collected falls into two categories:",
          "Contact information — if you use the contact form, I receive the details you submit, such as your name, email address, and the contents of your message.",
          "Usage information — anonymous analytics data such as pages visited, approximate location, browser, and device type, used to understand how visitors use the Site.",
        ],
      },
      {
        heading: "2. How your information is used",
        paragraphs: [
          "Your information is used only to respond to enquiries, improve the Site, and keep it secure. I do not sell or rent your personal information to anyone.",
        ],
      },
      {
        heading: "3. Cookies",
        paragraphs: [
          "The Site may use essential cookies to function correctly and analytics cookies to measure traffic. You can block or delete cookies through your browser settings; doing so may affect some functionality.",
        ],
      },
      {
        heading: "4. Sharing of information",
        paragraphs: [
          "Information is only shared with trusted service providers (such as hosting and analytics providers) strictly to operate the Site, or where required by law.",
        ],
      },
      {
        heading: "5. Retention and security",
        paragraphs: [
          "Information is kept only as long as necessary for the purposes described above, and reasonable technical measures are taken to protect it.",
        ],
      },
      {
        heading: "6. Your rights",
        paragraphs: [
          "You may request access to, correction of, or deletion of your personal information at any time by contacting me using the details below.",
        ],
      },
      {
        heading: "7. External links",
        paragraphs: [
          "The Site may link to third-party websites. I am not responsible for the privacy practices of those sites and encourage you to read their privacy policies.",
        ],
      },
      {
        heading: "8. Changes to this notice",
        paragraphs: [
          "This Privacy Notice may be updated from time to time. The latest version will always be available on this page.",
        ],
      },
      {
        heading: "9. Contact",
        paragraphs: [
          `For any questions about this Privacy Notice, contact ${OWNER} at ${EMAIL}.`,
        ],
      },
    ],
  },
  license: {
    title: "License",
    subtitle: `Effective ${YEAR} — ${SITE}`,
    sections: [
      {
        paragraphs: [
          `All content on ${SITE}, including design, code, text, graphics, and media, is the property of ${OWNER} unless otherwise stated, and is protected by applicable copyright laws.`,
        ],
      },
      {
        heading: "1. What you may do",
        paragraphs: [
          "You may view the Site for personal, non-commercial purposes, share links to it, and reference it in your own work with appropriate attribution.",
        ],
      },
      {
        heading: "2. What you may not do",
        paragraphs: [
          "You may not copy, reproduce, redistribute, modify, or create derivative works from the Site's content, design, or code for commercial purposes without prior written permission from the owner.",
        ],
      },
      {
        heading: "3. Code samples",
        paragraphs: [
          "Code snippets displayed on the Site may be used in your own personal projects provided you include attribution to the original source.",
        ],
      },
      {
        heading: "4. Enforcement",
        paragraphs: [
          "Unauthorized use of the Site's content may constitute copyright infringement and may result in legal action.",
        ],
      },
      {
        heading: "5. Licensing enquiries",
        paragraphs: [
          `For licensing, collaboration, or permission requests, contact ${OWNER} at ${EMAIL}.`,
        ],
      },
    ],
  },
  terms: {
    title: "Terms & Conditions",
    subtitle: `Effective ${YEAR} — ${SITE}`,
    sections: [
      {
        paragraphs: [
          `By accessing or using ${SITE} ("the Site"), operated by ${OWNER}, you agree to be bound by these Terms & Conditions. If you do not agree, please do not use the Site.`,
        ],
      },
      {
        heading: "1. Use of the Site",
        paragraphs: [
          "The Site is provided for personal, informational, and portfolio purposes. You agree to use it lawfully and not to disrupt, overload, or attempt to gain unauthorized access to the Site or its underlying systems.",
        ],
      },
      {
        heading: "2. Intellectual property",
        paragraphs: [
          "All content and code on the Site are owned by the owner and protected by copyright law. See the License document for permitted uses.",
        ],
      },
      {
        heading: "3. External links",
        paragraphs: [
          "The Site may contain links to third-party websites. These are provided for convenience only, and I am not responsible for their content or availability.",
        ],
      },
      {
        heading: "4. No warranties",
        paragraphs: [
          "The Site is provided on an \"as is\" and \"as available\" basis without warranties of any kind, either express or implied.",
        ],
      },
      {
        heading: "5. Limitation of liability",
        paragraphs: [
          "To the fullest extent permitted by law, the owner shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Site.",
        ],
      },
      {
        heading: "6. Governing law",
        paragraphs: [
          "These Terms are governed by the laws of the Republic of India. Any disputes shall be subject to the exclusive jurisdiction of the courts of India.",
        ],
      },
      {
        heading: "7. Changes to these terms",
        paragraphs: [
          "I may update these Terms from time to time. Continued use of the Site after changes constitutes acceptance of the revised Terms.",
        ],
      },
      {
        heading: "8. Contact",
        paragraphs: [
          `For any questions about these Terms, contact ${OWNER} at ${EMAIL}.`,
        ],
      },
    ],
  },
};

interface LegalModalProps {
  doc: LegalDoc | null;
  onClose: () => void;
}

const EASE = [0.22, 1, 0.36, 1] as const;

/** Full-screen legal popup with an originkit dither background. */
export default function LegalModal({ doc, onClose }: LegalModalProps) {
  // Lock page scroll while the popup is open.
  useEffect(() => {
    if (!doc) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [doc]);

  // Close on Escape.
  useEffect(() => {
    if (!doc) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [doc, onClose]);

  const content = doc ? DOCS[doc] : null;

  return (
    <AnimatePresence>
      {content && (
        /* Static backdrop — no animation outside the box */
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={content.title}
        >
          {/* Plain dark backdrop */}
          <div className="absolute inset-0 bg-black/80" aria-hidden="true" />

          {/* ── Card — static bg and border, interior animations only ── */}
          <motion.div
            key={content.title}
            className="relative z-10 w-full max-w-3xl"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 18 }}
            transition={{ duration: 0.32, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Card body */}
            <div className="relative flex max-h-[85dvh] w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0A0A0A] shadow-[0_24px_80px_rgba(0,0,0,0.6)]">

            {/* Header — slides down on open */}
            <motion.div
              className="relative flex items-start justify-between gap-4 border-b border-white/[0.08] px-6 pt-6 pb-5 sm:px-8"
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.08, ease: EASE }}
            >
              <div>
                <p className="font-mono text-[10px] tracking-[0.2em] text-[#FF4A1F] uppercase">
                  heysayeed.dev
                </p>
                <h2 className="mt-2 text-2xl tracking-[-0.02em] text-white sm:text-3xl">
                  {content.title}
                </h2>
                <p className="mt-1 text-sm text-white/40">{content.subtitle}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                data-cursor="tap"
                aria-label="Close"
                className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/10 text-white/60 transition-colors hover:border-white/30 hover:text-white"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </motion.div>

            {/* Body — sections stagger up on open */}
            <div
              data-lenis-prevent
              className="relative overflow-y-auto px-6 py-6 sm:px-8"
            >
              <div className="flex flex-col gap-6">
                {content.sections.map((section, index) => (
                  <motion.section
                    key={index}
                    className="flex flex-col gap-2"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.45,
                      delay: 0.12 + index * 0.06,
                      ease: EASE,
                    }}
                  >
                    {section.heading && (
                      <h3 className="text-base font-medium tracking-[-0.01em] text-white">
                        {section.heading}
                      </h3>
                    )}
                    {section.paragraphs.map((paragraph, i) => (
                      <p
                        key={i}
                        className="text-sm leading-relaxed text-white/60"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </motion.section>
                ))}
              </div>
            </div>

            {/* Footer strip — slides up on open */}
            <motion.div
              className="relative flex items-center justify-between border-t border-white/[0.08] px-6 py-4 sm:px-8"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1, ease: EASE }}
            >
              <span className="font-mono text-[10px] tracking-[0.2em] text-white/30 uppercase">
                © {YEAR} {OWNER}
              </span>
              <span className="font-mono text-[10px] tracking-[0.2em] text-white/30 uppercase">
                {SITE}
              </span>
            </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Typewriter from "./originkit/ui/typewriter";
import AsciiImage from "@/components/originkit/ui/hero-32/ascii-reveal";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Tiny SVG plus-mark used as HUD decoration. */
function Plus({ className, delay }: { className: string; delay: number }) {
  return (
    <motion.svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      className={`pointer-events-none absolute text-white/30 ${className}`}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.6, ease: EASE }}
    >
      <path d="M6 0V12M0 6H12" stroke="currentColor" strokeWidth="1" />
    </motion.svg>
  );
}

/** One headline line, revealed with a clip-up wipe. */
function HeadlineLine({
  children,
  delay,
  outline = false,
}: {
  children: React.ReactNode;
  delay: number;
  outline?: boolean;
}) {
  return (
    <div className="overflow-hidden">
      <motion.div
        className={`font-body font-medium uppercase leading-[0.9] tracking-[-0.03em] text-[clamp(3.4rem,12.5vw,11rem)] ${
          outline ? "text-transparent" : "text-white"
        }`}
        style={
          outline
            ? { WebkitTextStroke: "1.5px var(--outline)" }
            : undefined
        }
        initial={{ y: "110%" }}
        animate={{ y: 0 }}
        transition={{ delay, duration: 1.1, ease: EASE }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export default function Hero() {
  // Subtle mouse parallax on the headline block
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(useTransform(mx, [-0.5, 0.5], [-14, 14]), {
    stiffness: 60,
    damping: 20,
  });
  const py = useSpring(useTransform(my, [-0.5, 0.5], [-8, 8]), {
    stiffness: 60,
    damping: 20,
  });

  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <section
      id="top"
      onMouseMove={onMouseMove}
      className="relative flex min-h-svh flex-col justify-between overflow-hidden px-6 pt-24 pb-0 md:px-10 md:pt-28"
    >
      {/* HUD plus-marks */}
      <Plus className="top-[20%] left-[12%] hidden md:block" delay={0.9} />
      <Plus className="top-[28%] right-[18%] hidden md:block" delay={1.05} />
      <Plus className="bottom-[30%] left-[22%] hidden md:block" delay={1.2} />

      {/* ── ASCII portrait — hero-32 hover reveal, right side ── */}
      <motion.div
        className="absolute right-4 bottom-90 z-0 w-40 opacity-70 sm:w-44 lg:top-1/2 lg:bottom-auto lg:right-14 lg:w-[24rem] lg:-translate-y-1/2 lg:opacity-100 xl:right-20 xl:w-[38rem]"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2, duration: 1, ease: EASE }}
      >
        {/* Small screens: small card, bottom-right. lg+: beside the headline. */}
        <div className="relative aspect-[4/5] w-full overflow-hidden opacity-70 lg:opacity-100">
          <AsciiImage
            image={{ src: "/images/profile.png", alt: "Sayeed Ahmed — profile" }}
            fit="cover"
            focusY={20}
            columns={72}
            contrast={21}
            inkColor="#FFFFFF"
            reveal
            tapReveal
            decodeOnLoad
            decodeDuration={3400}
            revealOptions={{ size: 80, softness: 16 }}
          />
        </div>

      </motion.div>

      {/* Connect Now vertical sticker — red, folded corner, links to contact */}
      <motion.a
        href="#contact"
        aria-label="Connect now"
        data-cursor="link"
        className="group absolute top-1/2 right-0 z-20 hidden -translate-y-1/2 md:block"
        style={{ width: 48, height: 232 }}
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{
          delay: 1.6,
          duration: 0.9,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {/* Main sticker */}
        <div
          className="absolute inset-0 flex items-center justify-center overflow-hidden transition-[filter] duration-300 group-hover:brightness-110"
          style={{
            background: "#E04A46",
          }}
        >
          {/* Vertical text — reads bottom-to-top: + then "Connect Now" */}
          <div
            className="flex items-center justify-center gap-2"
            style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
          >
            <span className="font-body text-[12px] font-semibold tracking-[0.18em] text-white whitespace-nowrap">
              Connect Now
            </span>
            <span className="font-mono text-[14px] leading-none font-medium text-white whitespace-nowrap">
              +
            </span>
          </div>
        </div>

        {/* Folded corner */}
        <div
          className="absolute bottom-0 right-0"
          style={{
            width: 0,
            height: 0,
            borderStyle: "solid",
            borderWidth: "0 0 18px 18px",
            borderColor:
              "transparent transparent #0A0A0A transparent",
          }}
        />

        {/* Fold shadow */}
        <div
          className="absolute bottom-0 right-0"
          style={{
            width: 0,
            height: 0,
            borderStyle: "solid",
            borderWidth: "0 0 15px 15px",
            borderColor:
              "transparent transparent #B5302A transparent",
          }}
        />
      </motion.a>

      {/* ── Top meta row ── */}
      <motion.div
        className="pointer-events-none relative z-10 flex items-center justify-between font-mono text-[11px] tracking-[0.2em] text-white/40 uppercase"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.8 }}
      >
        <span>( portfolio — 2026 )</span>
        <span className="flex items-center gap-2">
          <motion.span
            className="inline-block h-1.5 w-1.5 rounded-full bg-white/80"
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
          open for work
        </span>
      </motion.div>

      {/* ── Headline block — transparent to pointer so the ASCII canvas gets hover ── */}
      <motion.div
        className="pointer-events-none relative z-10 my-10 md:my-12"
        style={{ x: px, y: py }}
      >


        <h1 className="flex flex-col">
          <HeadlineLine delay={0.15}>Design</HeadlineLine>
          <HeadlineLine delay={0.3} outline>
            Build
          </HeadlineLine>
          <HeadlineLine delay={0.45}>
            Ship<span className="text-white/30">.</span>
          </HeadlineLine>
        </h1>

        {/* Under-headline row: self-drawing rule + intro copy + CTA */}
        <div className="mt-8 grid grid-cols-1 gap-8 md:mt-10 md:grid-cols-12">
          <motion.div
            className="h-px origin-left bg-white/25 md:col-span-12"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.9, duration: 1.2, ease: EASE }}
          />
          <motion.p
            className="max-w-sm text-[15px] leading-relaxed text-white/50 md:col-span-5"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.9, ease: EASE }}
          >
            I craft immersive digital experiences where motion, type and code
            collide — pixel-obsessed, performance-first, and shipped with care.
          </motion.p>
          <motion.div
            className="flex items-start md:col-span-7 md:justify-end"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.25, duration: 0.9, ease: EASE }}
          >
            <a
              href="#work"
              data-cursor="link"
              className="pointer-events-auto group flex items-center gap-3 font-mono text-[11px] tracking-[0.25em] text-white/60 uppercase transition-colors hover:text-white"
            >
              selected work
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 transition-colors group-hover:border-white/60">
                <motion.svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  animate={{ y: [0, 3, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                >
                  <path
                    d="M6 1v10M2 7l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                </motion.svg>
              </span>
            </a>
          </motion.div>
        </div>
      </motion.div>

      {/* ── Bottom row — typewriter role line + coordinates meta ── */}
      <div className="pointer-events-none relative z-10 flex flex-col gap-6 pb-8 md:flex-row md:items-end md:justify-between">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8, ease: EASE }}
          className="h-7"
        >
          <Typewriter
            texts={["react apps", "web animations", "design systems", "creative code"]}
            prefix="creative developer — "
            ease={{ type: "tween" as const, duration: 0.06, delay: 1.6, ease: "easeInOut" as const }}
            deleteSpeed={0.04}
            showCursor
            hideCursorOnType
            cursorChar="_"
            color="var(--text-faint)"
            typedColor="var(--text)"
            cursorColor="var(--text-dim)"
            font={{
              fontFamily: '"DM Mono", ui-monospace, monospace',
              fontSize: 15,
              lineHeight: "1.4em",
              letterSpacing: "-0.01em",
            }}
          />
        </motion.div>

        <motion.div
          className="flex items-center gap-3 font-mono text-[11px] tracking-[0.2em] text-white/40 uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          <span>portfolio</span>
          <span className="sep-dot" />
          <span>2026</span>
          <span className="sep-dot" />
          <span>worldwide</span>
        </motion.div>
      </div>
    </section>
  );
}

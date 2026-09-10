import { useCallback, useEffect, useRef, useState } from "react";
import DrawLine from "./DrawLine";
import GhostWord from "./GhostWord";

interface Project {
  id: string;
  name: string;
  category: string;
  year: string;
  tech: string[];
  video: string;
  url: string;
  description: string;
}



const THE_ELITE: Project[] = [
  {
    id: "01",
    name: "Cupid's Natural Farm",
    category: "Brand / Landing",
    year: "2026",
    tech: ["React", "Tailwind", "Framer Motion"],
    video: "/videos/cupidsnaturalfarm.in.mp4",
    url: "https://www.cupidsnaturalfarm.in/",
    description: "Organic farm brand website with earthy aesthetics and smooth page transitions",
  },
  {
    id: "02",
    name: "TekiArtz",
    category: "Creative Agency",
    year: "2024",
    tech: ["React", "GSAP", "Three.js"],
    video: "/videos/Tekiartz.com.mp4",
    url: "https://www.tekiartz.com/",
    description: "Creative agency website with immersive 3D animations and scroll-driven interactions",
  },
  {
    id: "04",
    name: "Grand Theft Auto VI",
    category: "Game / Landing",
    year: "2024",
    tech: ["React", "GSAP", "Three.js"],
    video: "/videos/Vice city.mp4",
    url: "https://grand-theft-auto-vi-rockstar.onrender.com/",
    description: "GTA VI fan tribute with immersive 3D city, parallax scrolling, and cinematic atmosphere",
  },
  {
    id: "08",
    name: "The Elite Portfolio",
    category: "Creative Portfolio",
    year: "2024",
    tech: ["React", "GSAP", "WebGL"],
    video: "/videos/grilli.mp4",
    url: "https://the-elite-portfolio.onrender.com/",
    description: "Curated showcase of elite creative work with cinematic transitions and scroll artistry",
  },
];

const OTHER_PROJECTS: Project[] = [
  {
    id: "06",
    name: "Apple Vision",
    category: "Product Clone",
    year: "2024",
    tech: ["JavaScript", "GSAP", "CSS"],
    video: "/videos/apple.mp4",
    url: "https://666464d6971505e9081bdacf--melodious-meerkat-be1be5.netlify.app/",
    description: "Apple Vision Pro landing page clone with smooth scroll animations and product showcase",
  },
  {
    id: "07",
    name: "Zara Clone",
    category: "E-Commerce",
    year: "2024",
    tech: ["React", "Chakra UI", "Router"],
    video: "/videos/zara.mp4",
    url: "https://661afcc99f80c4cbed326086--preeminent-moxie-bf9403.netlify.app/",
    description: "Full-featured Zara e-commerce clone with auth, product listing, and shopping bag",
  },
  {
    id: "03",
    name: "Grilli Restaurants",
    category: "Restaurant / UI",
    year: "2023",
    tech: ["HTML", "CSS", "JavaScript"],
    video: "/videos/grilli.mp4",
    url: "https://github.com/Sayeed613/Grilli-Restaurants",
    description: "Premium restaurant landing page with parallax scrolling and elegant typography",
  },
];


function SectionLabel({ label }: { label: string }) {
  return (
    <div className="mb-6 mt-16 flex items-center gap-4 first:mt-0 md:mb-8 md:mt-20">
      <span className="font-mono text-[11px] tracking-[0.25em] text-[var(--accent)] uppercase">
        {label}
      </span>
      <div className="h-px flex-1 bg-white/[0.06]" />
    </div>
  );
}

/**
 * Selected Work — editorial project index with video previews.
 * Hovering a row plays the project video in a cursor-following preview card.
 */
export default function Work() {
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const cardX = useRef(0);
  const cardY = useRef(0);
  const rafId = useRef(0);

  // Smooth card follow with requestAnimationFrame
  const animateCard = useCallback(() => {
    cardX.current += (mouseX.current - cardX.current) * 0.15;
    cardY.current += (mouseY.current - cardY.current) * 0.15;
    if (cardRef.current) {
      cardRef.current.style.transform = `translate(${cardX.current - 208}px, ${cardY.current - 117}px)`;
    }
    rafId.current = requestAnimationFrame(animateCard);
  }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mouseX.current = e.clientX;
      mouseY.current = e.clientY;
    };
    window.addEventListener("mousemove", onMouseMove);
    rafId.current = requestAnimationFrame(animateCard);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafId.current);
    };
  }, [animateCard]);

  const handleEnter = (project: Project) => {
    setActiveProject(project);
    if (videoRef.current) {
      videoRef.current.src = project.video;
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  };

  const handleLeave = () => {
    setActiveProject(null);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.removeAttribute("src");
      videoRef.current.load();
    }
  };

  const renderRow = (project: Project) => (
    <div key={project.id}>
      <DrawLine color="bg-white/[0.08]" />
      <a
        href={project.url}
        target="_blank"
        rel="noreferrer"
        onMouseEnter={() => handleEnter(project)}
        onMouseLeave={handleLeave}
        data-cursor="view"
        className="group flex cursor-pointer items-center justify-between gap-4 py-8 md:py-10"
      >
        <div className="flex items-baseline gap-5 md:gap-8">
          <span className="font-mono text-[11px] text-white/30 transition-colors duration-300 group-hover:text-[var(--accent)]">
            {project.id}
          </span>
          <h3 className="font-body text-[clamp(1.6rem,4.5vw,3.6rem)] font-light leading-none tracking-[-0.02em] text-white/50 transition-all duration-500 group-hover:translate-x-3 group-hover:text-white">
            {project.name}
          </h3>
        </div>
        <div className="flex shrink-0 items-center gap-4 md:gap-8">
          <span className="hidden font-mono text-[11px] text-white/30 lg:inline">
            {project.category}
          </span>
          <span className="font-mono text-[11px] text-white/30">
            {project.year}
          </span>
          <span className="text-white/30 transition-all duration-500 group-hover:rotate-45 group-hover:text-white">
            ↗
          </span>
        </div>
      </a>
    </div>
  );

  return (
    <>
      {/* Hidden video for preloading */}
      <video ref={videoRef} className="hidden" muted loop playsInline preload="none" />

      {/* Fixed video preview card — outside all sections, always on top */}
      <div
        ref={cardRef}
        className="pointer-events-none fixed left-0 top-0 z-[200] overflow-hidden rounded-xl border border-white/10"
        style={{
          width: 416,
          height: 234,
          opacity: activeProject ? 1 : 0,
          scale: activeProject ? "1" : "0.6",
          transition: "opacity 0.3s ease, scale 0.3s ease",
        }}
      >
        {activeProject && (
          <>
            <video
              key={activeProject.video}
              src={activeProject.video}
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-between p-5">
              <span className="font-mono text-[10px] tracking-[0.2em] text-white/60 uppercase">
                {activeProject.category}
              </span>
              <div>
                <p className="text-[13px] leading-relaxed text-white/70">
                  {activeProject.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {activeProject.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-white/10 px-2.5 py-0.5 font-mono text-[9px] text-white/70 backdrop-blur-sm"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <section id="work" className="relative px-6 py-28 md:px-10 md:py-44">
        <GhostWord
          text="Work"
          stroke="var(--ghost)"
          className="top-24 right-0"
        />
        <div className="flex items-baseline justify-between font-mono text-[11px] tracking-[0.2em] text-white/40 uppercase">
          <span>( 02 — selected work )</span>
          <span>2023 — 2026</span>
        </div>

        <DrawLine className="my-8 md:my-10" color="bg-white/[0.08]" />



        {/* === THE ELITE === */}
        <SectionLabel label="The Elite" />
        {THE_ELITE.map((p) => renderRow(p))}

        {/* === OTHER === */}
        <SectionLabel label="Other" />
        {OTHER_PROJECTS.map((p) => renderRow(p))}



        <DrawLine color="bg-white/[0.08]" />

        <div className="mt-12 flex justify-center md:justify-start">
          <a
            href="https://github.com/Sayeed613"
            target="_blank"
            rel="noreferrer"
            data-cursor="link"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 font-mono text-[12px] tracking-[0.05em] text-white/50 transition-all duration-300 hover:border-[var(--accent)] hover:text-white"
          >
            view all projects
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </a>
        </div>
      </section>
    </>
  );
}

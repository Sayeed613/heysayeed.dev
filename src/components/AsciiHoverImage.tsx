"use client";

import { useEffect, useRef } from "react";

type Props = {
  src: string;
  alt?: string;
};

const CHARS = " .·:+*#@";

export default function AsciiHoverImage({ src, alt = "" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const targetRef = useRef(0);
  const progressRef = useRef(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;

    if (!canvas || !wrapper) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const image = new Image();
    image.src = src;
    imageRef.current = image;

    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      const rect = wrapper.getBoundingClientRect();

      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      if (!image.complete || !image.naturalWidth) {
        animationRef.current = requestAnimationFrame(draw);
        return;
      }

      progressRef.current +=
        (targetRef.current - progressRef.current) * 0.09;

      const progress = progressRef.current;

      ctx.clearRect(0, 0, width, height);

      /*
       * Normal image layer.
       * It fades away as ASCII takes over.
       */
      ctx.save();
      ctx.globalAlpha = 1 - progress;
      drawCoverImage(ctx, image, width, height);
      ctx.restore();

      /*
       * ASCII layer.
       */
      if (progress > 0.01) {
        drawAscii(ctx, image, width, height, progress);
      }

      /*
       * Keep animating while transitioning.
       */
      if (
        Math.abs(targetRef.current - progressRef.current) > 0.001
      ) {
        animationRef.current = requestAnimationFrame(draw);
      }
    };

    const drawCoverImage = (
      context: CanvasRenderingContext2D,
      img: HTMLImageElement,
      w: number,
      h: number
    ) => {
      const scale = Math.max(
        w / img.naturalWidth,
        h / img.naturalHeight
      );

      const drawW = img.naturalWidth * scale;
      const drawH = img.naturalHeight * scale;

      const x = (w - drawW) / 2;
      const y = (h - drawH) / 2;

      context.drawImage(img, x, y, drawW, drawH);
    };

    const drawAscii = (
      context: CanvasRenderingContext2D,
      img: HTMLImageElement,
      w: number,
      h: number,
      amount: number
    ) => {
      /*
       * Smaller cell = more detailed face.
       */
      const cell = Math.max(5, 8 - amount * 2);

      const cols = Math.ceil(w / cell);
      const rows = Math.ceil(h / cell);

      const offscreen = document.createElement("canvas");
      const offCtx = offscreen.getContext("2d");

      if (!offCtx) return;

      offscreen.width = cols;
      offscreen.height = rows;

      const scale = Math.max(
        w / img.naturalWidth,
        h / img.naturalHeight
      );

      const drawW = img.naturalWidth * scale;
      const drawH = img.naturalHeight * scale;

      const x = (w - drawW) / 2;
      const y = (h - drawH) / 2;

      offCtx.drawImage(
        img,
        x / cell,
        y / cell,
        drawW / cell,
        drawH / cell
      );

      const data = offCtx.getImageData(
        0,
        0,
        cols,
        rows
      ).data;

      context.save();

      /*
       * Red/orange ASCII to match your portfolio.
       */
      context.font = `${cell}px monospace`;
      context.textAlign = "center";
      context.textBaseline = "middle";

      const mouseX = mouseRef.current.x * w;
      const mouseY = mouseRef.current.y * h;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const index = (row * cols + col) * 4;

          const r = data[index];
          const g = data[index + 1];
          const b = data[index + 2];

          /*
           * Perceived brightness.
           */
          const brightness =
            (r * 0.299 + g * 0.587 + b * 0.114) / 255;

          /*
           * Dark pixels = dense characters.
           * Bright pixels = lighter characters.
           */
          const charIndex = Math.floor(
            (1 - brightness) * (CHARS.length - 1)
          );

          const char = CHARS[charIndex];

          if (char === " ") continue;

          const px = col * cell + cell / 2;
          const py = row * cell + cell / 2;

          /*
           * Cursor distortion.
           */
          const dx = px - mouseX;
          const dy = py - mouseY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          const influence = Math.max(
            0,
            1 - distance / 180
          );

          const offsetX =
            Math.sin(row * 0.35 + performance.now() * 0.002) *
            influence *
            2;

          const offsetY =
            Math.cos(col * 0.25 + performance.now() * 0.0015) *
            influence *
            2;

          const alpha =
            Math.min(
              1,
              amount * 1.4 + influence * 0.3
            );

          context.globalAlpha = alpha;

          /*
           * Mostly orange/red, with some white highlights.
           */
          const highlight = brightness > 0.65;

          context.fillStyle = highlight
            ? "rgba(255, 120, 80, 0.9)"
            : "rgba(255, 74, 31, 0.78)";

          context.fillText(
            char,
            px + offsetX,
            py + offsetY
          );
        }
      }

      context.restore();
    };

    const handleEnter = () => {
      targetRef.current = 1;

      if (!animationRef.current) {
        animationRef.current = requestAnimationFrame(draw);
      }
    };

    const handleLeave = () => {
      targetRef.current = 0;

      if (!animationRef.current) {
        animationRef.current = requestAnimationFrame(draw);
      }
    };

    const handleMove = (event: PointerEvent) => {
      const rect = wrapper.getBoundingClientRect();

      mouseRef.current.x =
        (event.clientX - rect.left) / rect.width;

      mouseRef.current.y =
        (event.clientY - rect.top) / rect.height;

      if (!animationRef.current) {
        animationRef.current = requestAnimationFrame(draw);
      }
    };

    image.onload = () => {
      resize();
      draw();
    };

    wrapper.addEventListener("pointerenter", handleEnter);
    wrapper.addEventListener("pointerleave", handleLeave);
    wrapper.addEventListener("pointermove", handleMove);

    window.addEventListener("resize", resize);

    return () => {
      wrapper.removeEventListener("pointerenter", handleEnter);
      wrapper.removeEventListener("pointerleave", handleLeave);
      wrapper.removeEventListener("pointermove", handleMove);

      window.removeEventListener("resize", resize);

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [src]);

  return (
    <div
      ref={wrapperRef}
      className="relative h-full min-h-[420px] w-full overflow-hidden bg-black"
    >
      <img
        src={src}
        alt={alt}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />

      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full"
      />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_30%,rgba(0,0,0,0.35)_100%)]" />
    </div>
  );
}
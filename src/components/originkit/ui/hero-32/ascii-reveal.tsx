"use client";

import { useEffect, useRef, type CSSProperties } from "react";

const DEFAULT_IMAGE =
    "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/e4476503-c1e3-4358-3ff6-539deda1f800/w=800";

type ColorMode = "mono" | "image";
type Fit = "cover" | "contain";

interface RevealOptions {
    size: number;
    softness: number;
}

const DEFAULTS = {
    fit: "cover" as Fit,
    focusY: 19,
    columns: 200,
    ramp: " .:-=+*#%@",
    invert: false,
    contrast: 100,
    colorMode: "mono" as ColorMode,
    inkColor: "#FFFFFF",
    reveal: true,
    revealOptions: { size: 80, softness: 16 } as RevealOptions,
};

const contrastAt = (value: number) => 0.5 + (value / 100) * 2;

const clampFocus = (value: number) =>
    Math.min(100, Math.max(0, typeof value === "number" ? value : 50));

function placeRect(
    imgW: number,
    imgH: number,
    boxW: number,
    boxH: number,
    fit: Fit,
    focusY: number
) {
    const scale =
        fit === "contain"
            ? Math.min(boxW / imgW, boxH / imgH)
            : Math.max(boxW / imgW, boxH / imgH);
    const dw = imgW * scale;
    const dh = imgH * scale;
    const f = fit === "cover" ? clampFocus(focusY) / 100 : 0.5;
    return { dx: (boxW - dw) / 2, dy: (boxH - dh) * f, dw, dh };
}

interface AsciiImageProps {
    image?: { src: string; srcSet?: string; alt?: string } | string;
    fit?: Fit;
    focusY?: number;
    columns?: number;
    ramp?: string;
    invert?: boolean;
    contrast?: number;
    colorMode?: ColorMode;
    inkColor?: string;
    reveal?: boolean;
    /** When true, the photo reveal keeps drifting on its own while the
     *  pointer is away, instead of hiding until hover. */
    autoReveal?: boolean;
    /** When true, tapping/pressing the canvas reveals the full photo for a
     *  moment, then dissolves back to its previous state. */
    tapReveal?: boolean;
    /** When true, the ASCII art resolves in progressively on load — like a
     *  scramble-text decode, but using the art's own characters. */
    decodeOnLoad?: boolean;
    /** Decode duration in ms. */
    decodeDuration?: number;
    revealOptions?: RevealOptions;
    style?: CSSProperties;
}

function resolveImageSrc(image: unknown): string | undefined {
    if (!image) return undefined;
    if (typeof image === "string") return image.trim() || undefined;
    return (image as { src?: string }).src || undefined;
}

export default function AsciiImage(props: AsciiImageProps) {
    const {
        image,
        fit = DEFAULTS.fit,
        focusY = DEFAULTS.focusY,
        columns = DEFAULTS.columns,
        ramp = DEFAULTS.ramp,
        invert = DEFAULTS.invert,
        contrast = DEFAULTS.contrast,
        colorMode = DEFAULTS.colorMode,
        inkColor = DEFAULTS.inkColor,
        reveal = DEFAULTS.reveal,
        autoReveal = false,
        tapReveal = false,
        decodeOnLoad = false,
        decodeDuration = 3200,
        revealOptions = DEFAULTS.revealOptions,
        style,
    } = props;

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const offRef = useRef<HTMLCanvasElement | null>(null);
    const samplerRef = useRef<HTMLCanvasElement | null>(null);
    const imgRef = useRef<HTMLImageElement | null>(null);
    const revealRef = useRef<HTMLCanvasElement | null>(null);
    const maskRef = useRef<HTMLCanvasElement | null>(null);
    const blobsRef = useRef<Array<{ x: number; y: number }>>([]);
    const seededRef = useRef(false);
    const pointer = useRef({ x: -9999, y: -9999, inside: false });
    const autoRef = useRef(autoReveal);
    autoRef.current = autoReveal;
    const tapRef = useRef(tapReveal);
    tapRef.current = tapReveal;
    // Timestamp (performance.now) until which the full-photo reveal holds.
    const tapUntilRef = useRef(0);
    const decodeRef = useRef(decodeOnLoad);
    decodeRef.current = decodeOnLoad;
    const decodeDurationRef = useRef(decodeDuration);
    decodeDurationRef.current = decodeDuration;

    const src = resolveImageSrc(image) || DEFAULT_IMAGE;
    const revealSize = revealOptions?.size ?? DEFAULTS.revealOptions.size;
    const revealSoftness =
        revealOptions?.softness ?? DEFAULTS.revealOptions.softness;

    useEffect(() => {
        const canvasEl = canvasRef.current;
        if (!canvasEl) return;
        const context = canvasEl.getContext("2d");
        if (!context) return;
        const canvas: HTMLCanvasElement = canvasEl;
        const ctx: CanvasRenderingContext2D = context;

        const chars = ramp && ramp.length > 0 ? ramp : DEFAULTS.ramp;
        const punch = contrastAt(contrast);

        let raf = 0;
        let alive = true;
        let coverRect = { dx: 0, dy: 0, dw: 0, dh: 0 };

        // ── Decode intro state ──
        // startMs: when the decode began; grid: sampler geometry; jitter: a
        // per-column random offset so the frontier flickers like scramble.
        let decodeStart = -1;
        let decodeDone = !decodeOnLoad;
        let grid = { cols: 0, cellW: 1 };
        let jitter: number[] = [];
        const DECODE_FADE = 520; // per-column fade-in time

        const BLOB_COUNT = 5;
        blobsRef.current = Array.from({ length: BLOB_COUNT }, () => ({
            x: 0,
            y: 0,
        }));
        seededRef.current = false;

        function getSize() {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const w = canvas.clientWidth || 600;
            const h = canvas.clientHeight || 600;
            return { w, h, dpr };
        }

        function buildAscii() {
            const img = imgRef.current;
            if (!img) return;
            const { w, h, dpr } = getSize();
            canvas.width = Math.max(1, Math.round(w * dpr));
            canvas.height = Math.max(1, Math.round(h * dpr));

            const cols = Math.max(8, Math.round(columns));
            const cellW = (w * dpr) / cols;
            const fontPx = cellW * 1.7;
            const cellH = fontPx;
            const rows = Math.max(1, Math.floor((h * dpr) / cellH));

            let sampler = samplerRef.current;
            if (!sampler) {
                sampler = document.createElement("canvas");
                samplerRef.current = sampler;
            }
            sampler.width = cols;
            sampler.height = rows;
            const sctx = sampler.getContext("2d", { willReadFrequently: true });
            if (!sctx) return;

            const place = placeRect(
                img.width,
                img.height,
                canvas.width,
                canvas.height,
                fit,
                focusY
            );
            sctx.clearRect(0, 0, cols, rows);
            sctx.drawImage(
                img,
                place.dx / cellW,
                place.dy / cellH,
                place.dw / cellW,
                place.dh / cellH
            );

            let data: Uint8ClampedArray;
            try {
                data = sctx.getImageData(0, 0, cols, rows).data;
            } catch (e) {
                imgRef.current = null;
                return;
            }

            let off = offRef.current;
            if (!off) {
                off = document.createElement("canvas");
                offRef.current = off;
            }
            off.width = canvas.width;
            off.height = canvas.height;
            const octx = off.getContext("2d");
            if (!octx) return;
            octx.clearRect(0, 0, off.width, off.height);
            octx.font = fontPx.toFixed(2) + "px ui-monospace, monospace";
            octx.textBaseline = "top";

            const last = chars.length - 1;
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const i = (r * cols + c) * 4;
                    const rr = data[i];
                    const gg = data[i + 1];
                    const bb = data[i + 2];
                    let lum = (0.299 * rr + 0.587 * gg + 0.114 * bb) / 255;
                    lum = (lum - 0.5) * punch + 0.5;
                    if (invert) lum = 1 - lum;
                    lum = lum < 0 ? 0 : lum > 1 ? 1 : lum;
                    const ch = chars[Math.round(lum * last)];
                    if (ch === " ") continue;
                    octx.fillStyle =
                        colorMode === "image"
                            ? `rgb(${Math.min(255, rr + 30)}, ${Math.min(
                                  255,
                                  gg + 30
                              )}, ${Math.min(255, bb + 30)})`
                            : inkColor;
                    octx.fillText(ch, c * cellW, r * cellH);
                }
            }

            coverRect = place;
            grid = { cols, cellW };
            // One jitter value per column, so the resolve frontier is ragged
            // and flickers — scramble-style — as it sweeps left to right.
            jitter = Array.from(
                { length: cols },
                () => Math.random() * (decodeDurationRef.current * 0.28)
            );
            if (decodeOnLoad && decodeStart < 0) decodeStart = performance.now();
        }

        function ensureLayer(ref: { current: HTMLCanvasElement | null }) {
            let layer = ref.current;
            if (!layer) {
                layer = document.createElement("canvas");
                ref.current = layer;
            }
            if (
                layer.width !== canvas.width ||
                layer.height !== canvas.height
            ) {
                layer.width = canvas.width;
                layer.height = canvas.height;
            }
            return layer;
        }

        function updateBlobs() {
            const blobs = blobsRef.current;
            if (blobs.length === 0) return;
            const { w, h, dpr } = getSize();
            // Idle drift: a slow figure-eight path around the frame so the
            // reveal keeps travelling when the pointer is away.
            let tx = pointer.current.x;
            let ty = pointer.current.y;
            if (!pointer.current.inside && autoRef.current) {
                const t = performance.now();
                tx = w * (0.5 + 0.34 * Math.sin(t * 0.00030));
                ty = h * (0.48 + 0.3 * Math.sin(t * 0.00021 + 1.7));
            }
            const TX = tx * dpr;
            const TY = ty * dpr;
            if (!seededRef.current) {
                for (const blob of blobs) {
                    blob.x = TX;
                    blob.y = TY;
                }
                seededRef.current = true;
                return;
            }
            blobs[0].x += (TX - blobs[0].x) * 0.35;
            blobs[0].y += (TY - blobs[0].y) * 0.35;
            for (let i = 1; i < blobs.length; i++) {
                blobs[i].x += (blobs[i - 1].x - blobs[i].x) * 0.35;
                blobs[i].y += (blobs[i - 1].y - blobs[i].y) * 0.35;
            }
        }

        function paint() {
            const off = offRef.current;
            if (!off) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // ── Decode intro: columns of the true art resolve in over time.
            // Chars are the final ASCII glyphs — no letters, just the art.
            if (!decodeDone) {
                const now = performance.now();
                const elapsed = now - decodeStart;
                const total = decodeDurationRef.current;
                let allIn = true;
                for (let c = 0; c < grid.cols; c++) {
                    const birth = (c / grid.cols) * (total - DECODE_FADE) + jitter[c];
                    const a = Math.min(1, Math.max(0, (elapsed - birth) / DECODE_FADE));
                    if (a <= 0) {
                        allIn = false;
                        continue;
                    }
                    if (a < 1) {
                        allIn = false;
                        // Frontier flicker: the column strobes as it settles.
                        const flicker = 0.55 + 0.45 * Math.sin(elapsed * 0.045 + c);
                        ctx.globalAlpha = a * (0.55 + 0.45 * flicker);
                    } else {
                        ctx.globalAlpha = 1;
                    }
                    const sx = c * grid.cellW;
                    ctx.drawImage(off, sx, 0, grid.cellW, off.height, sx, 0, grid.cellW, off.height);
                }
                ctx.globalAlpha = 1;
                if (allIn) decodeDone = true;
                return;
            }

            ctx.drawImage(off, 0, 0);

            const img = imgRef.current;
            if (!reveal || !img) return;

            const now = performance.now();
            const tapping = tapUntilRef.current > now;
            if (!pointer.current.inside && !autoRef.current && !tapping) return;

            const { dpr } = getSize();
            const blobs = blobsRef.current;
            const photo = ensureLayer(revealRef);
            const pctx = photo.getContext("2d");
            const mask = ensureLayer(maskRef);
            const mctx = mask.getContext("2d");
            if (!pctx || !mctx) return;

            pctx.globalCompositeOperation = "source-over";
            pctx.clearRect(0, 0, photo.width, photo.height);
            pctx.drawImage(
                img,
                coverRect.dx,
                coverRect.dy,
                coverRect.dw,
                coverRect.dh
            );

            // Tap reveal: the full photo takes over the frame, then fades
            // back to ASCII across the final stretch of the tap window.
            if (tapping) {
                const remain = (tapUntilRef.current - now) / 450;
                const alpha = Math.min(1, Math.max(0, remain));
                ctx.save();
                ctx.globalAlpha = alpha;
                ctx.drawImage(photo, 0, 0);
                ctx.restore();
                return;
            }

            mctx.clearRect(0, 0, mask.width, mask.height);
            mctx.save();
            mctx.filter = `blur(${(revealSoftness * dpr).toFixed(1)}px)`;
            mctx.fillStyle = "#FFFFFF";
            for (let i = 0; i < blobs.length; i++) {
                const t = blobs.length <= 1 ? 0 : i / (blobs.length - 1);
                const radius = revealSize * dpr * (1 - t * 0.5);
                mctx.beginPath();
                mctx.arc(blobs[i].x, blobs[i].y, radius, 0, Math.PI * 2);
                mctx.fill();
            }
            mctx.restore();

            pctx.globalCompositeOperation = "destination-in";
            pctx.drawImage(mask, 0, 0);
            pctx.globalCompositeOperation = "source-over";
            ctx.drawImage(photo, 0, 0);
        }

        function loop() {
            if (!alive) return;
            updateBlobs();
            paint();
            // Keep animating while there is motion to draw: hover/auto blob,
            // the decode intro, or a tap reveal in flight.
            if (
                reveal ||
                !decodeDone ||
                tapUntilRef.current > performance.now()
            ) {
                raf = requestAnimationFrame(loop);
            }
        }

        function onMove(event: PointerEvent) {
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            pointer.current.x = x;
            pointer.current.y = y;
            pointer.current.inside =
                x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
        }
        function onLeave() {
            pointer.current.inside = false;
            // In auto mode the blob keeps travelling, so don't snap it back
            // to the pointer's last known position on re-entry.
            if (!autoRef.current) seededRef.current = false;
        }

        function onDown() {
            if (!tapRef.current) return;
            // Full-photo reveal holds ~1.5s, then dissolves back.
            tapUntilRef.current = performance.now() + 1500;
        }

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            if (!alive) return;
            imgRef.current = img;
            buildAscii();
            paint();
            if (reveal || decodeOnLoad || tapReveal)
                raf = requestAnimationFrame(loop);
        };
        if (src) img.src = src;

        let ro: ResizeObserver | null = null;
        if (typeof ResizeObserver !== "undefined") {
            ro = new ResizeObserver(() => {
                buildAscii();
                paint();
            });
            ro.observe(canvas);
        }
        canvas.addEventListener("pointermove", onMove);
        canvas.addEventListener("pointerleave", onLeave);
        canvas.addEventListener("pointerdown", onDown);

        return () => {
            alive = false;
            cancelAnimationFrame(raf);
            ro?.disconnect();
            canvas.removeEventListener("pointermove", onMove);
            canvas.removeEventListener("pointerleave", onLeave);
            canvas.removeEventListener("pointerdown", onDown);
        };
    }, [
        src,
        fit,
        focusY,
        columns,
        ramp,
        invert,
        contrast,
        colorMode,
        inkColor,
        reveal,
        autoReveal,
        tapReveal,
        decodeOnLoad,
        decodeDuration,
        revealSize,
        revealSoftness,
    ]);

    return (
        <canvas
            ref={canvasRef}
            aria-label={
                typeof image === "object"
                    ? (image?.alt ?? "ASCII art")
                    : "ASCII art"
            }
            data-cursor={tapReveal ? "tap" : undefined}
            style={{
                ...style,
                display: "block",
                width: "100%",
                height: "100%",
                cursor: reveal ? "crosshair" : "default",
            }}
        />
    );
}
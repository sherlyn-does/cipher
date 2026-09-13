"use client";

// Font: monospace + Arial Black for the sampled wordmark — both system fonts,
// so this component is fully self-contained: no images, no external libraries.
// All styles live in the injected <style> block below. Paste into any React app.
//
// To use your custom matrix.ttf instead of Arial Black for the sampled word,
// see the note above `sampleWordIntoCells()` below.

import { useEffect, useRef } from "react";

/* ───────────────────────────────────────────────────────────────────────────
   CIPHER LOGO — an interactive ASCII wordmark.

   The word "CIPHER" is rasterised into a dense grid of monospace glyphs on a
   single <canvas>: each lit cell flickers through a character set (with the
   brand letters mixed in) so the logo shimmers like a terminal. The cursor acts
   as a force field — lit glyphs near the pointer are shoved outward on a spring
   and ease back, tinted toward the accent (phosphor green) as they scatter.

   Driven by one hand-rolled requestAnimationFrame loop writing straight to the
   canvas (no per-frame React re-render). Honours prefers-reduced-motion by
   holding a calm, static frame (no flicker, no physics).

   SIZE & PLACEMENT: this is built to sit centered wherever you drop it. Control
   how big it reads via the `height` prop (default fills the viewport, for use
   as the homepage hero). Drop it in your root layout above `{children}` at a
   shorter fixed height (e.g. height="45vh") if you want it present and large
   at the top of *every* page rather than only the homepage.
   ─────────────────────────────────────────────────────────────────────────── */

// Flicker glyph set — the brand letters are folded in so the wordmark shimmers
// with its own characters.
const ASCII_CHARS = ".:-+*=#%@CIPHER";
const THRESHOLD = 0.5; // brightness above which a sampled cell is "lit"
const PUSH_RADIUS = 10; // cursor influence, in cell units — wide, lively wake
const PUSH_FORCE = 42; // outward shove per frame on cells in range
const TURB = 5.5; // continuous turbulence so glyphs keep flowing while hovered
const SPRING = 0.025;
const DAMPING = 0.5;

const GRID_COLOR = "#0a1a0d"; // the resting dot grid — dim green-black
const CHAR_COLOR = [140, 255, 170]; // calm phosphor-green glyph at rest
const ACCENT_COLOR = [0, 255, 65]; // bright Matrix green as glyphs scatter

const css = `
.cl-root{
  position:relative;
  width:100%;
  overflow:hidden;
  background:radial-gradient(130% 120% at 50% 38%,#060a07 0%,#040604 60%,#020302 100%);
  font-family:'Space Grotesk','Inter',system-ui,sans-serif;
  cursor:crosshair;
}
.cl-canvas{position:absolute;inset:0;display:block;width:100%;height:100%;}
`;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

type CipherLogoProps = {
  /** CSS height for the block — e.g. "100vh" for a full-bleed hero, or a
   * fixed value like "45vh" / "400px" to reuse this as a persistent header
   * logo on every page. Defaults to a full-viewport hero. */
  height?: string;
};

export default function CipherLogo({ height = "100vh" }: CipherLogoProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0;
    let H = 0;
    let CELL_SIZE = 8;
    let CELL_GAP = 2;
    let CELL_STEP = 10;
    let cols = 0;
    let rows = 0;

    type Cell = {
      col: number;
      row: number;
      char: string;
      isLit: boolean;
      offsetX: number;
      offsetY: number;
      velX: number;
      velY: number;
    };
    let cells: Cell[] = [];

    // `active` = the cursor is hovering the stage, so the push field is live
    // even when the pointer holds still (no movement required).
    const mouse = { col: -999, row: -999, active: false };

    function setupCanvas() {
      const rect = root!.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      const small = W < 768;
      CELL_SIZE = small ? 3 : 8;
      CELL_GAP = small ? 1 : 2;
      CELL_STEP = CELL_SIZE + CELL_GAP;
      cols = Math.floor(W / CELL_STEP);
      rows = Math.floor(H / CELL_STEP);
      canvas!.width = W * dpr;
      canvas!.height = H * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // Rasterise the word "CIPHER" into a low-res brightness map, one sample
    // per grid cell, then mark the lit cells and seed each with a glyph.
    //
    // To use matrix.ttf here instead of Arial Black: load it with the CSS
    // Font Loading API before calling rebuild(), e.g.
    //   const face = new FontFace("Matrix", "url(/fonts/matrix.ttf)");
    //   face.load().then((f) => { document.fonts.add(f); rebuild(); });
    // then swap the `font` helper below to use `'Matrix'` instead of
    // 'Arial Black'. Canvas text only renders correctly once the font has
    // actually finished loading, so the rebuild must happen in that .then().
    function sampleWordIntoCells() {
      const boxW = Math.min(W * 0.82, 1100);
      const boxH = boxW * 0.24;
      const startCol = Math.floor((W - boxW) / 2 / CELL_STEP);
      const startRow = Math.floor((H - boxH) / 2 / CELL_STEP);
      const logoCols = Math.max(1, Math.ceil(boxW / CELL_STEP));
      const logoRows = Math.max(1, Math.ceil(boxH / CELL_STEP));

      // 1) draw the word large (crisp), white on black.
      const text = document.createElement("canvas");
      text.width = Math.max(2, Math.round(boxW));
      text.height = Math.max(2, Math.round(boxH));
      const tctx = text.getContext("2d")!;
      tctx.fillStyle = "#000";
      tctx.fillRect(0, 0, text.width, text.height);
      tctx.fillStyle = "#fff";
      tctx.textAlign = "center";
      tctx.textBaseline = "middle";
      const word = "CIPHER";
      let fs = text.height * 0.92;
      const font = (s: number) =>
        `bold ${s}px 'Arial Black','Helvetica Neue',Arial,sans-serif`;
      tctx.font = font(fs);
      while (tctx.measureText(word).width > text.width * 0.96 && fs > 4) {
        fs -= 2;
        tctx.font = font(fs);
      }
      tctx.fillText(word, text.width / 2, text.height / 2 + fs * 0.02);

      // 2) downsample to one pixel per cell.
      const sample = document.createElement("canvas");
      sample.width = logoCols;
      sample.height = logoRows;
      const sctx = sample.getContext("2d")!;
      sctx.fillStyle = "#000";
      sctx.fillRect(0, 0, logoCols, logoRows);
      sctx.drawImage(text, 0, 0, logoCols, logoRows);
      const { data } = sctx.getImageData(0, 0, logoCols, logoRows);

      cells = [];
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const inLogo =
            col >= startCol &&
            col < startCol + logoCols &&
            row >= startRow &&
            row < startRow + logoRows;
          let isLit = false;
          let char = " ";
          if (inLogo) {
            const idx = ((row - startRow) * logoCols + (col - startCol)) * 4;
            const brightness =
              (data[idx] * 0.299 +
                data[idx + 1] * 0.587 +
                data[idx + 2] * 0.114) /
              255;
            isLit = brightness > THRESHOLD;
            char = isLit
              ? ASCII_CHARS[
                  Math.min(
                    ASCII_CHARS.length - 1,
                    Math.floor(brightness * ASCII_CHARS.length)
                  )
                ]
              : " ";
          }
          cells.push({
            col,
            row,
            char,
            isLit,
            offsetX: 0,
            offsetY: 0,
            velX: 0,
            velY: 0,
          });
        }
      }
    }

    function renderFrame() {
      ctx!.font = `${CELL_SIZE + 2}px monospace`;
      ctx!.textBaseline = "top";
      ctx!.textAlign = "center";
      ctx!.clearRect(0, 0, W, H);

      // resting dot grid under the wordmark
      ctx!.fillStyle = GRID_COLOR;
      for (const { col, row } of cells)
        ctx!.fillRect(col * CELL_STEP, row * CELL_STEP, CELL_SIZE, CELL_SIZE);

      // glyphs — tint toward the accent the further they are shoved
      for (const { col, row, char, isLit, offsetX, offsetY } of cells) {
        if (!isLit) continue;
        const disp = Math.min(1, Math.hypot(offsetX, offsetY) / 3);
        ctx!.fillStyle = `rgb(${Math.round(
          lerp(CHAR_COLOR[0], ACCENT_COLOR[0], disp)
        )},${Math.round(lerp(CHAR_COLOR[1], ACCENT_COLOR[1], disp))},${Math.round(
          lerp(CHAR_COLOR[2], ACCENT_COLOR[2], disp)
        )})`;
        const x = (col + Math.round(offsetX)) * CELL_STEP;
        const y = (row + Math.round(offsetY)) * CELL_STEP;
        ctx!.fillText(char, x + CELL_SIZE / 2, y);
      }
    }

    function updatePhysics() {
      for (const cell of cells) {
        if (!cell.isLit) continue;
        if (mouse.active) {
          const dx = cell.col + cell.offsetX - mouse.col;
          const dy = cell.row + cell.offsetY - mouse.row;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < PUSH_RADIUS && dist > 0) {
            const weight = 1 - dist / PUSH_RADIUS;
            const force = weight ** 2 * PUSH_FORCE;
            cell.velX += (dx / dist) * force;
            cell.velY += (dy / dist) * force;
            // continuous turbulence so the field keeps boiling/flowing even when
            // the cursor holds still — gives the lively "lots of particles" feel.
            cell.velX += (Math.random() - 0.5) * TURB * weight;
            cell.velY += (Math.random() - 0.5) * TURB * weight;
          }
        }
        cell.velX += -cell.offsetX * SPRING;
        cell.velY += -cell.offsetY * SPRING;
        cell.velX *= DAMPING;
        cell.velY *= DAMPING;
        cell.offsetX += cell.velX;
        cell.offsetY += cell.velY;
        if (Math.abs(cell.offsetX) < 0.01 && Math.abs(cell.velX) < 0.01)
          cell.offsetX = cell.velX = 0;
        if (Math.abs(cell.offsetY) < 0.01 && Math.abs(cell.velY) < 0.01)
          cell.offsetY = cell.velY = 0;
      }
    }

    function rebuild() {
      setupCanvas();
      sampleWordIntoCells();
      renderFrame();
    }

    rebuild();

    // Reduced motion: a single calm static frame, no flicker / physics / loop.
    if (reduce) {
      const onResize = () => rebuild();
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }

    // Flicker the lit glyphs like a live terminal.
    const flicker = setInterval(() => {
      for (const cell of cells)
        if (cell.isLit)
          cell.char =
            ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)];
    }, 50);

    let raf = 0;
    function loop() {
      updatePhysics();
      renderFrame();
      raf = requestAnimationFrame(loop);
    }
    loop();

    const onMove = (e: PointerEvent) => {
      const rect = root!.getBoundingClientRect();
      mouse.col = (e.clientX - rect.left) / CELL_STEP;
      mouse.row = (e.clientY - rect.top) / CELL_STEP;
      mouse.active = true;
    };
    const onLeave = () => {
      mouse.col = mouse.row = -999;
      mouse.active = false;
    };
    const onResize = () => rebuild();

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(flicker);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="cl-root" ref={rootRef} style={{ height }}>
      <style>{css}</style>
      <canvas className="cl-canvas" ref={canvasRef} />
    </div>
  );
}

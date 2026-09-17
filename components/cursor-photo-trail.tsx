'use client'

import { useEffect, useRef, useCallback, useState, memo } from 'react'

/**
 * CursorPhotoTrail
 * -----------------
 * Matches the "TOKYO"-style reference: big photo cards trail the cursor
 * inside an invisible bounding zone, with a giant wordmark on top using
 * mix-blend-mode so it reads as a dark cutout over the photos and a
 * plain solid color over empty space.
 *
 * IMPORTANT: photo size and label font size are both computed as a
 * PROPORTION of this component's own box width (not fixed pixels), so
 * it looks correct whether you place it full-width or in a narrow side
 * column next to text. Just give the parent an explicit width/height.
 *
 * The effect only runs while the cursor is inside this component's own
 * box, and only while that box is visible in the viewport (so it stays
 * off during an intro sequence higher up the page).
 *
 * The label ("CIPHER") layers several independent, non-conflicting
 * animations by nesting elements so each one owns a different CSS
 * property and they compose instead of fighting over `transform`:
 *   .cpt-label-entrance  -> opacity/scale on viewport entry
 *   .cpt-label-float     -> slow infinite translateY drift
 *   .cpt-label-reactive  -> cursor-velocity-driven scale/translateX/glow
 *   .cpt-label           -> base color/glow-pulse/glitch-shift (+::before/::after glitch slivers)
 *   .cpt-label-shimmer   -> periodic light sweep clipped to the text
 *
 * Usage:
 *   <div className="relative h-80 w-full overflow-hidden">
 *     <CursorPhotoTrail label="CIPHER" />
 *   </div>
 */

interface TrailPhoto {
  id: number
  x: number
  y: number
  width: number
  height: number
  rotation: number
  duration: number
  img: string
}

// These match the 8 event photos expected at /public/images/trail/.
const DEFAULT_IMAGES = [
  '/images/trail/1.jpg',
  '/images/trail/2.jpg',
  '/images/trail/3.jpg',
  '/images/trail/4.jpg',
  '/images/trail/5.jpg',
  '/images/trail/6.jpg',
  '/images/trail/7.jpg',
  '/images/trail/8.jpg',
]

// --- Tuning knobs -------------------------------------------------------
const MAX_PHOTOS = 6
const MIN_SPAWN_INTERVAL_MS = 240
const MAX_SPAWN_INTERVAL_MS = 60
const MIN_VELOCITY_TO_SPAWN = 0.05 // px/ms
const MAX_VELOCITY_CLAMP = 3.2 // px/ms

// Photo width as a RATIO of the zone's own current width — not a fixed px
// value — so a narrow side-column box and a full-width band both look
// proportionate instead of the photos overflowing (or vanishing) in a
// narrower box.
const SIZE_RATIO_MIN = 0.32 // at low velocity
const SIZE_RATIO_MAX = 0.52 // at high velocity
const SIZE_FLOOR_PX = 90 // never smaller than this, even in a tiny box
const SIZE_CEIL_PX = 420 // never bigger than this, even in a huge box
const ASPECT = 0.68 // height = width * ASPECT (landscape cards)
// -------------------------------------------------------------------------

let uid = 0

function clampedVelocityRatio(v: number) {
  return Math.min(v / MAX_VELOCITY_CLAMP, 1)
}
function velocityToSpawnInterval(v: number) {
  const t = clampedVelocityRatio(v)
  return MIN_SPAWN_INTERVAL_MS - t * (MIN_SPAWN_INTERVAL_MS - MAX_SPAWN_INTERVAL_MS)
}
// zoneWidth = the box's own current width in px, read fresh from
// getBoundingClientRect() at spawn time — this is what makes sizing
// correct regardless of where the box is placed on the page.
function velocityToSize(v: number, zoneWidth: number) {
  const t = clampedVelocityRatio(v)
  const ratio = SIZE_RATIO_MIN + t * (SIZE_RATIO_MAX - SIZE_RATIO_MIN)
  const raw = zoneWidth * ratio
  return Math.min(Math.max(raw, SIZE_FLOOR_PX), SIZE_CEIL_PX)
}

const TrailImage = memo(function TrailImage({
  photo,
  onDone,
}: {
  photo: TrailPhoto
  onDone: (id: number) => void
}) {
  useEffect(() => {
    const timer = setTimeout(() => onDone(photo.id), photo.duration)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photo.id, photo.duration])

  return (
    <div
      className="cpt-photo"
      style={
        {
          left: photo.x,
          top: photo.y,
          width: photo.width,
          height: photo.height,
          '--cpt-rot': `${photo.rotation}deg`,
          '--cpt-duration': `${photo.duration}ms`,
        } as React.CSSProperties
      }
    >
      <img src={photo.img} alt="" draggable={false} loading="eager" />
    </div>
  )
})

export function CursorPhotoTrail({
  images = DEFAULT_IMAGES,
  label = 'CIPHER',
  className,
}: {
  images?: string[]
  /** Giant wordmark rendered on top of the photos, blended like the reference. Pass "" to omit it. */
  label?: string
  className?: string
}) {
  const zoneRef = useRef<HTMLDivElement>(null)
  const reactiveRef = useRef<HTMLSpanElement>(null) // drives the cursor-reactive boost on the label
  const [photos, setPhotos] = useState<TrailPhoto[]>([])
  const [inView, setInView] = useState(false)

  const lastPos = useRef<{ x: number; y: number; t: number } | null>(null)
  const lastSpawn = useRef(0)
  const ticking = useRef(false)
  const pendingPos = useRef<{ x: number; y: number } | null>(null)
  const wasInside = useRef(false)

  const removePhoto = useCallback((id: number) => {
    setPhotos((prev) => (prev.length ? prev.filter((p) => p.id !== id) : prev))
  }, [])

  // Only "arm" the effect while the box itself is on screen. This is what
  // keeps it off during an intro/hero sequence earlier on the page, and it
  // also triggers the label's entrance animation below.
  useEffect(() => {
    const el = zoneRef.current
    if (!el || typeof window === 'undefined') return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.15,
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const el = zoneRef.current
    if (!el) return
    if (typeof window === 'undefined') return
    if (window.matchMedia('(pointer: coarse)').matches) return // no touch devices
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!images.length) return
    if (!inView) return // box off-screen (e.g. during the intro) -> do nothing

    const handleFrame = () => {
      ticking.current = false
      const pos = pendingPos.current
      if (!pos) return

      const rect = el.getBoundingClientRect()
      const inside =
        pos.x >= rect.left && pos.x <= rect.right && pos.y >= rect.top && pos.y <= rect.bottom

      if (!inside) {
        wasInside.current = false
        lastPos.current = null
        // Cursor left the box -> let the wordmark settle back to its resting state.
        reactiveRef.current?.style.setProperty('--cpt-boost', '0')
        return
      }

      const now = performance.now()
      const prev = wasInside.current ? lastPos.current : null
      wasInside.current = true

      let velocity = 0
      if (prev) {
        const dt = Math.max(now - prev.t, 1)
        const dist = Math.hypot(pos.x - prev.x, pos.y - prev.y)
        velocity = dist / dt
      }
      lastPos.current = { x: pos.x, y: pos.y, t: now }

      // Feed the same velocity signal (already computed for the photo trail)
      // into the wordmark's reactive CSS variable — tiny scale/glow/shift,
      // smoothed by a CSS transition rather than per-frame JS animation.
      reactiveRef.current?.style.setProperty(
        '--cpt-boost',
        clampedVelocityRatio(velocity).toFixed(3)
      )

      if (velocity < MIN_VELOCITY_TO_SPAWN) return
      const interval = velocityToSpawnInterval(velocity)
      if (now - lastSpawn.current < interval) return
      lastSpawn.current = now

      // Sized relative to THIS box's current width — correct in a full-width
      // band or a narrow side column alike.
      const width = velocityToSize(velocity, rect.width)
      const height = width * ASPECT
      const jitter = 10
      const localX = pos.x - rect.left
      const localY = pos.y - rect.top

      const photo: TrailPhoto = {
        id: uid++,
        x: localX - width / 2 + (Math.random() - 0.5) * jitter,
        y: localY - height / 2 + (Math.random() - 0.5) * jitter,
        width,
        height,
        // Small rotation only — the reference stays close to axis-aligned.
        rotation: (Math.random() - 0.5) * (5 + clampedVelocityRatio(velocity) * 7),
        duration: 2000 + Math.random() * 1000,
        img: images[Math.floor(Math.random() * images.length)],
      }

      setPhotos((prev) => {
        const next = prev.length >= MAX_PHOTOS ? prev.slice(prev.length - MAX_PHOTOS + 1) : prev
        return [...next, photo]
      })
    }

    // Listen on window (not the zone) so we never affect pointer-events
    // inside the box; we just check membership in the box's rect per frame.
    const handleMouseMove = (e: MouseEvent) => {
      pendingPos.current = { x: e.clientX, y: e.clientY }
      if (!ticking.current) {
        ticking.current = true
        requestAnimationFrame(handleFrame)
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [images, inView])

  return (
    <div ref={zoneRef} className={`cpt-zone ${className ?? ''}`}>
      {photos.map((p) => (
        <TrailImage key={p.id} photo={p} onDone={removePhoto} />
      ))}

      {label && (
        <div className="cpt-label-wrap" aria-hidden="true">
          <div className={`cpt-label-entrance ${inView ? 'cpt-label-in' : ''}`}>
            <div className="cpt-label-float">
              <span ref={reactiveRef} className="cpt-label-reactive">
                <span className="cpt-label" data-text={label}>
                  {label}
                  <span className="cpt-label-shimmer" aria-hidden="true">
                    {label}
                  </span>
                </span>
              </span>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .cpt-zone {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          isolation: isolate; /* contain the blend mode to this box */
          background: transparent; /* fully invisible — no box, no border */
          /* Lets .cpt-label use cqw units below, sized to THIS box's own
             width rather than the viewport — correct in a narrow column. */
          container-type: inline-size;
        }
        .cpt-photo {
          position: absolute;
          pointer-events: none;
          border-radius: 4px;
          overflow: hidden;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
          animation: cpt-pop var(--cpt-duration) cubic-bezier(0.16, 1, 0.3, 1) forwards;
          transform: rotate(var(--cpt-rot)) scale(0.6);
          will-change: transform, opacity;
          z-index: 1;
        }
        .cpt-photo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        @keyframes cpt-pop {
          0% {
            opacity: 0;
            transform: rotate(var(--cpt-rot)) scale(0.6) translateY(0);
          }
          14% {
            opacity: 1;
            transform: rotate(var(--cpt-rot)) scale(1) translateY(-2px);
          }
          65% {
            opacity: 0.95;
          }
          100% {
            opacity: 0;
            transform: rotate(var(--cpt-rot)) scale(0.9) translateY(-14px);
          }
        }

        /* ---------------------------------------------------------------
           Label: entrance -> float -> reactive -> base (glow/glitch) -> shimmer
           Each layer owns its own property so none of the animations fight
           each other; they compose visually through the nesting instead.
           ------------------------------------------------------------- */
        .cpt-label-wrap {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2; /* sits above the photos */
          padding: 0 4%;
        }

        /* Entrance: settles in from slightly smaller + transparent when the
           box first scrolls into view. Re-plays if scrolled away and back. */
        .cpt-label-entrance {
          opacity: 0;
          transform: scale(0.88);
          transition: opacity 800ms cubic-bezier(0.16, 1, 0.3, 1),
            transform 800ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        .cpt-label-entrance.cpt-label-in {
          opacity: 1;
          transform: scale(1);
        }

        /* Float: a few px of slow, smooth vertical drift, looping forever. */
        .cpt-label-float {
          animation: cpt-float 6.5s ease-in-out infinite;
        }
        @keyframes cpt-float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }

        /* Reactive: cursor-velocity boost, smoothed by a transition rather
           than per-frame JS animation. --cpt-boost is set in JS (0..1). */
        .cpt-label-reactive {
          display: inline-block;
          transform: scale(calc(1 + var(--cpt-boost, 0) * 0.045))
            translateX(calc(var(--cpt-boost, 0) * 5px - 2.5px));
          filter: drop-shadow(0 0 calc(4px + var(--cpt-boost, 0) * 12px) var(--matrix));
          transition: transform 260ms ease-out, filter 260ms ease-out;
          will-change: transform, filter;
        }

        /* Base label: color, readable at all times, plus a slow glow pulse
           and a very brief, intermittent glitch shift. */
        .cpt-label {
          position: relative;
          display: inline-block;
          font-family: var(--font-jetbrains, monospace);
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: -0.02em;
          line-height: 1;
          white-space: nowrap;
          /* Brighter phosphor-green so it reads as glowing terminal text
             rather than a dark cutout. */
          color: #5cffab;
          /* Sized in cqw (% of THIS box's own width) instead of vw, so it
             fits a narrow side column instead of using full-viewport sizing. */
          font-size: clamp(2rem, 22cqw, 7rem);
          mix-blend-mode: screen; /* additive green glow over photos and empty space alike */
          user-select: none;
          animation: cpt-glow-pulse 4s ease-in-out infinite, cpt-glitch-shift 3.6s steps(1, end) infinite;
        }
        @keyframes cpt-glow-pulse {
          0%,
          100% {
            text-shadow: 0 0 8px color-mix(in srgb, var(--matrix) 55%, transparent),
              0 0 18px color-mix(in srgb, var(--matrix) 22%, transparent);
          }
          50% {
            text-shadow: 0 0 13px color-mix(in srgb, var(--matrix) 75%, transparent),
              0 0 26px color-mix(in srgb, var(--matrix) 35%, transparent);
          }
        }
        /* Horizontal shift-distortion — several short glitch windows per
           loop so the wordmark keeps stuttering instead of once every 7s. */
        @keyframes cpt-glitch-shift {
          0%,
          21%,
          25%,
          49%,
          52%,
          78%,
          82%,
          100% {
            transform: translate(0, 0);
          }
          22% {
            transform: translate(-4px, 1px);
          }
          23% {
            transform: translate(4px, -1px);
          }
          24% {
            transform: translate(-2px, 0);
          }
          50% {
            transform: translate(3px, -1px);
          }
          51% {
            transform: translate(-3px, 1px);
          }
          79% {
            transform: translate(-5px, 0);
          }
          80% {
            transform: translate(3px, 1px);
          }
          81% {
            transform: translate(-1px, 0);
          }
        }
        /* RGB-split glitch slivers — subtle variants of the same matrix
           green (never a different color family), invisible except during
           the brief spike a few times a minute. */
        .cpt-label::before,
        .cpt-label::after {
          content: attr(data-text);
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0;
        }
        .cpt-label::before {
          color: color-mix(in srgb, var(--matrix) 55%, #7ffbe0 45%);
          animation: cpt-glitch-1 3.6s steps(1, end) infinite;
        }
        .cpt-label::after {
          color: color-mix(in srgb, var(--matrix) 60%, #04120c 40%);
          animation: cpt-glitch-2 3.6s steps(1, end) infinite;
        }
        /* Cyan-green sliver — fires in the same windows as cpt-glitch-shift. */
        @keyframes cpt-glitch-1 {
          0%,
          21%,
          25%,
          49%,
          53%,
          78%,
          83%,
          100% {
            opacity: 0;
            transform: translate(0, 0);
            clip-path: inset(0 0 100% 0);
          }
          22% {
            opacity: 0.75;
            transform: translate(-4px, 0);
            clip-path: inset(6% 0 55% 0);
          }
          24% {
            opacity: 0.55;
            transform: translate(4px, 0);
            clip-path: inset(52% 0 8% 0);
          }
          50% {
            opacity: 0.65;
            transform: translate(3px, 0);
            clip-path: inset(22% 0 46% 0);
          }
          52% {
            opacity: 0.45;
            transform: translate(-3px, 0);
            clip-path: inset(46% 0 22% 0);
          }
          79% {
            opacity: 0.7;
            transform: translate(-5px, 0);
            clip-path: inset(10% 0 60% 0);
          }
          82% {
            opacity: 0.5;
            transform: translate(3px, 0);
            clip-path: inset(60% 0 10% 0);
          }
        }
        /* Deep-green sliver, offset a hair from the cyan one for RGB-split. */
        @keyframes cpt-glitch-2 {
          0%,
          21%,
          26%,
          49%,
          53%,
          78%,
          83%,
          100% {
            opacity: 0;
            transform: translate(0, 0);
            clip-path: inset(100% 0 0 0);
          }
          23% {
            opacity: 0.6;
            transform: translate(4px, 0);
            clip-path: inset(35% 0 35% 0);
          }
          25% {
            opacity: 0.45;
            transform: translate(-4px, 0);
            clip-path: inset(4% 0 64% 0);
          }
          51% {
            opacity: 0.55;
            transform: translate(-3px, 0);
            clip-path: inset(48% 0 20% 0);
          }
          80% {
            opacity: 0.6;
            transform: translate(4px, 0);
            clip-path: inset(30% 0 40% 0);
          }
          81% {
            opacity: 0.45;
            transform: translate(-2px, 0);
            clip-path: inset(66% 0 6% 0);
          }
        }

        /* Shimmer: a soft highlight that periodically sweeps across the
           letters, clipped to the text shape itself. */
        .cpt-label-shimmer {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            115deg,
            transparent 35%,
            rgba(255, 255, 255, 0.85) 50%,
            transparent 65%
          );
          background-size: 250% 100%;
          background-position: -120% 0;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          mix-blend-mode: overlay;
          opacity: 0.7;
          animation: cpt-shimmer-sweep 5.5s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes cpt-shimmer-sweep {
          0%,
          60% {
            background-position: -120% 0;
          }
          100% {
            background-position: 120% 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .cpt-label-entrance {
            transition: none;
            opacity: 1;
            transform: none;
          }
          .cpt-label-float {
            animation: none;
          }
          .cpt-label-reactive {
            transition: none;
            transform: none;
            filter: drop-shadow(0 0 6px var(--matrix));
          }
          .cpt-label {
            animation: none;
            text-shadow: 0 0 10px color-mix(in srgb, var(--matrix) 55%, transparent);
          }
          .cpt-label::before,
          .cpt-label::after {
            display: none;
          }
          .cpt-label-shimmer {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}

'use client'

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react'
import {
  motion,
  AnimatePresence,
  animate,
  useMotionValue,
  useReducedMotion,
  type AnimationPlaybackControls,
} from 'motion/react'
import { X } from 'lucide-react'

export type CarouselImage = {
  src: string
  alt: string
  caption?: string
}

interface OrbitCarouselProps {
  images: CarouselImage[]
  eyebrow?: string
  title?: string
  description?: string
  className?: string
}

const DRAG_FACTOR = 0.16
const SPRING = { type: 'spring' as const, stiffness: 72, damping: 20, mass: 0.8 }

function defaultDims(count: number) {
  // Deterministic values for SSR + first client render (no window access)
  const cardWidth = 220
  const geometric = (cardWidth / 2) / Math.tan(Math.PI / count)
  const radius = Math.max(cardWidth * 1.5, Math.round(geometric * 1.25))
  return { cardWidth, radius, perspective: 900 }
}

function computeDims(count: number) {
  if (typeof window === 'undefined') {
    return defaultDims(count)
  }
  const w = window.innerWidth
  let cardWidth: number
  if (w < 400) cardWidth = 132
  else if (w < 640) cardWidth = 158
  else if (w < 1024) cardWidth = 196
  else cardWidth = 230
  const geometric = (cardWidth / 2) / Math.tan(Math.PI / count)
  const radius = Math.max(cardWidth * 1.5, Math.round(geometric * 1.25))
  const perspective = Math.max(760, Math.min(Math.round(w * 1.15), 1400))
  return { cardWidth, radius, perspective }
}

export function OrbitCarousel({
  images,
  eyebrow = 'INTERACTIVE COLLECTION',
  title = 'Visual Orbit',
  description = 'Drag to explore. Select an image to expand.',
  className,
}: OrbitCarouselProps) {
  const count = Math.max(images.length, 1)
  const anglePerCard = 360 / count

  const prefersReduced = useReducedMotion()
  const rotation = useMotionValue(0)

  const [dims, setDims] = useState(() => defaultDims(count))
  const [expanded, setExpanded] = useState<number | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)
  const controlsRef = useRef<AnimationPlaybackControls | null>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const lastFocused = useRef<HTMLElement | null>(null)

  const dragging = useRef(false)
  const moved = useRef(false)
  const pointerStart = useRef(0)
  const rotationStart = useRef(0)
  const lastX = useRef(0)
  const lastT = useRef(0)
  const velocity = useRef(0)

  useEffect(() => {
    const onResize = () => setDims(computeDims(count))
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [count])

  useEffect(() => {
    return () => controlsRef.current?.stop()
  }, [])

  const settleTo = useCallback(
    (target: number) => {
      controlsRef.current?.stop()
      if (prefersReduced) {
        rotation.set(target)
        return
      }
      controlsRef.current = animate(rotation, target, SPRING)
    },
    [prefersReduced, rotation],
  )

  const onPointerDown = (e: ReactPointerEvent) => {
    controlsRef.current?.stop()
    dragging.current = true
    moved.current = false
    pointerStart.current = e.clientX
    rotationStart.current = rotation.get()
    lastX.current = e.clientX
    lastT.current = performance.now()
    velocity.current = 0
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }

  const onPointerMove = (e: ReactPointerEvent) => {
    if (!dragging.current) return
    const dx = e.clientX - pointerStart.current
    if (Math.abs(dx) > 4) moved.current = true
    rotation.set(rotationStart.current + dx * DRAG_FACTOR)
    const now = performance.now()
    const dt = now - lastT.current
    if (dt > 0) {
      velocity.current = (e.clientX - lastX.current) / dt
      lastX.current = e.clientX
      lastT.current = now
    }
  }

  const endDrag = (e: ReactPointerEvent) => {
    if (!dragging.current) return
    dragging.current = false
    e.currentTarget.releasePointerCapture?.(e.pointerId)
    const projectedRaw = velocity.current * DRAG_FACTOR * 220
    const projected = Math.max(-140, Math.min(140, projectedRaw))
    settleTo(rotation.get() + projected)
  }

  const rotateByCards = (steps: number) => {
    settleTo(rotation.get() + steps * anglePerCard)
  }

  const onKeyDown = (e: ReactKeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      rotateByCards(1)
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      rotateByCards(-1)
    }
  }

  const openCard = (i: number) => {
    if (moved.current) return
    lastFocused.current = document.activeElement as HTMLElement
    setExpanded(i)
  }

  const closeExpanded = useCallback(() => {
    setExpanded(null)
    lastFocused.current?.focus?.()
  }, [])

  useEffect(() => {
    if (expanded === null) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeBtnRef.current?.focus()
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') closeExpanded()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [expanded, closeExpanded])

  const { cardWidth, radius, perspective } = dims

  return (
    <div
      className={`relative h-[88svh] w-full overflow-hidden ${className ?? ''}`}
      style={{
        background:
          'radial-gradient(circle at 50% 16%, rgba(63,255,130,0.16), transparent 34%), radial-gradient(circle at 12% 86%, rgba(16,185,129,0.12), transparent 32%), linear-gradient(180deg, #0a0f0a 0%, #060906 55%, #020402 100%)',
      }}
    >
      {/* Header */}
      <div className="pointer-events-none absolute left-0 top-0 z-20 flex w-full items-start justify-between p-6 sm:p-8">
        <div className="max-w-md">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--matrix)]">
            {eyebrow}
          </p>
          <h2 className="mt-2 font-display text-2xl leading-tight text-foreground sm:text-4xl lg:text-5xl">
            {title}
          </h2>
          <p className="mt-3 max-w-xs text-xs text-muted-foreground sm:text-sm">
            {description}
          </p>
        </div>
        <span className="hidden rounded-full border border-[var(--border)] bg-[var(--card)]/60 px-3 py-1 font-mono text-xs text-muted-foreground sm:inline-block">
          {count.toString().padStart(2, '0')} cards
        </span>
      </div>

      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#020402] to-transparent sm:w-40" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#020402] to-transparent sm:w-40" />

      {/* Interaction stage */}
      <div
        ref={containerRef}
        role="group"
        aria-label={`${title} carousel. Use left and right arrow keys to rotate.`}
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={onKeyDown}
        className="absolute inset-0 flex cursor-grab touch-pan-y items-center justify-center outline-none active:cursor-grabbing"
        style={{ perspective: `${perspective}px` }}
      >
        <motion.div
          className="relative"
          style={{
            rotateY: rotation,
            transformStyle: 'preserve-3d',
            width: cardWidth,
            height: cardWidth,
          }}
        >
          {images.map((img, i) => {
            const angle = anglePerCard * i
            return (
              <motion.button
                key={img.src + i}
                type="button"
                onClick={() => openCard(i)}
                aria-label={`Expand image: ${img.alt}`}
                whileHover={prefersReduced ? undefined : { scale: 1.04, y: -5 }}
                whileTap={prefersReduced ? undefined : { scale: 0.97 }}
                className="group absolute left-1/2 top-1/2 overflow-hidden rounded-2xl border border-white/12 bg-[#050705] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.85)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--matrix)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#020402]"
                style={{
                  width: cardWidth,
                  height: cardWidth,
                  transform: `translate(-50%, -50%) rotateY(${angle}deg) translateZ(${radius}px)`,
                  backfaceVisibility: 'hidden',
                }}
              >
                <img
                  src={img.src || '/placeholder.svg'}
                  alt={img.alt}
                  draggable={false}
                  loading={i < 3 ? 'eager' : 'lazy'}
                  className="pointer-events-none h-full w-full select-none object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                {img.caption ? (
                  <span className="pointer-events-none absolute bottom-3 left-3 font-mono text-xs uppercase tracking-widest text-white/90">
                    {img.caption}
                  </span>
                ) : null}
              </motion.button>
            )
          })}
        </motion.div>
      </div>

      {/* Expanded overlay */}
      <AnimatePresence>
        {expanded !== null ? (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={images[expanded].alt}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md sm:p-8"
            style={{ background: 'rgba(2,4,2,0.86)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeExpanded}
          >
            <button
              ref={closeBtnRef}
              type="button"
              onClick={closeExpanded}
              aria-label="Close expanded image"
              className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white outline-none transition-colors hover:border-[var(--matrix)] hover:text-[var(--matrix)] focus-visible:ring-2 focus-visible:ring-[var(--matrix)]"
            >
              <X className="h-5 w-5" />
            </button>
            <motion.figure
              className="relative flex max-h-[90svh] max-w-5xl flex-col items-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[expanded].src || '/placeholder.svg'}
                alt={images[expanded].alt}
                className="max-h-[80svh] w-auto rounded-2xl border border-white/12 object-contain"
              />
              {images[expanded].caption ? (
                <figcaption className="mt-4 font-mono text-sm uppercase tracking-widest text-white/80">
                  {images[expanded].caption}
                </figcaption>
              ) : null}
            </motion.figure>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

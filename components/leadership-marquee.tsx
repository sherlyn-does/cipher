'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import Image from 'next/image'
import { X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

function GithubIcon({ size = 25 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.38 7.86 10.9.57.1.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.75 2.7 1.25 3.36.95.1-.74.4-1.25.72-1.54-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.24 2.75.12 3.04.74.81 1.18 1.84 1.18 3.1 0 4.43-2.7 5.41-5.27 5.7.42.36.78 1.07.78 2.17 0 1.57-.01 2.83-.01 3.22 0 .3.22.66.79.55A10.52 10.52 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
    </svg>
  )
}

function LinkedinIcon({ size = 25 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.44-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.59 0 4.27 2.36 4.27 5.44v6.3ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.11 20.45H3.56V9h3.55v11.45Z" />
    </svg>
  )
}

type Bearer = {
  role: string
  name: string
  photo: string
  github?: string
  linkedin?: string
}

export function LeadershipMarquee({ bearers }: { bearers: Bearer[] }) {
  const reduceMotion = useReducedMotion()

  const scrollerRef = useRef<HTMLDivElement>(null)
  // When the user is actively scrolling/dragging we pause the auto-scroll and
  // resume it a short moment after they stop.
  const pausedRef = useRef(false)
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [selected, setSelected] = useState<Bearer | null>(null)

  // Duplicate the list so the track can scroll seamlessly: when the first
  // copy has fully moved out of view, the second copy is in the exact same
  // position, so wrapping the scroll offset is invisible.
  const track = [...bearers, ...bearers]

  useEffect(() => {
    const el = scrollerRef.current
    if (!el || reduceMotion) return

    let frame = 0
    const speed = 0.5 // px per frame (~30px/s at 60fps)

    const step = () => {
      // The seamless loop point is exactly half of the total scroll width,
      // because we render the list twice.
      const half = el.scrollWidth / 2

      if (!pausedRef.current) {
        el.scrollLeft += speed
      }

      // Keep scrollLeft within the first copy so both auto-scroll and manual
      // scroll wrap around forever without hitting an edge.
      if (el.scrollLeft >= half) {
        el.scrollLeft -= half
      } else if (el.scrollLeft <= 0) {
        el.scrollLeft += half
      }

      frame = requestAnimationFrame(step)
    }

    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [reduceMotion])

  const pauseAuto = () => {
    pausedRef.current = true
    if (resumeTimer.current) clearTimeout(resumeTimer.current)
    resumeTimer.current = setTimeout(() => {
      pausedRef.current = false
    }, 1200)
  }

  return (
    <>
      <div
        className="group relative mt-14"
        // Fade the edges so cards ease in/out instead of hard-clipping.
        style={{
          maskImage:
            'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
        }}
      >
        <div
          ref={scrollerRef}
          className="no-scrollbar flex w-full cursor-grab gap-5 overflow-x-auto overscroll-x-contain"
          onWheel={pauseAuto}
          onPointerDown={pauseAuto}
          onTouchMove={pauseAuto}
        >
          {track.map((b, i) => (
            <div
              key={`${b.role}-${i}`}
              role="button"
              tabIndex={0}
              data-cursor="lens"
              onClick={() => setSelected(b)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') setSelected(b)
              }}
              className="flex w-[240px] shrink-0 cursor-pointer flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)]/50 text-left transition-all duration-300 hover:border-[var(--matrix)] hover:box-glow sm:w-[280px]"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#050705]">
                <Image
                  src={b.photo || '/placeholder.svg'}
                  alt={`${b.name}, ${b.role}`}
                  fill
                  sizes="280px"
                  className="object-cover grayscale transition-all duration-500 hover:grayscale-0"
                  draggable={false}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050705] via-transparent to-transparent" />
              </div>
              <div className="flex flex-col items-center gap-1 px-4 py-5 text-center">
                <span className="font-mono text-xs uppercase tracking-widest text-[var(--matrix)]">
                  {b.role}
                </span>
                <span className="font-display text-lg leading-tight text-foreground">
                  {b.name}
                </span>
                {/* Social links — add each person's URL to fill these in. */}
                <div className="mt-2 flex items-center gap-3">
                  <a
                    href={b.github || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`${b.name} on GitHub`}
                    className="text-muted-foreground transition-colors hover:text-[var(--matrix)]"
                  >
                    <GithubIcon size={20} />
                  </a>
                  <a
                    href={b.linkedin || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`${b.name} on LinkedIn`}
                    className="text-muted-foreground transition-colors hover:text-[var(--matrix)]"
                  >
                    <LinkedinIcon size={20} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <style jsx>{`
          .no-scrollbar {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>

      {/* CARD MODAL */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-5 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="relative w-full max-w-xs overflow-hidden rounded-xl border border-[var(--matrix)]/40 bg-[var(--card)]"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-md border border-[var(--matrix)]/40 bg-black/40 text-[var(--matrix)] transition-colors hover:bg-[var(--matrix)]/10"
                aria-label="Close"
              >
                <X size={18} />
              </button>

              <div className="relative aspect-[3/4] w-full bg-[#050705]">
                <Image
                  src={selected.photo || '/placeholder.svg'}
                  alt={`${selected.name}, ${selected.role}`}
                  fill
                  sizes="384px"
                  className="object-cover"
                  draggable={false}
                />
              </div>

              <div className="flex flex-col items-center gap-1 px-5 py-5 text-center">
                <span className="font-mono text-xs uppercase tracking-widest text-[var(--matrix)]">
                  {selected.role}
                </span>
                <span className="font-display text-xl leading-tight text-foreground">
                  {selected.name}
                </span>
                <div className="mt-3 flex items-center gap-4">
                  <a
                    href={selected.github || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${selected.name} on GitHub`}
                    className="text-muted-foreground transition-colors hover:text-[var(--matrix)]"
                  >
                    <GithubIcon size={25} />
                  </a>
                  <a
                    href={selected.linkedin || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${selected.name} on LinkedIn`}
                    className="text-muted-foreground transition-colors hover:text-[var(--matrix)]"
                  >
                    <LinkedinIcon size={25} />
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

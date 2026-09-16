'use client'

import { useReducedMotion } from 'motion/react'
import Image from 'next/image'
import { useEffect, useRef } from 'react'

type Bearer = {
  role: string
  name: string
  photo: string
}

export function LeadershipMarquee({ bearers }: { bearers: Bearer[] }) {
  const reduceMotion = useReducedMotion()

  const scrollerRef = useRef<HTMLDivElement>(null)
  // When the user is actively scrolling/dragging we pause the auto-scroll and
  // resume it a short moment after they stop.
  const pausedRef = useRef(false)
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

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
            data-cursor="lens"
            className="flex w-[240px] shrink-0 flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)]/50 transition-all duration-300 hover:border-[var(--matrix)] hover:box-glow sm:w-[280px]"
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
  )
}

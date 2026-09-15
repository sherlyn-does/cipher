'use client'

import { useReducedMotion } from 'motion/react'
import Image from 'next/image'

type Bearer = {
  role: string
  name: string
  photo: string
}

export function LeadershipMarquee({ bearers }: { bearers: Bearer[] }) {
  const reduceMotion = useReducedMotion()

  // Duplicate the list so the track can scroll seamlessly: when the first
  // copy has fully moved out of view, the second copy is in the exact same
  // position, so resetting to 0 is invisible.
  const track = [...bearers, ...bearers]

  return (
    <div
      className="group relative mt-14 overflow-hidden"
      // Fade the edges so cards ease in/out instead of hard-clipping.
      style={{
        maskImage:
          'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
        WebkitMaskImage:
          'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
      }}
    >
      <div
        className="flex w-max gap-5"
        style={{
          animation: reduceMotion
            ? undefined
            : 'leadership-scroll 32s linear infinite',
        }}
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
        @keyframes leadership-scroll {
          from {
            transform: translateX(0);
          }
          to {
            /* Move exactly one copy's width (half the doubled track).
               The gap after the last of the first copy is included because
               the track has gap between every item, keeping spacing even. */
            transform: translateX(calc(-50% - 0.625rem));
          }
        }
      `}</style>
    </div>
  )
}

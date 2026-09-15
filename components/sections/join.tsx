'use client'

import { ArrowRight } from 'lucide-react'
import { MatrixRain } from '../matrix-rain'
import { ScrambleText } from '../scramble-text'
import { MagneticButton } from '../magnetic-button'
import { Reveal } from '../reveal'

export function Join() {
  return (
    <section
      id="join"
      className="relative overflow-hidden border-t border-[var(--border)] py-28"
    >
      <MatrixRain opacity={0.1} />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#050705] via-transparent to-[#050705]" />

      <div className="relative mx-auto max-w-3xl px-5 text-center">
        <div className="mb-4 font-mono text-xs uppercase tracking-[0.4em] text-[var(--matrix)]">
          // join
        </div>
        <ScrambleText
          as="h2"
          text="Join Cipher"
          className="font-display text-4xl leading-tight text-foreground text-glow sm:text-5xl md:text-6xl"
        />
        <Reveal delay={0.15}>
          <p className="mx-auto mt-6 max-w-xl font-mono text-base leading-relaxed text-muted-foreground">
            Whether you want to build, lead, or simply learn — CIPHER is where CSE
            students turn curiosity into capability. Join the community and help
            shape what comes next.
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <MagneticButton href="mailto:cipher@cse.edu">
              Join <ArrowRight size={16} />
            </MagneticButton>
            <MagneticButton href="#top" variant="outline">
              Back to Top
            </MagneticButton>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

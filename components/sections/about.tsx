import { SectionHeading } from '../section-heading'
import { Reveal } from '../reveal'

const STATS = [
  { value: '01', label: 'Department Association' },
  { value: '∞', label: 'Ideas Compiled' },
  { value: '24/7', label: 'Curiosity Uptime' },
]

export function About() {
  return (
    <section id="about" className="relative border-t border-[var(--border)] py-24">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading label="about" title="Who we are" />

        <div className="mt-12 grid gap-12 md:grid-cols-[1.4fr_1fr]">
          <Reveal>
            <p className="font-mono text-lg leading-relaxed text-muted-foreground">
              <span className="text-[var(--matrix)]">CIPHER</span> is the student
              association of the Department of Computer Science &amp; Engineering.
              It serves as a platform for students to nurture their technical and
              interpersonal skills through innovative and collaborative
              activities. The association strives to bridge the gap between
              academic knowledge and practical application, fostering a community
              of aspiring professionals dedicated to excellence in computing.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="flex flex-col divide-y divide-[var(--border)] rounded-lg border border-[var(--border)] bg-[var(--card)]/50">
              {STATS.map((s) => (
                <div
                  key={s.label}
                  className="flex items-center justify-between px-6 py-5"
                >
                  <span className="font-display text-4xl text-[var(--matrix)] text-glow">
                    {s.value}
                  </span>
                  <span className="text-right font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

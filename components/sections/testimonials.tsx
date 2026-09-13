import { Quote } from 'lucide-react'
import { SectionHeading } from '../section-heading'
import { Reveal, StaggerGroup, StaggerItem } from '../reveal'

const VOICES = [
  {
    quote:
      'CIPHER gives our students a space to experiment, fail fast, and grow into confident engineers. Placeholder quote — to be replaced.',
    name: 'Head of Department',
    role: 'CSE Department',
  },
  {
    quote:
      'Watching students organize, lead, and build together is the most rewarding part of my role. Placeholder quote — to be replaced.',
    name: 'Faculty Coordinator',
    role: 'CIPHER Mentor',
  },
  {
    quote:
      'From my first workshop to leading events, CIPHER shaped how I think and collaborate. Placeholder quote — to be replaced.',
    name: 'Student President',
    role: 'CIPHER',
  },
]

export function Testimonials() {
  return (
    <section className="relative border-t border-[var(--border)] py-24">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <SectionHeading label="testimonials" title="Voices of CIPHER" />
        </Reveal>

        <StaggerGroup className="mt-12 grid gap-5 md:grid-cols-3">
          {VOICES.map((v) => (
            <StaggerItem key={v.name}>
              <figure className="flex h-full flex-col rounded-lg border border-[var(--border)] bg-[var(--card)]/50 p-7">
                <Quote className="mb-4 text-[var(--matrix)]" size={24} />
                <blockquote className="flex-1 font-mono text-sm leading-relaxed text-muted-foreground">
                  {v.quote}
                </blockquote>
                <figcaption className="mt-6 border-t border-[var(--border)] pt-4">
                  <div className="font-display text-lg text-foreground">
                    {v.name}
                  </div>
                  <div className="font-mono text-xs uppercase tracking-widest text-[var(--matrix)]">
                    {v.role}
                  </div>
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  )
}

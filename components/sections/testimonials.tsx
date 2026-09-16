import { Quote } from 'lucide-react'
import { SectionHeading } from '../section-heading'
import { Reveal, StaggerGroup, StaggerItem } from '../reveal'

const VOICES = [
  {
    quote:
      'Through associations, one\u2019s objective should be to achieve something not in the curriculum. This can be done by attending technical talks, visiting companies and by visual development.',
    name: 'Mr. Praveen Udupa',
    role: 'CIPHER 2014\u201315',
  },
  {
    quote:
      'A student\u2019s life should have commitment, contribution and involvement in activities as it is for a limited period. This gives them a platform for the rest of their lives.',
    name: 'Rev. Fr. Ajith Menezes',
    role: 'CIPHER 2014\u201315',
  },
  {
    quote:
      'One can define the concepts by the apparent growth and improvement in functionality and usability of new devices in market using these approaches.',
    name: 'Dr. Sreekanth N. S.',
    role: 'CIPHER & CSI Inaugural 2018\u201319',
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

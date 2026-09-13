import { CheckCircle2 } from 'lucide-react'
import { SectionHeading } from '../section-heading'
import { Reveal, StaggerGroup, StaggerItem } from '../reveal'

const POINTS = [
  'Annual elections conducted under the guidance of the Head of Department and Faculty Coordinator.',
  'Elected office bearers: President, Secretary, and other key roles.',
  'A chance for students to develop leadership skills, take responsibility, and drive the association forward.',
]

const BEARERS = [
  { role: 'President', name: 'To be announced' },
  { role: 'Secretary', name: 'To be announced' },
  { role: 'Treasurer', name: 'To be announced' },
  { role: 'Tech Lead', name: 'To be announced' },
]

export function Leadership() {
  return (
    <section
      id="leadership"
      className="relative border-t border-[var(--border)] py-24"
    >
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <SectionHeading label="governance" title="Leadership Structure" />
        </Reveal>

        <div className="mt-12 grid gap-12 lg:grid-cols-2">
          <Reveal>
            <ul className="space-y-5">
              {POINTS.map((p) => (
                <li key={p} className="flex gap-3">
                  <CheckCircle2
                    className="mt-0.5 shrink-0 text-[var(--matrix)]"
                    size={20}
                  />
                  <span className="font-mono text-base leading-relaxed text-muted-foreground">
                    {p}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          <StaggerGroup className="grid grid-cols-2 gap-4">
            {BEARERS.map((b) => (
              <StaggerItem key={b.role}>
                <div
                  data-cursor="lens"
                  className="group flex h-full flex-col items-center rounded-lg border border-[var(--border)] bg-[var(--card)]/50 p-6 text-center transition-all duration-300 hover:border-[var(--matrix)] hover:box-glow"
                >
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-[var(--border)] bg-[#050705] font-display text-3xl text-[var(--matrix)] transition-colors group-hover:border-[var(--matrix)] group-hover:text-glow">
                    {b.role.charAt(0)}
                  </div>
                  <span className="font-mono text-xs uppercase tracking-widest text-[var(--matrix)]">
                    {b.role}
                  </span>
                  <span className="mt-1 font-mono text-sm text-muted-foreground">
                    {b.name}
                  </span>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </div>
    </section>
  )
}

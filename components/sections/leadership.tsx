import { SectionHeading } from '../section-heading'
import { Reveal } from '../reveal'
import { LeadershipMarquee } from '../leadership-marquee'

const FACULTY = [
  {
    role: 'Head of Department',
    name: "Dr. Melwyn D'Souza",
  },
  {
    role: 'Faculty Co-Coordinator',
    name: 'Ms. Nisha J Roche',
  },
  {
    role: 'Faculty Co-Coordinator',
    name: 'Ms. Jaishma K',
  },
]

const BEARERS = [
  {
    role: 'President',
    name: 'Elston Herold Pereira',
    photo: '/leadership/president.png',
  },
  {
    role: 'Vice President',
    name: 'Raynell Lewis',
    photo: '/leadership/vice-president.png',
  },
  {
    role: 'Secretary',
    name: 'Chaitra R M',
    photo: '/leadership/secretary.png',
  },
  {
    role: 'Treasurer',
    name: 'Nazmin Ziya',
    photo: '/leadership/treasurer.png',
  },
  {
    role: 'Joint Treasurer',
    name: 'Jeslin Ninora',
    photo: '/leadership/joint-treasurer.png',
  },
]

export function Leadership() {
  return (
    <section
      id="leadership"
      className="relative border-t border-[var(--border)] py-24"
    >
      <div className="mx-auto max-w-7xl px-5">
        <Reveal>
          <SectionHeading label="governance" title="Leadership Structure" />
        </Reveal>

        <Reveal>
          <div className="mt-14">
            <h3 className="font-mono text-xs uppercase tracking-widest text-[var(--matrix)]">
              {'// faculty'}
            </h3>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {FACULTY.map((f) => (
                <div
                  key={f.name}
                  data-cursor="lens"
                  className="flex flex-col gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)]/50 px-6 py-7 transition-all duration-300 hover:border-[var(--matrix)] hover:box-glow"
                >
                  <span className="font-mono text-xs uppercase tracking-widest text-[var(--matrix)]">
                    {f.role}
                  </span>
                  <span className="font-display text-xl leading-tight text-foreground">
                    {f.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="mt-16">
          <h3 className="font-mono text-xs uppercase tracking-widest text-[var(--matrix)]">
            {'// office bearers'}
          </h3>
        </div>

        <LeadershipMarquee bearers={BEARERS} />
      </div>
    </section>
  )
}

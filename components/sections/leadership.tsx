import { SectionHeading } from '../section-heading'
import { Reveal } from '../reveal'
import { LeadershipMarquee } from '../leadership-marquee'

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

        <LeadershipMarquee bearers={BEARERS} />
      </div>
    </section>
  )
}

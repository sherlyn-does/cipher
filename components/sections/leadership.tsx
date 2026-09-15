import Image from 'next/image'
import { SectionHeading } from '../section-heading'
import { Reveal, StaggerGroup, StaggerItem } from '../reveal'

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

        <StaggerGroup className="mt-14 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {BEARERS.map((b) => (
            <StaggerItem key={b.role}>
              <div
                data-cursor="lens"
                className="group flex h-full flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)]/50 transition-all duration-300 hover:border-[var(--matrix)] hover:box-glow"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#050705]">
                  <Image
                    src={b.photo || "/placeholder.svg"}
                    alt={`${b.name}, ${b.role}`}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
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
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  )
}

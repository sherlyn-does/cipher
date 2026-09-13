'use client'

import Image from 'next/image'
import { Calendar, ArrowUpRight } from 'lucide-react'
import { SectionHeading } from '../section-heading'
import { Reveal } from '../reveal'

const EVENTS = [
  {
    tag: 'Hackathon',
    title: 'CIPHER Hack — 24hr Build Sprint',
    status: 'Upcoming',
    desc: 'A day-long hackathon where teams ship a working prototype from scratch.',
  },
  {
    tag: 'Workshop',
    title: 'Intro to Systems Programming',
    status: 'Planned',
    desc: 'Hands-on session covering memory, processes, and low-level debugging.',
  },
  {
    tag: 'Tech Talk',
    title: 'Careers in Security & AI',
    status: 'Planned',
    desc: 'Industry speakers on breaking into modern computing fields.',
  },
]

export function Events() {
  return (
    <section id="events" className="relative border-t border-[var(--border)] py-24">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <SectionHeading label="activities" title="Events & Workshops" />
        </Reveal>

        {/* Big visual centerpiece */}
        <Reveal delay={0.1}>
          <div
            data-cursor="lens"
            className="group relative mt-12 overflow-hidden rounded-xl border border-[var(--border)]"
          >
            <Image
              src="/images/events-centerpiece.png"
              alt="Abstract green digital network representing CIPHER events and collaboration"
              width={1200}
              height={600}
              className="h-[280px] w-full object-cover opacity-80 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100 sm:h-[360px]"
              priority={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050705] via-[#050705]/30 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 sm:p-8">
              <span className="font-mono text-xs uppercase tracking-widest text-[var(--matrix)]">
                Flagship
              </span>
              <h3 className="mt-1 font-display text-3xl text-foreground text-glow sm:text-4xl">
                Build. Break. Ship.
              </h3>
              <p className="mt-2 max-w-md font-mono text-sm text-muted-foreground">
                A full calendar of hands-on events — from hackathons to deep-dive
                workshops. Details drop soon.
              </p>
            </div>
          </div>
        </Reveal>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {EVENTS.map((e, i) => (
            <Reveal key={e.title} delay={i * 0.1}>
              <article
                data-cursor="lens"
                className="group flex h-full flex-col rounded-lg border border-[var(--border)] bg-[var(--card)]/50 p-6 transition-all duration-300 hover:border-[var(--matrix)] hover:box-glow"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-[var(--matrix)]">
                    <Calendar size={13} /> {e.tag}
                  </span>
                  <span className="rounded border border-[var(--border)] px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {e.status}
                  </span>
                </div>
                <h3 className="mb-2 font-display text-xl text-foreground transition-colors group-hover:text-[var(--matrix)]">
                  {e.title}
                </h3>
                <p className="flex-1 font-mono text-sm leading-relaxed text-muted-foreground">
                  {e.desc}
                </p>
                <span className="mt-5 inline-flex items-center gap-1 font-mono text-xs uppercase tracking-widest text-[var(--matrix)] opacity-0 transition-opacity group-hover:opacity-100">
                  Details soon <ArrowUpRight size={13} />
                </span>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

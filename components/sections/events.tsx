'use client'

import { Calendar, ArrowUpRight } from 'lucide-react'
import { SectionHeading } from '../section-heading'
import { Reveal } from '../reveal'

const EVENTS = [
  {
    tag: 'Branch Gala',
    title: 'Lumière — The Gala',
    status: '29 Oct 2025',
    desc: 'The CSE branch entry programme at Kalam Auditorium, themed “Where Glam Meets Glow.” Organised by the Cipher Association with coordinated red, gold and black décor, it welcomed students into the department and reinforced a shared sense of collective identity.',
  },
  {
    tag: 'Competition',
    title: 'PROMPT OPS-2K26',
    status: '25 Mar 2026',
    desc: 'A technical competition on prompt engineering and AI tools by the AgentBlazer Club and Cipher. Track 1 (1st Year) covered invitation, logo and image recreation; Track 2 (2nd Year) tested JSON conversion, Python debugging and a Gemini AI security prompt challenge.',
  },
]

export function Events() {
  return (
    <section id="events" className="relative border-t border-[var(--border)] py-24">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <SectionHeading label="activities" title="Events & Workshops" />
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
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

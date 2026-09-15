'use client'

import { Code2, Crown, Users, Rocket } from 'lucide-react'
import { SectionHeading } from '../section-heading'
import { StaggerGroup, StaggerItem, Reveal } from '../reveal'

const STATS = [
  { value: '01', label: 'Department Association' },
  { value: '∞', label: 'Ideas Compiled' },
  { value: '24/7', label: 'Curiosity Uptime' },
]

const DOMAINS = [
  {
    icon: Code2,
    title: 'Technical Skill Building',
    desc: 'Hands-on workshops, coding sessions, and tech talks that turn theory into working software.',
  },
  {
    icon: Crown,
    title: 'Leadership & Governance',
    desc: 'Annual elections for President, Secretary, and office bearers — guided by the HOD and Faculty Coordinator.',
  },
  {
    icon: Users,
    title: 'Events & Collaboration',
    desc: 'Hackathons, seminars, and department-level competitions that bring students together.',
  },
  {
    icon: Rocket,
    title: 'Industry Readiness',
    desc: 'Bridging classroom learning with real-world application to prepare students for the field.',
  },
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

        <div className="mt-20">
          <Reveal>
            <SectionHeading label="what we do" title="Our Domains" />
          </Reveal>

          <StaggerGroup className="mt-12 grid gap-5 sm:grid-cols-2">
            {DOMAINS.map((d) => (
              <StaggerItem key={d.title}>
                <article
                  data-cursor="lens"
                  className="group h-full rounded-lg border border-[var(--border)] bg-[var(--card)]/50 p-7 transition-all duration-300 hover:border-[var(--matrix)] hover:box-glow"
                >
                  <div className="mb-5 inline-flex rounded-md border border-[var(--border)] bg-[#050705] p-3 text-[var(--matrix)] transition-colors group-hover:border-[var(--matrix)]">
                    <d.icon size={22} />
                  </div>
                  <h3 className="mb-2 font-display text-2xl text-foreground transition-colors group-hover:text-[var(--matrix)] group-hover:text-glow">
                    {d.title}
                  </h3>
                  <p className="font-mono text-sm leading-relaxed text-muted-foreground">
                    {d.desc}
                  </p>
                </article>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </div>
    </section>
  )
}

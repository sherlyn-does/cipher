'use client'

import { Code2, Crown, Users, Rocket } from 'lucide-react'
import { SectionHeading } from '../section-heading'
import { StaggerGroup, StaggerItem, Reveal } from '../reveal'
import { CursorPhotoTrail } from '../cursor-photo-trail'

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

        {/* Same two-column layout the stats table used to live in.
            Left: the paragraph. Right: the trail zone, side-by-side. */}
        <div className="mt-8 grid items-start gap-12 md:grid-cols-[1.4fr_1fr]">
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

          {/* Fully invisible box (no border/background) — photo size and the
              "CIPHER" label are both sized relative to THIS box's own width,
              so they fit correctly in this narrower side column. Photos only
              trail inside this box, and only while it's scrolled into view,
              so it stays off during the intro. */}
          <Reveal delay={0.15} className="-mt-20">
            <div className="relative h-72 w-full overflow-hidden sm:h-80 lg:h-[26rem]">
              <CursorPhotoTrail label="CIPHER" />
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

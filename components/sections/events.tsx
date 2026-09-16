'use client'

import { Calendar, ArrowUpRight } from 'lucide-react'
import { SectionHeading } from '../section-heading'
import { Reveal } from '../reveal'

const ACTIVITIES = [
  { title: 'Applied Machine Learning', href: 'https://sjec.ac.in/cipher/activity/applied-machine-learning' },
  { title: 'Industrial Visit', href: 'https://sjec.ac.in/cipher/activity/industrial-visit-1' },
  { title: 'LaTeX Tool', href: 'https://sjec.ac.in/cipher/activity/latex-tool' },
  { title: 'Robotic Process Automation using UiPath', href: 'https://sjec.ac.in/cipher/activity/robotic-process-automation-design-and-development-using-uipath' },
  { title: 'HackTO Future 20', href: 'https://sjec.ac.in/cipher/activity/hackto-future-20' },
  { title: 'How to Win at the Sport of Programming', href: 'https://sjec.ac.in/cipher/activity/how-to-win-at-the-sport-of-programming' },
  { title: 'Introduction to Google Crowdsource', href: 'https://sjec.ac.in/cipher/activity/introduction-to-google-crowdsource' },
  { title: 'Educational Session on GitHub', href: 'https://sjec.ac.in/cipher/activity/educational-session-on-github' },
  { title: 'Industrial Visit', href: 'https://sjec.ac.in/cipher/activity/industrial-visit' },
  { title: 'UDAAN Mock Interview', href: 'https://sjec.ac.in/cipher/activity/udaan-mock-interview' },
  { title: 'Freshers Onboarding Programme', href: 'https://sjec.ac.in/cipher/activity/freshers-onboarding-programme' },
  { title: 'Projects Funded by KSCST', href: 'https://sjec.ac.in/cipher/activity/projects-funded-by-kscst' },
  { title: 'Generative AI Tools for Research', href: 'https://sjec.ac.in/cipher/activity/generative-ai-tools-for-research' },
  { title: 'Introduction to Blockchain: Solidity Workshop', href: 'https://sjec.ac.in/cipher/activity/introduction-to-blockchain-beginners-worskhop-on-solidity-programming' },
  { title: 'Star UML', href: 'https://sjec.ac.in/cipher/activity/star-uml' },
  { title: 'Generative AI: Custom Solutions using OpenAI', href: 'https://sjec.ac.in/cipher/activity/generative-ai-grafting-custom-solutions-for-your-needs-using-open-ai' },
  { title: 'React.js and Node.js Workshop', href: 'https://sjec.ac.in/cipher/activity/reactjs-and-nodejs-workshop' },
]

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

        <div className="mt-20">
          <Reveal>
            <SectionHeading label="archive" title="Activities" />
          </Reveal>

          <p className="mt-4 max-w-2xl font-mono text-sm leading-relaxed text-muted-foreground">
            Hands-on workshops, industrial visits, and technical sessions run by the Cipher Association — spanning AI, blockchain, research tooling, and career prep.
          </p>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ACTIVITIES.map((a, i) => (
              <Reveal key={a.href} delay={(i % 3) * 0.05}>
                <a
                  href={a.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="lens"
                  className="group flex h-full items-start justify-between gap-3 rounded-lg border border-[var(--border)] bg-[var(--card)]/50 p-4 transition-all duration-300 hover:border-[var(--matrix)] hover:box-glow"
                >
                  <div className="flex items-start gap-3">
                    <span className="font-mono text-[10px] leading-5 text-[var(--matrix)]">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="font-mono text-sm leading-snug text-foreground transition-colors group-hover:text-[var(--matrix)]">
                      {a.title}
                    </h3>
                  </div>
                  <ArrowUpRight
                    size={15}
                    className="mt-0.5 shrink-0 text-muted-foreground transition-colors group-hover:text-[var(--matrix)]"
                  />
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

import { Users, Camera, Mail } from 'lucide-react'

const SOCIALS = [
  { icon: Users, href: '#', label: 'LinkedIn' },
  { icon: Camera, href: '#', label: 'Instagram' },
  { icon: Mail, href: 'mailto:cipher@cse.edu', label: 'Email' },
]

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[#050705] py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 px-5 md:flex-row">
        <div className="text-center md:text-left">
          <div className="font-display text-2xl text-[var(--matrix)] text-glow">
            CIPHER
          </div>
          <p className="mt-2 font-mono text-xs text-muted-foreground">
            Student Association · Computer Science &amp; Engineering
          </p>
        </div>

        <div className="flex items-center gap-3">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              aria-label={s.label}
              className="rounded-md border border-[var(--border)] p-2.5 text-muted-foreground transition-colors hover:border-[var(--matrix)] hover:text-[var(--matrix)]"
            >
              <s.icon size={18} />
            </a>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-6xl px-5">
        <div className="border-t border-[var(--border)] pt-6 text-center font-mono text-xs text-[var(--matrix-dim)]">
          <span>{'>'} © {new Date().getFullYear()} CIPHER. All systems operational.</span>
        </div>
      </div>
    </footer>
  )
}

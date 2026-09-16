import { FaGithub, FaLinkedinIn, FaInstagram } from 'react-icons/fa'
import { Mail } from 'lucide-react'

const SOCIALS = [
  { icon: Mail, href: 'email@example.com', label: 'Email' },
  { icon: FaLinkedinIn, href: 'https://www.linkedin.com/company/ciphersjec/', label: 'LinkedIn' },
  { icon: FaGithub, href: 'YOUR_GITHUB_URL', label: 'GitHub' },
  { icon: FaInstagram, href: 'https://www.instagram.com/ciphersjec?stkn=MmRlZjNzMW1tNjZ2', label: 'Instagram' },
  
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

        <div className="flex items-center gap-4">
  {SOCIALS.map((s) => (
    <a
      key={s.label}
      href={s.href}
      target={s.label === 'Email' ? undefined : '_blank'}
      rel={s.label === 'Email' ? undefined : 'noopener noreferrer'}
      aria-label={s.label}
      className="group flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border)] text-muted-foreground transition-all duration-300 hover:-translate-y-1 hover:border-[var(--matrix)] hover:bg-[var(--matrix)]/10 hover:text-[var(--matrix)] hover:shadow-[0_0_20px_rgba(0,255,65,0.25)]"
    >
      <s.icon
        size={21}
        strokeWidth={1.7}
        className="transition-transform duration-300 group-hover:scale-110"
      />
    </a>
  ))}
</div>
      </div>

      <div className="mx-auto mt-8 max-w-6xl px-5">
        <div className="border-t border-[var(--border)] pt-6 text-center font-mono text-xs text-[var(--matrix-dim)]">
          <span>{'>'} © {new Date().getFullYear()} CIPHER SJEC.</span>
        </div>
      </div>
    </footer>
  )
}

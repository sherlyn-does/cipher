'use client'

import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'

const LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Team', href: '#leadership' },
  { label: 'Events', href: '#events' },
  { label: 'Join', href: '#join' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-[var(--border)] bg-[#050705]/85 backdrop-blur-md'
          : 'border-b border-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <a
          href="#top"
          className="font-display text-2xl leading-none text-[var(--matrix)] text-glow"
          aria-label="CIPHER home"
        >
          CIPHER
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="group relative font-mono text-sm uppercase tracking-wider text-muted-foreground transition-colors hover:text-[var(--matrix)]"
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-[var(--matrix)] shadow-[0_0_8px_var(--matrix-glow)] transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#join"
          className="hidden rounded-md border border-[var(--matrix)] px-4 py-2 font-mono text-xs uppercase tracking-wider text-[var(--matrix)] transition-colors hover:bg-[rgba(0,255,65,0.1)] md:inline-block"
        >
          Join CIPHER
        </a>

        <button
          type="button"
          className="text-[var(--matrix)] md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-[var(--border)] bg-[#050705]/95 backdrop-blur-md md:hidden">
          <ul className="flex flex-col px-5 py-4">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 font-mono text-sm uppercase tracking-wider text-muted-foreground transition-colors hover:text-[var(--matrix)]"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}

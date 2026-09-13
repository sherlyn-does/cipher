'use client'

import { useRef, type ReactNode } from 'react'
import { motion } from 'motion/react'

interface MagneticButtonProps {
  children: ReactNode
  href?: string
  onClick?: () => void
  variant?: 'solid' | 'outline'
  className?: string
}

/** A CTA with a subtle magnetic pull toward the cursor. */
export function MagneticButton({
  children,
  href,
  onClick,
  variant = 'solid',
  className = '',
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement>(null)

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - (rect.left + rect.width / 2)
    const y = e.clientY - (rect.top + rect.height / 2)
    el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`
  }
  const handleLeave = () => {
    const el = ref.current
    if (el) el.style.transform = 'translate(0px, 0px)'
  }

  const base =
    'relative inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 font-mono text-sm font-medium uppercase tracking-wider transition-[background-color,color,box-shadow] duration-200 will-change-transform'
  const styles =
    variant === 'solid'
      ? 'bg-[var(--matrix)] text-[#030503] box-glow hover:box-glow-hover'
      : 'border border-[var(--matrix)] text-[var(--matrix)] hover:bg-[rgba(0,255,65,0.08)] box-glow'

  const content = (
    <motion.span
      className="inline-flex items-center gap-2"
      whileTap={{ scale: 0.96 }}
    >
      {children}
    </motion.span>
  )

  if (href) {
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className={`${base} ${styles} ${className}`}
      >
        {content}
      </a>
    )
  }
  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type="button"
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`${base} ${styles} ${className}`}
    >
      {content}
    </button>
  )
}

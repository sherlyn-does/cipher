'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { MatrixRain } from './matrix-rain'

const KONAMI = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
]

/** Konami-code backdoor: unlocks a hidden "root access" overlay. */
export function EasterEgg() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let idx = 0
    const onKey = (e: KeyboardEvent) => {
  const target = e.target as HTMLElement

  if (
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.isContentEditable
  ) {
    return
  }

  const rawKey = e.key ?? ''
  const key = rawKey.length === 1 ? rawKey.toLowerCase() : rawKey

  if (key === KONAMI[idx]) {
    idx++

    if (idx === KONAMI.length) {
      setOpen(true)
      idx = 0
    }
  } else {
    idx = key === KONAMI[0] ? 1 : 0
  }
}
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[300] flex items-center justify-center overflow-hidden bg-[#050705]/95 bg-scanlines p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
        >
          <MatrixRain opacity={0.3} intense />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="relative max-w-md rounded-lg border border-[var(--matrix)] bg-[#050705]/90 p-8 text-center box-glow"
          >
            <div className="font-display text-5xl text-[var(--matrix)] text-glow-strong">
              ROOT ACCESS
            </div>
            <p className="mt-4 font-mono text-sm leading-relaxed text-muted-foreground">
              {'>'} You found the backdoor. Welcome to the inner circle of{' '}
              <span className="text-[var(--matrix)]">CIPHER</span>. The real code
              was inside you all along.
            </p>
            <button
              type="button"
              className="mt-6 font-mono text-xs uppercase tracking-widest text-[var(--matrix-dim)] transition-colors hover:text-[var(--matrix)]"
            >
              [ close connection ]
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

'use client'

import { motion } from 'motion/react'
import { ArrowRight, Terminal } from 'lucide-react'
import { MagneticButton } from '../magnetic-button'
import CipherLogo from '../cipher-logo'

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-screen flex-col items-center overflow-hidden"
    >
      {/* Interactive ASCII wordmark centerpiece */}
      <div className="relative h-[58vh] min-h-[360px] w-full">
        <CipherLogo height="100%" tagline="CSE Student Association" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-[#050705]" />
      </div>

      <div className="relative mx-auto -mt-10 w-full max-w-6xl px-5 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)]/60 px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-[var(--matrix)]"
        >
          <Terminal size={14} />
          Student Association · CSE Department
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl font-display text-3xl leading-[0.95] text-foreground text-glow sm:text-4xl md:text-5xl"
        >
          Student Association of Computer Science &amp; Engineering
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 max-w-xl font-mono text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          Bridging academic knowledge and practical application — a community of
          aspiring professionals in computing.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <MagneticButton href="#join">
            Join CIPHER <ArrowRight size={16} />
          </MagneticButton>
          <MagneticButton href="#events" variant="outline">
            Explore Events
          </MagneticButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-16 flex items-center gap-3 font-mono text-xs text-[var(--matrix-dim)]"
        >
          <span className="h-8 w-px animate-pulse bg-[var(--matrix)]" />
          scroll to decrypt more
        </motion.div>
      </div>
    </section>
  )
}

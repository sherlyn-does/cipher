'use client'

import { useState } from 'react'
import { ArrowRight, X } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { MatrixRain } from '../matrix-rain'
import { ScrambleText } from '../scramble-text'
import { MagneticButton } from '../magnetic-button'
import { Reveal } from '../reveal'

export function Join() {
  const [isOpen, setIsOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const message = formData.get('message') as string

    const subject = encodeURIComponent(`CIPHER Access Request - ${name}`)
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    )
    window.location.href = `mailto:cipher@cse.edu?subject=${subject}&body=${body}`
  }

  return (
    <>
      <section
        id="join"
        className="relative overflow-hidden border-t border-[var(--border)] py-28"
      >
        <MatrixRain opacity={0.1} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#050705] via-transparent to-[#050705]" />
        <div className="relative mx-auto max-w-3xl px-5 text-center">
          <div className="mb-4 font-mono text-xs uppercase tracking-[0.4em] text-[var(--matrix)]">
            // access club
          </div>

          <ScrambleText
            as="h2"
            text="Join the Team"
            className="font-display text-4xl leading-tight text-foreground text-glow sm:text-5xl md:text-6xl"
          />

          <Reveal delay={0.15}>
            <p className="mx-auto mt-6 max-w-xl font-mono text-base leading-relaxed text-muted-foreground">
              Whether you want to build, lead, or simply learn — CIPHER is where CSE
              students turn curiosity into capability. Join the community and help
              shape what comes next.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              {/* REQUEST ACCESS BUTTON */}
              <MagneticButton onClick={() => setIsOpen(true)}>
                Join <ArrowRight size={16} />
              </MagneticButton>
              <MagneticButton href="#top" variant="outline">
                Back to Top
              </MagneticButton>
            </div>
          </Reveal>
        </div>
      </section>

      {/* POPUP MODAL */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="join-modal fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-5 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="relative w-full max-w-md rounded-lg border border-[var(--matrix)]/40 bg-[#050705] p-8"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* subtle matrix background */}
              <div className="pointer-events-none absolute inset-0 opacity-20">
                <MatrixRain opacity={0.15} />
              </div>

              <div className="relative z-10">
                {/* CLOSE BUTTON */}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center rounded-md border border-[var(--matrix)]/40 text-[var(--matrix)] transition-colors hover:bg-[var(--matrix)]/10"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>

                {/* HEADER */}
                <div className="mb-7 pr-10">
                  <div className="mb-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--matrix)]">
                    // access request
                  </div>
                  <h3 className="font-display text-3xl text-foreground text-glow">
                    Join CIPHER
                  </h3>
                  <p className="mt-2 font-mono text-xs leading-relaxed text-muted-foreground">
                    Send us a message and we'll get back to you.
                  </p>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* NAME */}
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block font-mono text-xs uppercase tracking-wider text-[var(--matrix)]"
                    >
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="Enter your name"
                      className="w-full rounded-md border border-[var(--matrix)]/40 bg-black/40 px-4 py-3 font-mono text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/50 focus:border-[var(--matrix)] focus:shadow-[0_0_15px_rgba(0,255,65,0.12)]"
                    />
                  </div>

                  {/* EMAIL */}
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block font-mono text-xs uppercase tracking-wider text-[var(--matrix)]"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="Enter your email"
                      className="w-full rounded-md border border-[var(--matrix)]/40 bg-black/40 px-4 py-3 font-mono text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/50 focus:border-[var(--matrix)] focus:shadow-[0_0_15px_rgba(0,255,65,0.12)]"
                    />
                  </div>

                  {/* MESSAGE */}
                  <div>
                    <label
                      htmlFor="message"
                      className="mb-2 block font-mono text-xs uppercase tracking-wider text-[var(--matrix)]"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={4}
                      placeholder="Tell us why you'd like to join..."
                      className="w-full resize-none rounded-md border border-[var(--matrix)]/40 bg-black/40 px-4 py-3 font-mono text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/50 focus:border-[var(--matrix)] focus:shadow-[0_0_15px_rgba(0,255,65,0.12)]"
                    />
                  </div>

                  {/* SUBMIT */}
                  <motion.button
                    type="submit"
                    whileHover={{ y: -4, scale: 1.02 }}
                    whileTap={{ y: 0, scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    className="flex w-full items-center justify-center gap-2 rounded-md bg-[var(--matrix)] px-6 py-3 font-mono text-sm font-medium uppercase tracking-wider text-[#030503] transition-shadow hover:shadow-[0_0_25px_rgba(0,255,65,0.35)]"
                  >
                    Send
                    <ArrowRight size={16} />
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

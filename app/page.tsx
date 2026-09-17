'use client'

import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { IntroSequence } from '@/components/intro-sequence'
import { Waves } from '@/components/waves-background'
import { CustomCursor } from '@/components/custom-cursor'
import { EasterEgg } from '@/components/easter-egg'
import { IdleHint } from '@/components/idle-hint'
import { Navbar } from '@/components/navbar'
import { Hero } from '@/components/sections/hero'
import { About } from '@/components/sections/about'
import { Leadership } from '@/components/sections/leadership'
import { Events } from '@/components/sections/events'
import { Join } from '@/components/sections/join'
import { Footer } from '@/components/sections/footer'

export default function Page() {
  const [introDone, setIntroDone] = useState(false)

  // Lock scroll while the intro sequence plays.
  useEffect(() => {
    document.body.style.overflow = introDone ? '' : 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [introDone])

  return (
    <>
      <CustomCursor />
      <EasterEgg />
      <IdleHint />

      {!introDone && <IntroSequence onComplete={() => setIntroDone(true)} />}

      {introDone && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-0 pointer-events-none"
        >
          <Waves style={{ position: 'fixed' }} />
        </div>
      )}

      <motion.main
        className="relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: introDone ? 1 : 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <Navbar />
        <Hero />
        <About />
        <Leadership />
        <Events />
        <Join />
        <Footer />
      </motion.main>
    </>
  )
}

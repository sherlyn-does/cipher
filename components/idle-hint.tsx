'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

const IDLE_MS = 5000

/** Shows a subtle text hint after 13s of no user activity, nudging toward the Konami code. */
export function IdleHint() {
  const [visible, setVisible] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const startTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setVisible(true), IDLE_MS)
    }

    const handleActivity = () => {
      setVisible(false)
      startTimer()
    }

    const events: (keyof WindowEventMap)[] = [
      'mousemove',
      'keydown',
      'scroll',
      'touchstart',
      'wheel',
    ]
    events.forEach((event) =>
      window.addEventListener(event, handleActivity, { passive: true })
    )

    startTimer()

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      events.forEach((event) => window.removeEventListener(event, handleActivity))
    }
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="pointer-events-none fixed bottom-6 left-1/2 z-[90] -translate-x-1/2"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.4 }}
        >
          <p className="font-mono text-[11px] tracking-wide text-muted-foreground/60">
            Try this: ↑ ↑ ↓ ↓ ← → ← → B A
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

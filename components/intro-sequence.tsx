'use client'

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { MatrixRain } from './matrix-rain'

const BOOT_LINES = [
  '> establishing connection...',
  '> authenticating access...',
  '> decrypting CIPHER_v1.0...',
  '__PROGRESS__',
  '> access granted',
]

const WORD = 'CIPHER'
const SCRAMBLE = '#$%&@!?<>[]{}=+*/01ΣΦΨΩ'
const HARD_TIMEOUT = 3000

type Phase = 'boot' | 'decrypt' | 'done'

export function IntroSequence({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<Phase>('boot')
  const finished = useRef(false)

  const finish = useCallback(() => {
    if (finished.current) return
    finished.current = true
    setPhase('done')
    // allow exit animation to play before unmounting via parent
    setTimeout(onComplete, 650)
  }, [onComplete])

  const skip = useCallback(() => {
    if (phase === 'boot') setPhase('decrypt')
    else finish()
  }, [phase, finish])

  // Allow skipping via scroll/wheel/touch anywhere during the sequence
  useEffect(() => {
    if (phase === 'done') return
    const onWheel = () => skip()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') skip()
    }
    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKey)
    }
  }, [phase, skip])

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[200] overflow-hidden bg-[#050705] bg-scanlines"
          onClick={skip}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(6px)' }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          <MatrixRain opacity={0.18} intense />
          <div className="absolute inset-0 flex items-center justify-center p-6">
            {phase === 'boot' ? (
              <BootScreen
                onReady={() => setPhase('decrypt')}
              />
            ) : (
              <DecryptReveal onResolved={finish} />
            )}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              skip()
            }}
            className="absolute bottom-6 right-6 z-10 font-mono text-xs uppercase tracking-widest text-[var(--matrix-dim)] transition-colors hover:text-[var(--matrix)]"
          >
            [ skip &gt; ]
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ---------------- Boot screen ---------------- */

function BootScreen({ onReady }: { onReady: () => void }) {
  const [typed, setTyped] = useState<string[]>([])
  const [current, setCurrent] = useState('')
  const [lineIndex, setLineIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const readyRef = useRef(false)
  const doneRef = useRef(false)

  // Track real asset-loading progress (fonts + window load) with a hard timeout.
  useEffect(() => {
    let target = 15
    let raf = 0
    const start = performance.now()

    const bump = (v: number) => {
      target = Math.max(target, v)
    }

    document.fonts?.ready.then(() => bump(70))
    if (document.readyState === 'complete') bump(100)
    else window.addEventListener('load', () => bump(100), { once: true })

    const loop = () => {
      const elapsed = performance.now() - start
      // creep upward toward target, and force completion past the hard timeout
      if (elapsed > HARD_TIMEOUT) target = 100
      setProgress((p) => {
        const next = p + (target - p) * 0.06 + 0.4
        return Math.min(next, 100)
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const progressBar = useMemo(() => {
    const pct = Math.round(progress)
    const filled = Math.round((pct / 100) * 10)
    const bar = '='.repeat(filled) + ' '.repeat(10 - filled)
    return `> loading modules... [${bar}] ${pct}%`
  }, [progress])

  // Type out the boot lines one character at a time.
  useEffect(() => {
    if (lineIndex >= BOOT_LINES.length) return
    const raw = BOOT_LINES[lineIndex]

    // The progress line waits until real loading is complete.
    if (raw === '__PROGRESS__') {
      if (progress < 99.5) {
        setCurrent(progressBar)
        return
      }
      setTyped((t) => [...t, progressBar])
      setCurrent('')
      setLineIndex((i) => i + 1)
      return
    }

    let i = 0
    setCurrent('')
    const id = setInterval(() => {
      i++
      setCurrent(raw.slice(0, i))
      if (i >= raw.length) {
        clearInterval(id)
        setTimeout(() => {
          setTyped((t) => [...t, raw])
          setCurrent('')
          setLineIndex((n) => n + 1)
        }, 50)
      }
    }, 10)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lineIndex, progress >= 99.5])

  // keep the progress line updating while it is the current line
  useEffect(() => {
    if (BOOT_LINES[lineIndex] === '__PROGRESS__' && progress < 99.5) {
      setCurrent(progressBar)
    }
  }, [progressBar, lineIndex, progress])

  // When all lines are typed, hand off to decrypt.
  useEffect(() => {
    if (lineIndex >= BOOT_LINES.length && !doneRef.current) {
      doneRef.current = true
      readyRef.current = true
      const t = setTimeout(onReady, 500)
      return () => clearTimeout(t)
    }
  }, [lineIndex, onReady])

  return (
    <div className="w-full max-w-xl font-mono text-sm leading-relaxed text-[var(--matrix)] sm:text-base">
      {typed.map((line, i) => (
        <div
          key={i}
          className={
            line === '> access granted'
              ? 'text-glow text-[var(--matrix)]'
              : ''
          }
        >
          {line}
        </div>
      ))}
      {lineIndex < BOOT_LINES.length && (
        <div>
          <span>{current}</span>
          <span className="cursor-blink">█</span>
        </div>
      )}
    </div>
  )
}

/* ---------------- Decrypt reveal ---------------- */

function DecryptReveal({ onResolved }: { onResolved: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([])
  const [display, setDisplay] = useState<string[]>(WORD.split(''))
  const lockedRef = useRef<boolean[]>(WORD.split('').map(() => false))
  const lensRef = useRef<HTMLDivElement>(null)
  const pointer = useRef<{ x: number; y: number; active: boolean }>({
    x: -9999,
    y: -9999,
    active: false,
  })

  useEffect(() => {
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (reduced) {
      setDisplay(WORD.split(''))
      const t = setTimeout(onResolved, 700)
      return () => clearTimeout(t)
    }

    let raf = 0
    let lastScramble = 0
    const startTime = performance.now()
    const lensRadius = 90

    const onMove = (e: PointerEvent) => {
      pointer.current = { x: e.clientX, y: e.clientY, active: true }
    }
    window.addEventListener('pointermove', onMove)

    const loop = (now: number) => {
      const elapsed = now - startTime

      // Auto-lock letters left to right so the reveal always completes,
      // even without pointer movement (e.g. on mobile).
      const lockCount = Math.floor(elapsed / 420)
      for (let i = 0; i < WORD.length; i++) {
        if (i < lockCount) lockedRef.current[i] = true
      }

      // Auto-moving lens (mobile / no pointer): sweep across the word.
      let lx = pointer.current.x
      let ly = pointer.current.y
      if (!pointer.current.active && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const t = (Math.sin(elapsed / 700) + 1) / 2
        lx = rect.left + t * rect.width
        ly = rect.top + rect.height / 2
      }
      if (lensRef.current) {
        lensRef.current.style.transform = `translate3d(${lx}px, ${ly}px, 0) translate(-50%, -50%)`
        lensRef.current.style.opacity = '1'
      }

      if (now - lastScramble > 55) {
        lastScramble = now
        const next = WORD.split('').map((ch, i) => {
          if (lockedRef.current[i]) return ch
          const el = letterRefs.current[i]
          if (el) {
            const r = el.getBoundingClientRect()
            const cx = r.left + r.width / 2
            const cy = r.top + r.height / 2
            const dist = Math.hypot(cx - lx, cy - ly)
            if (dist < lensRadius) return ch // revealed under the lens
          }
          return SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)]
        })
        setDisplay(next)
      }

      if (lockCount >= WORD.length + 1) {
        setDisplay(WORD.split(''))
        window.removeEventListener('pointermove', onMove)
        setTimeout(onResolved, 500)
        return
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
    }
  }, [onResolved])

  return (
    <motion.div
      className="relative flex w-full flex-col items-center justify-center"
      initial={{ scale: 1, opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ scale: 0.4, opacity: 0, y: -140 }}
      transition={{ duration: 0.5 }}
    >
      <div
        ref={containerRef}
        className="font-matrix flex select-none text-[clamp(3.5rem,20vw,16rem)] leading-none tracking-tight text-[var(--matrix)] text-glow-strong"
      >
        {display.map((ch, i) => (
          <span
            key={i}
            ref={(el) => {
              letterRefs.current[i] = el
            }}
            className="inline-block w-[0.72em] text-center"
            aria-hidden="true"
          >
            {ch}
          </span>
        ))}
      </div>
      

      
    </motion.div>
  )
}

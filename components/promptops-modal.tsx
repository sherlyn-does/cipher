'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, animate, useMotionValue, useTransform, type PanInfo } from 'motion/react'
import { X, ArrowRight, ArrowLeft } from 'lucide-react'

const PHOTOS = [
  '/promptops/website_photo_1.jpg',
  '/promptops/website_photo_2.jpg',
  '/promptops/website_photo_3.jpg',
  '/promptops/website_photo_4.jpg',
  '/promptops/website_photo_5.jpg',
  '/promptops/website_photo_6.jpg',
  '/promptops/website_photo_7.jpg',
  '/promptops/website_photo_8.jpg',
]

const SWIPE_THRESHOLD = 110

function TopCard({
  photo,
  position,
  total,
  onSwiped,
}: {
  photo: string
  position: number
  total: number
  onSwiped: () => void
}) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-240, 0, 240], [-16, 0, 16])
  const opacity = useTransform(x, [-320, -160, 0, 160, 320], [0, 1, 1, 1, 0])

  const fling = useCallback(
    (dir: number) => {
      animate(x, dir * 640, {
        type: 'spring',
        stiffness: 320,
        damping: 34,
        onComplete: onSwiped,
      })
    },
    [x, onSwiped],
  )

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > SWIPE_THRESHOLD || Math.abs(info.velocity.x) > 520) {
      fling(info.offset.x > 0 ? 1 : -1)
    }
  }

  return (
    <motion.div
      className="absolute inset-0 cursor-grab touch-none overflow-hidden rounded-lg border border-[var(--matrix)]/60 bg-[var(--card)] shadow-2xl shadow-black/60 box-glow active:cursor-grabbing"
      style={{ x, rotate, opacity, touchAction: 'none' }}
      drag="x"
      dragSnapToOrigin
      dragElastic={0.55}
      whileTap={{ scale: 0.98 }}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.94, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
    >
      <Image
        src={photo || '/placeholder.svg'}
        alt="PROMPT OPS-2K26"
        fill
        draggable={false}
        sizes="(max-width: 768px) 90vw, 420px"
        className="select-none object-cover"
        priority
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/30" />

      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-3 font-mono text-[10px] uppercase tracking-widest text-[var(--matrix)]">
        <span>PROMPT_OPS</span>
        <span>
          {String(position + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4">
        <span className="inline-block rounded border border-[var(--matrix)]/50 bg-black/50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-[var(--matrix)]">
          25 Mar 2026
        </span>
        <h4 className="mt-2 font-display text-lg leading-tight text-foreground">PROMPT OPS-2K26</h4>
        <p className="font-mono text-xs text-muted-foreground">AgentBlazer Club × Cipher</p>
      </div>
    </motion.div>
  )
}

export function PromptOpsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [index, setIndex] = useState(0)

  const advance = useCallback(() => setIndex((p) => (p + 1) % PHOTOS.length), [])

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') advance()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose, advance])

  useEffect(() => {
    if (!open) setIndex(0)
  }, [open])

  if (!open) return null

  const behind = [(index + 1) % PHOTOS.length, (index + 2) % PHOTOS.length]

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="PROMPT OPS-2K26 photo archive"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      <motion.div
        className="absolute inset-0 bg-black/85 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
      />

      <motion.div
        className="relative z-10 grid max-h-[90vh] w-full max-w-4xl gap-6 overflow-y-auto rounded-lg border border-[var(--matrix)]/40 bg-[var(--background)]/95 p-6 md:grid-cols-2 md:p-8"
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          data-cursor="lens"
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded border border-[var(--border)] text-muted-foreground transition-colors hover:border-[var(--matrix)] hover:text-[var(--matrix)]"
        >
          <X size={16} />
        </button>

        <div className="flex flex-col">
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--matrix)]">
            CIPHER // ACTIVITIES
          </span>
          <h3 className="mt-2 font-display text-2xl text-foreground md:text-3xl">PROMPT OPS-2K26</h3>
          <span className="mt-1 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            25 March 2026 · Prompt Engineering Competition
          </span>
          <p className="mt-4 font-mono text-sm leading-relaxed text-muted-foreground">
            Organized by the AgentBlazer Club and Cipher under the guidance of Ms. Nisha J Roche,
            Ms. Jaishma K, and HOD Dr. Melwyn D&rsquo;Souza, this technical competition focused on
            prompt engineering and AI tools (mapped to PO4, PO5, PO8, PO11).
          </p>
          <p className="mt-3 font-mono text-sm leading-relaxed text-muted-foreground">
            Track 1 (1st Year) featured invitation generation, logo recreation, and image recreation
            rounds, with Chinmayee, Chris Royston Monteiro, and Deeksha Ravi Moger taking top honors.
          </p>
          <p className="mt-3 font-mono text-sm leading-relaxed text-muted-foreground">
            Track 2 (2nd Year) tested students in JSON conversion, Python code debugging, and a Gemini
            AI security prompt extraction challenge, with Harimurali KS, Venus Suhani D&rsquo;Lima, and
            Venisha Snehal D&rsquo;Souza securing top positions.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="relative aspect-[3/4] w-full max-w-[320px]">
            {behind
              .slice()
              .reverse()
              .map((p, i) => {
                const depth = behind.length - i
                return (
                  <div
                    key={`behind-${p}`}
                    className="absolute inset-0 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--card)]"
                    style={{
                      transform: `translateY(${depth * 10}px) scale(${1 - depth * 0.05})`,
                      opacity: 1 - depth * 0.25,
                    }}
                  >
                    <Image
                      src={PHOTOS[p] || '/placeholder.svg'}
                      alt=""
                      fill
                      sizes="320px"
                      className="object-cover opacity-70"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                  </div>
                )
              })}

            <TopCard
              key={index}
              photo={PHOTOS[index]}
              position={index}
              total={PHOTOS.length}
              onSwiped={advance}
            />
          </div>

          <div className="mt-5 flex w-full max-w-[320px] items-center justify-between">
            <button
              onClick={advance}
              aria-label="Previous photo"
              data-cursor="lens"
              className="flex h-9 w-9 items-center justify-center rounded border border-[var(--border)] text-muted-foreground transition-colors hover:border-[var(--matrix)] hover:text-[var(--matrix)]"
            >
              <ArrowLeft size={16} />
            </button>

            <div className="flex flex-col items-center">
              <span className="font-mono text-xs tracking-widest text-[var(--matrix)]">
                {String(index + 1).padStart(2, '0')} / {String(PHOTOS.length).padStart(2, '0')}
              </span>
              <span className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Swipe to explore →
              </span>
            </div>

            <button
              onClick={advance}
              aria-label="Next photo"
              data-cursor="lens"
              className="flex h-9 w-9 items-center justify-center rounded border border-[var(--border)] text-muted-foreground transition-colors hover:border-[var(--matrix)] hover:text-[var(--matrix)]"
            >
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="mt-4 flex gap-1.5">
            {PHOTOS.map((_, i) => (
              <span
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === index ? 'w-6 bg-[var(--matrix)]' : 'w-1.5 bg-[var(--border)]'
                }`}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

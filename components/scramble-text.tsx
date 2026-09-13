'use client'

import { useEffect, useRef, useState, type ElementType } from 'react'

const CHARS = '!<>-_\\/[]{}—=+*^?#________ΣΦΨΩ01'

interface ScrambleTextProps {
  text: string
  as?: ElementType
  className?: string
  /** ms between resolving each character */
  speed?: number
  /** Start scrambling only when scrolled into view */
  triggerOnView?: boolean
  /** Delay before starting (ms) */
  delay?: number
}

/**
 * Renders text that briefly scrambles through random glyphs before resolving
 * into the real string — the cipher-decode effect reused across the site.
 * The real text is always present in the DOM (visually hidden) so it stays
 * crawlable and accessible even while the visible layer animates.
 */
export function ScrambleText({
  text,
  as: Tag = 'span',
  className,
  speed = 28,
  triggerOnView = true,
  delay = 0,
}: ScrambleTextProps) {
  const [display, setDisplay] = useState(text)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLElement>(null)
  const frame = useRef(0)
  const raf = useRef<number>(0)

  useEffect(() => {
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    if (reduced) {
      setDisplay(text)
      return
    }

    const node = ref.current
    if (!node) return

    if (!triggerOnView) {
      setStarted(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStarted(true)
          observer.disconnect()
        }
      },
      { threshold: 0.4 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [text, triggerOnView])

  useEffect(() => {
    if (!started) return
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    if (reduced) {
      setDisplay(text)
      return
    }

    let cancelled = false
    const totalFrames = text.length + 12
    frame.current = 0

    const timeout = setTimeout(() => {
      const tick = () => {
        if (cancelled) return
        const progress = frame.current
        let out = ''
        for (let i = 0; i < text.length; i++) {
          if (i < progress - 12) {
            out += text[i]
          } else if (text[i] === ' ') {
            out += ' '
          } else {
            out += CHARS[Math.floor(Math.random() * CHARS.length)]
          }
        }
        setDisplay(out)
        frame.current += 1
        if (frame.current <= totalFrames) {
          raf.current = window.setTimeout(tick, speed)
        } else {
          setDisplay(text)
        }
      }
      tick()
    }, delay)

    return () => {
      cancelled = true
      clearTimeout(timeout)
      clearTimeout(raf.current)
    }
  }, [started, text, speed, delay])

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">{display}</span>
    </Tag>
  )
}

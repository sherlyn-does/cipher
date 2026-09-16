'use client'

import { useEffect, useRef, useState } from 'react'
import { Search } from 'lucide-react'

/**
 * A subtle custom cursor: a small green ring that trails a solid dot.
 * Over interactive elements it grows and morphs into a magnifying glass,
 * tying into the site's "inspecting code through a lens" motif.
 * Disabled on touch / coarse-pointer devices.
 */
export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!fine) return
    setEnabled(true)
    document.documentElement.classList.add('cipher-custom-cursor')

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const ring = { x: pos.x, y: pos.y }
    let raf = 0

    const render = () => {
      ring.x += (pos.x - ring.x) * 0.18
      ring.y += (pos.y - ring.y) * 0.18
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`
      }
      raf = requestAnimationFrame(render)
    }
    raf = requestAnimationFrame(render)

    const onMove = (e: MouseEvent) => {
      pos.x = e.clientX
      pos.y = e.clientY
      if (!visible) setVisible(true)
      const target = e.target as HTMLElement | null
      const interactive = target?.closest(
        'a, button, [role="button"], input, textarea, [data-cursor="lens"]',
      )
      setHovering(Boolean(interactive))
    }
    const onLeave = () => setVisible(false)
    const onEnter = () => setVisible(true)

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      document.documentElement.classList.remove('cipher-custom-cursor')
    }
  }, [visible])

  if (!enabled) return null

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999]"
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 200ms ease' }}
    >
      <div
        ref={ringRef}
        className="fixed left-0 top-0 flex items-center justify-center rounded-full border border-[var(--matrix)] transition-[width,height,background-color] duration-200 ease-out"
        style={{
          width: hovering ? 44 : 28,
          height: hovering ? 44 : 28,
          backgroundColor: hovering
            ? 'rgba(0,255,65,0.08)'
            : 'transparent',
          boxShadow: '0 0 12px -2px var(--matrix-glow)',
        }}
      >
        <Search
          className="text-[var(--matrix)] transition-opacity duration-200"
          style={{ opacity: hovering ? 1 : 0 }}
          size={18}
          strokeWidth={2.25}
        />
      </div>
      <div
        ref={dotRef}
        className="fixed left-0 top-0 h-1.5 w-1.5 rounded-full bg-[var(--matrix)]"
        style={{ opacity: hovering ? 0 : 1, transition: 'opacity 200ms ease' }}
      />
    </div>
  )
}

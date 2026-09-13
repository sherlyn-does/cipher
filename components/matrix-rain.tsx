'use client'

import { useEffect, useRef } from 'react'

interface MatrixRainProps {
  /** 0..1 overall opacity of the layer */
  opacity?: number
  /** brightness of the leading glyph */
  intense?: boolean
  className?: string
}

const GLYPHS =
  'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎ0123456789<>[]{}=+*/#$%&@ABCDEFΣΦΨΩ'

export function MatrixRain({
  opacity = 0.16,
  intense = false,
  className,
}: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    const fontSize = 16
    let columns = 0
    let drops: number[] = []
    let width = 0
    let height = 0

    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const setup = () => {
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      columns = Math.floor(width / fontSize)
      drops = new Array(columns)
        .fill(0)
        .map(() => Math.floor((Math.random() * -height) / fontSize))
    }

    setup()

    let raf = 0
    let last = 0
    const frameInterval = 1000 / 24 // cap frame rate for performance

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw)
      if (now - last < frameInterval) return
      last = now

      ctx.fillStyle = 'rgba(5, 7, 5, 0.09)'
      ctx.fillRect(0, 0, width, height)
      ctx.font = `${fontSize}px "JetBrains Mono", monospace`

      for (let i = 0; i < drops.length; i++) {
        const char = GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        const x = i * fontSize
        const y = drops[i] * fontSize

        if (intense && Math.random() > 0.975) {
          ctx.fillStyle = '#d6ffdd'
        } else {
          ctx.fillStyle = '#00ff41'
        }
        ctx.fillText(char, x, y)

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
    }

    if (reduced) {
      // Draw a single static frame instead of animating
      ctx.fillStyle = 'rgba(5, 7, 5, 1)'
      ctx.fillRect(0, 0, width, height)
      ctx.font = `${fontSize}px "JetBrains Mono", monospace`
      ctx.fillStyle = '#00ff41'
      for (let i = 0; i < columns; i++) {
        for (let j = 0; j < height / fontSize; j += 3) {
          if (Math.random() > 0.6) {
            const char = GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
            ctx.fillText(char, i * fontSize, j * fontSize)
          }
        }
      }
    } else {
      raf = requestAnimationFrame(draw)
    }

    let resizeTimer: ReturnType<typeof setTimeout>
    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(setup, 150)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      clearTimeout(resizeTimer)
    }
  }, [intense])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        opacity,
        pointerEvents: 'none',
      }}
    />
  )
}

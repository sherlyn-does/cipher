'use client'

/*
  Waves — self-contained perlin-noise line background.
  Tuned for Cipher's Matrix-green aesthetic.
  The waves move continuously on their own.
  No cursor or touch interaction.
  Respects prefers-reduced-motion.
*/

import { useRef, useEffect, type CSSProperties } from 'react'

class Grad {
  x: number
  y: number
  z: number

  constructor(x: number, y: number, z: number) {
    this.x = x
    this.y = y
    this.z = z
  }

  dot2(x: number, y: number): number {
    return this.x * x + this.y * y
  }
}

class Noise {
  private grad3: Grad[]
  private p: number[]
  private perm: number[]
  private gradP: Grad[]

  constructor(seed = 0) {
    this.grad3 = [
      new Grad(1, 1, 0),
      new Grad(-1, 1, 0),
      new Grad(1, -1, 0),
      new Grad(-1, -1, 0),
      new Grad(1, 0, 1),
      new Grad(-1, 0, 1),
      new Grad(1, 0, -1),
      new Grad(-1, 0, -1),
      new Grad(0, 1, 1),
      new Grad(0, -1, 1),
      new Grad(0, 1, -1),
      new Grad(0, -1, -1),
    ]

    this.p = [
      151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225,
      140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247,
      120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177,
      33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165,
      71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211,
      133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25,
      63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196,
      135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217,
      226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206,
      59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248,
      152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22,
      39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218,
      246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241,
      81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157,
      184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93,
      222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180,
    ]

    this.perm = new Array(512)
    this.gradP = new Array(512)

    this.seed(seed)
  }

  seed(seed: number) {
    if (seed > 0 && seed < 1) seed *= 65536

    seed = Math.floor(seed)

    if (seed < 256) seed |= seed << 8

    for (let i = 0; i < 256; i++) {
      let v: number

      if (i & 1) {
        v = this.p[i] ^ (seed & 255)
      } else {
        v = this.p[i] ^ ((seed >> 8) & 255)
      }

      this.perm[i] = this.perm[i + 256] = v
      this.gradP[i] = this.gradP[i + 256] = this.grad3[v % 12]
    }
  }

  private fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10)
  }

  private lerp(a: number, b: number, t: number): number {
    return (1 - t) * a + t * b
  }

  perlin2(x: number, y: number): number {
    let X = Math.floor(x)
    let Y = Math.floor(y)

    x = x - X
    y = y - Y

    X = X & 255
    Y = Y & 255

    const n00 = this.gradP[X + this.perm[Y]].dot2(x, y)
    const n01 = this.gradP[X + this.perm[Y + 1]].dot2(x, y - 1)
    const n10 = this.gradP[X + 1 + this.perm[Y]].dot2(x - 1, y)
    const n11 = this.gradP[X + 1 + this.perm[Y + 1]].dot2(
      x - 1,
      y - 1,
    )

    const u = this.fade(x)

    return this.lerp(
      this.lerp(n00, n10, u),
      this.lerp(n01, n11, u),
      this.fade(y),
    )
  }
}

interface Point {
  x: number
  y: number
  wave: {
    x: number
    y: number
  }
}

interface WavesProps {
  lineColor?: string
  backgroundColor?: string
  waveSpeedX?: number
  waveSpeedY?: number
  waveAmpX?: number
  waveAmpY?: number
  xGap?: number
  yGap?: number
  className?: string
  style?: CSSProperties
}

export function Waves({
  lineColor = 'rgba(0, 255, 65, 0.28)',
  backgroundColor = 'transparent',
  waveSpeedX = 0.0125,
  waveSpeedY = 0.005,
  waveAmpX = 32,
  waveAmpY = 16,
  xGap = 12,
  yGap = 36,
  className,
  style,
}: WavesProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current

    if (!container || !canvas) return

    const ctx = canvas.getContext('2d')

    if (!ctx) return

    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    const noise = new Noise(Math.random())

    let lines: Point[][] = []
    let width = 0
    let height = 0

    function setSize() {
      const bounds = container!.getBoundingClientRect()

      width = bounds.width
      height = bounds.height

      const dpr = Math.min(window.devicePixelRatio || 1, 2)

      canvas!.width = Math.floor(width * dpr)
      canvas!.height = Math.floor(height * dpr)

      canvas!.style.width = `${width}px`
      canvas!.style.height = `${height}px`

      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function setLines() {
      lines = []

      const oWidth = width + 200
      const oHeight = height + 30

      const totalLines = Math.ceil(oWidth / xGap)
      const totalPoints = Math.ceil(oHeight / yGap)

      const xStart = (width - xGap * totalLines) / 2
      const yStart = (height - yGap * totalPoints) / 2

      for (let i = 0; i <= totalLines; i++) {
        const pts: Point[] = []

        for (let j = 0; j <= totalPoints; j++) {
          pts.push({
            x: xStart + xGap * i,
            y: yStart + yGap * j,
            wave: {
              x: 0,
              y: 0,
            },
          })
        }

        lines.push(pts)
      }
    }

    function movePoints(time: number) {
      lines.forEach((pts) => {
        pts.forEach((p) => {
          const move =
            noise.perlin2(
              (p.x + time * waveSpeedX) * 0.002,
              (p.y + time * waveSpeedY) * 0.0015,
            ) * 12

          p.wave.x = Math.cos(move) * waveAmpX
          p.wave.y = Math.sin(move) * waveAmpY
        })
      })
    }

    function moved(point: Point) {
      const x = point.x + point.wave.x
      const y = point.y + point.wave.y

      return {
        x: Math.round(x * 10) / 10,
        y: Math.round(y * 10) / 10,
      }
    }

    function drawLines() {
      ctx!.clearRect(0, 0, width, height)

      if (backgroundColor !== 'transparent') {
        ctx!.fillStyle = backgroundColor
        ctx!.fillRect(0, 0, width, height)
      }

      ctx!.beginPath()
      ctx!.strokeStyle = lineColor
      ctx!.lineWidth = 1

      lines.forEach((pts) => {
        let p1 = moved(pts[0])

        ctx!.moveTo(p1.x, p1.y)

        pts.forEach((p, idx) => {
          const isLast = idx === pts.length - 1

          p1 = moved(p)

          const p2 = moved(
            pts[idx + 1] || pts[pts.length - 1],
          )

          ctx!.lineTo(p1.x, p1.y)

          if (isLast) {
            ctx!.moveTo(p2.x, p2.y)
          }
        })
      })

      ctx!.stroke()
    }

    let raf = 0

    function tick(t: number) {
      movePoints(t)
      drawLines()

      raf = requestAnimationFrame(tick)
    }

    setSize()
    setLines()

    if (reduced) {
      movePoints(0)
      drawLines()
    } else {
      raf = requestAnimationFrame(tick)
    }

    const onResize = () => {
      setSize()
      setLines()
    }

    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [
    lineColor,
    backgroundColor,
    waveSpeedX,
    waveSpeedY,
    waveAmpX,
    waveAmpY,
    xGap,
    yGap,
  ])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
        }}
      />
    </div>
  )
}
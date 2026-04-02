import { useEffect, useRef, useState } from 'react'
import { layoutNextLine, prepareWithSegments } from '@chenglou/pretext'
import './App.css'

type Piece = {
  index: string
  title: string
  description: string
  clip: string
  poster: string
  playbackRate?: number
}

type Point = {
  x: number
  y: number
}

type Pointer = {
  x: number
  y: number
  active: boolean
}

const DEMO_COPY = `Systems. Type. Motion. Fiora Studio explores interfaces where language is not locked into a static frame. Pretext lets text react to a living contour so the layout becomes responsive, graphic, and spatial all at once. `

const pieces: Piece[] = [
  {
    index: '01',
    title: 'Black Letter A',
    description:
      'Black-letter-a study centered on a single A, where the glyph is treated as a graphic object instead of body text.',
    clip: '/media/pieces/01-black-letter-a/clip.mp4',
    poster: '/media/pieces/01-black-letter-a/poster.jpg',
  },
  {
    index: '02',
    title: 'Type Morph',
    description:
      'Type-morph sequence that transforms one typographic form through controlled changes in shape, weight, and scale.',
    clip: '/media/pieces/02-type-morph/clip.mp4',
    poster: '/media/pieces/02-type-morph/poster.jpg',
  },
  {
    index: '03',
    title: 'From A To B',
    description:
      'From-a-to-b transition clip focused on the intermediate movement between two letterform states.',
    clip: '/media/pieces/03-from-a-to-b/clip-b-isolated-piece.mp4',
    poster: '/media/pieces/03-from-a-to-b/poster.jpg',
  },
  {
    index: '04',
    title: 'Out Of Office',
    description:
      'Out-of-office fragment using repeated forms and hard contrast to turn a familiar phrase into a poster-like motion loop.',
    clip: '/media/pieces/04-out-of-office/clip-c-tail.mp4',
    poster: '/media/pieces/04-out-of-office/poster.jpg',
  },
  {
    index: '05',
    title: 'Black Yellow Drum',
    description:
      'Black-yellow-drum cut built from high-contrast yellow and black typography, with rhythm driven by tight cropping.',
    clip: '/media/pieces/05-black-yellow-drum/clip.mp4',
    poster: '/media/pieces/05-black-yellow-drum/poster.jpg',
  },
  {
    index: '07',
    title: 'Just Keep Swimming',
    description:
      'Just-keep-swimming segment with looping phrase energy and drift, paced as a buoyant text-and-motion field.',
    clip: '/media/pieces/07-just-keep-swimming/clip.mp4',
    poster: '/media/pieces/07-just-keep-swimming/poster.jpg',
  },
  {
    index: '08',
    title: 'Yellow Monday Field',
    description:
      'Yellow-monday-field micro study where color and timing carry the composition more than complex form changes.',
    clip: '/media/pieces/08-yellow-monday-field/clip.mp4',
    poster: '/media/pieces/08-yellow-monday-field/poster.jpg',
  },
  {
    index: '09',
    title: 'Black Matrix Rain',
    description:
      'Black-matrix-rain sequence: dense text falls through black space to create a matrix-like vertical stream.',
    clip: '/media/pieces/09-black-matrix-rain/clip.mp4',
    poster: '/media/pieces/09-black-matrix-rain/poster.jpg',
  },
  {
    index: '11',
    title: 'Dark Matter',
    description:
      'Dark-matter piece emphasizing low-light texture and particulate motion inside a restrained frame.',
    clip: '/media/pieces/11-dark-matter/clip.mp4',
    poster: '/media/pieces/11-dark-matter/poster.jpg',
  },
  {
    index: '12',
    title: 'Work Life Balance',
    description:
      'Work-life-balance clip that stages the phrase as a direct diagrammatic statement with minimal motion.',
    clip: '/media/pieces/12-work-life-balance/clip.mp4',
    poster: '/media/pieces/12-work-life-balance/poster.jpg',
  },
  {
    index: '13',
    title: 'White Twisty Squares',
    description:
      'White-twisty-squares study focused on rotating square geometry and subtle white-field variation.',
    clip: '/media/pieces/13-white-twisty-squares/clip-a-opening.mp4',
    poster: '/media/pieces/13-white-twisty-squares/poster-a-opening.jpg',
  },
  {
    index: '14',
    title: 'Mona Lisa Portrait In Space',
    description:
      'Mona-lisa-portrait-in-space sequence that pushes the portrait into accelerated residue, blur, and spatial distortion.',
    clip: '/media/pieces/14-mona-lisa-portrait-in-space/clip.mp4',
    poster: '/media/pieces/14-mona-lisa-portrait-in-space/poster.jpg',
  },
  {
    index: '15',
    title: 'The Moving False Mirror by Rene Magritte, 1929',
    description:
      'Moving-false-mirror citation built around the eye-and-sky motif, adapted as a short moving study.',
    clip: '/media/pieces/15-the-moving-false-mirror-rene-magritte-1929/clip.mp4',
    poster: '/media/pieces/15-the-moving-false-mirror-rene-magritte-1929/poster.jpg',
  },
  {
    index: '16',
    title: 'Lissajours Circle',
    description:
      'Lissajours-circle ending clip tracing oscillating circular motion as a clean rhythmic diagram.',
    clip: '/media/pieces/16-lissajours-circle/clip-b-lissajous-circle.mp4',
    poster: '/media/pieces/16-lissajours-circle/poster-b-lissajous-circle.jpg',
  },
]

const FONT_FAMILY = '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif'
const FONT_SIZE = 17
const LINE_HEIGHT = 27
const TEXT_MARGIN = 32
const FIELD_TEXT_PADDING = 30
const MIN_TEXT_SEGMENT_WIDTH = 128
const SAMPLE_COUNT = 320

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

const superformulaPoint = (
  theta: number,
  m: number,
  n1: number,
  n2: number,
  n3: number,
) => {
  const t1 = Math.pow(Math.abs(Math.cos((m * theta) / 4)), n2)
  const t2 = Math.pow(Math.abs(Math.sin((m * theta) / 4)), n3)
  const sum = t1 + t2

  if (sum === 0) {
    return 0
  }

  return Math.pow(sum, -1 / n1)
}

const buildPolygon = (width: number, height: number, center: Point, time: number) => {
  const radius = clamp(Math.min(width, height) * 0.21, 110, 188)
  const n1 = 0.58 + Math.sin(time * 0.42) * 0.1
  const n2 = 1 + Math.sin(time * 0.95) * 0.24
  const n3 = 1.18 + Math.cos(time * 1.1) * 0.28
  const rotation = time * 0.28
  const points: Point[] = []

  for (let index = 0; index < SAMPLE_COUNT; index += 1) {
    const theta = (index / SAMPLE_COUNT) * Math.PI * 2
    const radial = superformulaPoint(theta, 7, n1, n2, n3)
    const pulse = 0.9 + Math.sin(time * 1.2 + theta * 2.4) * 0.06
    const finalRadius = radius * radial * pulse
    const angle = theta + rotation

    points.push({
      x: center.x + Math.cos(angle) * finalRadius,
      y: center.y + Math.sin(angle) * finalRadius,
    })
  }

  return points
}

const getHorizontalGap = (
  polygon: Point[],
  y: number,
  minX: number,
  maxX: number,
  padding: number,
) => {
  const intersections: number[] = []

  for (let index = 0; index < polygon.length; index += 1) {
    const a = polygon[index]
    const b = polygon[(index + 1) % polygon.length]
    const minY = Math.min(a.y, b.y)
    const maxY = Math.max(a.y, b.y)

    if (y < minY || y >= maxY || a.y === b.y) {
      continue
    }

    const t = (y - a.y) / (b.y - a.y)
    intersections.push(a.x + t * (b.x - a.x))
  }

  if (intersections.length < 2) {
    return null
  }

  intersections.sort((left, right) => left - right)

  const start = clamp(intersections[0] - padding, minX, maxX)
  const end = clamp(intersections[intersections.length - 1] + padding, minX, maxX)

  if (end - start < 48) {
    return null
  }

  return { start, end }
}

function ParametricField() {
  const stageRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  const pointerRef = useRef<Pointer>({ x: 0, y: 0, active: false })
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const element = stageRef.current

    if (!element) {
      return undefined
    }

    const updateSize = () => {
      const rect = element.getBoundingClientRect()
      setSize({
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      })
    }

    updateSize()

    const observer = new ResizeObserver(updateSize)
    observer.observe(element)
    window.addEventListener('resize', updateSize)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updateSize)
    }
  }, [])

  useEffect(() => {
    const element = stageRef.current

    if (!element) {
      return undefined
    }

    const handlePointerMove = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect()
      pointerRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        active: true,
      }
    }

    const handlePointerLeave = () => {
      pointerRef.current = { ...pointerRef.current, active: false }
    }

    element.addEventListener('pointermove', handlePointerMove)
    element.addEventListener('pointerleave', handlePointerLeave)

    return () => {
      element.removeEventListener('pointermove', handlePointerMove)
      element.removeEventListener('pointerleave', handlePointerLeave)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas || size.width === 0 || size.height === 0) {
      return undefined
    }

    const context = canvas.getContext('2d')

    if (!context) {
      return undefined
    }

    const dpr = window.devicePixelRatio || 1
    canvas.width = size.width * dpr
    canvas.height = size.height * dpr
    context.setTransform(dpr, 0, 0, dpr, 0, 0)

    const font = `${FONT_SIZE}px ${FONT_FAMILY}`
    const prepared = prepareWithSegments(DEMO_COPY.repeat(10), font)
    const center = {
      x: size.width * 0.5,
      y: size.height * 0.5,
    }
    const target = { ...center }

    const draw = (timestamp: number) => {
      const time = timestamp / 1000
      context.clearRect(0, 0, size.width, size.height)

      context.fillStyle = '#f3eee4'
      context.fillRect(0, 0, size.width, size.height)

      const pointer = pointerRef.current
      const driftX = Math.cos(time * 0.45) * 16
      const driftY = Math.sin(time * 0.62) * 16

      target.x = pointer.active ? pointer.x : size.width * 0.5 + driftX
      target.y = pointer.active ? pointer.y : size.height * 0.5 + driftY

      center.x += (target.x - center.x) * 0.08
      center.y += (target.y - center.y) * 0.08

      const polygon = buildPolygon(size.width, size.height, center, time)

      context.beginPath()
      polygon.forEach((point, index) => {
        if (index === 0) {
          context.moveTo(point.x, point.y)
        } else {
          context.lineTo(point.x, point.y)
        }
      })
      context.closePath()

      context.fillStyle = 'rgba(225, 24, 24, 0.12)'
      context.fill()
      context.lineWidth = 3
      context.strokeStyle = '#111111'
      context.stroke()

      context.font = font
      context.textBaseline = 'top'
      context.fillStyle = '#111111'

      let cursor: { segmentIndex: number; graphemeIndex: number } = {
        segmentIndex: 0,
        graphemeIndex: 0,
      }
      let y = TEXT_MARGIN
      const minX = TEXT_MARGIN
      const maxX = size.width - TEXT_MARGIN
      const resetCursor = { segmentIndex: 0, graphemeIndex: 0 }

      while (y < size.height - TEXT_MARGIN) {
        const gap = getHorizontalGap(
          polygon,
          y + LINE_HEIGHT / 2,
          minX,
          maxX,
          FIELD_TEXT_PADDING,
        )
        let x = minX
        let lineCursor = cursor

        if (gap) {
          const gapWidth = gap.end - gap.start
          const leftWidth = gap.start - minX
          const rightWidth = maxX - gap.end

          // Leave a clean moat around the shape when it occupies the center.
          if (gapWidth > (maxX - minX) * 0.4 && leftWidth < 150 && rightWidth < 150) {
            y += LINE_HEIGHT
            continue
          }
        }

        if (gap && gap.start - minX > MIN_TEXT_SEGMENT_WIDTH) {
          let leftLine = layoutNextLine(prepared, lineCursor, gap.start - minX)

          if (!leftLine) {
            leftLine = layoutNextLine(prepared, resetCursor, gap.start - minX)
          }

          if (leftLine) {
            context.fillText(leftLine.text, x, y)
            lineCursor = leftLine.end
          }
        }

        if (gap) {
          x = gap.end
          const remainingWidth = maxX - gap.end

          if (remainingWidth > MIN_TEXT_SEGMENT_WIDTH) {
            let rightLine = layoutNextLine(prepared, lineCursor, remainingWidth)

            if (!rightLine) {
              rightLine = layoutNextLine(prepared, resetCursor, remainingWidth)
            }

            if (!rightLine) {
              break
            }

            context.fillText(rightLine.text, x, y)
            cursor = rightLine.end
            y += LINE_HEIGHT
            continue
          }
        }

        let line = layoutNextLine(prepared, lineCursor, maxX - x)

        if (!line) {
          line = layoutNextLine(prepared, resetCursor, maxX - x)
        }

        if (!line) {
          break
        }

        context.fillText(line.text, x, y)
        cursor = line.end
        y += LINE_HEIGHT
      }

      animationRef.current = window.requestAnimationFrame(draw)
    }

    animationRef.current = window.requestAnimationFrame(draw)

    return () => {
      if (animationRef.current !== null) {
        window.cancelAnimationFrame(animationRef.current)
      }
    }
  }, [size.height, size.width])

  return (
    <div className="field-cell">
      <div className="field-header">
        <div className="field-label">Parametric Field</div>
      </div>
      <div className="field-stage" ref={stageRef}>
        <canvas ref={canvasRef} className="field-canvas" />
      </div>
    </div>
  )
}

function App() {
  const carouselRef = useRef<HTMLDivElement>(null)
  const [activePiece, setActivePiece] = useState(0)

  useEffect(() => {
    const element = carouselRef.current

    if (!element) {
      return undefined
    }

    const updateActivePiece = () => {
      const firstCard = element.querySelector<HTMLElement>('.clip-card')
      const styles = window.getComputedStyle(element)
      const gap = Number.parseFloat(styles.columnGap || styles.gap || '0') || 0
      const step = (firstCard?.offsetWidth ?? element.clientWidth) + gap
      const nextIndex = Math.round(element.scrollLeft / Math.max(step, 1))
      setActivePiece(clamp(nextIndex, 0, pieces.length - 1))
    }

    updateActivePiece()
    element.addEventListener('scroll', updateActivePiece, { passive: true })
    window.addEventListener('resize', updateActivePiece)

    return () => {
      element.removeEventListener('scroll', updateActivePiece)
      window.removeEventListener('resize', updateActivePiece)
    }
  }, [])

  const scrollCarousel = (direction: -1 | 1) => {
    const element = carouselRef.current

    if (!element) {
      return
    }

    const firstCard = element.querySelector<HTMLElement>('.clip-card')
    const styles = window.getComputedStyle(element)
    const gap = Number.parseFloat(styles.columnGap || styles.gap || '0') || 0
    const step = (firstCard?.offsetWidth ?? element.clientWidth * 0.85) + gap

    element.scrollBy({
      left: step * direction,
      behavior: 'smooth',
    })
  }

  return (
    <main className="page">
      <section className="masthead">
        <div className="masthead-brand">Fiora Studio</div>
        <div className="masthead-mode">Systems / Type / Motion</div>
      </section>

      <section className="hero-grid">
        <ParametricField />
      </section>

      <section className="clips-shell" id="clips">
        <div className="clips-toolbar">
          <div className="clips-count">
            {String(activePiece + 1).padStart(2, '0')} / {String(pieces.length).padStart(2, '0')}
          </div>
          <div className="clips-nav">
            <button
              type="button"
              onClick={() => scrollCarousel(-1)}
              disabled={activePiece === 0}
            >
              Prev
            </button>
            <button
              type="button"
              onClick={() => scrollCarousel(1)}
              disabled={activePiece >= pieces.length - 1}
            >
              Next
            </button>
          </div>
        </div>

        <div className="clips-strip" ref={carouselRef}>
          {pieces.map((piece, pieceIndex) => (
            <article key={piece.clip} className="clip-card">
              <div className="clip-card-meta">
                <span>{String(pieceIndex + 1).padStart(2, '0')}</span>
                <span>{piece.title}</span>
              </div>
              <div className="clip-media">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  poster={piece.poster}
                  onLoadedData={(event) => {
                    event.currentTarget.playbackRate = piece.playbackRate ?? 1
                  }}
                >
                  <source src={piece.clip} type="video/mp4" />
                </video>
              </div>
              <p>{piece.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default App

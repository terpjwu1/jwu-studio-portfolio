import { useEffect, useRef, useState } from 'react'
import { layoutNextLine, prepareWithSegments } from '@chenglou/pretext'
import './App.css'

type Piece = {
  index: string
  title: string
  description: string
  clip: string
  poster: string
  frame: 'wide' | 'square' | 'portrait'
  playbackRate?: number
}

type Point = {
  x: number
  y: number
}

type ParametricVariant = {
  label: string
  points: (time: number) => Point[]
}

type RgbaColor = [number, number, number, number]

type SessionConfig = {
  colorOrder: RgbaColor[]
  cycleDuration: number
  phaseOffset: number
  radiusScale: number
  spinSpeed: number
  startX: number
  startY: number
  variantOrder: number[]
  velocityX: number
  velocityY: number
}

const DEMO_COPY = `Systems. Type. Motion. Jwu Studio explores interfaces where language is not locked into a static frame. Pretext lets text react to a living contour so the layout becomes responsive, graphic, and spatial all at once. `

const pieces: Piece[] = [
  {
    index: '01',
    title: 'Black Letter A',
    description:
      'Black-letter-a study centered on a single A, where the glyph is treated as a graphic object instead of body text.',
    clip: '/media/pieces/01-black-letter-a/clip.mp4',
    poster: '/media/pieces/01-black-letter-a/poster.jpg',
    frame: 'wide',
  },
  {
    index: '02',
    title: 'Type Morph',
    description:
      'Type-morph sequence that transforms one typographic form through controlled changes in shape, weight, and scale.',
    clip: '/media/pieces/02-type-morph/clip.mp4',
    poster: '/media/pieces/02-type-morph/poster.jpg',
    frame: 'square',
  },
  {
    index: '03',
    title: 'From A To B',
    description:
      'From-a-to-b transition clip focused on the intermediate movement between two letterform states.',
    clip: '/media/pieces/03-from-a-to-b/clip-b-isolated-piece.mp4',
    poster: '/media/pieces/03-from-a-to-b/poster.jpg',
    frame: 'square',
  },
  {
    index: '04',
    title: 'Out Of Office',
    description:
      'Out-of-office fragment using repeated forms and hard contrast to turn a familiar phrase into a poster-like motion loop.',
    clip: '/media/pieces/04-out-of-office/clip-c-tail.mp4',
    poster: '/media/pieces/04-out-of-office/poster.jpg',
    frame: 'wide',
  },
  {
    index: '05',
    title: 'Black Yellow Drum',
    description:
      'Black-yellow-drum cut built from high-contrast yellow and black typography, with rhythm driven by tight cropping.',
    clip: '/media/pieces/05-black-yellow-drum/clip.mp4',
    poster: '/media/pieces/05-black-yellow-drum/poster.jpg',
    frame: 'wide',
  },
  {
    index: '07',
    title: 'Just Keep Swimming',
    description:
      'Just-keep-swimming segment with looping phrase energy and drift, paced as a buoyant text-and-motion field.',
    clip: '/media/pieces/07-just-keep-swimming/clip.mp4',
    poster: '/media/pieces/07-just-keep-swimming/poster.jpg',
    frame: 'wide',
  },
  {
    index: '08',
    title: 'Yellow Monday Field',
    description:
      'Yellow-monday-field micro study where color and timing carry the composition more than complex form changes.',
    clip: '/media/pieces/08-yellow-monday-field/clip.mp4',
    poster: '/media/pieces/08-yellow-monday-field/poster.jpg',
    frame: 'wide',
  },
  {
    index: '09',
    title: 'Black Matrix Rain',
    description:
      'Black-matrix-rain sequence: dense text falls through black space to create a matrix-like vertical stream.',
    clip: '/media/pieces/09-black-matrix-rain/clip.mp4',
    poster: '/media/pieces/09-black-matrix-rain/poster.jpg',
    frame: 'portrait',
  },
  {
    index: '11',
    title: 'Dark Matter',
    description:
      'Dark-matter piece emphasizing low-light texture and particulate motion inside a restrained frame.',
    clip: '/media/pieces/11-dark-matter/clip.mp4',
    poster: '/media/pieces/11-dark-matter/poster.jpg',
    frame: 'square',
  },
  {
    index: '12',
    title: 'Work Life Balance',
    description:
      'Work-life-balance clip that stages the phrase as a direct diagrammatic statement with minimal motion.',
    clip: '/media/pieces/12-work-life-balance/clip.mp4',
    poster: '/media/pieces/12-work-life-balance/poster.jpg',
    frame: 'wide',
  },
  {
    index: '13',
    title: 'White Twisty Squares',
    description:
      'White-twisty-squares study focused on rotating square geometry and subtle white-field variation.',
    clip: '/media/pieces/13-white-twisty-squares/clip-a-opening.mp4',
    poster: '/media/pieces/13-white-twisty-squares/poster-a-opening.jpg',
    frame: 'square',
  },
  {
    index: '14',
    title: 'Mona Lisa Portrait In Space',
    description:
      'Mona-lisa-portrait-in-space sequence that pushes the portrait into accelerated residue, blur, and spatial distortion.',
    clip: '/media/pieces/14-mona-lisa-portrait-in-space/clip.mp4',
    poster: '/media/pieces/14-mona-lisa-portrait-in-space/poster.jpg',
    frame: 'portrait',
  },
  {
    index: '15',
    title: 'The Moving False Mirror',
    description:
      'Moving-false-mirror citation built around the eye-and-sky motif, adapted as a short moving study.',
    clip: '/media/pieces/15-the-moving-false-mirror-rene-magritte-1929/clip.mp4',
    poster: '/media/pieces/15-the-moving-false-mirror-rene-magritte-1929/poster.jpg',
    frame: 'square',
  },
  {
    index: '16',
    title: 'Lissajours Circle',
    description:
      'Lissajours-circle ending clip tracing oscillating circular motion as a clean rhythmic diagram.',
    clip: '/media/pieces/16-lissajours-circle/clip-b-lissajous-circle.mp4',
    poster: '/media/pieces/16-lissajours-circle/poster-b-lissajous-circle.jpg',
    frame: 'square',
  },
]

const FONT_FAMILY = '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif'
const FONT_SIZE = 22
const LINE_HEIGHT = 34
const TEXT_MARGIN = 36
const FIELD_TEXT_PADDING = 26
const SOFT_TEXT_SEGMENT_WIDTH = 84
const COLUMN_GUTTER = 40
const SAMPLE_COUNT = 320

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

const lerp = (start: number, end: number, amount: number) =>
  start + (end - start) * amount

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

const samplePoints = (builder: (theta: number) => Point) => {
  const points: Point[] = []

  for (let index = 0; index < SAMPLE_COUNT; index += 1) {
    const theta = (index / SAMPLE_COUNT) * Math.PI * 2
    points.push(builder(theta))
  }

  return points
}

const normalizePoints = (points: Point[]) => {
  const bounds = points.reduce(
    (acc, point) => ({
      minX: Math.min(acc.minX, point.x),
      maxX: Math.max(acc.maxX, point.x),
      minY: Math.min(acc.minY, point.y),
      maxY: Math.max(acc.maxY, point.y),
    }),
    {
      minX: Number.POSITIVE_INFINITY,
      maxX: Number.NEGATIVE_INFINITY,
      minY: Number.POSITIVE_INFINITY,
      maxY: Number.NEGATIVE_INFINITY,
    },
  )

  const centerX = (bounds.minX + bounds.maxX) * 0.5
  const centerY = (bounds.minY + bounds.maxY) * 0.5
  const scale = Math.max(bounds.maxX - bounds.minX, bounds.maxY - bounds.minY) * 0.5 || 1

  return points.map((point) => ({
    x: (point.x - centerX) / scale,
    y: (point.y - centerY) / scale,
  }))
}

const PARAMETRIC_COLORS: RgbaColor[] = [
  [231, 5, 3, 1],
  [0, 5, 145, 1],
  [253, 222, 6, 1],
]

const toColorString = ([red, green, blue, alpha]: RgbaColor) =>
  `rgba(${red}, ${green}, ${blue}, ${alpha})`

const createPrng = (seed: number) => {
  let state = seed >>> 0

  return () => {
    state = (state + 0x6d2b79f5) | 0
    let value = Math.imul(state ^ (state >>> 15), 1 | state)
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

const shuffleWithSeed = <Item,>(items: Item[], random: () => number) => {
  const clone = [...items]

  for (let index = clone.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1))
    ;[clone[index], clone[swapIndex]] = [clone[swapIndex], clone[index]]
  }

  return clone
}

const getSessionSeed = () => {
  if (typeof window === 'undefined') {
    return 1729
  }

  const storageKey = 'fiora-parametric-field-seed'
  const stored = window.sessionStorage.getItem(storageKey)

  if (stored) {
    const parsed = Number(stored)

    if (Number.isFinite(parsed)) {
      return parsed
    }
  }

  let nextSeed = Math.floor(Math.random() * 0xffffffff)

  if (window.crypto?.getRandomValues) {
    const values = new Uint32Array(1)
    window.crypto.getRandomValues(values)
    nextSeed = values[0]
  }

  window.sessionStorage.setItem(storageKey, String(nextSeed))
  return nextSeed
}

const buildSessionConfig = (seed: number): SessionConfig => {
  const random = createPrng(seed)
  const signs: Array<-1 | 1> = [-1, 1]

  return {
    colorOrder: shuffleWithSeed(PARAMETRIC_COLORS, random),
    cycleDuration: lerp(5.8, 8.4, random()),
    phaseOffset: random() * Math.PI * 2,
    radiusScale: lerp(0.9, 1.12, random()),
    spinSpeed: lerp(0.24, 0.56, random()),
    startX: lerp(0.34, 0.66, random()),
    startY: lerp(0.5, 0.7, random()),
    variantOrder: shuffleWithSeed(
      PARAMETRIC_VARIANTS.map((_, index) => index),
      random,
    ),
    velocityX: lerp(0.085, 0.13, random()) * signs[Math.floor(random() * signs.length)],
    velocityY: lerp(0.07, 0.11, random()) * signs[Math.floor(random() * signs.length)],
  }
}

const PARAMETRIC_VARIANTS: ParametricVariant[] = [
  {
    label: 'Superformula',
    points: (time) =>
      normalizePoints(
        samplePoints((theta) => {
          const n1 = 0.58 + Math.sin(time * 0.42) * 0.1
          const n2 = 1 + Math.sin(time * 0.95) * 0.24
          const n3 = 1.18 + Math.cos(time * 1.1) * 0.28
          const r = superformulaPoint(theta, 7, n1, n2, n3)
          const pulse = 0.9 + Math.sin(time * 1.2 + theta * 2.4) * 0.06

          return {
            x: Math.cos(theta + time * 0.28) * r * pulse,
            y: Math.sin(theta + time * 0.28) * r * pulse,
          }
        }),
      ),
  },
  {
    label: 'Lissajous',
    points: (time) =>
      normalizePoints(
        samplePoints((theta) => ({
          x: Math.sin(3 * theta + time * 0.45),
          y: Math.sin(4 * theta + time * 0.2),
        })),
      ),
  },
  {
    label: 'Epicycloid Crest',
    points: (time) =>
      normalizePoints(
        samplePoints((theta) => {
          const R = 4.4
          const r = 1.1
          const wobble = 1 + Math.sin(time * 0.48) * 0.06

          return {
            x:
              ((R + r) * Math.cos(theta) - r * Math.cos(((R + r) / r) * theta + time * 0.18)) *
              wobble,
            y:
              ((R + r) * Math.sin(theta) - r * Math.sin(((R + r) / r) * theta + time * 0.18)) *
              wobble,
          }
        }),
      ),
  },
  {
    label: 'Hypotrochoid',
    points: (time) =>
      normalizePoints(
        samplePoints((theta) => {
          const R = 6
          const r = 2.8
          const d = 2 + Math.sin(time * 0.5) * 0.35

          return {
            x: (R - r) * Math.cos(theta) + d * Math.cos(((R - r) / r) * theta + time * 0.16),
            y: (R - r) * Math.sin(theta) - d * Math.sin(((R - r) / r) * theta + time * 0.16),
          }
        }),
      ),
  },
  {
    label: 'Lemniscate Weave',
    points: (time) =>
      normalizePoints(
        samplePoints((theta) => {
          const denominator = 1 + Math.sin(theta + time * 0.16) ** 2

          return {
            x: (Math.cos(theta + time * 0.12) * 1.1) / denominator,
            y:
              (Math.sin(theta + time * 0.12) * Math.cos(theta * 1.02 - time * 0.08) * 1.25) /
              denominator,
          }
        }),
      ),
  },
  {
    label: 'Epitrochoid',
    points: (time) =>
      normalizePoints(
        samplePoints((theta) => {
          const R = 4.6
          const r = 1.9
          const d = 2.2 + Math.cos(time * 0.42) * 0.32

          return {
            x: (R + r) * Math.cos(theta) - d * Math.cos(((R + r) / r) * theta + time * 0.2),
            y: (R + r) * Math.sin(theta) - d * Math.sin(((R + r) / r) * theta + time * 0.2),
          }
        }),
      ),
  },
  {
    label: 'Astroid Drift',
    points: (time) =>
      normalizePoints(
        samplePoints((theta) => ({
          x:
            Math.sign(Math.cos(theta)) * Math.pow(Math.abs(Math.cos(theta)), 3) +
            0.12 * Math.cos(5 * theta + time * 0.42),
          y:
            Math.sign(Math.sin(theta)) * Math.pow(Math.abs(Math.sin(theta)), 3) +
            0.12 * Math.sin(5 * theta - time * 0.38),
        })),
      ),
  },
  {
    label: 'Harmonograph',
    points: (time) =>
      normalizePoints(
        samplePoints((theta) => {
          const t = theta * 3.4
          const decay1 = Math.exp(-0.08 * t)
          const decay2 = Math.exp(-0.06 * t)

          return {
            x:
              decay1 * Math.sin(2.4 * t + time * 0.26) +
              0.72 * decay2 * Math.sin(3.6 * t + time * 0.44),
            y:
              decay1 * Math.sin(3 * t + time * 0.18) +
              0.68 * decay2 * Math.sin(4.2 * t + time * 0.3),
          }
        }),
      ),
  },
  {
    label: 'Cardioid Bloom',
    points: (time) =>
      normalizePoints(
        samplePoints((theta) => {
          const r = 0.74 + 0.38 * (1 - Math.sin(theta + time * 0.22))

          return {
            x: r * Math.cos(theta),
            y: r * Math.sin(theta),
          }
        }),
      ),
  },
  {
    label: 'Hypocycloid Kite',
    points: (time) =>
      normalizePoints(
        samplePoints((theta) => {
          const R = 5
          const r = 1.25
          const phase = time * 0.22

          return {
            x: (R - r) * Math.cos(theta) + r * Math.cos(((R - r) / r) * theta + phase),
            y: (R - r) * Math.sin(theta) - r * Math.sin(((R - r) / r) * theta + phase),
          }
        }),
      ),
  },
  {
    label: 'Squircle Pulse',
    points: (time) =>
      normalizePoints(
        samplePoints((theta) => {
          const exponent = 3.4 + Math.sin(time * 0.55) * 0.8
          const x = Math.sign(Math.cos(theta)) * Math.pow(Math.abs(Math.cos(theta)), 2 / exponent)
          const y = Math.sign(Math.sin(theta)) * Math.pow(Math.abs(Math.sin(theta)), 2 / exponent)
          const swell = 1 + Math.sin(theta * 4 + time * 0.9) * 0.06

          return {
            x: x * swell,
            y: y * swell,
          }
        }),
      ),
  },
  {
    label: 'Capsule Wave',
    points: (time) =>
      normalizePoints(
        samplePoints((theta) => {
          const x = Math.sign(Math.cos(theta)) * Math.pow(Math.abs(Math.cos(theta)), 0.42)
          const y = 0.68 * Math.sign(Math.sin(theta)) * Math.pow(Math.abs(Math.sin(theta)), 1.9)
          const wobble = 1 + Math.sin(theta * 6 - time * 0.85) * 0.09

          return {
            x: x * wobble,
            y: y * (1 + Math.cos(theta * 2 + time * 0.4) * 0.05),
          }
        }),
      ),
  },
  {
    label: 'Ripple Star',
    points: (time) =>
      normalizePoints(
        samplePoints((theta) => {
          const r =
            0.76 +
            Math.sin(theta * 8 + time * 0.95) * 0.2 +
            Math.cos(theta * 3 - time * 0.5) * 0.08

          return {
            x: r * Math.cos(theta),
            y: r * Math.sin(theta),
          }
        }),
      ),
  },
  {
    label: 'Offset Clover',
    points: (time) =>
      normalizePoints(
        samplePoints((theta) => ({
          x:
            Math.cos(theta) +
            0.34 * Math.cos(3 * theta + time * 0.45) +
            0.14 * Math.sin(2 * theta - time * 0.28),
          y:
            Math.sin(theta) -
            0.3 * Math.sin(3 * theta - time * 0.4) +
            0.1 * Math.cos(4 * theta + time * 0.32),
        })),
      ),
  },
  {
    label: 'Diamond Bloom',
    points: (time) =>
      normalizePoints(
        samplePoints((theta) => {
          const base =
            0.84 +
            Math.abs(Math.cos(theta * 2 + Math.PI / 4)) * 0.18 +
            Math.sin(theta * 5 + time * 0.7) * 0.06
          const rotation = Math.PI / 4 + Math.sin(time * 0.24) * 0.08

          return {
            x: base * Math.cos(theta + rotation),
            y: base * Math.sin(theta + rotation),
          }
        }),
      ),
  },
  {
    label: 'Braided Loop',
    points: (time) =>
      normalizePoints(
        samplePoints((theta) => ({
          x:
            Math.sin(2 * theta + time * 0.36) +
            0.38 * Math.sin(5 * theta - time * 0.52),
          y:
            Math.sin(3 * theta - time * 0.24) +
            0.24 * Math.cos(6 * theta + time * 0.46),
        })),
      ),
  },
]

const buildPolygon = (
  width: number,
  height: number,
  center: Point,
  time: number,
  sessionConfig: SessionConfig,
) => {
  const radius = clamp(Math.min(width, height) * 0.266 * sessionConfig.radiusScale, 146, 263)
  const adjustedTime = time + sessionConfig.phaseOffset
  const cycleIndex = Math.floor(adjustedTime / sessionConfig.cycleDuration)
  const nextIndex = (cycleIndex + 1) % sessionConfig.variantOrder.length
  const currentIndex = cycleIndex % sessionConfig.variantOrder.length
  const cycleProgress = (adjustedTime % sessionConfig.cycleDuration) / sessionConfig.cycleDuration
  const morphAmount = clamp((cycleProgress - 0.55) / 0.45, 0, 1)
  const easedMorph = morphAmount * morphAmount * (3 - 2 * morphAmount)
  const currentVariant = PARAMETRIC_VARIANTS[sessionConfig.variantOrder[currentIndex]]
  const nextVariant = PARAMETRIC_VARIANTS[sessionConfig.variantOrder[nextIndex]]
  const currentPoints = currentVariant.points(adjustedTime)
  const nextPoints = nextVariant.points(adjustedTime + 0.35)

  const rotation = -adjustedTime * sessionConfig.spinSpeed
  const cosRotation = Math.cos(rotation)
  const sinRotation = Math.sin(rotation)
  const points = currentPoints.map((point, index) => {
    const mixedX = lerp(point.x, nextPoints[index].x, easedMorph)
    const mixedY = lerp(point.y, nextPoints[index].y, easedMorph)
    const rotatedX = mixedX * cosRotation - mixedY * sinRotation
    const rotatedY = mixedX * sinRotation + mixedY * cosRotation

    return {
      x: center.x + rotatedX * radius,
      y: center.y + rotatedY * radius,
    }
  })

  return {
    points,
    label: currentVariant.label,
    fillColor: toColorString(
      sessionConfig.colorOrder[currentIndex % sessionConfig.colorOrder.length],
    ),
  }
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

const getTextColumns = (width: number) => {
  const columnCount = width >= 760 ? 2 : 1
  const gutter = columnCount === 1 ? 0 : COLUMN_GUTTER
  const usableWidth = width - TEXT_MARGIN * 2 - gutter * (columnCount - 1)
  const columnWidth = usableWidth / columnCount

  return Array.from({ length: columnCount }, (_, index) => {
    const start = TEXT_MARGIN + index * (columnWidth + gutter)

    return {
      start,
      end: start + columnWidth,
    }
  })
}

function ParametricField() {
  const stageRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  const [sessionSeed] = useState(getSessionSeed)
  const [sessionConfig] = useState(() => buildSessionConfig(sessionSeed))
  const [size, setSize] = useState({ width: 0, height: 0 })
  const [shapeLabel, setShapeLabel] = useState(
    PARAMETRIC_VARIANTS[sessionConfig.variantOrder[0]].label,
  )

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
    const columns = getTextColumns(size.width)
    const maxReach = clamp(Math.min(size.width, size.height) * 0.294, 165, 269)
    const minCenterX = TEXT_MARGIN + maxReach
    const maxCenterX = size.width - TEXT_MARGIN - maxReach
    const minCenterY = TEXT_MARGIN + maxReach + LINE_HEIGHT * 2.8
    const maxCenterY = size.height - TEXT_MARGIN - maxReach - LINE_HEIGHT * 1.2
    const center = {
      x: lerp(minCenterX, maxCenterX, sessionConfig.startX),
      y: lerp(minCenterY, maxCenterY, sessionConfig.startY),
    }
    const velocity = {
      x: clamp(size.width * Math.abs(sessionConfig.velocityX), 72, 132) * Math.sign(sessionConfig.velocityX || 1),
      y: clamp(size.height * Math.abs(sessionConfig.velocityY), 66, 122) * Math.sign(sessionConfig.velocityY || 1),
    }
    let activeLabel = PARAMETRIC_VARIANTS[sessionConfig.variantOrder[0]].label
    let lastTimestamp = 0

    const draw = (timestamp: number) => {
      const dt = lastTimestamp === 0 ? 1 / 60 : Math.min((timestamp - lastTimestamp) / 1000, 0.033)
      lastTimestamp = timestamp
      const time = timestamp / 1000
      context.clearRect(0, 0, size.width, size.height)

      context.fillStyle = '#EAEFE9'
      context.fillRect(0, 0, size.width, size.height)

      center.x += velocity.x * dt
      center.y += velocity.y * dt

      if (center.x <= minCenterX || center.x >= maxCenterX) {
        velocity.x *= -1
        center.x = clamp(center.x, minCenterX, maxCenterX)
      }

      if (center.y <= minCenterY || center.y >= maxCenterY) {
        velocity.y *= -1
        center.y = clamp(center.y, minCenterY, maxCenterY)
      }

      const { points: polygon, label, fillColor } = buildPolygon(
        size.width,
        size.height,
        center,
        time,
        sessionConfig,
      )

      if (label !== activeLabel) {
        activeLabel = label
        setShapeLabel((current) => (current === label ? current : label))
      }

      context.font = font
      context.textBaseline = 'top'
      context.fillStyle = 'rgba(17, 17, 17, 0.9)'

      let cursor: { segmentIndex: number; graphemeIndex: number } = {
        segmentIndex: 0,
        graphemeIndex: 0,
      }
      const resetCursor = { segmentIndex: 0, graphemeIndex: 0 }

      for (const column of columns) {
        let y = TEXT_MARGIN

        while (y < size.height - TEXT_MARGIN) {
          const gap = getHorizontalGap(
            polygon,
            y + LINE_HEIGHT / 2,
            column.start,
            column.end,
            FIELD_TEXT_PADDING,
          )
          let x = column.start
          let lineCursor = cursor

          if (gap) {
            const leftWidth = gap.start - column.start
            const rightWidth = column.end - gap.end
            let rendered = false

            if (leftWidth >= SOFT_TEXT_SEGMENT_WIDTH) {
              let leftLine = layoutNextLine(prepared, lineCursor, leftWidth)

              if (!leftLine) {
                leftLine = layoutNextLine(prepared, resetCursor, leftWidth)
              }

              if (leftLine) {
                context.fillText(leftLine.text, x, y)
                lineCursor = leftLine.end
                rendered = true
              }
            }

            if (rightWidth >= SOFT_TEXT_SEGMENT_WIDTH) {
              x = gap.end
              let rightLine = layoutNextLine(prepared, lineCursor, rightWidth)

              if (!rightLine) {
                rightLine = layoutNextLine(prepared, resetCursor, rightWidth)
              }

              if (rightLine) {
                context.fillText(rightLine.text, x, y)
                cursor = rightLine.end
                rendered = true
              } else if (rendered) {
                cursor = lineCursor
              }
            } else if (rendered) {
              cursor = lineCursor
            }

            if (rendered) {
              y += LINE_HEIGHT
              continue
            }
          }

          let line = layoutNextLine(prepared, lineCursor, column.end - x)

          if (!line) {
            line = layoutNextLine(prepared, resetCursor, column.end - x)
          }

          if (!line) {
            break
          }

          context.fillText(line.text, x, y)
          cursor = line.end
          y += LINE_HEIGHT
        }
      }

      context.beginPath()
      polygon.forEach((point, index) => {
        if (index === 0) {
          context.moveTo(point.x, point.y)
        } else {
          context.lineTo(point.x, point.y)
        }
      })
      context.closePath()

      context.fillStyle = fillColor
      context.fill()
      context.lineWidth = 3
      context.strokeStyle = '#050103'
      context.stroke()

      animationRef.current = window.requestAnimationFrame(draw)
    }

    animationRef.current = window.requestAnimationFrame(draw)

    return () => {
      if (animationRef.current !== null) {
        window.cancelAnimationFrame(animationRef.current)
      }
    }
  }, [sessionConfig, size.height, size.width])

  return (
    <div className="field-cell">
      <div className="field-header">
        <div className="field-label">Parametric Field</div>
        <div className="field-variant">{shapeLabel}</div>
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
        <div className="masthead-brand">Jwu Studio</div>
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
        <div className="clips-progress" aria-hidden="true">
          <div
            className="clips-progress-bar"
            style={{ width: `${((activePiece + 1) / pieces.length) * 100}%` }}
          />
        </div>

        <div className="clips-strip" ref={carouselRef}>
          {pieces.map((piece, pieceIndex) => (
            <article key={piece.clip} className="clip-card">
              <div className="clip-card-meta">
                <span className="clip-card-index">{String(pieceIndex + 1).padStart(2, '0')}</span>
                <span className="clip-card-title">{piece.title}</span>
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

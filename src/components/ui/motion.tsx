'use client'

// Набор анимаций сайта (идеи 21st.dev / Magic UI / Aceternity, переписаны под framer-motion 11 и палитру брендбука).
// Каждый элемент уважает «уменьшить движение» в системе.

import { useEffect, useId, useRef, useState, type ReactNode, type RefObject } from 'react'
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion'

// Полоска прогресса чтения вверху страницы
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 })
  return <motion.div aria-hidden className="fixed inset-x-0 top-0 z-[60] h-1 origin-left bg-gradient-to-r from-neon via-teal to-lime" style={{ scaleX }} />
}

// Число досчитывается, когда попадает в экран
export function NumberTicker({ value, decimals = 0, className }: { value: number; decimals?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const reduce = useReducedMotion()
  const fmt = (v: number) => v.toLocaleString('ru-RU', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
  useEffect(() => {
    const el = ref.current
    if (!el || !inView) return
    if (reduce) { el.textContent = fmt(value); return }
    const c = animate(0, value, { duration: 1.6, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => { el.textContent = fmt(v) } })
    return () => c.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, value, reduce])
  return <span ref={ref} className={`tabular-nums ${className ?? ''}`}>{fmt(reduce ? value : 0)}</span>
}

// Слово в заголовке сменяется по кругу (Flip Words)
export function FlipWords({ words, className, interval = 2400 }: { words: string[]; className?: string; interval?: number }) {
  const [i, setI] = useState(0)
  const reduce = useReducedMotion()
  useEffect(() => {
    if (reduce) return
    const t = setInterval(() => setI((n) => (n + 1) % words.length), interval)
    return () => clearInterval(t)
  }, [words.length, interval, reduce])
  return (
    <span className="relative inline-grid align-baseline">
      {/* невидимое самое длинное слово держит ширину, чтобы строка не прыгала */}
      <span aria-hidden className="invisible col-start-1 row-start-1">{words.reduce((a, b) => (b.length > a.length ? b : a))}</span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={words[i]}
          initial={{ y: '0.45em', opacity: 0, filter: 'blur(8px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: '-0.45em', opacity: 0, filter: 'blur(8px)' }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className={`col-start-1 row-start-1 ${className ?? ''}`}
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

// 3D-наклон за курсором + свет под пальцем (Tilt Card)
export function TiltCard({ children, className, max = 9 }: { children: ReactNode; className?: string; max?: number }) {
  const reduce = useReducedMotion()
  const x = useMotionValue(0.5)
  const y = useMotionValue(0.5)
  const rx = useSpring(useTransform(y, [0, 1], [max, -max]), { stiffness: 220, damping: 18 })
  const ry = useSpring(useTransform(x, [0, 1], [-max, max]), { stiffness: 220, damping: 18 })
  const lx = useTransform(x, (v) => `${v * 100}%`)
  const ly = useTransform(y, (v) => `${v * 100}%`)
  const glow = useMotionTemplate`radial-gradient(260px circle at ${lx} ${ly}, rgba(255,255,255,0.28), transparent 60%)`
  return (
    <motion.div
      className={`relative [transform-style:preserve-3d] ${className ?? ''}`}
      style={reduce ? undefined : { rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        x.set((e.clientX - r.left) / r.width)
        y.set((e.clientY - r.top) / r.height)
      }}
      onPointerLeave={() => { x.set(0.5); y.set(0.5) }}
    >
      {children}
      {!reduce && <motion.span aria-hidden className="pointer-events-none absolute inset-0 z-10 rounded-[inherit]" style={{ background: glow }} />}
    </motion.div>
  )
}

// Кнопка чуть тянется к курсору (Magnetic)
export function Magnetic({ children, strength = 0.3 }: { children: ReactNode; strength?: number }) {
  const reduce = useReducedMotion()
  const x = useSpring(0, { stiffness: 260, damping: 15 })
  const y = useSpring(0, { stiffness: 260, damping: 15 })
  return (
    <motion.span
      className="inline-flex"
      style={reduce ? undefined : { x, y }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        x.set((e.clientX - r.left - r.width / 2) * strength)
        y.set((e.clientY - r.top - r.height / 2) * strength)
      }}
      onPointerLeave={() => { x.set(0); y.set(0) }}
    >
      {children}
    </motion.span>
  )
}

// Бесконечная бегущая строка; на наведении останавливается
export function Marquee({ children, reverse = false, duration = 40, className }: { children: ReactNode; reverse?: boolean; duration?: number; className?: string }) {
  return (
    <div className={`group flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)] ${className ?? ''}`}>
      {[0, 1].map((k) => (
        <div key={k} aria-hidden={k === 1} className="marquee-track flex shrink-0 items-center gap-3 pr-3 group-hover:[animation-play-state:paused]" style={{ animationDuration: `${duration}s`, animationDirection: reverse ? 'reverse' : 'normal' }}>
          {children}
        </div>
      ))}
    </div>
  )
}

// Текст проявляется по словам, пока его прокручиваешь (Scroll Word Reveal)
export function TextReveal({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 45%'] })
  const words = text.split(' ')
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>{w}</Word>)}
    </p>
  )
}
function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const reduce = useReducedMotion()
  const opacity = useTransform(progress, range, [0.15, 1])
  return <><motion.span style={reduce ? undefined : { opacity }}>{children}</motion.span>{' '}</>
}

// Слова заголовка всплывают из размытия
export function BlurIn({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const reduce = useReducedMotion()
  if (reduce) return <span className={className}>{text}</span>
  return (
    <span className={className}>
      {text.split(' ').map((w, i) => (
        <span key={i}>
          <motion.span className="inline-block" initial={{ opacity: 0, y: 14, filter: 'blur(10px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ delay: delay + i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>{w}</motion.span>{' '}
        </span>
      ))}
    </span>
  )
}

// Луч света бежит по кривой между двумя элементами (Animated Beam, Magic UI через 21st.dev)
export function AnimatedBeam({ containerRef, fromRef, toRef, curvature = 0, reverse = false, duration = 4, delay = 0 }: {
  containerRef: RefObject<HTMLElement | null>; fromRef: RefObject<HTMLElement | null>; toRef: RefObject<HTMLElement | null>
  curvature?: number; reverse?: boolean; duration?: number; delay?: number
}) {
  // useId даёт символы вроде «:» и «», которые ломают url(#…) — оставляем только буквы и цифры
  const id = 'beam' + useId().replace(/[^a-zA-Z0-9]/g, '')
  const reduce = useReducedMotion()
  const [d, setD] = useState('')
  const [size, setSize] = useState({ w: 0, h: 0 })
  useEffect(() => {
    const update = () => {
      const c = containerRef.current, a = fromRef.current, b = toRef.current
      if (!c || !a || !b) return
      const cr = c.getBoundingClientRect(), ar = a.getBoundingClientRect(), br = b.getBoundingClientRect()
      setSize({ w: cr.width, h: cr.height })
      const sx = ar.left - cr.left + ar.width / 2, sy = ar.top - cr.top + ar.height / 2
      const ex = br.left - cr.left + br.width / 2, ey = br.top - cr.top + br.height / 2
      setD(`M ${sx},${sy} Q ${(sx + ex) / 2},${sy - curvature} ${ex},${ey}`)
    }
    update()
    const ro = new ResizeObserver(update)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [containerRef, fromRef, toRef, curvature])
  const g = reverse ? { x1: ['90%', '-10%'], x2: ['100%', '0%'] } : { x1: ['10%', '110%'], x2: ['0%', '100%'] }
  return (
    <svg aria-hidden fill="none" width={size.w} height={size.h} viewBox={`0 0 ${size.w} ${size.h}`} className="pointer-events-none absolute left-0 top-0">
      <path d={d} stroke="#177E96" strokeWidth={2} strokeOpacity={0.18} strokeLinecap="round" />
      {!reduce && <path d={d} stroke={`url(#${id})`} strokeWidth={3} strokeLinecap="round" />}
      <defs>
        <motion.linearGradient id={id} gradientUnits="userSpaceOnUse" initial={{ x1: '0%', x2: '0%', y1: '0%', y2: '0%' }} animate={{ ...g, y1: ['0%', '0%'], y2: ['0%', '0%'] }}
          transition={{ delay, duration, ease: [0.16, 1, 0.3, 1], repeat: Infinity }}>
          <stop stopColor="#48F6FF" stopOpacity="0" />
          <stop stopColor="#48F6FF" />
          <stop offset="32.5%" stopColor="#F2FF59" />
          <stop offset="100%" stopColor="#F2FF59" stopOpacity="0" />
        </motion.linearGradient>
      </defs>
    </svg>
  )
}

// Свет бежит по рамке карточки (Border Beam)
export function BorderBeam({ className }: { className?: string }) {
  return <span aria-hidden className={`border-beam pointer-events-none absolute inset-0 rounded-[inherit] ${className ?? ''}`} />
}

// Мягкий свет за курсором внутри секции (Spotlight)
export function Spotlight({ className, color = 'rgba(72,246,255,0.22)' }: { className?: string; color?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(-400)
  const my = useMotionValue(-400)
  const bg = useMotionTemplate`radial-gradient(520px circle at ${mx}px ${my}px, ${color}, transparent 65%)`
  useEffect(() => {
    const parent = ref.current?.parentElement
    if (!parent) return
    const on = (e: PointerEvent) => { const r = parent.getBoundingClientRect(); mx.set(e.clientX - r.left); my.set(e.clientY - r.top) }
    parent.addEventListener('pointermove', on)
    return () => parent.removeEventListener('pointermove', on)
  }, [mx, my])
  return <motion.div ref={ref} aria-hidden className={`pointer-events-none absolute inset-0 -z-10 ${className ?? ''}`} style={{ background: bg }} />
}

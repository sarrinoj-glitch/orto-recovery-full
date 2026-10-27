'use client'

import { forwardRef, useEffect, useRef, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion, useInView, useReducedMotion, useSpring } from 'framer-motion'
import { ArrowRight, BellRing, CalendarCheck, Globe, MessageCircle, Phone, Stethoscope, X } from 'lucide-react'
import { CLINIC, DOCTORS, type Doctor } from '@/lib/clinic'
import { METHODS } from '@/lib/content'
import { SERVICES } from '@/lib/nav'
import { asset } from '@/lib/asset'
import { openChat } from '@/components/ChatWidget'
import { AnimatedBeam, BorderBeam, Magnetic, Marquee, NumberTicker, TextReveal } from '@/components/ui/motion'

const H2 = 'text-[2.1rem] font-extrabold leading-[1.05] tracking-[-0.03em] text-graphite sm:text-5xl'
const tel = `tel:${CLINIC.phone.replace(/[^\d+]/g, '')}`

// ===== Цифры центра (Number Ticker) — только факты: 2ГИС, Яндекс, биография врача, старый сайт, прайс =====
const STATS: { v: number; dec?: number; suffix?: string; label: string; src: string }[] = [
  { v: 5, dec: 1, label: 'рейтинг в 2ГИС', src: '2ГИС' },
  { v: 121, label: 'оценка пациентов', src: '2ГИС' },
  { v: 4.9, dec: 1, label: 'на Яндекс Картах', src: 'Яндекс' },
  { v: 30, suffix: ' лет', label: 'стаж эндоскописта высшей категории', src: 'биография врача' },
  { v: 23, label: 'методики восстановления', src: 'сайт центра' },
  { v: 8, label: 'направлений в одном центре', src: 'прайс' },
]

export function Stats() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="relative overflow-hidden rounded-[32px] bg-deep p-6 text-white sm:p-8">
        <BorderBeam />
        <div aria-hidden className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-neon/15 blur-3xl" />
        <ul className="relative grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-3 lg:grid-cols-6">
          {STATS.map((s) => (
            <li key={s.label}>
              <p className="text-[2.6rem] font-extrabold leading-none tracking-[-0.04em] text-lime sm:text-5xl">
                <NumberTicker value={s.v} decimals={s.dec} />{s.suffix && <span className="text-2xl">{s.suffix}</span>}
              </p>
              <p className="mt-2 text-sm leading-snug text-white/75">{s.label}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

// ===== Как проходит лечение: шаги со старого сайта, фото «прилипает» и меняется при прокрутке (Sticky Scroll Reveal) =====
const STEPS = [
  { t: 'Расскажите, что беспокоит', d: 'Врач собирает жалобы и историю: когда началось, что усиливает боль, были ли травмы и операции.', img: '/photos/g-ortho.jpg', alt: 'Ортопед за рабочим столом' },
  { t: 'Осмотр и простой тест', d: 'Врач смотрит, как двигается сустав или спина, и проводит несложный физический тест.', img: '/photos/g-explain.jpg', alt: 'Врач объясняет на доске' },
  { t: 'Разбираем снимки', d: 'МРТ, рентген, заключения — врач объяснит простыми словами, что на них видно.', img: '/photos/g-mri.jpg', alt: 'Врачи разбирают снимок МРТ' },
  { t: 'План лечения и цена', d: 'Вы получаете курс процедур и знаете, сколько он стоит, до начала лечения.', img: '/photos/c-shoulder.jpg', alt: 'Ударно-волновая терапия плеча' },
]

function Step({ i, active, onActive }: { i: number; active: boolean; onActive: (i: number) => void }) {
  const ref = useRef<HTMLLIElement>(null)
  const inView = useInView(ref, { margin: '-45% 0px -45% 0px' })
  useEffect(() => { if (inView) onActive(i) }, [inView, i, onActive])
  const s = STEPS[i]
  return (
    <li ref={ref} className="relative py-8 pl-16 lg:min-h-[52vh] lg:py-12">
      <span className={`absolute left-0 top-8 flex h-11 w-11 items-center justify-center rounded-full text-lg font-extrabold transition-colors duration-500 lg:top-12 ${active ? 'bg-lime text-graphite' : 'bg-ward text-graphite/40'}`}>{i + 1}</span>
      <p className={`text-2xl font-bold tracking-[-0.02em] transition-colors duration-500 sm:text-3xl ${active ? 'text-deep' : 'text-graphite/35'}`}>{s.t}</p>
      <p className={`mt-3 max-w-md text-lg leading-relaxed transition-colors duration-500 ${active ? 'text-graphite/75' : 'text-graphite/30'}`}>{s.d}</p>
      <img src={asset(s.img)} alt={s.alt} className="mt-5 aspect-[4/3] w-full rounded-3xl object-cover lg:hidden" />
    </li>
  )
}

export function StickySteps() {
  const [active, setActive] = useState(0)
  const reduce = useReducedMotion()
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal">Как проходит приём</p>
      <h2 className={`${H2} mt-3 max-w-2xl`}>Сначала причина — потом лечение</h2>
      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <ol className="relative">
          <span aria-hidden className="absolute bottom-12 left-[21px] top-12 w-0.5 bg-ward" />
          <motion.span aria-hidden className="absolute left-[21px] top-12 w-0.5 origin-top bg-gradient-to-b from-neon to-lime" style={{ height: 'calc(100% - 96px)' }} animate={{ scaleY: (active + 1) / STEPS.length }} transition={{ type: 'spring', stiffness: 120, damping: 24 }} />
          {STEPS.map((_, i) => <Step key={i} i={i} active={active === i} onActive={setActive} />)}
        </ol>
        <div className="hidden lg:block">
          <div className="sticky top-28 aspect-[4/5] overflow-hidden rounded-[36px] bg-ward shadow-lift">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.img key={active} src={asset(STEPS[active].img)} alt={STEPS[active].alt} className="absolute inset-0 h-full w-full object-cover"
                initial={reduce ? false : { opacity: 0, scale: 1.08 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} />
            </AnimatePresence>
            <div className="absolute inset-x-5 bottom-5 flex items-center justify-between rounded-2xl bg-white/90 px-4 py-3 backdrop-blur">
              <span className="text-sm font-semibold text-deep">Шаг {active + 1} из {STEPS.length}</span>
              <span className="flex gap-1.5">{STEPS.map((_, i) => <span key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === active ? 'w-6 bg-teal' : 'w-1.5 bg-teal/25'}`} />)}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ===== Как работает запись: лучи от каналов к администратору и дальше (Animated Beam) =====
const Node = forwardRef<HTMLDivElement, { children: ReactNode; label: string; big?: boolean }>(({ children, label, big }, ref) => (
  <div className="relative z-10 flex flex-col items-center gap-2 text-center">
    <div ref={ref} className={`flex items-center justify-center rounded-full bg-white shadow-[0_10px_30px_-12px_rgba(11,61,74,0.55)] ring-1 ring-graphite/5 ${big ? 'h-24 w-24 sm:h-28 sm:w-28' : 'h-14 w-14 sm:h-16 sm:w-16'}`}>{children}</div>
    <span className={`max-w-[110px] text-[13px] leading-tight ${big ? 'font-bold text-deep' : 'text-graphite/70'}`}>{label}</span>
  </div>
))
Node.displayName = 'Node'

export function BookingFlow() {
  const box = useRef<HTMLDivElement>(null)
  const a = useRef<HTMLDivElement>(null), b = useRef<HTMLDivElement>(null), c = useRef<HTMLDivElement>(null)
  const hub = useRef<HTMLDivElement>(null)
  const x = useRef<HTMLDivElement>(null), y = useRef<HTMLDivElement>(null), z = useRef<HTMLDivElement>(null)
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal">Запись без ожидания на линии</p>
          <h2 className={`${H2} mt-3`}>Пишете куда удобно — администратор сделает остальное</h2>
          <p className="mt-4 text-lg leading-relaxed text-graphite/65">Сайт, WhatsApp или звонок: администратор подберёт врача, запишет на свободное время и напомнит о визите накануне.</p>
          <p className="mt-3 text-sm text-graphite/45">Пример того, как работает ИИ-администратор центра.</p>
          <button type="button" onClick={() => openChat()} className="shimmer mt-7 flex h-14 items-center gap-2 rounded-full bg-deep px-7 font-semibold text-white">Попробовать — написать <ArrowRight size={18} /></button>
        </div>
        <div ref={box} className="relative flex h-[380px] items-center justify-between overflow-hidden rounded-[32px] bg-gradient-to-br from-lagoon via-white to-lime-soft px-4 sm:h-[420px] sm:px-10">
          <div className="flex h-full flex-col justify-around py-6">
            <Node ref={a} label="Сайт"><Globe size={22} className="text-teal" /></Node>
            <Node ref={b} label="WhatsApp"><MessageCircle size={22} className="text-[#25D366]" /></Node>
            <Node ref={c} label="Звонок"><Phone size={22} className="text-teal" /></Node>
          </div>
          <Node ref={hub} big label="Администратор"><img src={asset('/logo-dark.png')} alt="" className="w-16 sm:w-20" /></Node>
          <div className="flex h-full flex-col justify-around py-6">
            <Node ref={x} label="Подбор врача"><Stethoscope size={22} className="text-deep" /></Node>
            <Node ref={y} label="Запись на время"><CalendarCheck size={22} className="text-deep" /></Node>
            <Node ref={z} label="Напоминание накануне"><BellRing size={22} className="text-[#C2563A]" /></Node>
          </div>
          <AnimatedBeam containerRef={box} fromRef={a} toRef={hub} curvature={-60} duration={4.2} />
          <AnimatedBeam containerRef={box} fromRef={b} toRef={hub} duration={3.6} delay={0.4} />
          <AnimatedBeam containerRef={box} fromRef={c} toRef={hub} curvature={60} duration={4.6} delay={0.8} />
          <AnimatedBeam containerRef={box} fromRef={hub} toRef={x} curvature={-60} duration={4.2} delay={1.2} />
          <AnimatedBeam containerRef={box} fromRef={hub} toRef={y} duration={3.8} delay={1.6} />
          <AnimatedBeam containerRef={box} fromRef={hub} toRef={z} curvature={60} duration={4.4} delay={2} />
        </div>
      </div>
    </section>
  )
}

// ===== Принцип центра: цитата со старого сайта проявляется при прокрутке =====
export function Manifesto() {
  return (
    <section className="relative isolate overflow-hidden bg-deep py-20 text-white sm:py-28">
      <div aria-hidden className="absolute -left-32 top-0 -z-10 h-96 w-96 rounded-full bg-neon/10 blur-3xl" />
      <div aria-hidden className="absolute -right-24 bottom-0 -z-10 h-80 w-80 rounded-full bg-lime/10 blur-3xl" />
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neon">Принцип центра</p>
        <TextReveal className="mt-5 text-[1.9rem] font-bold leading-[1.2] tracking-[-0.02em] sm:text-[2.9rem]"
          text="Для двух пациентов с одинаковым диагнозом нельзя использовать одну и ту же программу: для одного она будет слишком лёгкой, для другого — невыполнимой. Поэтому план лечения мы составляем под вас." />
      </div>
    </section>
  )
}

// ===== 23 методики бегущей строкой =====
export function MethodsMarquee() {
  const half = Math.ceil(METHODS.length / 2)
  const chip = (n: string, i: number) => <span key={n} className={`whitespace-nowrap rounded-full px-5 py-3 text-[15px] font-medium ${i % 3 === 0 ? 'bg-lime text-graphite' : i % 3 === 1 ? 'bg-lagoon text-deep' : 'bg-white text-deep ring-1 ring-graphite/10'}`}>{n}</span>
  return (
    <section className="py-14">
      <div className="mx-auto mb-6 flex max-w-6xl flex-wrap items-end justify-between gap-3 px-4 sm:px-6">
        <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-graphite sm:text-3xl">23 методики восстановления в одном центре</h2>
        <Link href="/uslugi/fizioterapiya/" className="flex items-center gap-2 font-semibold text-teal">Что это за методики <ArrowRight size={18} /></Link>
      </div>
      <div className="space-y-3">
        <Marquee duration={55}>{METHODS.slice(0, half).map((m, i) => chip(m.name, i))}</Marquee>
        <Marquee duration={60} reverse>{METHODS.slice(half).map((m, i) => chip(m.name, i + 1))}</Marquee>
      </div>
    </section>
  )
}

// ===== Врачи: карточка раскрывается в окно с биографией (Morphing Dialog) =====
// Биографии — из медиатеки старого сайта (выгрузка WordPress, 25.10.2026); у кого её нет, показываем, что лечит
const BIO: Record<string, string[]> = {
  'Куделя Александр Павлович': ['Дагестанский государственный медицинский институт, лечебное дело (1979)', 'Переподготовка по эндоскопии — ГНЦ колопроктологии, Москва (1984)', 'Высшая квалификационная категория по эндоскопии (2004)', 'Повышение квалификации: РМАПО (1999, 2018), СПбМАПО (2009), ГНЦ колопроктологии (2014)'],
  'Нажмудинова Айшат Абдурахмановна': ['Первый МГМУ им. Сеченова, лечебное дело (2013)', 'Специализация по гастроэнтерологии — МГМСУ им. Евдокимова (2019)', 'Повышение квалификации по гастроэнтерологии и гепатологии — РНИМУ им. Пирогова (2023–2024)'],
  'Мусаева Эльмира Ашурбеговна': ['Лечебная гимнастика по методике SEAS (СИАС)', 'Ашхабадское медицинское училище (1994)', 'Северо-Кавказский государственный институт (2012)'],
  'Куделя Павел Александрович': ['Проводит авторские семинары по сухим иглам для специалистов'],
}
const TONES = ['bg-teal text-white', 'bg-lime text-graphite', 'bg-deep text-white', 'bg-coral-soft text-graphite', 'bg-lagoon-deep text-graphite', 'bg-teal-soft text-teal-dark']
const initials = (n: string) => n.split(' ').slice(0, 2).map((w) => w[0]).join('')

function Avatar({ d, i, className }: { d: Doctor; i: number; className: string }) {
  return d.photo ? <img src={d.photo} alt="" className={`object-cover object-[50%_20%] ${className}`} />
    : <span aria-hidden className={`flex items-center justify-center font-bold ${TONES[i % TONES.length]} ${className}`}>{initials(d.name)}</span>
}

export function DoctorsMorph({ title = 'Врачи, к которым приходят по имени', link = true }: { title?: string; link?: boolean }) {
  const [open, setOpen] = useState<number | null>(null)
  useEffect(() => {
    if (open === null) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(null) }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [open])
  const d = open !== null ? DOCTORS[open] : null

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className={H2}>{title}</h2>
        {link && <Link href="/vrachi/" className="flex items-center gap-2 font-semibold text-teal">Все врачи <ArrowRight size={18} /></Link>}
      </div>
      <p className="mt-3 text-graphite/55">Нажмите на карточку — откроется подробнее о враче.</p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DOCTORS.map((doc, i) => (
          <li key={doc.name}>
            <motion.button layoutId={`doc-${i}`} type="button" onClick={() => setOpen(i)} className="group flex w-full items-center gap-4 rounded-[26px] bg-white p-4 text-left shadow-soft ring-1 ring-graphite/5 transition-shadow hover:shadow-lift" style={{ borderRadius: 26 }}>
              <motion.div layoutId={`doc-ava-${i}`} className="shrink-0 overflow-hidden rounded-[20px]"><Avatar d={doc} i={i} className="h-20 w-20 text-xl" /></motion.div>
              <span className="min-w-0 flex-1">
                <motion.b layoutId={`doc-name-${i}`} className="block leading-tight text-deep">{doc.name}</motion.b>
                <span className="mt-1 block text-[13px] text-teal">{doc.role}</span>
                <span className="mt-2 flex items-center justify-between text-sm"><b className="text-deep">{doc.price}</b><span className="flex h-8 w-8 items-center justify-center rounded-full bg-ward text-deep transition group-hover:bg-lime">+</span></span>
              </span>
            </motion.button>
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {d && open !== null && (
          <motion.div className="fixed inset-0 z-[70] flex items-end justify-center bg-deep/60 p-3 backdrop-blur-sm sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(null)}>
            <motion.div layoutId={`doc-${open}`} role="dialog" aria-modal="true" aria-label={d.name} onClick={(e) => e.stopPropagation()} className="relative max-h-[90svh] w-full max-w-2xl overflow-y-auto bg-white p-6 sm:p-8" style={{ borderRadius: 32 }}>
              <button type="button" autoFocus onClick={() => setOpen(null)} aria-label="Закрыть" className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-ward text-deep"><X size={18} /></button>
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <motion.div layoutId={`doc-ava-${open}`} className="shrink-0 overflow-hidden rounded-[26px]"><Avatar d={d} i={open} className="h-36 w-36 text-4xl" /></motion.div>
                <div>
                  <motion.b layoutId={`doc-name-${open}`} className="block text-2xl leading-tight text-deep">{d.name}</motion.b>
                  <p className="mt-2 font-semibold text-teal">{d.role}</p>
                  <p className="mt-2 text-[15px] leading-relaxed text-graphite/70">{d.treats}</p>
                </div>
              </div>
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                {BIO[d.name] && (
                  <ul className="mt-6 space-y-2.5 rounded-3xl bg-ward p-5">
                    {BIO[d.name].map((line) => <li key={line} className="flex gap-3 text-[15px] leading-relaxed"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />{line}</li>)}
                  </ul>
                )}
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                  <span className="text-2xl font-extrabold text-deep">{d.price}</span>
                  <button type="button" onClick={() => { setOpen(null); openChat(d.chat) }} className="shimmer h-14 rounded-full bg-deep px-7 font-semibold text-white">Записаться к врачу</button>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

// ===== Финальный призыв: врачи вращаются вокруг кнопки (Orbiting Circles) =====
export function OrbitCta() {
  const ring = (cls: string, radius: number, items: number[]) => (
    <div className={`absolute left-1/2 top-1/2 ${cls}`} style={{ width: radius * 2, height: radius * 2, marginLeft: -radius, marginTop: -radius }}>
      {items.map((di, k) => {
        const ang = (k / items.length) * Math.PI * 2
        const d = DOCTORS[di]
        return (
          <div key={di} className="orbit-item absolute" style={{ left: radius + Math.cos(ang) * radius - 28, top: radius + Math.sin(ang) * radius - 28 }}>
            <Avatar d={d} i={di} className="h-14 w-14 rounded-full border-[3px] border-deep text-base shadow-lift" />
          </div>
        )
      })}
    </div>
  )
  return (
    <section className="px-4 py-10 sm:px-6">
      <div className="relative mx-auto flex min-h-[520px] max-w-6xl flex-col items-center justify-center overflow-hidden rounded-[40px] bg-deep px-6 py-16 text-center text-white">
        <div aria-hidden className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
        <div aria-hidden className="absolute left-1/2 top-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {ring('orbit-spin', 150, [0, 2, 4])}
          {ring('orbit-spin-2 hidden sm:block', 240, [1, 3, 5])}
        </div>
        <div className="relative z-10 max-w-md rounded-[28px] bg-deep/70 px-4 py-6 backdrop-blur-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neon">Запись</p>
          <h2 className="mt-3 text-[2rem] font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-[2.6rem]">Жизнь без боли начинается <span className="text-lime">с&nbsp;одного приёма</span></h2>
          <div className="mt-7 flex justify-center">
            <Magnetic>
              <button type="button" onClick={() => openChat()} className="shimmer flex h-14 items-center gap-2 rounded-full bg-lime px-8 font-bold text-graphite shadow-[0_18px_40px_-16px_rgba(242,255,89,.7)]">Записаться на приём <ArrowRight size={18} /></button>
            </Magnetic>
          </div>
          <a href={tel} className="mt-4 inline-block text-white/70 hover:text-white">или позвоните: {CLINIC.phone}</a>
        </div>
      </div>
    </section>
  )
}

// ===== Мобильная панель записи (как Dock): всегда под рукой на телефоне =====
export function MobileDock() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const on = () => setShow(window.scrollY > 280)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  return (
    <AnimatePresence>
      {show && (
        <motion.nav aria-label="Быстрая запись" initial={{ y: 90 }} animate={{ y: 0 }} exit={{ y: 90 }} transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-[1fr_1fr_1.4fr] gap-2 rounded-[22px] bg-white/95 p-2 shadow-[0_20px_50px_-15px_rgba(11,61,74,0.6)] ring-1 ring-graphite/10 backdrop-blur md:hidden">
          <a href={tel} className="flex h-12 flex-col items-center justify-center rounded-2xl bg-ward text-[11px] font-semibold text-deep"><Phone size={18} />Позвонить</a>
          <a href={CLINIC.whatsappLink} target="_blank" rel="noreferrer" className="flex h-12 flex-col items-center justify-center rounded-2xl bg-ward text-[11px] font-semibold text-deep"><MessageCircle size={18} className="text-[#25D366]" />WhatsApp</a>
          <button type="button" onClick={() => openChat()} className="shimmer h-12 rounded-2xl bg-deep text-[15px] font-bold text-white">Записаться</button>
        </motion.nav>
      )}
    </AnimatePresence>
  )
}

// ===== Каталог услуг: картинка плывёт за курсором над строкой (Hover Image Reveal), только на компьютере =====
export function ServicesHoverList() {
  const [hover, setHover] = useState<number | null>(null)
  const box = useRef<HTMLDivElement>(null)
  const x = useSpring(0, { stiffness: 260, damping: 28 })
  const y = useSpring(0, { stiffness: 260, damping: 28 })
  return (
    <section className="mx-auto hidden max-w-6xl px-6 py-14 lg:block">
      <div ref={box} className="relative" onPointerMove={(e) => { const r = box.current!.getBoundingClientRect(); x.set(e.clientX - r.left); y.set(e.clientY - r.top) }} onPointerLeave={() => setHover(null)}>
        <ul className="border-t border-graphite/10">
          {SERVICES.map((s, i) => (
            <li key={s.slug} onPointerEnter={() => setHover(i)}>
              <Link href={`/uslugi/${s.slug}/`} className="group flex items-center justify-between gap-8 border-b border-graphite/10 py-6">
                <span className="flex items-baseline gap-6">
                  <span className="w-8 font-mono text-sm text-graphite/35">{String(i + 1).padStart(2, '0')}</span>
                  <span className={`text-[2.4rem] font-extrabold tracking-[-0.03em] transition-all duration-300 ${hover === null || hover === i ? 'text-deep' : 'text-graphite/25'} group-hover:translate-x-2`}>{s.menu}</span>
                </span>
                <span className="flex items-center gap-5">
                  <span className="max-w-xs text-right text-sm text-graphite/55">{s.kicker}</span>
                  <span className="whitespace-nowrap rounded-full bg-ward px-4 py-2 font-semibold text-deep transition group-hover:bg-lime">{s.prices[0][1]}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <AnimatePresence>
          {hover !== null && (
            <motion.div key="float" aria-hidden className="pointer-events-none absolute left-0 top-0 z-20 h-[220px] w-[300px] overflow-hidden rounded-3xl shadow-lift"
              style={{ x, y, translateX: '-50%', translateY: '-115%' }} initial={{ opacity: 0, scale: 0.8, rotate: -4 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }}>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.img key={hover} src={asset(SERVICES[hover].photo)} alt="" className="absolute inset-0 h-full w-full object-cover" initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} />
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

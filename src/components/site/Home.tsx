'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { ArrowRight, Plus, Search } from 'lucide-react'
import { CLINIC, DOCTORS } from '@/lib/clinic'
import { asset } from '@/lib/asset'
import { openChat } from '@/components/ChatWidget'

const H2 = 'text-[2.1rem] font-extrabold leading-[1.05] tracking-[-0.03em] text-graphite sm:text-5xl'
const CHIPS = ['Болит спина', 'Грыжа диска', 'Колено', 'Плечо после травмы', 'Пятка по утрам', 'Сколиоз у ребёнка', 'Реабилитолог на дом']

// Первый экран (подача Hinge): живое фото на весь экран + оффер «без операции» со старого сайта + поиск «Что беспокоит?»
export function HomeHero() {
  const [q, setQ] = useState('')
  const submit = (e: FormEvent) => { e.preventDefault(); openChat(q.trim() || undefined) }
  return (
    <>
      <section className="relative isolate -mt-[84px] flex min-h-[max(680px,100svh)] items-start overflow-hidden rounded-b-[32px] text-white sm:-mt-[92px] sm:rounded-b-[48px]">
        <img src={asset('/photos/hero.jpg')} alt="Дедушка присел в саду и держит внука на руках" className="absolute inset-0 -z-20 h-[62%] w-full -scale-x-100 object-cover object-[40%_0%] sm:h-full sm:object-[50%_40%]" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(7,40,49,.45)_0%,rgba(7,40,49,0)_18%,rgba(7,40,49,0)_34%,rgba(7,40,49,.9)_54%,#072831_64%)] sm:bg-[linear-gradient(90deg,rgba(7,40,49,.92)_0%,rgba(7,40,49,.78)_28%,rgba(7,40,49,.25)_52%,rgba(7,40,49,0)_70%),linear-gradient(180deg,rgba(7,40,49,.55)_0%,rgba(7,40,49,0)_22%,rgba(7,40,49,0)_70%,rgba(7,40,49,.55)_100%)]" />
        <div className="mx-auto w-full max-w-[1320px] px-4 pb-24 pt-[300px] sm:px-6 sm:pt-[170px]">
          <div className="max-w-[640px]">
            <span className="inline-flex items-center gap-2.5 rounded-full bg-lime py-2 pl-2.5 pr-4 text-sm font-semibold text-graphite">
              <b className="rounded-full bg-graphite px-2.5 py-0.5 text-[13px] text-lime">{CLINIC.rating2gis.value}</b>2ГИС · {CLINIC.rating2gis.count} оценка
            </span>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-neon">Центр восстановительной медицины · Махачкала</p>
            <h1 className="mt-3 text-[2.6rem] font-extrabold leading-none tracking-[-0.035em] sm:text-[4.2rem]">
              Лечим боль в спине и суставах <span className="bg-gradient-to-r from-neon to-lime bg-clip-text text-transparent">без операции</span>
            </h1>
            <p className="mt-5 max-w-[520px] text-lg leading-relaxed text-white/85">Ортопеды, невролог и реабилитологи. Сначала находим причину, потом составляем план лечения — цену вы знаете до начала.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={() => openChat()} className="flex h-14 items-center justify-center gap-2.5 rounded-full bg-[radial-gradient(120%_180%_at_50%_50%,#FDFFC7_0%,#F2FF59_45%,#DCEB2E_100%)] px-8 font-bold text-graphite shadow-[0_18px_40px_-16px_rgba(242,255,89,.7)] transition hover:-translate-y-0.5">
                Записаться на приём <ArrowRight size={20} />
              </button>
              <Link href="/uslugi/" className="flex h-14 items-center justify-center rounded-full border border-white/35 bg-white/10 px-7 font-semibold backdrop-blur">Что мы лечим</Link>
            </div>
          </div>
        </div>
        <span aria-hidden className="absolute left-[69.5%] top-[53%] hidden h-5 w-5 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full border-[3px] border-white bg-[#E2553A] shadow-[0_0_0_10px_rgba(226,85,58,.25)] lg:block" />
        <Link href="/uslugi/ortopediya/" className="absolute left-[calc(69.5%+22px)] top-[calc(53%+14px)] hidden rounded-2xl bg-white/95 px-3.5 py-2.5 text-[13px] leading-snug text-graphite shadow-lift lg:block">
          <b className="block text-sm">Плечо</b><span className="text-graphite/60">ортопед · приём 3 000 ₽</span>
        </Link>
      </section>

      <section className="relative z-10 mx-auto -mt-10 max-w-[1320px] px-4 sm:-mt-16 sm:px-6">
        <div className="grid gap-4 rounded-[28px] bg-white p-4 shadow-[0_30px_60px_-30px_rgba(11,61,74,.45)] sm:p-5 lg:grid-cols-[1fr_auto] lg:items-center">
          <form onSubmit={submit} className="flex h-14 items-center gap-3 rounded-2xl bg-ward pl-4 pr-2">
            <Search size={20} className="shrink-0 text-teal" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Что беспокоит? Например: болит поясница" aria-label="Что беспокоит" className="min-w-0 flex-1 bg-transparent text-base outline-none" />
            <button type="submit" className="hidden h-11 rounded-xl bg-deep px-5 font-semibold text-white sm:block">Подобрать врача</button>
          </form>
          <div className="flex items-center gap-3 lg:border-l lg:border-graphite/10 lg:pl-5">
            <b className="text-3xl font-extrabold tracking-[-0.03em] text-deep">5,0</b>
            <span className="text-[13px] leading-tight text-graphite/60"><span className="text-[#F5B301]">★★★★★</span><br />2ГИС, {CLINIC.rating2gis.count} оценка · Яндекс {CLINIC.ratingYandex.value}</span>
          </div>
          <div className="flex flex-wrap gap-2 lg:col-span-2">
            {CHIPS.map((c) => <button key={c} type="button" onClick={() => openChat(`Здравствуйте, ${c.toLowerCase()}`)} className="rounded-full border border-teal-soft px-4 py-2 text-sm text-deep transition hover:border-neon hover:bg-lagoon">{c}</button>)}
          </div>
        </div>
      </section>
    </>
  )
}

const CARDS = [
  { href: '/uslugi/spina/', tag: 'Спина и шея', title: 'Боль в спине и шее', text: 'Грыжи, протрузии, остеохондроз.', price: 'полный приём 8 000 ₽', img: '/photos/c-back.jpg', pos: 'object-right' },
  { href: '/uslugi/ortopediya/', tag: 'Суставы', title: 'Колено и тазобедренный', text: 'PRP, ударно-волновая терапия, ЛФК.', price: 'приём ортопеда 3 000 ₽', img: '/photos/c-knee.jpg', pos: 'object-center', spot: ['52%', '52%'] },
  { href: '/uslugi/ortopediya/', tag: 'Плечо и кисть', title: 'Плечо и кисть', text: 'После переломов и травм, УВТ, тейпирование.', price: 'приём ортопеда 3 000 ₽', img: '/photos/c-shoulder.jpg', pos: 'object-left', spot: ['57%', '38%'] },
  { href: '/uslugi/ortopediya/', tag: 'Стопа', title: 'Стопа и пятка', text: 'Пяточная шпора, плоскостопие, стельки.', price: 'УВТ 3 000 ₽', img: '/photos/foot.jpg', pos: 'object-[95%_50%]', spot: ['74%', '50%'] },
  { href: '/uslugi/reabilitaciya/', tag: 'Реабилитация', title: 'После травм и операций', text: 'ЛФК под контролем врача, спортивная реабилитация.', price: 'ЛФК 2 500 ₽', img: '/photos/g-lfk.jpg', pos: 'object-center' },
  { href: '/uslugi/endoskopiya/', tag: 'Эндоскопия', title: 'Обследование во сне', text: 'Гастроскопия и колоноскопия под седацией.', price: 'от 6 000 ₽', img: '/photos/c-endo.jpg', pos: 'object-center' },
  { href: '/uslugi/detyam/', tag: 'Детям', title: 'Осанка и стопы у детей', text: 'Гимнастика СИАС, занятия при ДЦП.', price: 'занятие 2 500 ₽', img: '/photos/g-explain.jpg', pos: 'object-[60%_50%]' },
]

// «От шеи до пяток» (Hinge): карточки с фото и точкой боли, каждая ведёт на страницу услуги
export function BodyCards() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className={H2}>От шеи до пяток</h2>
        <Link href="/uslugi/" className="flex items-center gap-2 font-semibold text-teal">Все услуги <ArrowRight size={18} /></Link>
      </div>
      <div className="-mx-4 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 [scrollbar-width:none] sm:mx-0 sm:px-0">
        {CARDS.map((c) => (
          <Link key={c.title} href={c.href} className="group relative isolate aspect-[4/5] w-[78%] shrink-0 snap-start overflow-hidden rounded-[28px] text-white transition hover:-translate-y-1.5 sm:w-[300px]">
            <img src={asset(c.img)} alt="" className={`absolute inset-0 -z-20 h-full w-full object-cover transition duration-700 group-hover:scale-105 ${c.pos}`} />
            <span className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent from-40% to-deep/90" />
            <span className="absolute left-4 top-4 rounded-full bg-lime px-3 py-1 text-[13px] font-semibold text-graphite">{c.tag}</span>
            {c.spot && <span aria-hidden className="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white bg-[#E2553A] shadow-[0_0_0_14px_rgba(255,106,61,.3)]" style={{ left: c.spot[0], top: c.spot[1] }} />}
            <span className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-3">
              <span>
                <span className="block text-[1.4rem] font-bold leading-tight tracking-[-0.02em]">{c.title}</span>
                <span className="mt-1.5 block text-sm text-white/80">{c.text}</span>
                <span className="mt-2 block text-sm font-semibold text-neon">{c.price}</span>
              </span>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-deep transition group-hover:rotate-90 group-hover:bg-lime"><Plus size={20} /></span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}

const TONES = ['bg-teal text-white', 'bg-lime text-graphite', 'bg-deep text-white', 'bg-coral-soft text-graphite', 'bg-lagoon-deep text-graphite', 'bg-teal-soft text-teal-dark']
const initials = (n: string) => n.split(' ').slice(0, 2).map((w) => w[0]).join('')

export function DoctorsTeaser() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className={H2}>Врачи, к которым приходят по имени</h2>
        <Link href="/vrachi/" className="flex items-center gap-2 font-semibold text-teal">Все врачи <ArrowRight size={18} /></Link>
      </div>
      <ul data-stagger className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DOCTORS.map((d, i) => (
          <li key={d.name} className="lift flex flex-col gap-3 rounded-[26px] bg-white p-5 shadow-soft ring-1 ring-graphite/5">
            <div className="flex items-center gap-3.5">
              {d.photo ? <img src={d.photo} alt="" className="h-16 w-16 shrink-0 rounded-[20px] object-cover object-[50%_20%]" />
                : <span className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-[20px] text-xl font-bold ${TONES[i % TONES.length]}`} aria-hidden>{initials(d.name)}</span>}
              <span><b className="block leading-tight text-deep">{d.name}</b><span className="mt-1 block text-[13px] text-teal">{d.role}</span></span>
            </div>
            <div className="mt-auto flex items-center justify-between border-t border-graphite/5 pt-3">
              <b className="text-deep">{d.price}</b>
              <button type="button" onClick={() => openChat(d.chat)} className="h-10 rounded-xl bg-ward px-4 text-sm font-semibold text-deep transition hover:bg-lime">Записаться</button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

const TOP_PRICES: [string, string][] = [['Травматолог-ортопед', '3 000 ₽'], ['Невролог, полный приём', '8 000 ₽'], ['Ударно-волновая терапия', '3 000 ₽'], ['PRP-терапия', '10 500 ₽'], ['ЛФК, 60 минут', '2 500 ₽'], ['Гастроскопия во сне', '6 000 ₽']]

export function PricesTeaser() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="grid gap-8 rounded-[36px] bg-deep p-6 text-white sm:p-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neon">Цены</p>
          <h2 className="mt-3 text-[2rem] font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-[2.6rem]">Цену вы знаете до начала лечения</h2>
          <p className="mt-4 text-white/75">Прайс центра на ПроДокторов от 19.10.2026. Есть рассрочка без переплат и справка для налогового вычета.</p>
          <Link href="/ceny/" className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-lime px-6 font-semibold text-graphite">Весь прайс <ArrowRight size={18} /></Link>
        </div>
        <ul className="divide-y divide-white/10 rounded-3xl bg-white/5 px-5">
          {TOP_PRICES.map(([n, p]) => <li key={n} className="flex justify-between gap-4 py-3.5"><span className="text-white/85">{n}</span><b className="whitespace-nowrap">{p}</b></li>)}
        </ul>
      </div>
    </section>
  )
}

// Шапка внутренних страниц
export function PageHead({ kicker, title, lead, children }: { kicker: string; title: string; lead?: string; children?: ReactNode }) {
  return (
    <section className="relative isolate -mt-[84px] overflow-hidden bg-lagoon pb-14 pt-[132px] sm:-mt-[92px] sm:pt-[150px]">
      <div aria-hidden className="absolute -right-24 -top-24 -z-10 h-80 w-80 rounded-full bg-neon/25 blur-2xl" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal">{kicker}</p>
        <h1 className="mt-3 max-w-3xl text-[2.4rem] font-extrabold leading-[1.02] tracking-[-0.035em] text-deep sm:text-[3.6rem]">{title}</h1>
        {lead && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-graphite/70">{lead}</p>}
        {children}
      </div>
    </section>
  )
}

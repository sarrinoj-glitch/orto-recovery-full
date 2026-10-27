'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { DOCTORS } from '@/lib/clinic'
import { SERVICES, type Extra } from '@/lib/nav'
import { asset } from '@/lib/asset'
import { openChat } from '@/components/ChatWidget'
import { Conditions, SecondOpinion, AfterCourse } from '@/components/site/Conditions'
import { TwinPlans, Glossary, PrpSteps, Whole, Sport } from '@/components/site/Treatment'
import { Procedures } from '@/components/site/Procedures'
import { Endoscopy } from '@/components/site/Endoscopy'
import { HomeVisit } from '@/components/site/HomeVisit'
import { ForFamily } from '@/components/site/ForFamily'
import { OrbitCta } from '@/components/site/Extras'

const EXTRAS: Record<Extra, () => ReactNode> = {
  second: () => <SecondOpinion />,
  twin: () => <TwinPlans />,
  glossary: () => <Glossary />,
  procedures: () => <Procedures />,
  prp: () => <PrpSteps />,
  sport: () => <Sport />,
  after: () => <AfterCourse />,
  home: () => <HomeVisit />,
  endoscopy: () => <Endoscopy />,
  family: () => <ForFamily />,
  whole: () => <Whole />,
}

const initials = (n: string) => n.split(' ').slice(0, 2).map((w) => w[0]).join('')

// Страница услуги: шапка с фото → цены и врачи → с чем работаем → блоки по теме → запись
export function ServicePage({ slug }: { slug: string }) {
  const s = SERVICES.find((x) => x.slug === slug)!
  const docs = DOCTORS.filter((d) => s.doctors.includes(d.name))
  const others = SERVICES.filter((x) => x.slug !== slug)
  return (
    <>
      <section className="relative isolate -mt-[84px] overflow-hidden bg-lagoon pt-[120px] sm:-mt-[92px] sm:pt-[140px]">
        <div aria-hidden className="absolute -left-24 top-10 -z-10 h-80 w-80 rounded-full bg-neon/25 blur-2xl" />
        <div className="mx-auto grid max-w-6xl gap-8 px-4 pb-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pb-16">
          <div>
            <nav aria-label="Хлебные крошки" className="flex flex-wrap items-center gap-1 text-sm text-graphite/55">
              <Link href="/" className="hover:text-teal">Главная</Link><ChevronRight size={14} />
              <Link href="/uslugi/" className="hover:text-teal">Услуги</Link><ChevronRight size={14} />
              <span className="text-graphite/80">{s.menu}</span>
            </nav>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-teal">{s.kicker}</p>
            <h1 className="mt-3 text-[2.3rem] font-extrabold leading-[1.02] tracking-[-0.035em] text-deep sm:text-[3.4rem]">{s.title}</h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-graphite/70">{s.lead}</p>
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <button type="button" onClick={() => openChat(s.chat)} className="flex h-14 items-center gap-2 rounded-full bg-deep px-7 font-semibold text-white transition hover:-translate-y-0.5">Записаться <ArrowRight size={18} /></button>
              <span className="text-graphite/70">{s.prices[0][0]} — <b className="text-deep">{s.prices[0][1]}</b></span>
            </div>
          </div>
          <img src={asset(s.photo)} alt={s.photoAlt} className="aspect-[4/3] w-full rounded-[32px] object-cover shadow-lift" />
        </div>
      </section>

      <main>
        <section className="mx-auto grid max-w-6xl gap-4 px-4 py-14 sm:px-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div data-reveal className="rounded-[28px] bg-white p-6 shadow-soft ring-1 ring-graphite/5 sm:p-7">
            <h2 className="text-2xl font-bold text-deep">Цены</h2>
            <ul className="mt-3 divide-y divide-graphite/5">
              {s.prices.map(([n, p]) => <li key={n} className="flex justify-between gap-4 py-3"><span>{n}</span><b className="whitespace-nowrap text-deep">{p}</b></li>)}
            </ul>
            <p className="mt-3 text-[13px] text-graphite/50">Прайс центра на ПроДокторов от 19.10.2026. <Link href="/ceny/" className="text-teal underline-offset-2 hover:underline">Все цены</Link></p>
          </div>
          <div data-reveal className="flex flex-col gap-3 rounded-[28px] bg-ward p-6 sm:p-7">
            <h2 className="text-2xl font-bold text-deep">{docs.length > 1 ? 'Ведут приём' : 'Ведёт приём'}</h2>
            {docs.map((d) => (
              <div key={d.name} className="flex items-center gap-3.5 rounded-2xl bg-white p-3.5">
                {d.photo ? <img src={d.photo} alt="" className="h-14 w-14 shrink-0 rounded-2xl object-cover object-[50%_20%]" />
                  : <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-teal text-lg font-bold text-white" aria-hidden>{initials(d.name)}</span>}
                <span className="min-w-0 flex-1"><b className="block leading-tight text-deep">{d.name}</b><span className="text-[13px] text-teal">{d.role}</span></span>
              </div>
            ))}
            <button type="button" onClick={() => openChat(docs[0]?.chat ?? s.chat)} className="mt-auto h-12 rounded-2xl bg-teal font-semibold text-white">Записаться к врачу</button>
          </div>
        </section>

        {s.conditions.length > 0 && <Conditions ids={s.conditions} title="С чем к нам приходят" />}
        {s.extras.map((e) => <div key={e}>{EXTRAS[e]()}</div>)}
        <OrbitCta />

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-bold text-deep">Другие направления</h2>
          <div className="mt-5 flex flex-wrap gap-2.5">
            {others.map((o) => <Link key={o.slug} href={`/uslugi/${o.slug}/`} className="rounded-full border border-teal-soft bg-white px-4 py-2.5 text-[15px] text-deep transition hover:border-teal hover:bg-lagoon">{o.menu}</Link>)}
          </div>
        </section>
      </main>
    </>
  )
}

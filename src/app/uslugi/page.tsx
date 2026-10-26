import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SERVICES } from '@/lib/nav'
import { asset } from '@/lib/asset'
import { PageHead } from '@/components/site/Home'
import { Start } from '@/components/site/Start'
import { Glossary } from '@/components/site/Treatment'

export const metadata: Metadata = { title: 'Услуги', description: 'Ортопедия, лечение спины, реабилитация и ЛФК, физиотерапия, PRP, эндоскопия во сне, детская реабилитация.' }

export default function ServicesIndex() {
  return (
    <>
      <PageHead kicker="Услуги" title="Что мы лечим" lead="Восемь направлений в одном центре: от консультации ортопеда до обследования во сне. Выберите своё или подберите врача за три вопроса." />
      <main>
        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <ul data-stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <Link href={`/uslugi/${s.slug}/`} className="lift group flex h-full flex-col overflow-hidden rounded-[26px] bg-white shadow-soft ring-1 ring-graphite/5">
                  <img src={asset(s.photo)} alt={s.photoAlt} className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-105" />
                  <span className="flex flex-1 flex-col gap-2 p-5">
                    <b className="text-lg leading-tight text-deep">{s.menu}</b>
                    <span className="text-sm leading-relaxed text-graphite/65">{s.lead}</span>
                    <span className="mt-auto flex items-center justify-between pt-2 text-sm font-semibold text-teal">{s.prices[0][1]} <ArrowRight size={16} className="transition group-hover:translate-x-1" /></span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <Start />
        <Glossary />
      </main>
    </>
  )
}

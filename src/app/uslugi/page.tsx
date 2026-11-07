import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PROBLEMS, METHODS, type Service } from '@/lib/nav'
import { asset } from '@/lib/asset'
import { PageHead } from '@/components/site/Home'
import { Start } from '@/components/site/Start'
import { Glossary } from '@/components/site/Treatment'
import { MethodsMarquee, ServicesHoverList } from '@/components/site/Extras'

export const metadata: Metadata = { title: 'Услуги', description: 'Боль в суставах и спине, восстановление после травм и операций, осанка и стопы у детей; физиотерапия и PRP-терапия.' }

// Карточки для телефона (на десктопе — список с плавающим фото)
function Cards({ items, title }: { items: Service[]; title: string }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:hidden">
      <h2 className="text-[1.75rem] font-extrabold tracking-[-0.02em] text-graphite">{title}</h2>
      <ul data-stagger className="mt-5 grid gap-4 sm:grid-cols-2">
        {items.map((s) => (
          <li key={s.slug}>
            <Link href={`/uslugi/${s.slug}/`} className="lift group flex h-full flex-col overflow-hidden rounded-[26px] bg-white shadow-soft ring-1 ring-graphite/5">
              <img src={asset(s.photo)} alt={s.photoAlt} className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-105" />
              <span className="flex flex-1 flex-col gap-2 p-5">
                <b className="text-lg leading-tight text-deep">{s.menu}</b>
                <span className="text-sm leading-relaxed text-graphite/65">{s.lead}</span>
                <span className="mt-auto flex items-center justify-between pt-2 text-sm font-semibold text-teal">{s.price ?? s.prices[0][1]} <ArrowRight size={16} className="transition group-hover:translate-x-1" /></span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default function ServicesIndex() {
  return (
    <>
      <PageHead kicker="Услуги" title="Что мы лечим" lead="Выберите, что беспокоит, — или подберите врача за три вопроса. Ниже — методы лечения, которые есть в центре." />
      <main>
        <ServicesHoverList items={PROBLEMS} />
        <Cards items={PROBLEMS} title="Что беспокоит" />
        <ServicesHoverList items={METHODS} title="Методы лечения" />
        <Cards items={METHODS} title="Методы лечения" />
        <Start />
        <MethodsMarquee />
        <Glossary />
      </main>
    </>
  )
}

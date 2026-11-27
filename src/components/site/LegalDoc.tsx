import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { LEGAL_DOCS, LEGAL_GROUPS, LEGAL_UPDATED, type LegalDoc } from '@/lib/legal'

// Внутренние ссылки в документах записаны как {P}path/ — подставляем basePath сайта
const prefix = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/`
const withBase = (html: string) => html.split('{P}').join(prefix)

export function LegalIndex() {
  return (
    <div className="grid gap-10 lg:grid-cols-3">
      {LEGAL_GROUPS.map((g) => (
        <section key={g}>
          <h2 className="text-lg font-bold text-deep">{g}</h2>
          <ul className="mt-3 divide-y divide-graphite/10 border-y border-graphite/10">
            {LEGAL_DOCS.filter((d) => d.group === g).map((d) => (
              <li key={d.slug}>
                <Link href={`/dokumenty/${d.slug}/`} className="group flex items-center justify-between gap-3 py-3.5 text-[15px] text-graphite hover:text-teal">
                  {d.title}<ChevronRight size={16} className="shrink-0 text-graphite/30 transition group-hover:translate-x-0.5 group-hover:text-teal" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

export function LegalBody({ doc }: { doc: LegalDoc }) {
  const others = LEGAL_DOCS.filter((d) => d.slug !== doc.slug)
  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_280px]">
      <article className="legal-doc" dangerouslySetInnerHTML={{ __html: withBase(doc.html) }} />
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <p className="text-sm font-semibold text-deep">Другие документы</p>
        <ul className="mt-2 space-y-1.5 text-[14px]">
          {others.map((d) => <li key={d.slug}><Link href={`/dokumenty/${d.slug}/`} className="text-graphite/70 hover:text-teal">{d.title}</Link></li>)}
        </ul>
        <p className="mt-6 text-xs text-graphite/45">Редакция от {LEGAL_UPDATED}</p>
      </aside>
    </div>
  )
}

// Информация для пациентов: документы клиники для скачивания (по просьбе юристов).
// Сейчас PDF сделаны из присланных Word-файлов; после подписания приказов заменяем на сканы с теми же именами
const PATIENT_DOCS = [
  { slug: 'polozhenie', pdf: 'polozhenie.pdf', title: 'Положение о порядке предоставления платных медицинских услуг' },
  { slug: 'prava-pacienta', pdf: 'prava-grazhdan.pdf', title: 'Права и обязанности граждан в сфере охраны здоровья' },
  { slug: 'pravila', pdf: 'pravila.pdf', title: 'Правила внутреннего распорядка для пациентов и посетителей' },
  { slug: 'dogovor', pdf: 'dogovor.pdf', title: 'Договор на оказание платных медицинских услуг (образец)' },
]

export function PatientDocs() {
  return (
    <section id="info" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h2 className="text-[2.1rem] font-extrabold leading-[1.05] tracking-[-0.03em] text-graphite sm:text-5xl">Информация для пациентов</h2>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {PATIENT_DOCS.map((d) => (
          <li key={d.slug} className="flex flex-col justify-between gap-5 rounded-[28px] bg-white p-6 shadow-soft ring-1 ring-graphite/5">
            <p className="text-lg font-semibold leading-snug text-deep">{d.title}</p>
            <div className="flex flex-wrap gap-3">
              <Link href={`/dokumenty/${d.slug}/`} className="flex h-11 items-center rounded-full bg-ward px-5 text-[15px] font-semibold text-deep hover:bg-lagoon">Читать на сайте</Link>
              <a href={`${prefix}docs/${d.pdf}`} target="_blank" rel="noreferrer" className="flex h-11 items-center rounded-full bg-deep px-5 text-[15px] font-semibold text-white">Скачать PDF</a>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

// Текст документа без боковой колонки — для вставки на другие страницы
export function LegalHtml({ slug }: { slug: string }) {
  const d = LEGAL_DOCS.find((x) => x.slug === slug)
  return d ? <div className="legal-doc" dangerouslySetInnerHTML={{ __html: withBase(d.html) }} /> : null
}

// Главная: полный текст политики и согласия (по просьбе юристов) — в раскрывающихся блоках
export function HomeLegal() {
  return (
    <section id="personal-data" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h2 className="text-[1.6rem] font-extrabold leading-tight tracking-[-0.02em] text-graphite sm:text-[2rem]">Персональные данные</h2>
      <div className="mt-6 space-y-3">
        {['politika', 'soglasie'].map((slug) => {
          const d = LEGAL_DOCS.find((x) => x.slug === slug)!
          return (
            <details key={slug} className="group rounded-[24px] bg-white p-5 shadow-soft ring-1 ring-graphite/5 sm:p-7">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold text-deep [&::-webkit-details-marker]:hidden">
                {d.title}
                <ChevronRight size={20} className="shrink-0 transition group-open:rotate-90" />
              </summary>
              <div className="mt-5 max-h-[70vh] overflow-y-auto pr-2"><LegalHtml slug={slug} /></div>
            </details>
          )
        })}
      </div>
    </section>
  )
}

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

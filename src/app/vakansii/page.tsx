import type { Metadata } from 'next'
import { PageHead } from '@/components/site/Home'
import { LegalHtml } from '@/components/site/LegalDoc'
import { LEGAL_DOCS } from '@/lib/legal'

const doc = LEGAL_DOCS.find((d) => d.slug === 'vakansii')!

export const metadata: Metadata = { title: 'Вакансии', description: doc.lead }

export default function VacanciesPage() {
  return (
    <>
      <PageHead kicker="Работа в центре" title="Вакантные должности" lead={doc.lead} />
      <main className="mx-auto max-w-6xl px-4 py-14 sm:px-6"><LegalHtml slug="vakansii" /></main>
    </>
  )
}

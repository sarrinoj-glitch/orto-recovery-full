import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { LEGAL_DOCS } from '@/lib/legal'
import { PageHead } from '@/components/site/Home'
import { LegalBody } from '@/components/site/LegalDoc'

export const dynamicParams = false

export function generateStaticParams() {
  return LEGAL_DOCS.map((d) => ({ slug: d.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const d = LEGAL_DOCS.find((x) => x.slug === slug)
  return d ? { title: d.title, description: d.lead } : {}
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const d = LEGAL_DOCS.find((x) => x.slug === slug)
  if (!d) notFound()
  return (
    <>
      <PageHead kicker="Документы" title={d.title} lead={d.lead} />
      <main className="mx-auto max-w-6xl px-4 py-14 sm:px-6"><LegalBody doc={d} /></main>
    </>
  )
}

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SERVICES } from '@/lib/nav'
import { ServicePage } from '@/components/site/ServicePage'

export const dynamicParams = false

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const s = SERVICES.find((x) => x.slug === slug)
  return s ? { title: s.menu, description: s.lead } : {}
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!SERVICES.some((s) => s.slug === slug)) notFound()
  return <ServicePage slug={slug} />
}

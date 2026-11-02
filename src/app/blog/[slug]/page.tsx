import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Clock } from 'lucide-react'
import { BLOG_POSTS } from '@/lib/blog'
import { SERVICES } from '@/lib/nav'
import { asset } from '@/lib/asset'
import { MedWarning } from '@/components/site/Consent'
import { AskButton, BlogCards, Reviewer } from '@/components/site/BlogClient'

export const dynamicParams = false

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const p = BLOG_POSTS.find((x) => x.slug === slug)
  return p ? { title: p.title, description: p.lead } : {}
}

// Внутренние ссылки в статьях записаны как {P}path/ — подставляем basePath сайта
const withBase = (html: string) => html.split('{P}').join(`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/`)

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = BLOG_POSTS.find((x) => x.slug === slug)
  if (!p) notFound()
  const s = SERVICES.find((x) => x.slug === p.service)
  const more = [...BLOG_POSTS.filter((x) => x.slug !== p.slug && x.category === p.category), ...BLOG_POSTS.filter((x) => x.category !== p.category)].slice(0, 2)
  return (
    <>
      <section className="relative isolate -mt-[84px] overflow-hidden bg-lagoon pb-12 pt-[124px] sm:-mt-[92px] sm:pt-[142px]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Link href="/blog/" className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-teal"><ArrowLeft size={15} /> Блог</Link>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-teal">{p.category}</p>
          <h1 className="mt-3 max-w-4xl text-[2.1rem] font-extrabold leading-[1.05] tracking-[-0.03em] text-deep sm:text-[3.1rem]">{p.title}</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-graphite/70">{p.lead}</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Reviewer name={p.reviewer} />
            <span className="flex items-center gap-1.5 text-[14px] text-graphite/55"><Clock size={15} />{p.minutes} минуты чтения</span>
          </div>
        </div>
      </section>
      <main className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <img src={asset(`/photos/${p.cover}`)} alt={p.coverAlt} className="-mt-2 aspect-[21/9] w-full rounded-[28px] object-cover" />
        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_300px]">
          <article className="legal-doc article" dangerouslySetInnerHTML={{ __html: withBase(p.html) }} />
          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <nav aria-label="Содержание" className="hidden rounded-[22px] bg-ward p-5 lg:block">
              <p className="text-sm font-semibold text-deep">Содержание</p>
              <ol className="mt-3 space-y-2 text-[14px]">
                {p.toc.map((t) => <li key={t.id}><a href={`#${t.id}`} className="text-graphite/70 hover:text-teal">{t.title}</a></li>)}
              </ol>
            </nav>
            {s && (
              <div className="rounded-[22px] bg-deep p-6 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neon">{s.kicker}</p>
                <p className="mt-2 text-xl font-bold leading-snug">{s.menu}</p>
                <p className="mt-2 text-[14px] text-white/70">{s.prices[0][0]} — <b className="text-white">{s.prices[0][1]}</b></p>
                <AskButton text={`Здравствуйте, прочитал статью «${p.title}», хочу записаться`} label="Записаться" className="mt-5 w-full bg-neon text-deep" />
                <Link href={`/uslugi/${s.slug}/`} className="mt-3 block text-center text-[14px] text-white/70 underline underline-offset-2">Подробнее о направлении</Link>
              </div>
            )}
          </aside>
        </div>
        <div className="mt-12 rounded-[22px] bg-lime-soft p-5 text-center"><MedWarning className="text-[13px] text-graphite sm:text-sm" /></div>
        <section className="mt-16">
          <h2 className="mb-6 text-[1.9rem] font-extrabold tracking-[-0.03em] text-graphite">Читайте также</h2>
          <BlogCards posts={more} />
        </section>
      </main>
    </>
  )
}

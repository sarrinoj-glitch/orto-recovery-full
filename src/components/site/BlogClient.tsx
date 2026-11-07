'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Clock } from 'lucide-react'
import { BLOG_CATEGORIES, BLOG_POSTS, type BlogPost } from '@/lib/blog'
import { DOCTORS } from '@/lib/clinic'
import { asset } from '@/lib/asset'
import { openLead } from '@/components/LeadForm'

const shortName = (full: string) => { const [f, i, o] = full.split(' '); return `${f} ${i?.[0] ?? ''}. ${o?.[0] ?? ''}.` }

export function Reviewer({ name, dark }: { name: string; dark?: boolean }) {
  const d = DOCTORS.find((x) => x.name === name)
  const initials = name.split(' ').slice(0, 2).map((w) => w[0]).join('')
  return (
    <span className="flex items-center gap-2.5">
      {d?.photo
        ? <img src={d.photo} alt="" className="h-9 w-9 rounded-full object-cover" />
        : <span aria-hidden className="flex h-9 w-9 items-center justify-center rounded-full bg-lime text-xs font-extrabold text-graphite">{initials}</span>}
      <span className="leading-tight">
        <span className={`block text-[14px] font-semibold ${dark ? 'text-white' : 'text-graphite'}`}>{shortName(name)}</span>
        <span className={`text-[12px] ${dark ? 'text-white/60' : 'text-graphite/55'}`}>{d?.role.split(',')[0] ?? 'врач центра'} · проверка текста</span>
      </span>
    </span>
  )
}

function Card({ p, big }: { p: BlogPost; big?: boolean }) {
  return (
    <Link href={`/blog/${p.slug}/`} className={`spot lift group flex flex-col overflow-hidden rounded-[28px] bg-white shadow-sm ring-1 ring-graphite/5 ${big ? 'lg:col-span-2 lg:grid lg:grid-cols-[1.1fr_1fr]' : ''}`}>
      <span className={`relative block overflow-hidden ${big ? 'aspect-[16/10] lg:aspect-auto lg:h-full' : 'aspect-[16/10]'}`}>
        <img src={asset(`/photos/${p.cover}`)} alt={p.coverAlt} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[12px] font-semibold text-deep backdrop-blur">{p.category}</span>
      </span>
      <span className={`flex flex-1 flex-col gap-3 ${big ? 'p-7 sm:p-9' : 'p-6'}`}>
        <span className={`font-extrabold leading-[1.12] tracking-[-0.02em] text-graphite ${big ? 'text-[1.7rem] sm:text-[2.1rem]' : 'text-xl'}`}>{p.title}</span>
        <span className="text-[15px] leading-relaxed text-graphite/65">{p.lead}</span>
        <span className="mt-auto flex items-center justify-between gap-3 pt-3">
          <Reviewer name={p.reviewer} />
          <span className="flex shrink-0 items-center gap-1.5 text-[13px] text-graphite/50"><Clock size={14} />{p.minutes} мин</span>
        </span>
      </span>
    </Link>
  )
}

export function BlogIndex() {
  const [cat, setCat] = useState<string | null>(null)
  const list = cat ? BLOG_POSTS.filter((p) => p.category === cat) : BLOG_POSTS
  const chip = (on: boolean) => `h-10 whitespace-nowrap rounded-full px-4 text-[14px] font-semibold transition ${on ? 'bg-deep text-white' : 'bg-white text-graphite ring-1 ring-inset ring-graphite/10 hover:ring-teal'}`
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div role="tablist" aria-label="Темы" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
        <button type="button" role="tab" aria-selected={!cat} onClick={() => setCat(null)} className={chip(!cat)}>Все статьи</button>
        {BLOG_CATEGORIES.map((c) => (
          <button key={c} type="button" role="tab" aria-selected={cat === c} onClick={() => setCat(c)} className={chip(cat === c)}>{c}</button>
        ))}
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {list.map((p, i) => <Card key={p.slug} p={p} big={i === 0 && !cat} />)}
      </div>
    </section>
  )
}

export function BlogCards({ posts }: { posts: BlogPost[] }) {
  return <div className="grid gap-6 md:grid-cols-2">{posts.map((p) => <Card key={p.slug} p={p} />)}</div>
}

export function AskButton({ text, label, className }: { text: string; label: string; className?: string }) {
  return (
    <button type="button" onClick={() => openLead(text)} className={`flex h-12 items-center justify-center gap-2 rounded-full px-6 font-semibold ${className ?? 'bg-deep text-white'}`}>
      {label} <ArrowRight size={17} />
    </button>
  )
}

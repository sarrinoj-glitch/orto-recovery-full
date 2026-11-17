// Собирает src/lib/blog.ts из статей content/blog/*.json (их пишет врач через Telegram-бот или разработчик).
// Запускается перед next build (package.json → build). Ошибка в статье останавливает сборку — битая статья не попадёт на сайт.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const DIR = 'content/blog'
const CATEGORIES = ['Спина и шея', 'Суставы и стопы', 'Дети', 'Восстановление']
const REQUIRED = ['slug', 'title', 'lead', 'category', 'service', 'reviewer', 'cover', 'coverAlt', 'html']

const posts = readdirSync(DIR).filter((f) => f.endsWith('.json')).map((f) => {
  const p = JSON.parse(readFileSync(join(DIR, f), 'utf8'))
  for (const k of REQUIRED) if (typeof p[k] !== 'string' || !p[k].trim()) throw new Error(`${f}: нет поля ${k}`)
  if (`${p.slug}.json` !== f) throw new Error(`${f}: slug не совпадает с именем файла`)
  if (!/^[a-z0-9-]+$/.test(p.slug)) throw new Error(`${f}: slug только латиница, цифры и дефис`)
  if (!CATEGORIES.includes(p.category)) throw new Error(`${f}: неизвестная рубрика ${p.category}`)
  if (/<script|<iframe|on\w+=/i.test(p.html)) throw new Error(`${f}: недопустимый HTML`)
  const words = p.html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length
  const toc = [...p.html.matchAll(/<h2 id="([^"]+)">([^<]+)<\/h2>/g)].map((m) => ({ id: m[1], title: m[2] }))
  return {
    slug: p.slug, title: p.title, lead: p.lead, category: p.category, service: p.service, reviewer: p.reviewer,
    cover: p.cover, coverAlt: p.coverAlt, date: p.date ?? '', order: p.order ?? 0,
    minutes: Math.max(3, Math.round(words / 170)), toc, html: p.html,
  }
})

// Новые статьи (с датой) — сверху, по убыванию даты; дальше статьи без даты по полю order
posts.sort((a, b) => (b.date || '').localeCompare(a.date || '') || a.order - b.order)
const out = posts.map(({ order, ...p }) => p)
const cats = CATEGORIES.filter((c) => out.some((p) => p.category === c))

writeFileSync('src/lib/blog.ts',
  '// Сгенерировано scripts/blog.mjs из content/blog/*.json — не правьте вручную.\n' +
  'export type BlogPost = { slug: string; title: string; lead: string; category: string; service: string; reviewer: string; cover: string; coverAlt: string; date: string; minutes: number; toc: { id: string; title: string }[]; html: string }\n' +
  `export const BLOG_CATEGORIES = ${JSON.stringify(cats)}\n` +
  `export const BLOG_POSTS: BlogPost[] = ${JSON.stringify(out, null, 1)}\n`)
console.log(`blog: ${out.length} статей`)

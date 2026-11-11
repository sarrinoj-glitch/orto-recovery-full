import type { MetadataRoute } from 'next'
import { SERVICES } from '@/lib/nav'
import { BLOG_POSTS } from '@/lib/blog'
import { LEGAL_DOCS } from '@/lib/legal'

export const dynamic = 'force-static'

// Карта сайта для поисковиков — адрес боевого домена задаётся при сборке (NEXT_PUBLIC_SITE_URL)
const SITE = (process.env.NEXT_PUBLIC_SITE_URL || 'https://ortorecovery.ru').replace(/\/$/, '')

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['', 'o-centre', 'uslugi', 'vrachi', 'ceny', 'pacientam', 'otzyvy', 'blog', 'kontakty', 'dokumenty']
  return [
    ...pages.map((p) => ({ url: `${SITE}/${p ? p + '/' : ''}` })),
    ...SERVICES.map((s) => ({ url: `${SITE}/uslugi/${s.slug}/` })),
    ...BLOG_POSTS.map((p) => ({ url: `${SITE}/blog/${p.slug}/` })),
    ...LEGAL_DOCS.map((d) => ({ url: `${SITE}/dokumenty/${d.slug}/` })),
  ]
}

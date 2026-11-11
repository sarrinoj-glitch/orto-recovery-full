import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

// Индексация включается только в сборке для домена клиники (NEXT_PUBLIC_INDEX=1); демо на GitHub Pages закрыто
const INDEX = process.env.NEXT_PUBLIC_INDEX === '1'
const SITE = (process.env.NEXT_PUBLIC_SITE_URL || 'https://ortorecovery.ru').replace(/\/$/, '')

export default function robots(): MetadataRoute.Robots {
  return INDEX
    ? { rules: { userAgent: '*', allow: '/' }, sitemap: `${SITE}/sitemap.xml`, host: SITE }
    : { rules: { userAgent: '*', disallow: '/' } }
}

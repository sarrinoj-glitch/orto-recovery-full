import type { Metadata } from 'next'
import { PageHead } from '@/components/site/Home'
import { BlogIndex } from '@/components/site/BlogClient'

export const metadata: Metadata = { title: 'Блог', description: 'Статьи врачей центра «Орто-Рекавери»: боль в спине, суставы и стопы, сколиоз у детей.' }

export default function BlogPage() {
  return (
    <>
      <PageHead kicker="Блог" title="Разбираемся в боли вместе с врачами" lead="Короткие статьи о том, что делать дома, какие признаки нельзя пропускать и как подготовиться к обследованию. Каждый текст проверяет врач центра." />
      <main>
        <BlogIndex />
      </main>
    </>
  )
}

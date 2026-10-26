import type { Metadata } from 'next'
import { PageHead } from '@/components/site/Home'
import { Doctors } from '@/components/site/Doctors'
import { Founders } from '@/components/site/Trust'

export const metadata: Metadata = { title: 'Врачи', description: 'Травматолог-ортопед, невролог, эндоскопист, гастроэнтеролог, инструкторы ЛФК центра «Орто-Рекавери».' }

export default function DoctorsPage() {
  return (
    <>
      <PageHead kicker="Специалисты" title="Врачи центра" lead="Можно записаться к конкретному врачу. Если вам спокойнее со специалистом-женщиной, скажите об этом администратору." />
      <main>
        <Doctors />
        <Founders people={false} />
      </main>
    </>
  )
}

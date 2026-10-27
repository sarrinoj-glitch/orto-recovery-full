import type { Metadata } from 'next'
import { PageHead } from '@/components/site/Home'
import { DoctorsMorph, OrbitCta } from '@/components/site/Extras'
import { Founders } from '@/components/site/Trust'

export const metadata: Metadata = { title: 'Врачи', description: 'Травматолог-ортопед, невролог, эндоскопист, гастроэнтеролог, инструкторы ЛФК центра «Орто-Рекавери».' }

export default function DoctorsPage() {
  return (
    <>
      <PageHead kicker="Специалисты" title="Врачи центра" lead="Можно записаться к конкретному врачу. Если вам спокойнее со специалистом-женщиной, скажите об этом администратору." />
      <main>
        <DoctorsMorph title="Наши специалисты" link={false} />
        <Founders people={false} />
        <OrbitCta />
      </main>
    </>
  )
}

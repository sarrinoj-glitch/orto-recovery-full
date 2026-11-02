import type { Metadata } from 'next'
import { PageHead } from '@/components/site/Home'
import { DoctorsMorph, OrbitCta } from '@/components/site/Extras'
import { Founders } from '@/components/site/Trust'
import { DoctorVideos } from '@/components/site/Videos'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Врачи', description: 'Травматолог-ортопед, невролог, эндоскопист, гастроэнтеролог, инструкторы ЛФК центра «Орто-Рекавери».' }

export default function DoctorsPage() {
  return (
    <>
      <PageHead kicker="Специалисты" title="Врачи центра" lead="Можно записаться к конкретному врачу. Если вам спокойнее со специалистом-женщиной, скажите об этом администратору." />
      <main>
        <DoctorsMorph title="Наши специалисты" link={false} />
        <section className="mx-auto max-w-6xl px-4 pb-10 sm:px-6">
          <p className="text-[15px] text-graphite/70">Образование, квалификация и график работы врачей — в разделе <Link href="/dokumenty/vrachi/" className="text-teal underline underline-offset-2">«Сведения о медицинских работниках»</Link>.</p>
        </section>
        <DoctorVideos />
        <Founders people={false} />
        <OrbitCta />
      </main>
    </>
  )
}

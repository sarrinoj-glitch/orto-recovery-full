import type { Metadata } from 'next'
import { PageHead } from '@/components/site/Home'
import { FirstVisit } from '@/components/site/FirstVisit'
import { Prep } from '@/components/site/Trust'
import { SecondOpinion } from '@/components/site/Conditions'
import { HomeVisit } from '@/components/site/HomeVisit'
import { Faq } from '@/components/site/Faq'

export const metadata: Metadata = { title: 'Пациентам', description: 'Как проходит первый визит, как подготовиться, второе мнение перед операцией, реабилитолог на дом, ответы на вопросы.' }

export default function PatientsPage() {
  return (
    <>
      <PageHead kicker="Пациентам" title="Всё, что нужно знать до визита" lead="Как проходит первый приём, что взять с собой, как получить второе мнение и вызвать реабилитолога на дом." />
      <main>
        <FirstVisit />
        <Prep />
        <SecondOpinion />
        <HomeVisit />
        <Faq />
      </main>
    </>
  )
}

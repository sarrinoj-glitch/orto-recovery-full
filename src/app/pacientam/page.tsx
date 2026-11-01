import type { Metadata } from 'next'
import { PageHead } from '@/components/site/Home'
import { StickySteps, BookingFlow } from '@/components/site/Extras'
import { WhatsAppPlan } from '@/components/site/Trust'
import { Prep } from '@/components/site/Trust'
import { SecondOpinion } from '@/components/site/Conditions'
import { HomeVisit } from '@/components/site/HomeVisit'
import { Faq } from '@/components/site/Faq'
import { LegalIndex } from '@/components/site/LegalDoc'

export const metadata: Metadata = { title: 'Пациентам', description: 'Как проходит первый визит, как подготовиться, второе мнение перед операцией, реабилитолог на дом, ответы на вопросы.' }

export default function PatientsPage() {
  return (
    <>
      <PageHead kicker="Пациентам" title="Всё, что нужно знать до визита" lead="Как проходит первый приём, что взять с собой, как получить второе мнение и вызвать реабилитолога на дом." />
      <main>
        <StickySteps />
        <Prep />
        <BookingFlow />
        <WhatsAppPlan />
        <SecondOpinion />
        <HomeVisit />
        <Faq />
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="mb-8 text-[2.1rem] font-extrabold leading-[1.05] tracking-[-0.03em] text-graphite sm:text-5xl">Документы</h2>
          <LegalIndex />
        </section>
      </main>
    </>
  )
}

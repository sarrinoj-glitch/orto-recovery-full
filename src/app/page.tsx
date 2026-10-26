import { BodyCards, DoctorsTeaser, PricesTeaser } from '@/components/site/Home'
import { HeroLive } from '@/components/site/HeroLive'
import { Start } from '@/components/site/Start'
import { SecondOpinion } from '@/components/site/Conditions'
import { WhatsAppPlan } from '@/components/site/Trust'
import { Reviews } from '@/components/site/Reviews'
import { Gallery } from '@/components/site/Gallery'
import { Visit } from '@/components/site/Visit'

// Главная первой версии: на первом экране интерактивный человечек «Покажите, где болит», как в исходном демо
export default function HomePage() {
  return (
    <>
      <HeroLive />
      <main>
        <Start />
        <BodyCards />
        <SecondOpinion />
        <DoctorsTeaser />
        <WhatsAppPlan />
        <Reviews />
        <Gallery />
        <PricesTeaser />
        <Visit />
      </main>
    </>
  )
}

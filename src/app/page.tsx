import { HomeHero, BodyCards, DoctorsTeaser, PricesTeaser } from '@/components/site/Home'
import { HeroLive } from '@/components/site/HeroLive'
import { Start } from '@/components/site/Start'
import { SecondOpinion } from '@/components/site/Conditions'
import { WhatsAppPlan } from '@/components/site/Trust'
import { Reviews } from '@/components/site/Reviews'
import { Gallery } from '@/components/site/Gallery'
import { Visit } from '@/components/site/Visit'

// Главная — только самое важное; подробности на страницах услуг и разделов
export default function HomePage() {
  return (
    <>
      <HomeHero />
      <main>
        <Start />
        <BodyCards />
        <HeroLive asBlock />
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

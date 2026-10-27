import { HomeHero, BodyCards, PricesTeaser } from '@/components/site/Home'
import { HeroLive } from '@/components/site/HeroLive'
import { Start } from '@/components/site/Start'
import { SecondOpinion } from '@/components/site/Conditions'
import { Reviews } from '@/components/site/Reviews'
import { Visit } from '@/components/site/Visit'
import { Stats, StickySteps, Manifesto, DoctorsMorph, BookingFlow, MethodsMarquee, OrbitCta } from '@/components/site/Extras'

// Главная — только самое важное; подробности на страницах услуг и разделов
export default function HomePage() {
  return (
    <>
      <HomeHero />
      <main>
        <Start />
        <Stats />
        <BodyCards />
        <HeroLive asBlock />
        <StickySteps />
        <Manifesto />
        <SecondOpinion />
        <DoctorsMorph />
        <BookingFlow />
        <MethodsMarquee />
        <Reviews />
        <PricesTeaser />
        <OrbitCta />
        <Visit />
      </main>
    </>
  )
}

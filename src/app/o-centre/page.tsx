import type { Metadata } from 'next'
import { PageHead } from '@/components/site/Home'
import { Founders, Guarantees, Stories } from '@/components/site/Trust'
import { Gallery } from '@/components/site/Gallery'
import { Reviews } from '@/components/site/Reviews'

export const metadata: Metadata = { title: 'О центре', description: 'Центр восстановительной медицины «Орто-Рекавери» в Махачкале: кто мы, как работаем, фото центра и отзывы.' }

export default function AboutPage() {
  return (
    <>
      <PageHead kicker="О центре" title="Центр восстановительной медицины «Орто-Рекавери»" lead="Лечим и восстанавливаем пациентов с заболеваниями и травмами опорно-двигательной системы — без операций, по принципам доказательной медицины." />
      <main>
        <Founders />
        <Guarantees />
        <Gallery />
        <Reviews />
        <Stories />
      </main>
    </>
  )
}

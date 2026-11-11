import type { Metadata } from 'next'
import { PageHead } from '@/components/site/Home'
import { Founders, Guarantees } from '@/components/site/Trust'
import { Gallery } from '@/components/site/Gallery'
import { Equipment } from '@/components/site/Equipment'
import { Reviews } from '@/components/site/Reviews'
import { Stats, Manifesto } from '@/components/site/Extras'

export const metadata: Metadata = { title: 'О центре', description: 'Центр восстановительной медицины «Орто-Рекавери» в Махачкале: кто мы, как работаем, фото центра и отзывы.' }

export default function AboutPage() {
  return (
    <>
      <PageHead kicker="О центре" title="Центр восстановительной медицины «Орто-Рекавери»" lead="Лечим и восстанавливаем пациентов с заболеваниями и травмами опорно-двигательной системы — без операций, по принципам доказательной медицины." image={{ src: '/photos/admin-desk.jpg', alt: 'Администратор центра за стойкой регистрации', caption: 'Администратор Зарема Муртузалиева встретит вас на ресепшене' }} />
      <main>
        <Stats />
        <Manifesto />
        <Founders />
        <Guarantees />
        <Gallery />
        <Equipment />
        <Reviews />
      </main>
    </>
  )
}

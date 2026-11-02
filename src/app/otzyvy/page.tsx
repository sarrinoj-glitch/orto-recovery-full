import type { Metadata } from 'next'
import { PageHead } from '@/components/site/Home'
import { ReviewsHub } from '@/components/site/Reviews'

export const metadata: Metadata = { title: 'Отзывы', description: 'Оценки и отзывы о центре «Орто-Рекавери» на независимых площадках: 2ГИС, Яндекс Карты, ПроДокторов.' }

export default function ReviewsPage() {
  return (
    <>
      <PageHead kicker="Отзывы" title="Отзывы пациентов — на независимых площадках" lead="Мы не пишем и не редактируем отзывы. Здесь собраны оценки центра и отзывы с площадок, где оставить отзыв может любой пациент." />
      <main>
        <ReviewsHub />
      </main>
    </>
  )
}

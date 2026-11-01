import type { Metadata } from 'next'
import { PageHead } from '@/components/site/Home'
import { Prices } from '@/components/site/Prices'
import { Savings } from '@/components/site/Savings'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Цены', description: 'Цены на приём врачей, физиотерапию, ЛФК, PRP и эндоскопию в центре «Орто-Рекавери».' }

export default function PricesPage() {
  return (
    <>
      <PageHead kicker="Цены" title="Цену вы знаете до начала лечения" lead="Прайс центра на ПроДокторов от 19.10.2026. Есть рассрочка без переплат и справка для налогового вычета." />
      <main>
        <Prices />
        <Savings />
        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          <div className="rounded-[24px] bg-ward p-6 text-[15px] leading-relaxed text-graphite/75 sm:p-7">
            Цены указаны в рублях по прейскуранту, утверждённому руководителем центра. Окончательная стоимость лечения определяется договором и сметой после консультации врача. Информация о ценах не является публичной офертой. Условия оплаты, возврата и налогового вычета — в разделе{' '}
            <Link href="/dokumenty/platnye-uslugi/" className="text-teal underline underline-offset-2">«Условия платных услуг»</Link>; бесплатная медицинская помощь оказывается в рамках программы государственных гарантий.
          </div>
        </section>
      </main>
    </>
  )
}

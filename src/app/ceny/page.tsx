import type { Metadata } from 'next'
import { PageHead } from '@/components/site/Home'
import { Prices } from '@/components/site/Prices'
import { Savings } from '@/components/site/Savings'

export const metadata: Metadata = { title: 'Цены', description: 'Цены на приём врачей, физиотерапию, ЛФК, PRP и эндоскопию в центре «Орто-Рекавери».' }

export default function PricesPage() {
  return (
    <>
      <PageHead kicker="Цены" title="Цену вы знаете до начала лечения" lead="Прайс центра на ПроДокторов от 19.10.2026. Есть рассрочка без переплат и справка для налогового вычета." />
      <main>
        <Prices />
        <Savings />
      </main>
    </>
  )
}

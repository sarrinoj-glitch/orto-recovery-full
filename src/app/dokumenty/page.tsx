import type { Metadata } from 'next'
import { PageHead } from '@/components/site/Home'
import { LegalIndex } from '@/components/site/LegalDoc'

export const metadata: Metadata = { title: 'Документы и сведения', description: 'Лицензия, реквизиты, сведения о врачах, образец договора, политика обработки персональных данных и другие документы центра «Орто-Рекавери».' }

export default function DocsPage() {
  return (
    <>
      <PageHead kicker="Документы" title="Документы и сведения о центре" lead="Информация, которую медицинская организация обязана раскрывать пациентам: лицензия и реквизиты, врачи, условия платных услуг, образец договора, работа с персональными данными." />
      <main className="mx-auto max-w-6xl px-4 py-14 sm:px-6"><LegalIndex /></main>
    </>
  )
}

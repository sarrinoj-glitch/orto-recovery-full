import type { Metadata } from 'next'
import { PageHead } from '@/components/site/Home'
import { Visit } from '@/components/site/Visit'

export const metadata: Metadata = { title: 'Контакты', description: 'Махачкала, проспект Имама Шамиля, 35А. Телефон, WhatsApp, часы работы и как добраться.' }

export default function ContactsPage() {
  return (
    <>
      <PageHead kicker="Контакты" title="Как нас найти" lead="Махачкала, проспект Имама Шамиля, 35А, 1 этаж. Вход за шлагбаумом, рядом санаторий «Тарнаир»." />
      <main>
        <Visit />
      </main>
    </>
  )
}

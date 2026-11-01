import Link from 'next/link'
import { CLINIC } from '@/lib/clinic'
import { NAV, SERVICES } from '@/lib/nav'
import { Waves } from '@/components/site/Decor'
import { asset } from '@/lib/asset'
import { LEGAL_ORG } from '@/lib/legal'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="relative isolate overflow-hidden bg-graphite text-white/70">
      {/* Предупреждение для рекламы медицинских услуг (ч. 7 ст. 24 38-ФЗ) */}
      <div className="bg-lime px-4 py-4 text-center text-graphite sm:py-5">
        <p className="text-[15px] font-extrabold uppercase tracking-[0.04em] sm:text-xl">Имеются противопоказания. Необходима консультация специалиста</p>
      </div>
      <Waves className="-top-6 left-0 -z-10 h-32 w-full" opacity={0.25} />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.1fr_1fr_1fr_1fr]">
        <div className="space-y-4">
          <img src={asset('/logo-color.png')} alt="Орто-Рекавери" className="h-16 w-auto" />
          <div className="space-y-1.5 text-[15px]">
            <p className="text-white">{CLINIC.address}</p>
            <p>{CLINIC.hoursWeek}, {CLINIC.hoursSat}</p>
            <p><a href={`tel:${CLINIC.phone.replace(/[^\d+]/g, '')}`} className="text-white hover:underline">{CLINIC.phone}</a></p>
            <p><a href={CLINIC.whatsappLink} target="_blank" rel="noreferrer" className="hover:text-white">WhatsApp {CLINIC.whatsapp}</a></p>
          </div>
        </div>
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-neon">Услуги</p>
          <ul className="space-y-2 text-[15px]">
            {SERVICES.map((s) => <li key={s.slug}><Link href={`/uslugi/${s.slug}/`} className="hover:text-white">{s.menu}</Link></li>)}
          </ul>
        </div>
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-neon">Центр</p>
          <ul className="space-y-2 text-[15px]">
            {NAV.filter((l) => !l.sub && l.href !== '/').map((l) => <li key={l.href}><Link href={l.href} className="hover:text-white">{l.label}</Link></li>)}
          </ul>
        </div>
        <div className="space-y-1.5 text-sm">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-neon">Документы</p>
          <ul className="space-y-2 text-[15px]">
            {[['svedeniya', 'Сведения о центре и лицензия'], ['vrachi', 'Сведения о врачах'], ['platnye-uslugi', 'Условия платных услуг'], ['dogovor', 'Образец договора'], ['politika', 'Политика обработки ПДн'], ['soglasie', 'Согласие на обработку ПДн'], ['cookie', 'Политика cookie'], ['kontroliruyushchie-organy', 'Контролирующие органы']].map(([s, t]) => (
              <li key={s}><Link href={`/dokumenty/${s}/`} className="hover:text-white">{t}</Link></li>
            ))}
            <li><Link href="/dokumenty/" className="text-neon hover:text-white">Все документы</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-6 text-[13px] leading-relaxed text-white/45 sm:px-6">
          {LEGAL_ORG.full} (ОГРН {LEGAL_ORG.ogrn}, ИНН {LEGAL_ORG.inn}). Адрес: {LEGAL_ORG.address}. Лицензия на медицинскую деятельность № {LEGAL_ORG.license_no} от {LEGAL_ORG.license_date}, выдана: {LEGAL_ORG.license_body}. Электронная почта для обращений:{' '}
          <a href={`mailto:${LEGAL_ORG.email}`} className="underline hover:text-white">{LEGAL_ORG.email}</a>. Информация на сайте не является публичной офертой и не заменяет консультацию врача. © {year}. Демо-версия сайта, подготовлена для обсуждения с центром.
        </p>
      </div>
    </footer>
  )
}

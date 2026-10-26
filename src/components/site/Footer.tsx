import Link from 'next/link'
import { CLINIC } from '@/lib/clinic'
import { NAV, SERVICES } from '@/lib/nav'
import { Waves } from '@/components/site/Decor'
import { asset } from '@/lib/asset'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="relative isolate overflow-hidden bg-graphite text-white/70">
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
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-neon">Реквизиты</p>
          <p>{CLINIC.legal}</p>
          <p>ИНН {CLINIC.inn}</p>
          <p>ОГРН {CLINIC.ogrn}</p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-6 text-[13px] leading-relaxed text-white/45 sm:px-6">
          Имеются противопоказания, необходима консультация специалиста. © {year}. Демо-версия сайта, подготовлена для обсуждения с центром.
        </p>
      </div>
    </footer>
  )
}

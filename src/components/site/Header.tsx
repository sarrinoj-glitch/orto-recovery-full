'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, Menu, Phone, X } from 'lucide-react'
import { CLINIC } from '@/lib/clinic'
import { NAV, SERVICES } from '@/lib/nav'
import { asset } from '@/lib/asset'
import { openChat } from '@/components/ChatWidget'

const tel = `tel:${CLINIC.phone.replace(/[^\d+]/g, '')}`

// Стеклянная плавающая шапка; меню как на старом сайте: Главная · О центре · Услуги · Врачи · Цены · Пациентам · Контакты
export function Header() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  useEffect(() => { setOpen(false) }, [pathname])

  const active = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href.replace(/\/$/, '')))

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 transition-colors sm:px-6 sm:pt-4" style={{ background: scrolled ? 'transparent' : '#DDF8FB' }}>
      <div
        className={`mx-auto flex max-w-[1320px] items-center gap-6 rounded-[22px] border border-white/90 py-2.5 pl-4 pr-2.5 backdrop-blur transition-all duration-300 sm:pl-6 ${
          scrolled ? 'bg-white/90 shadow-lift' : 'bg-white/80 shadow-[0_18px_40px_-28px_rgba(11,61,74,0.5)]'
        }`}
      >
        <Link href="/" className="shrink-0" aria-label="Орто-Рекавери, на главную">
          <img src={asset('/logo-dark.png')} alt="Орто-Рекавери, центр восстановительной медицины" className="h-10 w-auto sm:h-12" />
        </Link>

        <nav aria-label="Основное меню" className="ml-2 hidden items-center gap-6 text-[15px] text-[#4a5357] xl:flex">
          {NAV.map((l) =>
            l.sub ? (
              <div key={l.href} className="group relative">
                <Link href={l.href} className={`flex items-center gap-1.5 whitespace-nowrap py-2 transition-colors hover:text-graphite ${active(l.href) ? 'font-semibold text-graphite' : ''}`}>
                  {l.label} <ChevronDown size={14} className="transition group-hover:rotate-180" />
                </Link>
                <div className="invisible absolute -left-6 top-full z-50 grid w-[560px] translate-y-2 grid-cols-2 gap-x-6 rounded-3xl bg-white p-5 text-graphite opacity-0 shadow-lift ring-1 ring-graphite/5 transition duration-200 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  {SERVICES.map((s) => (
                    <Link key={s.slug} href={`/uslugi/${s.slug}/`} className="flex items-center justify-between gap-3 border-b border-graphite/5 py-2.5 text-[15px] hover:text-teal">
                      {s.menu}<span className="whitespace-nowrap text-sm text-graphite/45">{s.prices[0][1]}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link key={l.href} href={l.href} className={`group relative whitespace-nowrap transition-colors hover:text-graphite ${active(l.href) ? 'font-semibold text-graphite' : ''}`}>
                {l.label}
                <span className={`absolute -bottom-1.5 left-0 right-0 h-0.5 origin-left rounded bg-teal transition-transform duration-300 group-hover:scale-x-100 ${active(l.href) ? 'scale-x-100' : 'scale-x-0'}`} />
              </Link>
            ),
          )}
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <a href={tel} className="hidden flex-col items-end leading-tight md:flex">
            <b className="whitespace-nowrap text-[15px] text-graphite">{CLINIC.phone}</b>
            <span className="text-xs text-[#5b6266]">пн–пт 9–18, сб 9–16</span>
          </a>
          <a href={tel} aria-label="Позвонить" className="flex h-11 w-11 items-center justify-center rounded-full bg-ward text-graphite md:hidden">
            <Phone size={18} />
          </a>
          <button type="button" onClick={() => openChat()} className="hidden h-12 whitespace-nowrap rounded-[16px] bg-teal px-5 text-[15px] font-semibold text-white shadow-[0_10px_22px_-10px_rgba(23,126,150,0.8)] transition hover:-translate-y-0.5 sm:block">
            Записаться
          </button>
          <button type="button" onClick={() => setOpen((v) => !v)} aria-label={open ? 'Закрыть меню' : 'Открыть меню'} aria-expanded={open} className="flex h-11 w-11 items-center justify-center rounded-full bg-graphite text-white xl:hidden">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <nav aria-label="Меню" className="mx-auto mt-2 max-h-[calc(100svh-96px)] max-w-[1320px] overflow-y-auto rounded-[22px] bg-white p-4 shadow-lift xl:hidden">
          {NAV.filter((l) => !l.sub).map((l) => (
            <Link key={l.href} href={l.href} className={`block rounded-xl px-3 py-3 text-lg ${active(l.href) ? 'bg-ward font-semibold' : ''}`}>{l.label}</Link>
          ))}
          <p className="mt-3 px-3 text-xs font-semibold uppercase tracking-[0.12em] text-teal">Услуги</p>
          {SERVICES.map((s) => (
            <Link key={s.slug} href={`/uslugi/${s.slug}/`} className="flex justify-between rounded-xl px-3 py-2.5 text-[15px]">{s.menu}<span className="text-graphite/45">{s.prices[0][1]}</span></Link>
          ))}
          <button type="button" onClick={() => { setOpen(false); openChat() }} className="mt-3 h-12 w-full rounded-2xl bg-teal font-semibold text-white">Записаться</button>
        </nav>
      )}
    </header>
  )
}

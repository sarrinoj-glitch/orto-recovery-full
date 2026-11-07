'use client'

import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import clsx from 'clsx'
import { CLINIC } from '@/lib/clinic'
import { PdConsent } from '@/components/site/Consent'

// Заявка на приём: открывается любой CTA-кнопкой сайта.
// Заявка уходит на orto-lead-api (Vercel) → WhatsApp администратора через API.
// Если сервер недоступен или не настроен — показываем кнопку «Отправить через WhatsApp» с готовым текстом.
export function openLead(context?: string) {
  window.dispatchEvent(new CustomEvent('open-lead', { detail: { context } }))
}

const WHEN = ['До двух недель', 'От месяца до полугода', 'Больше полугода']
const WHY = ['Да, травма', 'Да, операция', 'Нет']
const LEAD_API = 'https://orto-lead-api.vercel.app/api/lead'

// «Здравствуйте, болит колено» → «Болит колено» — подсказка для поля «Что беспокоит?»
const fromContext = (t?: string) => {
  const s = (t ?? '').replace(/^здравствуйте[,!.]?\s*/i, '').trim()
  return s ? s[0].toUpperCase() + s.slice(1) : ''
}

const field = 'h-12 w-full rounded-2xl border border-graphite/15 bg-white px-4 text-[16px] text-graphite outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/20'

function Chips({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <fieldset>
      <legend className="mb-2 text-[14px] font-semibold text-graphite">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            aria-pressed={value === o}
            onClick={() => onChange(value === o ? '' : o)}
            className={clsx('rounded-full px-4 py-2.5 text-[14px] ring-1 ring-inset transition', value === o ? 'bg-deep font-semibold text-white ring-deep' : 'bg-white text-graphite ring-graphite/15 hover:ring-teal')}
          >
            {o}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

export default function LeadForm() {
  const [open, setOpen] = useState(false)
  const [stage, setStage] = useState<'form' | 'sending' | 'sent' | 'fallback'>('form')
  const [waText, setWaText] = useState('')
  const [company, setCompany] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [what, setWhat] = useState('')
  const [when, setWhen] = useState('')
  const [why, setWhy] = useState('')
  const [consent, setConsent] = useState(false)
  const [tried, setTried] = useState(false)
  const nameRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const onOpen = (e: Event) => {
      const ctx = fromContext((e as CustomEvent<{ context?: string }>).detail?.context)
      setWhat((w) => w || ctx)
      setStage('form')
      setTried(false)
      setOpen(true)
    }
    window.addEventListener('open-lead', onOpen)
    return () => window.removeEventListener('open-lead', onOpen)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    setTimeout(() => nameRef.current?.focus(), 50)
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [open])

  const digits = phone.replace(/\D/g, '')
  const nameOk = name.trim().length > 1
  const phoneOk = digits.length >= 10 && digits.length <= 12

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTried(true)
    if (!nameOk || !phoneOk || !consent || stage === 'sending') return
    const text = [
      'Заявка на приём с сайта',
      `Имя: ${name.trim()}`,
      `Телефон: ${phone.trim()}`,
      what.trim() && `Что беспокоит: ${what.trim()}`,
      when && `Как давно: ${when}`,
      why && `Травма или операция: ${why}`,
    ].filter(Boolean).join('\n')
    setWaText(text)
    setStage('sending')
    try {
      // text/plain — без предварительного CORS-запроса, быстрее на медленной сети
      const r = await fetch(LEAD_API, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ name: name.trim(), phone: phone.trim(), what: what.trim(), when, why, consent, company, page: location.pathname }),
        signal: AbortSignal.timeout(10000),
      })
      setStage(r.ok ? 'sent' : 'fallback')
    } catch {
      setStage('fallback')
    }
  }

  if (!open) return null
  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-deep/60 p-0 backdrop-blur-sm sm:items-center sm:p-6" onClick={() => setOpen(false)}>
      <div role="dialog" aria-modal="true" aria-labelledby="lead-title" onClick={(e) => e.stopPropagation()} className="relative max-h-[92svh] w-full max-w-lg overflow-y-auto rounded-t-[28px] bg-ward p-5 shadow-lift sm:rounded-[28px] sm:p-7">
        <button type="button" onClick={() => setOpen(false)} aria-label="Закрыть" className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-graphite"><X size={18} /></button>

        {stage === 'sent' ? (
          <div className="py-6 pr-8">
            <h2 id="lead-title" className="text-2xl font-extrabold tracking-[-0.02em] text-deep">Заявка отправлена</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-graphite/75">Администратор свяжется с вами, чтобы подобрать врача и время. Если срочно — позвоните: <a href={`tel:${CLINIC.phone.replace(/[^\d+]/g, '')}`} className="font-semibold text-teal">{CLINIC.phone}</a></p>
            <button type="button" onClick={() => setOpen(false)} className="mt-6 h-12 rounded-full bg-deep px-6 font-semibold text-white">Готово</button>
          </div>
        ) : stage === 'fallback' ? (
          <div className="py-6 pr-8">
            <h2 id="lead-title" className="text-2xl font-extrabold tracking-[-0.02em] text-deep">Отправьте заявку в WhatsApp</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-graphite/75">Не получилось отправить заявку напрямую. Нажмите кнопку — откроется WhatsApp центра с готовым текстом, останется нажать «Отправить».</p>
            <a href={`${CLINIC.whatsappLink}?text=${encodeURIComponent(waText)}`} target="_blank" rel="noreferrer" className="mt-6 flex h-14 items-center justify-center rounded-full bg-deep px-6 font-semibold text-white">Отправить через WhatsApp</a>
            <p className="mt-3 text-[15px] text-graphite/75">Или позвоните: <a href={`tel:${CLINIC.phone.replace(/[^\d+]/g, '')}`} className="font-semibold text-teal">{CLINIC.phone}</a></p>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="flex flex-col gap-4">
            <div className="pr-10">
              <h2 id="lead-title" className="text-2xl font-extrabold tracking-[-0.02em] text-deep">Запись на приём</h2>
              <p className="mt-1 text-[15px] text-graphite/65">Администратор перезвонит, подберёт врача и удобное время.</p>
            </div>
            <label className="flex flex-col gap-1.5">
              <span className="text-[14px] font-semibold text-graphite">Имя</span>
              <input ref={nameRef} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className={field} aria-invalid={tried && !nameOk} />
              {tried && !nameOk && <span className="text-[13px] text-[#a3341d]">Как к вам обращаться?</span>}
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[14px] font-semibold text-graphite">Номер телефона</span>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" inputMode="tel" autoComplete="tel" placeholder="+7 (___) ___-__-__" className={field} aria-invalid={tried && !phoneOk} />
              {tried && !phoneOk && <span className="text-[13px] text-[#a3341d]">Проверьте номер — нужно 10–11 цифр</span>}
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[14px] font-semibold text-graphite">Что беспокоит?</span>
              <textarea value={what} onChange={(e) => setWhat(e.target.value)} rows={3} placeholder="Например: болит колено при ходьбе" className={`${field} h-auto resize-none py-3`} />
            </label>
            <Chips label="Как давно?" options={WHEN} value={when} onChange={setWhen} />
            <Chips label="Была травма или операция?" options={WHY} value={why} onChange={setWhy} />
            <PdConsent checked={consent} onChange={setConsent} error={tried && !consent} />
            {/* ловушка для ботов: поле скрыто от людей */}
            <input value={company} onChange={(e) => setCompany(e.target.value)} name="company" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
            <button type="submit" disabled={stage === 'sending'} className="h-14 rounded-full bg-deep font-semibold text-white transition hover:-translate-y-0.5 disabled:opacity-60">{stage === 'sending' ? 'Отправляем…' : 'Отправить заявку'}</button>
          </form>
        )}
      </div>
    </div>
  )
}

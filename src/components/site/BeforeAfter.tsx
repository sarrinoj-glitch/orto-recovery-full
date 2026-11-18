'use client'

import { useState } from 'react'
import { asset } from '@/lib/asset'

// «До/после» на странице «Детям». Фото — от клиники, публикуются с письменного согласия родителей
const CASES = [
  { id: 'scoliosis', tab: 'Сколиоз, спина', before: '/photos/ba-scoliosis-before.jpg', after: '/photos/ba-scoliosis-after.jpg', what: 'Спина при сколиозе: пунктир — линия позвоночника' },
  { id: 'back', tab: 'Осанка, спина', before: '/photos/ba-back-before.jpg', after: '/photos/ba-back-after.jpg', what: 'Осанка ребёнка, вид со спины' },
  { id: 'side', tab: 'Осанка, сбоку', before: '/photos/ba-side-before.jpg', after: '/photos/ba-side-after.jpg', what: 'Осанка ребёнка, вид сбоку' },
]

export function BeforeAfter() {
  const [id, setId] = useState(CASES[0].id)
  const [pos, setPos] = useState(50)
  const c = CASES.find((x) => x.id === id) ?? CASES[0]
  return (
    <section id="results" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal">Примеры пациентов</p>
          <h2 className="mt-3 text-[2rem] font-extrabold leading-[1.05] tracking-[-0.03em] text-graphite sm:text-[2.6rem]">Осанка до и после курса</h2>
          <p className="mt-4 text-lg leading-relaxed text-graphite/70">Потяните ползунок, чтобы сравнить. Снимки сделаны в центре у одной и той же стены с сеткой — так проще увидеть разницу.</p>
          <div role="tablist" className="mt-6 flex flex-wrap gap-2">
            {CASES.map((x) => (
              <button key={x.id} role="tab" type="button" aria-selected={x.id === id} onClick={() => { setId(x.id); setPos(50) }}
                className={`h-11 rounded-full px-5 text-[15px] font-semibold transition-colors ${x.id === id ? 'bg-deep text-white' : 'bg-ward text-deep hover:bg-lagoon'}`}>{x.tab}</button>
            ))}
          </div>
          <p className="mt-6 text-[13px] leading-relaxed text-graphite/50">Пример одного пациента. Результат зависит от диагноза, возраста и регулярности занятий — врач скажет, чего ждать, после осмотра. Фото опубликованы с согласия родителей.</p>
        </div>
        <div className="lg:col-span-7">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[520px] select-none overflow-hidden rounded-[32px] bg-ward">
            <img src={asset(c.after)} alt={`${c.what} — после курса`} className="absolute inset-0 h-full w-full object-cover" draggable={false} />
            <img src={asset(c.before)} alt={`${c.what} — до начала занятий`} className="absolute inset-0 h-full w-full object-cover" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }} draggable={false} />
            <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[13px] font-semibold text-deep">До</span>
            <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-deep/90 px-3 py-1 text-[13px] font-semibold text-white">После</span>
            <div className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_8px_rgba(0,0,0,0.35)]" style={{ left: `${pos}%` }}>
              <span className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-lg font-bold text-deep shadow-soft">↔</span>
            </div>
            <input type="range" min={0} max={100} value={pos} onChange={(e) => setPos(Number(e.target.value))} aria-label="Сравнить фото до и после"
              className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0" style={{ touchAction: 'pan-y' }} />
          </div>
        </div>
      </div>
    </section>
  )
}

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
  const c = CASES.find((x) => x.id === id) ?? CASES[0]
  return (
    <section id="results" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal">Примеры пациентов</p>
          <h2 className="mt-3 text-[2rem] font-extrabold leading-[1.05] tracking-[-0.03em] text-graphite sm:text-[2.6rem]">Осанка до и после курса</h2>
          <p className="mt-4 text-lg leading-relaxed text-graphite/70">Слева — до начала занятий, справа — после курса. Снимки сделаны в центре.</p>
          <div role="tablist" className="mt-6 flex flex-wrap gap-2">
            {CASES.map((x) => (
              <button key={x.id} role="tab" type="button" aria-selected={x.id === id} onClick={() => setId(x.id)}
                className={`h-11 rounded-full px-5 text-[15px] font-semibold transition-colors ${x.id === id ? 'bg-deep text-white' : 'bg-ward text-deep hover:bg-lagoon'}`}>{x.tab}</button>
            ))}
          </div>
          <p className="mt-6 text-[13px] leading-relaxed text-graphite/50">Пример одного пациента. Результат зависит от диагноза, возраста и регулярности занятий — врач скажет, чего ждать, после осмотра. Фото опубликованы с согласия родителей.</p>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:col-span-7">
          {([['before', 'До', 'до начала занятий', 'bg-white/90 text-deep'], ['after', 'После', 'после курса', 'bg-deep/90 text-white']] as const).map(([k, label, alt, tone]) => (
            <figure key={k} className="relative overflow-hidden rounded-[28px] bg-ward">
              <img src={asset(c[k])} alt={`${c.what} — ${alt}`} className="aspect-[2/3] w-full object-cover" />
              <figcaption className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[13px] font-semibold ${tone}`}>{label}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

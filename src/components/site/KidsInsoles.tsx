'use client'

import { Check } from 'lucide-react'
import { asset } from '@/lib/asset'
import { openLead } from '@/components/LeadForm'

// Детские стельки Formthotics (страница «Детям»); тексты — как в блоке процедур, без обещаний результата
export function KidsInsoles() {
  return (
    <section id="insoles" className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div data-reveal className="grid overflow-hidden rounded-[36px] bg-lagoon lg:grid-cols-2">
        <img src={asset('/photos/insoles.jpg')} alt="Детские и взрослые стельки Formthotics разных размеров на кушетке" loading="lazy" className="h-64 w-full object-cover sm:h-80 lg:h-full lg:min-h-[400px]" />
        <div className="flex flex-col justify-center p-7 sm:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal">Индивидуальные стельки</p>
          <h2 className="mt-3 text-[2rem] font-extrabold leading-[1.05] tracking-[-0.03em] text-deep sm:text-[2.4rem]">Детские стельки Formthotics</h2>
          <p className="mt-4 text-lg leading-relaxed text-graphite/70">Стельки из термоформуемого материала. Их подгоняют под стопу ребёнка прямо на приёме.</p>
          <ul className="mt-5 space-y-2 text-deep">
            {['Подбирают при плоскостопии и быстрой усталости ног', 'Подбор и формовка — за один визит', 'Есть детские размеры'].map((t) => <li key={t} className="flex gap-3"><Check className="mt-0.5 shrink-0 text-teal" size={20} />{t}</li>)}
          </ul>
          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
            <button type="button" onClick={() => openLead('Здравствуйте, хочу подобрать ребёнку стельки Formthotics')} className="h-14 rounded-full bg-deep px-7 font-semibold text-white transition hover:-translate-y-0.5">Подобрать стельки</button>
            <span className="text-graphite/70">Детские — <b className="text-deep">до 9 500 ₽</b></span>
          </div>
        </div>
      </div>
    </section>
  )
}

// Гимнастика СИАС (страница «Детям»); тексты — из блока процедур
export function KidsSias() {
  return (
    <section id="sias" className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div data-reveal className="grid overflow-hidden rounded-[36px] bg-white shadow-soft ring-1 ring-graphite/5 lg:grid-cols-2">
        <img src={asset('/photos/sias.jpg')} alt="Подросток выполняет упражнение на скамье с лентой, специалист контролирует положение спины" loading="lazy" className="h-64 w-full object-cover sm:h-80 lg:order-2 lg:h-full lg:min-h-[400px]" />
        <div className="flex flex-col justify-center p-7 sm:p-12 lg:order-1">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal">Лечебная гимнастика</p>
          <h2 className="mt-3 text-[2rem] font-extrabold leading-[1.05] tracking-[-0.03em] text-deep sm:text-[2.4rem]">Занятия по методу СИАС</h2>
          <p className="mt-4 text-lg leading-relaxed text-graphite/70">Индивидуальные упражнения по итальянской методике, которые учат держать позвоночник правильно в обычной жизни.</p>
          <ul className="mt-5 space-y-2 text-deep">
            {['Подходит детям при сколиозе и нарушениях осанки', 'Занятие — с инструктором', 'Упражнения потом можно делать дома'].map((t) => <li key={t} className="flex gap-3"><Check className="mt-0.5 shrink-0 text-teal" size={20} />{t}</li>)}
          </ul>
          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
            <button type="button" onClick={() => openLead('Здравствуйте, у ребёнка сколиоз, интересует гимнастика СИАС')} className="h-14 rounded-full bg-deep px-7 font-semibold text-white transition hover:-translate-y-0.5">Записаться на занятие</button>
            <span className="text-graphite/70">Занятие — <b className="text-deep">от 2 000 ₽</b></span>
          </div>
        </div>
      </div>
    </section>
  )
}

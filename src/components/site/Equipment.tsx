import { EQUIPMENT } from '@/lib/clinic'

// Фото оборудования: на «О центре» — все аппараты, на странице услуги — только её
export function Equipment({ service }: { service?: string }) {
  const items = service ? EQUIPMENT.filter((e) => e.services.includes(service)) : EQUIPMENT
  if (!items.length) return null
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
      <h2 className="text-[2rem] font-extrabold leading-[1.05] tracking-[-0.03em] text-graphite sm:text-[2.6rem]">{service ? 'На чём проводим процедуры' : 'Оборудование центра'}</h2>
      <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-graphite/65">Фото из кабинетов центра. Аппарат и параметры процедуры подбирает врач по показаниям.</p>
      <ul className="-mx-4 mt-6 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:scroll-px-0 sm:grid-cols-2 sm:px-0 lg:grid-cols-3">
        {items.map((e) => (
          <li key={e.id} className="w-[72%] shrink-0 snap-start sm:w-auto">
            <img src={e.image} alt={e.alt} loading="lazy" className="aspect-[4/5] w-full rounded-[24px] bg-ward object-cover" />
            <p className="mt-3 text-[15px] font-semibold leading-snug text-graphite">{e.title}</p>
            <p className="text-[13px] text-graphite/55">{e.text}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

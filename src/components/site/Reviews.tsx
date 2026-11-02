import { ArrowUpRight, Star } from 'lucide-react'
import Link from 'next/link'
import { CLINIC } from '@/lib/clinic'
import { ProDoctorovWidget } from './ProDoctorov'
import { ConsentFrame } from './Consent'
import { AskButton } from './BlogClient'
import { LEGAL_ORG } from '@/lib/legal'
import { asset } from '@/lib/asset'

// Видео из orto-recovery/видеоотзывы, сжатые в 720p (web/review-*.mp4)
const VIDEO_REVIEWS = [
  { id: '8301', title: 'Обошла почти 10 клиник, пришла на костыле — теперь хожу без него', duration: '56 сек' },
  { id: '0931', title: 'Травма колена за три недели до турнира', duration: '52 сек' },
  { id: '5233', title: '16 лет с болезнью, лечился в Москве и Петербурге', duration: '1 мин 2 сек' },
  { id: '6986', title: 'Много раз обращался в центр: ортопедия, травматология, обследования', duration: '43 сек' },
]

// Сам сайт показывает только оценки со ссылками на площадки (ч. 3 ст. 24 38-ФЗ);
// отзывы ПроДокторов подгружаются виджетом площадки по кнопке
export function Reviews() {
  return (
    <section className="bg-lime-soft">
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14 lg:py-24">
      <div className="relative">
        <h2 className="text-[2.1rem] font-extrabold leading-[1.05] tracking-[-0.03em] text-graphite sm:text-5xl">
          Оценки центра
        </h2>
        <p className="mt-5 max-w-md text-lg leading-relaxed text-graphite/65">
          Оценки центра на независимых площадках. Мы отвечаем почти на каждый отзыв.
        </p>

        <div className="mt-8 space-y-3">
          <a
            href={CLINIC.rating2gis.url}
            target="_blank"
            rel="noreferrer"
            className="spot lift flex items-center justify-between rounded-2xl bg-white px-5 py-4 shadow-sm"
          >
            <span className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#19AA1E] text-sm font-extrabold text-white" aria-hidden>2Г</span>
              <span>
              <span className="block font-semibold text-graphite">2ГИС</span>
              <span className="text-[15px] text-graphite/60">{CLINIC.rating2gis.count} оценка</span>
              </span>
            </span>
            <span className="flex items-center gap-2 text-3xl font-extrabold tracking-[-0.03em] text-graphite">
              <Star size={22} className="fill-lime stroke-graphite" />
              {CLINIC.rating2gis.value}
            </span>
          </a>
          <a
            href={CLINIC.ratingYandex.url}
            target="_blank"
            rel="noreferrer"
            className="spot lift flex items-center justify-between rounded-2xl bg-white px-5 py-4 shadow-sm"
          >
            <span className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FC3F1D] text-lg font-extrabold text-white" aria-hidden>Я</span>
              <span>
              <span className="block font-semibold text-graphite">Яндекс Карты</span>
              <span className="text-[15px] text-graphite/60">все отзывы на карте</span>
              </span>
            </span>
            <span className="flex items-center gap-2 text-3xl font-extrabold tracking-[-0.03em] text-graphite">
              <Star size={22} className="fill-lime stroke-graphite" />
              {CLINIC.ratingYandex.value}
            </span>
          </a>
        </div>
      </div>

      <div className="flex flex-col justify-center gap-4 rounded-[28px] bg-white p-7 shadow-lift">
        <p className="text-xl font-bold text-deep">Отзывы на ПроДокторов</p>
        <p className="text-[15px] leading-relaxed text-graphite/70">Мы не публикуем отзывы и благодарности пациентов на своём сайте — так требует закон о рекламе медицинских услуг. Отзывы собирает и проверяет независимая площадка ПроДокторов: клиника не может их удалить или изменить. Виджет загружается с сервера prodoctorov.ru и использует его cookie.</p>
        <ProDoctorovWidget />
        <p className="text-[13px] text-graphite/50">Рейтинги: 2ГИС и Яндекс Карты, данные на октябрь 2026 года.</p>
        <Link href="/otzyvy/" className="self-start text-[15px] font-semibold text-teal underline underline-offset-4">Все отзывы и площадки →</Link>
      </div>
    </div>
    </section>
  )
}

const PD_NEW = 'https://prodoctorov.ru/new/rate/lpu/90155/'

// Страница «Отзывы»: оценки и виджеты независимых площадок — виджеты грузятся только по нажатию
export function ReviewsHub() {
  const rating = 'spot lift flex items-center justify-between rounded-2xl bg-white px-5 py-4 shadow-sm'
  const leave = 'flex h-12 items-center justify-center rounded-full bg-white px-5 text-[15px] font-semibold text-graphite ring-1 ring-graphite/10 transition hover:ring-teal'
  return (
    <>
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-3 md:grid-cols-3">
          <a href={CLINIC.rating2gis.url} target="_blank" rel="noreferrer" className={rating}>
            <span className="flex items-center gap-3">
              <span aria-hidden className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#19AA1E] text-sm font-extrabold text-white">2Г</span>
              <span><span className="block font-semibold text-graphite">2ГИС</span><span className="text-[15px] text-graphite/60">{CLINIC.rating2gis.count} оценка</span></span>
            </span>
            <span className="flex items-center gap-2 text-3xl font-extrabold tracking-[-0.03em] text-graphite"><Star size={22} className="fill-lime stroke-graphite" />{CLINIC.rating2gis.value}</span>
          </a>
          <a href={CLINIC.ratingYandex.url} target="_blank" rel="noreferrer" className={rating}>
            <span className="flex items-center gap-3">
              <span aria-hidden className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FC3F1D] text-lg font-extrabold text-white">Я</span>
              <span><span className="block font-semibold text-graphite">Яндекс Карты</span><span className="text-[15px] text-graphite/60">отзывы на карте</span></span>
            </span>
            <span className="flex items-center gap-2 text-3xl font-extrabold tracking-[-0.03em] text-graphite"><Star size={22} className="fill-lime stroke-graphite" />{CLINIC.ratingYandex.value}</span>
          </a>
          <a href="https://prodoctorov.ru/mahachkala/lpu/90155-orto-rekaveri/#otzivi" target="_blank" rel="noreferrer" className={rating}>
            <span className="flex items-center gap-3">
              <span aria-hidden className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1A5DD0] text-sm font-extrabold text-white">ПД</span>
              <span><span className="block font-semibold text-graphite">ПроДокторов</span><span className="text-[15px] text-graphite/60">39 отзывов</span></span>
            </span>
            <ArrowUpRight size={22} className="text-graphite/40" />
          </a>
        </div>
        <p className="mt-3 text-[13px] text-graphite/50">Данные площадок на 1 ноября 2026 года.</p>

        <h2 className="mt-14 text-[2rem] font-extrabold leading-[1.05] tracking-[-0.03em] text-graphite sm:text-[2.6rem]">Видеоотзывы пациентов</h2>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-graphite/65">Пациенты рассказывают о лечении своими словами. Видео начинает загружаться, только когда вы нажмёте «воспроизвести».</p>
        <div className="-mx-4 mt-6 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 sm:scroll-px-0 sm:mx-0 sm:grid sm:grid-cols-2 sm:px-0 lg:grid-cols-4">
          {VIDEO_REVIEWS.map((v) => (
            <figure key={v.id} className="w-[72%] shrink-0 snap-start sm:w-auto">
              <video
                controls
                playsInline
                preload="none"
                poster={asset(`/video/review-${v.id}.jpg`)}
                src={asset(`/video/review-${v.id}.mp4`)}
                aria-label={`Видеоотзыв: ${v.title}`}
                className="aspect-[9/16] w-full rounded-[24px] bg-graphite object-cover"
              />
              <figcaption className="mt-3 text-[15px] font-semibold leading-snug text-graphite">{v.title}</figcaption>
              <p className="text-[13px] text-graphite/50">{v.duration}</p>
            </figure>
          ))}
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-4 rounded-[28px] bg-white p-6 shadow-lift sm:p-7">
            <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-deep">ПроДокторов</h2>
            <p className="text-[15px] leading-relaxed text-graphite/70">Площадка проверяет, что автор действительно был на приёме. Виджет загружается с сервера prodoctorov.ru и использует его cookie.</p>
            <ProDoctorovWidget />
          </div>
          <div className="flex flex-col gap-4 rounded-[28px] bg-white p-6 shadow-lift sm:p-7">
            <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-deep">Яндекс Карты</h2>
            <p className="text-[15px] leading-relaxed text-graphite/70">Отзывы и оценки с карточки центра на Яндекс Картах.</p>
            <ConsentFrame src={CLINIC.reviewsWidget} title="Отзывы о центре на Яндекс Картах" label="Виджет отзывов Яндекс Карт" action="Показать отзывы Яндекса" className="min-h-[200px] w-full rounded-2xl bg-ward [&:is(iframe)]:h-[620px]" />
          </div>
        </div>
      </section>

      <section className="bg-lime-soft">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:py-20">
          <div>
            <h2 className="text-[2rem] font-extrabold leading-[1.05] tracking-[-0.03em] text-graphite sm:text-[2.6rem]">Были у нас? Расскажите о визите</h2>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-graphite/65">Отзыв помогает другим пациентам выбрать врача, а нам — понять, что улучшить. Выберите удобную площадку.</p>
            <div className="mt-6 grid gap-2.5 sm:grid-cols-3">
              <a href={CLINIC.rating2gis.url} target="_blank" rel="noreferrer" className={leave}>в 2ГИС</a>
              <a href={CLINIC.ratingYandex.url} target="_blank" rel="noreferrer" className={leave}>на Яндексе</a>
              <a href={PD_NEW} target="_blank" rel="noreferrer" className={leave}>на ПроДокторов</a>
            </div>
          </div>
          <div className="flex flex-col justify-center gap-4 rounded-[28px] bg-white p-7 shadow-lift">
            <p className="text-xl font-bold text-deep">Что-то пошло не так?</p>
            <p className="text-[15px] leading-relaxed text-graphite/70">Напишите администратору — передадим руководителю центра и ответим. Официальное обращение можно отправить письмом на <a href={`mailto:${LEGAL_ORG.email}`} className="text-teal underline underline-offset-2">{LEGAL_ORG.email}</a>.</p>
            <AskButton text="Здравствуйте, хочу оставить замечание о визите" label="Написать администратору" className="self-start bg-deep text-white" />
          </div>
        </div>
      </section>

      <p className="mx-auto max-w-6xl px-4 py-8 text-[13px] leading-relaxed text-graphite/50 sm:px-6">
        Видеоотзывы — личное мнение пациентов, результат лечения у каждого свой. Имеются противопоказания, необходима консультация специалиста. Отзывы в блоках площадок показывают виджеты 2ГИС, Яндекса и ПроДокторов: они загружаются с их серверов по вашему нажатию, клиника не может изменить или удалить отзыв.
      </p>
    </>
  )
}

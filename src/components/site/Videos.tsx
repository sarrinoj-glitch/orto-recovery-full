import { asset } from '@/lib/asset'

// Видео из orto-recovery/видеоотзывы, сжатые в 720p (web/review-*.mp4, web/doctor-*.mp4)
type Video = { id: string; title: string; duration: string }

export const VIDEO_REVIEWS: Video[] = [
  { id: '8301', title: 'Обошла почти 10 клиник, пришла на костыле — теперь хожу без него', duration: '56 сек' },
  { id: '0931', title: 'Травма колена за три недели до турнира', duration: '52 сек' },
  { id: '5233', title: '16 лет с болезнью, лечился в Москве и Петербурге', duration: '1 мин 2 сек' },
  { id: '6986', title: 'Много раз обращался в центр: ортопедия, травматология, обследования', duration: '43 сек' },
]

export const DOCTOR_VIDEOS: Video[] = [
  { id: '2747', title: 'Главный результат — вернуться к жизни без боли и ограничений', duration: '52 сек' },
  { id: '0912', title: 'Почему упражнения при боли в пояснице могут навредить', duration: '55 сек' },
  { id: '0871', title: 'Травма крестообразной связки: что нужно после операции', duration: '32 сек' },
  { id: '4617', title: 'Индивидуальные стельки Formthotics: кому нужны и как подбирают', duration: '1 мин 8 сек' },
]

// preload="none": ролик начинает грузиться только после нажатия «воспроизвести»
export function VideoGrid({ kind, items, label }: { kind: 'review' | 'doctor'; items: Video[]; label: string }) {
  return (
    <div className="-mx-4 mt-6 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:scroll-px-0 sm:grid-cols-2 sm:px-0 lg:grid-cols-4">
      {items.map((v) => (
        <figure key={v.id} className="w-[72%] shrink-0 snap-start sm:w-auto">
          <video
            controls
            playsInline
            preload="none"
            poster={asset(`/video/${kind}-${v.id}.jpg`)}
            src={asset(`/video/${kind}-${v.id}.mp4`)}
            aria-label={`${label}: ${v.title}`}
            className="aspect-[9/16] w-full rounded-[24px] bg-graphite object-cover"
          />
          <figcaption className="mt-3 text-[15px] font-semibold leading-snug text-graphite">{v.title}</figcaption>
          <p className="text-[13px] text-graphite/50">{v.duration}</p>
        </figure>
      ))}
    </div>
  )
}

export function DoctorVideos() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <h2 className="text-[2rem] font-extrabold leading-[1.05] tracking-[-0.03em] text-graphite sm:text-[2.6rem]">Врачи объясняют</h2>
      <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-graphite/65">Короткие видео от специалистов центра. Видео начинает загружаться, только когда вы нажмёте «воспроизвести».</p>
      <VideoGrid kind="doctor" items={DOCTOR_VIDEOS} label="Видео" />
      <p className="mt-6 text-[13px] text-graphite/50">Имеются противопоказания. Необходима консультация специалиста.</p>
    </section>
  )
}

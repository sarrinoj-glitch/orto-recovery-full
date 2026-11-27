import { asset } from '@/lib/asset'

type Shot = { src: string; cap: string; alt: string }

// Фото процедур на страницах услуг. Фото — от клиники и из карточки центра в 2ГИС
const REHAB: Shot[] = [
  { src: '/photos/sias.jpg', cap: 'Упражнения с лентой', alt: 'Пациент выполняет упражнение на скамье с лентой, специалист контролирует положение спины' },
  { src: '/photos/rehab-ems.jpg', cap: 'Электромиостимуляция', alt: 'Электроды миостимулятора на мышцах бедра пациента' },
  { src: '/photos/rehab-biomag.jpg', cap: 'Магнитотерапия Biomag', alt: 'Аппликатор Biomag на колене пациента во время процедуры лёжа' },
  { src: '/photos/rehab-head.jpg', cap: 'Транскраниальная электростимуляция', alt: 'Пациент на процедуре транскраниальной электростимуляции, электроды закреплены на голове' },
]

const FOOT: Shot[] = [
  { src: '/photos/foot-scan.jpg', cap: 'Осмотр стоп на подоскопе', alt: 'Пациент стоит на подоскопе, специалист осматривает отпечаток стопы в подсветке' },
  { src: '/photos/uvt-heel.jpg', cap: 'Ударно-волновая терапия', alt: 'Ортопед проводит ударно-волновую терапию на пятке пациента' },
  { src: '/photos/insoles-table.jpg', cap: 'Стельки Formthotics', alt: 'Стельки Formthotics разных размеров разложены на кушетке' },
]

function PhotoSet({ title, shots }: { title: string; shots: Shot[] }) {
  return (
    <section id="photos" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal">Фото из центра</p>
      <h2 className="mt-3 text-[2rem] font-extrabold leading-[1.05] tracking-[-0.03em] text-graphite sm:text-[2.6rem]">{title}</h2>
      <div data-stagger className={`-mx-4 mt-8 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:overflow-visible sm:px-0 ${shots.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-4'}`}>
        {shots.map((p) => (
          <figure key={p.src} className="relative w-[72%] shrink-0 snap-start overflow-hidden rounded-[28px] sm:w-auto">
            <img src={asset(p.src)} alt={p.alt} loading="lazy" className="aspect-[4/5] w-full object-cover transition duration-500 hover:scale-[1.03]" />
            <figcaption className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3.5 py-1.5 text-[13px] font-semibold text-deep backdrop-blur">{p.cap}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

export const RehabPhotos = () => <PhotoSet title="Как проходит восстановление" shots={REHAB} />
export const FootPhotos = () => <PhotoSet title="Как мы работаем со стопой" shots={FOOT} />

// Фото с коротким пояснением, что делает специалист
function PhotoNote({ id, img, alt, kicker, title, text }: { id: string; img: string; alt: string; kicker: string; title: string; text: string }) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div data-reveal className="grid overflow-hidden rounded-[36px] bg-white shadow-soft ring-1 ring-graphite/5 lg:grid-cols-2">
        <img src={asset(img)} alt={alt} loading="lazy" className="h-64 w-full object-cover sm:h-80 lg:h-full lg:min-h-[380px]" />
        <div className="flex flex-col justify-center p-7 sm:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal">{kicker}</p>
          <h2 className="mt-3 text-[1.9rem] font-extrabold leading-[1.08] tracking-[-0.03em] text-deep sm:text-[2.3rem]">{title}</h2>
          <p className="mt-4 text-lg leading-relaxed text-graphite/70">{text}</p>
        </div>
      </div>
    </section>
  )
}

export const HipCheck = () => (
  <PhotoNote id="hip" img="/photos/rehab-knee.jpg" alt="Специалист сгибает ногу пациента в колене и тазобедренном суставе на кушетке, таз зафиксирован ремнём"
    kicker="Осмотр" title="Проверяем подвижность тазобедренного сустава"
    text="Специалист сгибает ногу в колене и в тазобедренном суставе и мягко поворачивает бедро. Ремень удерживает таз, чтобы двигался только сустав. Так видно, насколько свободно сустав движется и в какой момент появляется боль." />
)

// Фото процедур для спины — без подписей, по просьбе клиента
const BACK = [
  { src: '/photos/cupping.jpg', alt: 'Специалист ставит на спину пациента силиконовые вакуумные банки' },
  { src: '/photos/back-massage.jpg', alt: 'Специалист центра делает массаж спины пациенту' },
  { src: '/photos/back-scraping.jpg', alt: 'Специалист обрабатывает мышцы спины металлическим скребком' },
]

export const Cupping = () => (
  <section id="back-photos" className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
    <div data-stagger className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0">
      {BACK.map((p) => (
        <img key={p.src} src={asset(p.src)} alt={p.alt} loading="lazy" className="aspect-[4/5] w-[72%] shrink-0 snap-start rounded-[28px] object-cover sm:w-full" />
      ))}
    </div>
  </section>
)

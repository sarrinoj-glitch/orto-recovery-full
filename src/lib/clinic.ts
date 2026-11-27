// Данные ЦВМ «Орто-Рекавери» (источник — orto-recovery/research_notes, проверено 20.10.2026).
// Цены — данные клиники от 07.11.2026; лаборатория — Яндекс/2ГИС.

import { asset } from './asset'

export const CLINIC = {
  name: 'Орто-Рекавери',
  legal: 'ООО ЦВМ «ОРТО-РЕКАВЕРИ»',
  inn: '0572029293',
  ogrn: '1210500012392',
  address: 'Махачкала, проспект Имама Шамиля, 35А, 1 этаж',
  howToFind: 'Вход за шлагбаумом, рядом санаторий «Тарнаир». Остановка «Источник Тарнаир». Есть пандус и парковка.',
  phone: '+7 (8722) 52-23-33',
  whatsapp: '+7 (988) 301-18-05',
  whatsappLink: 'https://wa.me/79883011805',
  hoursWeek: 'Пн–Пт: 9:00–18:00',
  hoursSat: 'Сб: 9:00–16:00',
  rating2gis: { value: '5,0', count: 121, url: 'https://2gis.ru/makhachkala/firm/70000001060465369/tab/reviews' },
  ratingYandex: { value: '4,9', url: 'https://yandex.ru/maps/org/orto_rekaveri/20949908898/reviews/' },
  reviewsWidget: 'https://yandex.ru/maps-reviews-widget/20949908898?comments',
  mapEmbed: 'https://yandex.ru/map-widget/v1/?ll=47.498081%2C42.965856&z=17&pt=47.498081%2C42.965856%2Cpm2rdm',
}

export type Doctor = {
  name: string
  role: string
  treats: string
  price: string
  chat: string
  // Врач приезжает и ведёт приём не каждый день — показываем под должностью
  visit?: string
  // Приглашённый врач: записи нет, вместо «Записаться» — «Узнать о приезде»
  guest?: boolean
  // Портрет из фотосессии 2024 (медиатека старого сайта) — только где имя точно известно
  photo?: string
}

export const DOCTORS: Doctor[] = [
  {
    name: 'Хаджалов Абузар Магомедович',
    role: 'Травматолог-ортопед, кистевой реабилитолог',
    photo: asset('/photos/d-khadzhalov.jpg'),
    treats: 'Суставы, травмы, восстановление после операций, PRP',
    price: 'до 3 000 ₽',
    chat: 'Здравствуйте, хочу на приём к ортопеду Хаджалову, болит сустав',
  },
]

export type BodyArea = {
  id: string
  label: string
  complaints: string
  options: { name: string; price: string }[]
  doctor: string
  doctorRole: string
  visit: string
  chat: string
}

// К приглашённому врачу записи нет — пациент оставляет заявку, и администратор сообщит о приезде
export const GUEST_CTA = 'Узнать о приезде'
export const isGuest = (name?: string) => DOCTORS.some((d) => d.name === name && d.guest)
export const guestAsk = (name: string) => `Сообщите, пожалуйста, когда приедет ${name} — хочу попасть на приём`
export const doctorCta = (name: string | undefined, chat: string, label = 'Записаться') =>
  isGuest(name) ? { label: GUEST_CTA, context: guestAsk(name!) } : { label, context: chat }

export const BODY_AREAS: BodyArea[] = [
  {
    id: 'back',
    label: 'Спина и шея',
    complaints: 'Тянет поясницу, отдаёт в ногу, затекает шея после работы, нашли грыжу или протрузию на МРТ.',
    options: [
      { name: 'Лечебная физкультура', price: 'от 2 000 ₽' },
      { name: 'Ударно-волновая терапия', price: 'до 3 000 ₽' },
      { name: 'Сухое иглоукалывание', price: 'до 2 500 ₽' },
      { name: 'Кинезиотейпирование', price: 'от 1 000 ₽' },
    ],
    doctor: 'Хаджалов Абузар Магомедович',
    doctorRole: 'травматолог-ортопед',
    visit: 'до 3 000 ₽',
    chat: 'Здравствуйте, болит спина, есть грыжа поясницы',
  },
  {
    id: 'arm',
    label: 'Плечо, локоть, кисть',
    complaints: 'Не поднимается рука, болит локоть, кисть плохо разгибается после перелома или операции.',
    options: [
      { name: 'Разработка кисти после операции', price: '3 000 ₽' },
      { name: 'Ударно-волновая терапия', price: 'до 3 000 ₽' },
      { name: 'Кинезиотейпирование', price: 'от 1 000 ₽' },
      { name: 'Магнит высокой интенсивности + лазер', price: 'до 2 000 ₽' },
    ],
    doctor: 'Хаджалов Абузар Магомедович',
    doctorRole: 'травматолог-ортопед, кистевой реабилитолог',
    visit: 'до 3 000 ₽',
    chat: 'Здравствуйте, после перелома плохо разгибается кисть',
  },
  {
    id: 'knee',
    label: 'Колено и тазобедренный сустав',
    complaints: 'Болит колено на лестнице, щёлкает, отекает после нагрузки, врач сказал «артроз».',
    options: [
      { name: 'PRP-терапия', price: 'до 10 500 ₽' },
      { name: 'Плазмотерапия', price: 'до 4 000 ₽' },
      { name: 'Лечебная физкультура', price: 'от 2 000 ₽' },
      { name: 'Ударно-волновая терапия', price: 'до 3 000 ₽' },
    ],
    doctor: 'Хаджалов Абузар Магомедович',
    doctorRole: 'травматолог-ортопед',
    visit: 'до 3 000 ₽',
    chat: 'Здравствуйте, болит колено уже месяц',
  },
  {
    id: 'foot',
    label: 'Стопа и пятка',
    complaints: 'Утром больно наступить на пятку, плоскостопие, быстро устают ноги.',
    options: [
      { name: 'Ударно-волновая терапия', price: 'до 3 000 ₽' },
      { name: 'Индивидуальные стельки Formthotics', price: 'до 13 500 ₽' },
      { name: 'Детские стельки Formthotics', price: 'до 9 500 ₽' },
    ],
    doctor: 'Хаджалов Абузар Магомедович',
    doctorRole: 'травматолог-ортопед',
    visit: 'до 3 000 ₽',
    chat: 'Здравствуйте, болит пятка по утрам',
  },
]

export const EXTRA_AREAS: BodyArea[] = [
  {
    id: 'kids',
    label: 'Ребёнок: осанка и стопы',
    complaints: 'Сутулится, одно плечо выше, плоскостопие, быстро устаёт при ходьбе.',
    options: [
      { name: 'Лечебная гимнастика по методу СИАС', price: 'от 2 000 ₽' },
      { name: 'Индивидуальные стельки Formthotics, детские', price: 'до 9 500 ₽' },
    ],
    doctor: 'Хаджалов Абузар Магомедович',
    doctorRole: 'травматолог-ортопед',
    visit: 'до 3 000 ₽',
    chat: 'Здравствуйте, ребёнку 9 лет, сколиоз',
  },
]

export const PRICE_GROUPS: { title: string; items: { name: string; price: string }[]; note?: string }[] = [
  {
    title: 'Приём врача',
    items: [
      { name: 'Консультация травматолога-ортопеда', price: 'до 3 000 ₽' },
      { name: 'Консультация невролога', price: 'от 8 000 ₽' },
      { name: 'Консультация терапевта-гастроэнтеролога', price: 'до 3 000 ₽' },
      { name: 'Консультация реабилитолога', price: 'от 2 500 ₽' },
      { name: 'Консультация нутрициолога', price: 'до 4 000 ₽' },
      { name: 'Консультация психолога', price: 'до 3 000 ₽' },
      { name: 'Выезд врача на дом', price: '4 000 ₽' },
    ],
  },
  {
    title: 'Физиотерапия',
    items: [
      { name: 'Ударно-волновая терапия', price: 'до 3 000 ₽' },
      { name: 'Магнит высокой интенсивности + лазер', price: 'до 2 000 ₽' },
      { name: 'Магнит низкой частоты', price: 'до 800 ₽' },
      { name: 'Ультразвуковая терапия', price: 'до 800 ₽' },
      { name: 'Электромиостимуляция', price: 'до 1 500 ₽' },
      { name: 'Электротерапия', price: 'до 1 500 ₽' },
      { name: 'Транскраниальная электростимуляция', price: 'до 1 500 ₽' },
      { name: 'Прессотерапия', price: 'до 1 500 ₽' },
      { name: 'Электроакупунктура', price: 'до 2 500 ₽' },
    ],
  },
  {
    title: 'Лечебная физкультура',
    items: [
      { name: 'Лечебная физкультура', price: 'от 2 000 ₽' },
      { name: 'Лечебная гимнастика по методу СИАС', price: 'от 2 000 ₽' },
      { name: 'Разработка кисти после операции', price: '3 000 ₽' },
      { name: 'Групповые тренинги по психологии', price: 'от 1 500 ₽' },
      { name: 'Сухие иглы', price: 'до 2 500 ₽' },
      { name: 'Кинезиотейпирование', price: 'от 1 000 ₽' },
    ],
  },
  {
    title: 'Суставы и стопы',
    items: [
      { name: 'PRP-терапия', price: 'до 10 500 ₽' },
      { name: 'Плазмотерапия', price: 'до 4 000 ₽' },
      { name: 'Блокада сустава или позвоночника', price: 'до 3 000 ₽' },
      { name: 'Индивидуальные стельки Formthotics (взрослые)', price: 'до 13 500 ₽' },
      { name: 'Индивидуальные стельки Formthotics (детские)', price: 'до 9 500 ₽' },
    ],
  },
  {
    title: 'Анализы всех видов',
    items: [{ name: 'Лабораторные анализы', price: 'от 595 ₽' }],
    note: 'Более 2 500 анализов. Быстро, качественно и точно в срок.',
  },
]

// Экскурсия по центру: фотосессия 2024 из медиатеки старого сайта + ресепшен
export const PHOTOS = [
  { id: 'reception', image: asset('/photos/reception.jpg'), title: 'Ресепшен', description: 'Здесь вас встретит администратор', alt: 'Стойка администратора с логотипом центра' },
  { id: 'hand', image: asset('/photos/hand-1.jpg'), title: 'Разработка кисти', description: 'Занятие ведёт ортопед Хаджалов А. М.', alt: 'Травматолог-ортопед Хаджалов проводит занятие по разработке кисти' },
  { id: 'uvt', image: asset('/photos/c-shoulder.jpg'), title: 'Ударно-волновая терапия', description: 'УВТ — до 3 000 ₽', alt: 'Ударно-волновая терапия плеча' },
  { id: 'uvt-foot', image: asset('/photos/hero-1.jpg'), title: 'Ударно-волновая терапия стопы', description: 'Процедура на аппарате BTL', alt: 'Врач проводит ударно-волновую терапию стопы' },
  { id: 'uvt-foot-2', image: asset('/photos/eq-uvt-foot.jpg'), title: 'Лечение пяточной шпоры', description: 'Ударно-волновая терапия', alt: 'Врач проводит ударно-волновую терапию пятки' },
  { id: 'magnet', image: asset('/photos/g-magnet.jpg'), title: 'Аппарат магнита высокой интенсивности', description: 'Процедура на спину', alt: 'Врач проводит процедуру на аппарате магнита высокой интенсивности' },
  { id: 'lfk', image: asset('/photos/g-lfk.jpg'), title: 'Зал лечебной физкультуры', description: 'Занятия со взрослыми и детьми', alt: 'Зал лечебной физкультуры: шведская стенка, тренажёр, мячи, кушетки' },
  { id: 'hand-band', image: asset('/photos/hand-3.jpg'), title: 'Разгибание пальцев с резинкой', description: 'Разработка кисти — 3 000 ₽', alt: 'Пациент разгибает пальцы, преодолевая сопротивление резинки' },
  { id: 'hand-show', image: asset('/photos/hand-2.jpg'), title: 'Врач показывает упражнение', description: 'И следит за техникой', alt: 'Хаджалов показывает пациенту упражнение для кисти' },
  { id: 'hand-board', image: asset('/photos/hand-4.jpg'), title: 'Доска со стойками', description: 'Захват цилиндров разной толщины', alt: 'Упражнение для кисти на доске со стойками' },
  { id: 'knee', image: asset('/photos/rehab-knee.jpg'), title: 'Разработка колена', description: 'Специалист проверяет подвижность сустава', alt: 'Специалист центра разрабатывает колено пациента на кушетке' },
  { id: 'bench', image: asset('/photos/sias.jpg'), title: 'Упражнения с лентой', description: 'Специалист следит за положением спины', alt: 'Пациент выполняет упражнение на скамье с лентой, специалист контролирует положение спины' },
  { id: 'ems-leg', image: asset('/photos/rehab-ems.jpg'), title: 'Электромиостимуляция', description: 'Электроды на мышцах бедра', alt: 'Электроды миостимулятора на мышцах бедра пациента' },
  { id: 'biomag-knee', image: asset('/photos/rehab-biomag.jpg'), title: 'Магнитотерапия Biomag', description: 'Процедура лёжа, индуктор на колене', alt: 'Пациент на процедуре магнитотерапии, индуктор на колене' },
  { id: 'tes', image: asset('/photos/rehab-head.jpg'), title: 'Транскраниальная электростимуляция', description: 'Электроды закреплены на голове', alt: 'Пациент на процедуре транскраниальной электростимуляции' },
]

// Оборудование центра: фото кабинетов 2026 (orto-recovery/оборудование). services — на каких страницах услуг показывать
export const EQUIPMENT = [
  { id: 'uvt', image: asset('/photos/eq-uvt.jpg'), title: 'Ударно-волновая терапия', text: 'Аппарат Gymna Shockmaster 500', alt: 'Аппарат ударно-волновой терапии Gymna Shockmaster 500', services: ['spina', 'koleno', 'plecho', 'stopa', 'reabilitaciya', 'fizioterapiya'] },
  { id: 'btl', image: asset('/photos/eq-btl.jpg'), title: 'Ударно-волновая терапия', text: 'Аппарат BTL', alt: 'Аппарат ударно-волновой терапии BTL', services: ['spina', 'koleno', 'plecho', 'stopa', 'reabilitaciya', 'fizioterapiya'] },
  { id: 'press', image: asset('/photos/rehab-biomag.jpg'), title: 'Импульсная магнитотерапия низкой частоты', text: 'Манжеты-индукторы на ноги, процедура лёжа', alt: 'Пациент на процедуре магнитотерапии лёжа: индуктор на колене, рядом аппарат Biomag', services: ['reabilitaciya', 'lechebnaya-fizkultura', 'fizioterapiya'] },
  { id: 'magnet', image: asset('/photos/eq-magnet.jpg'), title: 'Магнит высокой интенсивности', text: 'Аппарат Doc Basyr с кольцевым излучателем', alt: 'Аппарат высокоинтенсивной магнитотерапии Doc Basyr', services: ['spina', 'koleno', 'plecho', 'reabilitaciya', 'fizioterapiya'] },
  { id: 'biomag', image: asset('/photos/eq-biomag.jpg'), title: 'Импульсная магнитотерапия низкой частоты', text: 'Аппликаторы Biomag — процедура лёжа на кушетке', alt: 'Аппликаторы магнитотерапии Biomag на кушетке', services: ['spina', 'reabilitaciya', 'fizioterapiya'] },
  { id: 'combo', image: asset('/photos/eq-combo.jpg'), title: 'Ультразвуковая терапия и электротерапия', text: 'Комбинированный аппарат Enraf-Nonius', alt: 'Комбинированный аппарат физиотерапии Enraf-Nonius с двумя излучателями', services: ['spina', 'koleno', 'plecho', 'reabilitaciya', 'fizioterapiya'] },
  { id: 'ems', image: asset('/photos/eq-ems.jpg'), title: 'Электромиостимуляция', text: 'Стимулятор Compex SP 4.0 и ультразвук Enraf-Nonius', alt: 'Миостимулятор Compex SP 4.0 и аппарат ультразвуковой терапии Enraf-Nonius', services: ['plecho', 'reabilitaciya', 'lechebnaya-fizkultura', 'fizioterapiya'] },
  { id: 'tes', image: asset('/photos/eq-tes.jpg'), title: 'Транскраниальная электростимуляция', text: 'Аппарат Магнон-ДКС', alt: 'Аппарат транскраниальной электростимуляции Магнон-ДКС и оголовье с электродами', services: ['reabilitaciya', 'fizioterapiya'] },
  { id: 'lab', image: asset('/photos/eq-centrifuge.jpg'), title: 'Процедурный кабинет', text: 'Забор крови на анализы и для PRP-терапии', alt: 'Центрифуга для анализов в процедурном кабинете', services: ['prp'] },
]

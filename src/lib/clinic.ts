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
  {
    name: 'Куделя Павел Александрович',
    role: 'Невролог, мануальный терапевт',
    visit: 'Специальный гость из Москвы — принимает в дни приезда, по предварительной записи',
    guest: true,
    treats: 'Боль в спине и шее, грыжи, спортивные травмы',
    price: 'от 8 000 ₽',
    chat: 'Здравствуйте, болит спина, хочу к неврологу',
  },
  {
    name: 'Мусаева Эльмира Ашурбеговна',
    role: 'Инструктор по лечебной физкультуре и методике СИАС',
    treats: 'Сколиоз и осанка у детей и взрослых, лечебная физкультура для детей',
    photo: asset('/photos/d-musaeva.jpg'),
    price: 'от 2 000 ₽',
    chat: 'Здравствуйте, у ребёнка сколиоз, хочу на лечебную физкультуру',
  },
  {
    name: 'Магомедов Муслим Абдулла-Гаджиевич',
    role: 'Инструктор по лечебной физкультуре, мануальный терапевт',
    treats: 'Лечебная физкультура и мануальная терапия',
    price: 'от 2 000 ₽',
    chat: 'Здравствуйте, хочу записаться на лечебную физкультуру',
  },
  {
    name: 'Муртузалиева Зарема Гаджимурадовна',
    role: 'Психолог, администратор центра',
    treats: 'Страх движения после травмы, хроническая боль и стресс — то, что мешает восстановиться',
    photo: asset('/photos/d-murtuzalieva.jpg'),
    price: 'до 3 000 ₽',
    chat: 'Здравствуйте, хочу записаться к психологу',
  },
  {
    name: 'Нажмудинова Айшат Абдурахмановна',
    role: 'Терапевт-гастроэнтеролог, гепатолог',
    treats: 'Желудок, кишечник, печень. Сеченовский университет, стаж 9 лет',
    photo: asset('/photos/d-nazhmudinova.jpg'),
    price: 'до 3 000 ₽',
    chat: 'Здравствуйте, хочу записаться к гастроэнтерологу',
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
    doctor: 'Магомедов Муслим Абдулла-Гаджиевич',
    doctorRole: 'инструктор по лечебной физкультуре, мануальный терапевт',
    visit: 'от 2 000 ₽',
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
      { name: 'Плазмотерапия', price: '4 000 ₽' },
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
      { name: 'Индивидуальные стельки Formthotics', price: '13 500 ₽' },
      { name: 'Детские стельки Formthotics', price: '9 500 ₽' },
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
      { name: 'Массаж всех видов', price: 'от 1 600 ₽' },
      { name: 'Индивидуальные стельки Formthotics, детские', price: '9 500 ₽' },
    ],
    doctor: 'Мусаева Эльмира Ашурбеговна',
    doctorRole: 'инструктор по лечебной физкультуре и методике СИАС',
    visit: 'от 2 000 ₽',
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
      { name: 'Сухие иглы', price: 'до 2 500 ₽' },
      { name: 'Кинезиотейпирование', price: 'от 1 000 ₽' },
    ],
  },
  {
    title: 'Лечебная физкультура и массаж',
    items: [
      { name: 'Лечебная физкультура', price: 'от 2 000 ₽' },
      { name: 'Лечебная гимнастика по методу СИАС', price: 'от 2 000 ₽' },
      { name: 'Разработка кисти после операции', price: '3 000 ₽' },
      { name: 'Массаж всех видов', price: 'от 1 600 ₽' },
      { name: 'Групповые тренинги по психологии', price: 'от 1 500 ₽' },
    ],
  },
  {
    title: 'Суставы и стопы',
    items: [
      { name: 'PRP-терапия', price: 'до 10 500 ₽' },
      { name: 'Плазмотерапия', price: '4 000 ₽' },
      { name: 'Блокада сустава или позвоночника', price: '3 000 ₽' },
      { name: 'Индивидуальные стельки Formthotics (взрослые)', price: '13 500 ₽' },
      { name: 'Индивидуальные стельки Formthotics (детские)', price: '9 500 ₽' },
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
  { id: 'reception', image: asset('/photos/reception-admin.jpg'), title: 'Ресепшен', description: 'Вас встретит администратор Зарема Муртузалиева', alt: 'Администратор центра за стойкой регистрации' },
  { id: 'uvt', image: asset('/photos/c-shoulder.jpg'), title: 'Ударно-волновая терапия', description: 'УВТ — до 3 000 ₽', alt: 'Ударно-волновая терапия плеча' },
  { id: 'uvt-foot', image: asset('/photos/hero-1.jpg'), title: 'Ударно-волновая терапия стопы', description: 'Процедура на аппарате BTL', alt: 'Врач проводит ударно-волновую терапию стопы' },
  { id: 'uvt-foot-2', image: asset('/photos/eq-uvt-foot.jpg'), title: 'Лечение пяточной шпоры', description: 'Ударно-волновая терапия', alt: 'Врач проводит ударно-волновую терапию пятки' },
  { id: 'magnet', image: asset('/photos/g-magnet.jpg'), title: 'Аппаратная физиотерапия', description: 'Магнит, ультразвук, ток', alt: 'Аппаратная физиотерапия спины' },
  { id: 'massage', image: asset('/photos/g-massage.jpg'), title: 'Массаж', description: 'Массаж всех видов — от 1 600 ₽', alt: 'Лечебный массаж' },
  { id: 'lfk', image: asset('/photos/g-lfk.jpg'), title: 'Зал лечебной физкультуры', description: 'Занятия со взрослыми и детьми', alt: 'Зал лечебной физкультуры' },
  { id: 'mri', image: asset('/photos/g-mri.jpg'), title: 'Разбор снимков', description: 'МРТ и рентген — на приёме', alt: 'Врачи разбирают снимок МРТ' },
]

// Оборудование центра: фото кабинетов 2026 (orto-recovery/оборудование). services — на каких страницах услуг показывать
export const EQUIPMENT = [
  { id: 'uvt', image: asset('/photos/eq-uvt.jpg'), title: 'Ударно-волновая терапия', text: 'Аппарат Gymna Shockmaster 500', alt: 'Аппарат ударно-волновой терапии Gymna Shockmaster 500', services: ['spina', 'koleno', 'plecho', 'stopa', 'reabilitaciya', 'fizioterapiya'] },
  { id: 'btl', image: asset('/photos/eq-btl.jpg'), title: 'Ударно-волновая терапия', text: 'Аппарат BTL', alt: 'Аппарат ударно-волновой терапии BTL', services: ['spina', 'koleno', 'plecho', 'stopa', 'reabilitaciya', 'fizioterapiya'] },
  { id: 'press', image: asset('/photos/eq-press.jpg'), title: 'Прессотерапия', text: 'Манжеты на ноги, процедура лёжа', alt: 'Пациент на процедуре прессотерапии', services: ['reabilitaciya', 'lechebnaya-fizkultura', 'fizioterapiya'] },
  { id: 'magnet', image: asset('/photos/eq-magnet.jpg'), title: 'Магнит высокой интенсивности', text: 'Аппарат Doc Basyr с кольцевым излучателем', alt: 'Аппарат высокоинтенсивной магнитотерапии Doc Basyr', services: ['spina', 'koleno', 'plecho', 'reabilitaciya', 'fizioterapiya'] },
  { id: 'biomag', image: asset('/photos/eq-biomag.jpg'), title: 'Импульсная магнитотерапия низкой частоты', text: 'Аппликаторы Biomag — процедура лёжа на кушетке', alt: 'Аппликаторы магнитотерапии Biomag на кушетке', services: ['spina', 'reabilitaciya', 'fizioterapiya'] },
  { id: 'combo', image: asset('/photos/eq-combo.jpg'), title: 'Ультразвуковая терапия и электротерапия', text: 'Комбинированный аппарат Enraf-Nonius', alt: 'Комбинированный аппарат физиотерапии Enraf-Nonius с двумя излучателями', services: ['spina', 'koleno', 'plecho', 'reabilitaciya', 'fizioterapiya'] },
  { id: 'ems', image: asset('/photos/eq-ems.jpg'), title: 'Электромиостимуляция', text: 'Стимулятор Compex SP 4.0 и ультразвук Enraf-Nonius', alt: 'Миостимулятор Compex SP 4.0 и аппарат ультразвуковой терапии Enraf-Nonius', services: ['plecho', 'reabilitaciya', 'lechebnaya-fizkultura', 'fizioterapiya'] },
  { id: 'lab', image: asset('/photos/eq-lab.jpg'), title: 'Процедурный кабинет', text: 'Забор крови на анализы и для PRP-терапии', alt: 'Пробирки с кровью в штативе в процедурном кабинете', services: ['prp'] },
]

// Структура сайта: верхнее меню как на старом ortorecovery.ru + страницы услуг.
// Цены — прайс ПроДокторов от 19.10.2026, описания — старый сайт (выгрузка WordPress, 25.10.2026).

export type Extra = 'second' | 'twin' | 'glossary' | 'procedures' | 'prp' | 'sport' | 'after' | 'home' | 'family' | 'whole'

export type Service = {
  slug: string
  menu: string
  // problem — «что мы лечим» (жалоба пациента), method — метод лечения
  kind: 'problem' | 'method'
  kicker: string
  title: string
  lead: string
  photo: string
  photoAlt: string
  doctors: string[]
  prices: [string, string][]
  conditions: string[]
  extras: Extra[]
  chat: string
}

export const SERVICES: Service[] = [
  {
    slug: 'ortopediya',
    menu: 'Боль в суставах и травмы',
    kind: 'problem',
    kicker: 'Травматолог-ортопед',
    title: 'Лечим суставы, травмы и боль без операции',
    lead: 'Колено, плечо, кисть, стопа. Врач осмотрит, разберёт снимки и составит план лечения — цену вы узнаете до начала.',
    photo: '/photos/c-shoulder.jpg',
    photoAlt: 'Ортопед и реабилитолог работают с коленом пациента',
    doctors: ['Хаджалов Абузар Магомедович'],
    prices: [['Приём травматолога-ортопеда', 'до 3 000 ₽'], ['PRP-терапия', 'до 10 500 ₽'], ['Плазмотерапия', '4 000 ₽'], ['Гиалуроновая кислота в сустав', '3 000 ₽'], ['Блокада сустава или позвоночника', '3 000 ₽'], ['Ударно-волновая терапия', 'до 3 000 ₽'], ['Индивидуальные стельки Formthotics, взрослые / детские', '13 500 / 9 500 ₽']],
    conditions: ['knee', 'shoulder', 'foot'],
    extras: ['second', 'procedures'],
    chat: 'Здравствуйте, хочу на приём к ортопеду',
  },
  {
    slug: 'spina',
    menu: 'Боль в спине и шее',
    kind: 'problem',
    kicker: 'Невролог, мануальный терапевт',
    title: 'Боль в спине и шее, грыжи и протрузии',
    lead: 'Невролог осмотрит, разберёт МРТ и подберёт лечение. Программу подбираем под ваш образ жизни.',
    photo: '/photos/c-back.jpg',
    photoAlt: 'Врач центра осматривает спину пациента',
    doctors: ['Куделя Павел Александрович'],
    prices: [['Приём невролога', 'от 8 000 ₽'], ['Ударно-волновая терапия', 'до 3 000 ₽'], ['Лечебная физкультура', 'от 2 000 ₽'], ['Массаж всех видов', 'от 1 600 ₽'], ['Блокада позвоночника', '3 000 ₽']],
    conditions: ['spine'],
    extras: ['twin', 'second'],
    chat: 'Здравствуйте, болит спина, хочу к неврологу',
  },
  {
    slug: 'reabilitaciya',
    menu: 'Восстановление после травм и операций',
    kind: 'problem',
    kicker: 'Реабилитолог, лечебная физкультура',
    title: 'Восстановление после травм и операций',
    lead: 'Лечебная физкультура под контролем врача: нагрузка растёт постепенно, а дома вы занимаетесь по плану, который мы составим.',
    photo: '/photos/g-lfk.jpg',
    photoAlt: 'Зал лечебной физкультуры центра',
    doctors: ['Мусаева Эльмира Ашурбеговна', 'Магомедов Муслим Абдулла-Гаджиевич'],
    prices: [['Лечебная физкультура', 'от 2 000 ₽'], ['Реабилитолог', 'от 2 500 ₽'], ['Выезд врача на дом', '4 000 ₽'], ['Разработка кисти после операции', '3 000 ₽'], ['Массаж всех видов', 'от 1 600 ₽'], ['Кинезиотейпирование', 'от 1 000 ₽']],
    conditions: ['lfk', 'knee', 'shoulder'],
    extras: ['after', 'sport', 'home'],
    chat: 'Здравствуйте, нужна реабилитация после травмы',
  },
  {
    slug: 'fizioterapiya',
    menu: 'Физиотерапия',
    kind: 'method',
    kicker: 'Физиотерапия',
    title: 'Аппаратная физиотерапия в одном центре',
    lead: 'Ударно-волновая терапия, магнит с лазером, электромиостимуляция, прессотерапия. Процедуры назначает врач — по показаниям.',
    photo: '/photos/g-magnet.jpg',
    photoAlt: 'Аппаратная физиотерапия в кабинете центра',
    doctors: ['Хаджалов Абузар Магомедович', 'Куделя Павел Александрович'],
    prices: [['Ударно-волновая терапия', 'до 3 000 ₽'], ['Магнит высокой интенсивности + лазер', 'до 2 000 ₽'], ['Электромиостимуляция', 'до 1 500 ₽'], ['Прессотерапия', 'до 1 500 ₽'], ['Кинезиотейпирование', 'от 1 000 ₽'], ['Магнит низкой частоты', 'до 800 ₽']],
    conditions: [],
    extras: ['procedures', 'glossary'],
    chat: 'Здравствуйте, интересует физиотерапия',
  },
  {
    slug: 'prp',
    menu: 'PRP-терапия',
    kind: 'method',
    kicker: 'PRP-терапия',
    title: 'PRP: лечение плазмой собственной крови',
    lead: 'Плазму, обогащённую тромбоцитами, вводят в сустав или зону повреждения. Процедуру проводит врач-ортопед под местной анестезией.',
    photo: '/photos/eq-lab.jpg',
    photoAlt: 'Пробирки с кровью в процедурном кабинете центра',
    doctors: ['Хаджалов Абузар Магомедович'],
    prices: [['PRP-терапия', 'до 10 500 ₽'], ['Плазмотерапия', '4 000 ₽'], ['Приём травматолога-ортопеда', 'до 3 000 ₽']],
    conditions: [],
    extras: ['prp', 'second'],
    chat: 'Здравствуйте, интересует PRP-терапия сустава',
  },
  {
    slug: 'detyam',
    menu: 'Осанка и стопы у детей',
    kind: 'problem',
    kicker: 'Инструктор лечебной физкультуры',
    title: 'Осанка, стопы и занятия для детей',
    lead: 'Лечебная гимнастика при сколиозе по методу СИАС, массаж и индивидуальные стельки для детей.',
    photo: '/photos/g-explain.jpg',
    photoAlt: 'Врач центра объясняет на доске',
    doctors: ['Мусаева Эльмира Ашурбеговна', 'Магомедов Муслим Абдулла-Гаджиевич'],
    prices: [['Лечебная гимнастика по методу СИАС', 'от 2 000 ₽'], ['Массаж всех видов', 'от 1 600 ₽'], ['Индивидуальные стельки Formthotics, детские', '9 500 ₽']],
    conditions: ['lfk'],
    extras: ['family'],
    chat: 'Здравствуйте, у ребёнка сколиоз, хочу на лечебную физкультуру',
  },
]

export const NAV: { href: string; label: string; sub?: boolean }[] = [
  { href: '/', label: 'Главная' },
  { href: '/o-centre/', label: 'О центре' },
  { href: '/uslugi/', label: 'Услуги', sub: true },
  { href: '/vrachi/', label: 'Врачи' },
  { href: '/ceny/', label: 'Цены' },
  { href: '/pacientam/', label: 'Пациентам' },
  { href: '/otzyvy/', label: 'Отзывы' },
  { href: '/blog/', label: 'Блог' },
  { href: '/kontakty/', label: 'Контакты' },
]

export const PROBLEMS = SERVICES.filter((s) => s.kind === 'problem')
export const METHODS = SERVICES.filter((s) => s.kind === 'method')

// Вкладка «Услуги» в меню: только услуги с ценами от клиники (07.11.2026); href — страница направления, где о ней подробнее
export const SERVICE_MENU: { name: string; price: string; href: string }[] = [
  { name: 'Ударно-волновая терапия', price: 'до 3 000 ₽', href: '/uslugi/fizioterapiya/' },
  { name: 'Магнит высокой интенсивности + лазер', price: 'до 2 000 ₽', href: '/uslugi/fizioterapiya/' },
  { name: 'Магнит низкой частоты', price: 'до 800 ₽', href: '/uslugi/fizioterapiya/' },
  { name: 'Ультразвуковая терапия', price: 'до 800 ₽', href: '/uslugi/fizioterapiya/' },
  { name: 'Электромиостимуляция', price: 'до 1 500 ₽', href: '/uslugi/fizioterapiya/' },
  { name: 'Электротерапия', price: 'до 1 500 ₽', href: '/uslugi/fizioterapiya/' },
  { name: 'Транскраниальная электростимуляция', price: 'до 1 500 ₽', href: '/uslugi/fizioterapiya/' },
  { name: 'Прессотерапия', price: 'до 1 500 ₽', href: '/uslugi/fizioterapiya/' },
  { name: 'Электроакупунктура', price: 'до 2 500 ₽', href: '/uslugi/fizioterapiya/' },
  { name: 'Сухие иглы', price: 'до 2 500 ₽', href: '/uslugi/spina/' },
  { name: 'Лечебная физкультура', price: 'от 2 000 ₽', href: '/uslugi/reabilitaciya/' },
  { name: 'Лечебная гимнастика по методу СИАС', price: 'от 2 000 ₽', href: '/uslugi/detyam/' },
  { name: 'Массаж всех видов', price: 'от 1 600 ₽', href: '/uslugi/reabilitaciya/' },
  { name: 'Кинезиотейпирование', price: 'от 1 000 ₽', href: '/uslugi/fizioterapiya/' },
  { name: 'PRP-терапия', price: 'до 10 500 ₽', href: '/uslugi/prp/' },
  { name: 'Индивидуальные стельки Formthotics (взрослые)', price: '13 500 ₽', href: '/uslugi/ortopediya/' },
  { name: 'Индивидуальные стельки Formthotics (детские)', price: '9 500 ₽', href: '/uslugi/detyam/' },
  { name: 'Консультация травматолога-ортопеда', price: 'до 3 000 ₽', href: '/uslugi/ortopediya/' },
  { name: 'Консультация терапевта-гастроэнтеролога', price: 'до 3 000 ₽', href: '/ceny/' },
  { name: 'Консультация нутрициолога', price: 'до 4 000 ₽', href: '/ceny/' },
  { name: 'Консультация реабилитолога', price: 'от 2 500 ₽', href: '/uslugi/reabilitaciya/' },
  { name: 'Консультация психолога', price: 'до 3 000 ₽', href: '/ceny/' },
]

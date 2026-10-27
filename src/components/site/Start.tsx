'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { BorderBeam } from '@/components/ui/motion'
import { ArrowRight, RotateCcw } from 'lucide-react'
import { openChat } from '@/components/ChatWidget'
import { QUIZ, QUIZ_RESULT, type QuizArea } from '@/lib/content'

const DOORS = [
  { n: '01', title: 'Болит, и не знаю, к кому идти', text: 'Начните с консультации: врач осмотрит и скажет, что делать дальше.', cta: 'Подобрать врача', tone: 'bg-lagoon', go: '#quiz' },
  { n: '02', title: 'Восстанавливаюсь после травмы или операции', text: 'Курс восстановления: ЛФК, физиотерапия и контроль врача.', cta: 'ЛФК — 2 500 ₽', tone: 'bg-lime', go: '/uslugi/reabilitaciya/' },
  { n: '03', title: 'Я спортсмен', text: 'Спортивная реабилитация: вернуть силу и подвижность к тренировкам.', cta: 'Вернуться к спорту', tone: 'bg-coral-soft', go: '/uslugi/reabilitaciya/#sport' },
]

const SLUG: Record<QuizArea, string> = { back: 'spina', knee: 'ortopediya', arm: 'ortopediya', foot: 'ortopediya', kids: 'detyam', endo: 'endoskopiya' }

// Три двери + опрос «подобрать врача за 3 вопроса»
export function Start() {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const step = Object.keys(answers).length
  const done = step >= QUIZ.length
  const res = done ? QUIZ_RESULT[answers.area as QuizArea] : null
  const note =
    answers.why === 'surgery' ? 'После операции врач составит план реабилитации и передаст вас инструктору ЛФК.'
    : answers.why === 'trauma' ? 'Возьмите снимки после травмы — врач разберёт их на приёме.'
    : answers.when === 'long' ? 'Боль дольше полугода — врач найдёт причину и составит курс, а не просто снимет симптом.'
    : 'Чем раньше начать, тем короче обычно восстановление.'

  return (
    <section id="start" className="scroll-mt-20 mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
      <h2 className="text-[2.1rem] font-extrabold leading-[1.05] tracking-[-0.03em] text-graphite sm:text-5xl">С чего начать</h2>
      <div data-stagger className="mt-10 grid gap-4 md:grid-cols-3">
        {DOORS.map((d) => (
          <Link
            key={d.n}
            href={d.go}
            className={`lift group flex min-h-[220px] flex-col justify-between gap-5 rounded-[28px] p-6 text-left text-deep transition hover:-translate-y-1 hover:shadow-lift ${d.tone}`}
          >
            <span className="font-mono text-sm font-bold opacity-60">{d.n}</span>
            <span>
              <span className="block text-[1.4rem] font-bold leading-tight tracking-[-0.02em]">{d.title}</span>
              <span className="mt-2 block text-[15px] leading-relaxed opacity-80">{d.text}</span>
            </span>
            <span className="flex items-center justify-between font-semibold">
              {d.cta}
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70 transition group-hover:translate-x-1"><ArrowRight size={18} /></span>
            </span>
          </Link>
        ))}
      </div>

      <div id="quiz" data-reveal className="relative mt-4 grid scroll-mt-24 gap-8 rounded-[32px] bg-deep p-6 text-white sm:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <BorderBeam />
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neon">3 вопроса — 30 секунд</p>
          <p className="mt-3 text-[1.75rem] font-bold leading-tight tracking-[-0.02em]">Подберём врача и скажем цену приёма</p>
          <p className="mt-3 text-white/75">Ответьте на три вопроса — покажем, к кому записаться и сколько это стоит.</p>
        </div>
        <div aria-live="polite">
          <div className="mb-4 flex gap-1.5" aria-hidden>
            {QUIZ.map((_, i) => <span key={i} className={`h-1.5 flex-1 rounded-full transition ${i <= Math.min(step, QUIZ.length - 1) ? 'bg-lime' : 'bg-white/15'}`} />)}
          </div>
          <AnimatePresence mode="wait" initial={false}>
          {!done && (
            <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.25 }}>
              <p className="mb-3 text-lg font-semibold">{QUIZ[step].q}</p>
              <div className="flex flex-wrap gap-2">
                {QUIZ[step].options.map(([v, l]) => (
                  <button key={v} type="button" onClick={() => setAnswers((a) => ({ ...a, [QUIZ[step].key]: v }))} className="rounded-2xl border border-white/25 bg-white/5 px-4 py-3 text-[15px] transition hover:border-neon hover:bg-neon/15">
                    {l}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
          {res && (
            <motion.div key="res" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 22 }}>
              <div className="rounded-[22px] bg-white p-5 text-graphite">
                <p className="text-lg font-semibold text-deep">{res.doctor}</p>
                <p className="text-sm text-teal">{res.role}</p>
                <p className="mt-3 text-[15px] leading-relaxed text-graphite/70"><b className="text-deep">{res.title}.</b> {note}</p>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-2xl font-extrabold text-deep">{res.price} <span className="text-sm font-medium text-graphite/55">{res.priceNote}</span></span>
                  <span className="flex flex-wrap gap-2">
                    <Link href={`/uslugi/${SLUG[answers.area as QuizArea]}/`} className="flex h-12 items-center rounded-full border border-deep/20 px-5 font-semibold text-deep">Об услуге</Link>
                    <button type="button" onClick={() => openChat(res.chat)} className="h-12 rounded-full bg-deep px-6 font-semibold text-white transition hover:bg-black">Записаться</button>
                  </span>
                </div>
              </div>
              <button type="button" onClick={() => setAnswers({})} className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-neon"><RotateCcw size={14} /> Пройти заново</button>
            </motion.div>
          )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

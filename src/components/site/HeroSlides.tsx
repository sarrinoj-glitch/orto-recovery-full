'use client'

import { useEffect, useRef, useState } from 'react'
import { asset } from '@/lib/asset'

// Слайд-шоу первого экрана: фото центра плавно сменяются каждые 6 секунд, кадр медленно «отъезжает».
// Грузится первое фото (с высоким приоритетом) и следующее; остальные — по мере показа.
// На телефоне — версия 960 px, на компьютере — 1920 px. При «уменьшить движение» слайды не листаются.
const SLIDES = [
  { src: 'hero-1', alt: 'Врач проводит ударно-волновую терапию стопы', pos: 'object-[62%_50%]' },
  { src: 'hero-2', alt: 'Процедура магнитотерапии спины', pos: 'object-[70%_50%]' },
  { src: 'hero-3', alt: 'Врачи центра разбирают рентгеновский снимок', pos: 'object-[65%_40%]' },
  { src: 'hero-4', alt: 'Врачи осматривают спину пациента', pos: 'object-[60%_50%]' },
  { src: 'hero-5', alt: 'Ударно-волновая терапия плеча', pos: 'object-[60%_40%]' },
  { src: 'hero-6', alt: 'Лечебный массаж спины', pos: 'object-[60%_50%]' },
  { src: 'hero-7', alt: 'Специалисты центра обсуждают план лечения', pos: 'object-[60%_40%]' },
]
const DELAY = 6000

export function HeroSlides({ className }: { className: string }) {
  const [cur, setCur] = useState(0)
  const [mounted, setMounted] = useState(2)
  const timer = useRef<ReturnType<typeof setInterval> | undefined>(undefined)

  const restart = () => {
    clearInterval(timer.current)
    if (document.hidden || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    timer.current = setInterval(() => setCur((x) => (x + 1) % SLIDES.length), DELAY)
  }

  useEffect(() => {
    restart()
    document.addEventListener('visibilitychange', restart)
    return () => { clearInterval(timer.current); document.removeEventListener('visibilitychange', restart) }
  }, [])

  // держим смонтированным текущий слайд и следующий, чтобы смена шла без пустого кадра
  useEffect(() => { setMounted((n) => Math.max(n, Math.min(SLIDES.length, cur + 2))) }, [cur])

  const go = (k: number) => { setCur(k); restart() }

  return (
    <>
      <div className={className}>
        {SLIDES.slice(0, mounted).map((s, k) => (
          <img
            key={s.src}
            src={asset(`/photos/${s.src}.jpg`)}
            srcSet={`${asset(`/photos/${s.src}-m.jpg`)} 960w, ${asset(`/photos/${s.src}.jpg`)} 1920w`}
            sizes="100vw"
            alt={k === cur ? s.alt : ''}
            aria-hidden={k !== cur}
            fetchPriority={k === 0 ? 'high' : 'low'}
            decoding="async"
            className={`absolute inset-0 h-full w-full object-cover [transition:opacity_1.4s_ease,transform_7s_linear] ${s.pos} ${k === cur ? 'scale-100 opacity-100' : 'scale-[1.06] opacity-0'}`}
          />
        ))}
      </div>
      <div className="absolute bottom-24 right-6 z-10 hidden gap-2 sm:flex" role="group" aria-label="Фото центра">
        {SLIDES.map((s, k) => (
          <button
            key={s.src}
            type="button"
            onClick={() => go(k)}
            aria-label={`Фото ${k + 1} из ${SLIDES.length}`}
            aria-current={k === cur}
            className={`h-2 rounded-full transition-all duration-300 ${k === cur ? 'w-7 bg-white' : 'w-2 bg-white/45 hover:bg-white/80'}`}
          />
        ))}
      </div>
    </>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { Eye } from 'lucide-react'

// Версия для слабовидящих: крупнее текст, выше контраст, без анимаций. Выбор запоминается в браузере
export function A11yToggle({ className = '', withLabel = false }: { className?: string; withLabel?: boolean }) {
  const [on, setOn] = useState(false)
  useEffect(() => {
    let saved = false
    try { saved = localStorage.getItem('a11y') === '1' } catch {}
    setOn(saved)
    document.documentElement.classList.toggle('a11y', saved)
  }, [])
  const toggle = () => {
    const next = !on
    setOn(next)
    document.documentElement.classList.toggle('a11y', next)
    try { localStorage.setItem('a11y', next ? '1' : '0') } catch {}
  }
  const label = on ? 'Обычная версия сайта' : 'Версия для слабовидящих'
  return (
    <button type="button" onClick={toggle} aria-pressed={on} aria-label={label} title={label} className={className}>
      <Eye size={18} aria-hidden />
      {withLabel && <span>{label}</span>}
    </button>
  )
}

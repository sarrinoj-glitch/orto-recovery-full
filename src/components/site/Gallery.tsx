'use client'

import { useRef, useState, type PointerEvent as RPointerEvent } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import HoverExpand from '@/components/ui/hover-expand'
import { PHOTOS } from '@/lib/clinic'

// Ряд шире экрана: на компьютере листается стрелками, перетаскиванием мышью и тачпадом
export function Gallery() {
  const track = useRef<HTMLDivElement>(null)
  const drag = useRef({ on: false, x: 0, left: 0, moved: false })
  const [edge, setEdge] = useState({ start: true, end: false })
  const onScroll = () => {
    const el = track.current
    if (el) setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 })
  }
  const step = (dir: number) => track.current?.scrollBy({ left: dir * 480, behavior: 'smooth' })
  const down = (e: RPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || !track.current) return
    drag.current = { on: true, x: e.clientX, left: track.current.scrollLeft, moved: false }
  }
  const move = (e: RPointerEvent<HTMLDivElement>) => {
    const el = track.current
    if (!drag.current.on || !el) return
    const dx = e.clientX - drag.current.x
    if (!drag.current.moved && Math.abs(dx) > 6) {
      drag.current.moved = true
      el.setPointerCapture(e.pointerId)
    }
    if (drag.current.moved) el.scrollLeft = drag.current.left - dx
  }
  const up = () => { drag.current.on = false }
  return (
    <section id="tour" className="scroll-mt-20 mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="text-[1.75rem] font-bold tracking-[-0.02em] text-graphite sm:text-[2rem]">Пройдите по центру, пока не пришли</h2>
        <div className="flex items-center gap-5">
          <p className="text-[15px] text-graphite/55">Фото и видео центра</p>
          <div className="hidden gap-2.5 md:flex">
            <button type="button" aria-label="Предыдущие фото" onClick={() => step(-1)} disabled={edge.start} className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-deep shadow-soft ring-1 ring-graphite/5 transition hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0"><ArrowLeft size={20} /></button>
            <button type="button" aria-label="Следующие фото" onClick={() => step(1)} disabled={edge.end} className="flex h-12 w-12 items-center justify-center rounded-full bg-lime text-graphite shadow-soft transition hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0"><ArrowRight size={20} /></button>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <div className="hidden cursor-grab active:cursor-grabbing md:block" onScroll={onScroll} onScrollCapture={onScroll} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}
          onClickCapture={(e) => { if (drag.current.moved) { e.preventDefault(); e.stopPropagation(); drag.current.moved = false } }}>
          <HoverExpand items={PHOTOS} orientation="horizontal" showLabelsWhenCollapsed={false} scrollable trackRef={track} className="h-[440px]" />
        </div>
        <HoverExpand items={PHOTOS} orientation="vertical" showLabelsWhenCollapsed={false} className="h-[960px] md:hidden" />
      </div>
    </section>
  )
}

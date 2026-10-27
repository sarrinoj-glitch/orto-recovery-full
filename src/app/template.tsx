'use client'

import { motion } from 'framer-motion'

// Плавный переход между страницами. Только прозрачность: transform/filter на обёртке
// сломали бы position: fixed у окон врачей внутри страницы.
export default function Template({ children }: { children: React.ReactNode }) {
  return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>
}

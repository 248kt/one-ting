import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ThemeToggle() {
  const [dark, setDark] = useState(false)
  const [pulseKey, setPulseKey] = useState(0)

  useEffect(() => {
    const stored = localStorage.getItem('theme-dark')
    const initial = stored === '1'
    setDark(initial)
    document.documentElement.classList.toggle('dark', initial)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme-dark', dark ? '1' : '0')
  }, [dark])

  const onToggle = () => {
    setDark(d => !d)
    setPulseKey(k => k + 1)
  }

  return (
    <>
      <button
        aria-label="Toggle theme"
        onClick={onToggle}
        className="relative inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/10 px-3 py-1 text-sm hover:shadow-soft focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
      >
        <motion.span
          key={dark ? 'moon' : 'sun'}
          initial={{ rotate: -90, scale: 0.85, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 90, scale: 0.85, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="inline-block w-5 h-5 rounded-full bg-neutral-900 dark:bg-neutral-100"
        />
        <span className="hidden sm:block">{dark ? 'Dark' : 'Light'}</span>
      </button>

      {/* Subtle full-screen pulse */}
      <AnimatePresence>
        <motion.div
          key={pulseKey}
          initial={{ opacity: 0 }}
          animate={{ opacity: dark ? 0.12 : 0.25 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28 }}
          className={`fixed inset-0 pointer-events-none ${dark ? 'bg-black' : 'bg-white'}`}
        />
      </AnimatePresence>
    </>
  )
}
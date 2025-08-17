import { motion } from 'framer-motion'

type Props = {
  checked: boolean
  onChange: (v: boolean) => void
  label?: string
}
export default function Toggle({ checked, onChange, label }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="group inline-flex items-center gap-2 select-none focus:outline-none"
    >
      {label && <span className="text-sm text-neutral-700 dark:text-neutral-300">{label}</span>}
      <span
        className={`relative inline-block w-10 h-6 rounded-full border transition-colors duration-200
          ${checked
            ? 'bg-neutral-900 dark:bg-white border-black/30 dark:border-white/30'
            : 'bg-neutral-300 dark:bg-white/25 border-black/20 dark:border-white/20'}`}
      >
        <motion.span
          layout={false}
          animate={{ x: checked ? 16 : 0 }}
          transition={{ type: 'spring', stiffness: 600, damping: 35 }}
          className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white dark:bg-white shadow-soft border border-black/10 dark:border-white/30"
        />
      </span>
    </button>
  )
}
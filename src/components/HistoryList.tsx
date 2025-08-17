import { useMemo } from 'react'

export type HistoryItem = {
  task: string
  minutes: number
  finishedAt: string // ISO date
}

export default function HistoryList({
  history,
  onClear,
}:{
  history: HistoryItem[]
  onClear: () => void
}){
  const grouped = useMemo(() => {
    // Group by date (YYYY-MM-DD) for subtle headers
    const by: Record<string, HistoryItem[]> = {}
    for (const h of history){
      const day = h.finishedAt.slice(0,10)
      by[day] ||= []
      by[day].push(h)
    }
    // newest first by default
    return Object.entries(by).sort((a,b)=> b[0].localeCompare(a[0]))
  }, [history])

  if (!history.length){
    return <div className="text-sm text-neutral-500 dark:text-neutral-400">No sessions yet — your log will appear here.</div>
  }

  return (
    <div className="relative rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur p-2">
      <div className="mask-fade max-h-56 overflow-y-auto pr-1">
        <ul className="divide-y divide-black/5 dark:divide-white/5">
          {grouped.map(([day, items]) => (
            <li key={day} className="py-2">
              <div className="text-xs uppercase tracking-wide opacity-60 px-2 mb-1">
                {new Date(day).toLocaleDateString()}
              </div>
              <ul className="space-y-1">
                {items.map((h, i) => (
                  <li key={day + i} className="px-2 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition">
                    <div className="flex items-center gap-3">
                      <div className="shrink-0 w-2 h-2 rounded-full bg-neutral-900 dark:bg-white" />
                      <div className="flex-1 min-w-0">
                        <div className="truncate text-sm font-medium">{h.task || 'Untitled task'}</div>
                        <div className="text-xs opacity-60">{new Date(h.finishedAt).toLocaleTimeString()}</div>
                      </div>
                      <div className="text-xs opacity-70">{h.minutes}m</div>
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={onClear}
          className="text-xs underline opacity-70 hover:opacity-100"
        >
          Clear
        </button>
      </div>
    </div>
  )
}
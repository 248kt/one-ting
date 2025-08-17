import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import ThemeToggle from './components/ThemeToggle'
import Logo from './components/Logo'
import { formatTime } from './lib/time'
import HistoryList from './components/HistoryList'
import { chime, beep } from './lib/sound'type Status = 'idle' | 'running' | 'completed' | 'stopped'

type HistoryItem = {
  task: string
  minutes: number
  finishedAt: string // ISO date
}

const HISTORY_KEY = 'focus_history_v1'

function loadHistory(): HistoryItem[] {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]') } catch { return [] }
}
function saveHistory(items: HistoryItem[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(items))
}

function calcStreak(items: HistoryItem[]): number {
  const set = new Set(items.map(i => i.finishedAt.slice(0,10)))
  let streak = 0
  const today = new Date()
  for (let i = 0; i < 3650; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const key = d.toISOString().slice(0,10)
    if (set.has(key)) streak++
    else break
  }
  return streak
}

export default function App() {
  const [task, setTask] = useState('')
  const [minutes, setMinutes] = useState<number>(25)
  const [status, setStatus] = useState<Status>('idle')
  const [remaining, setRemaining] = useState(25 * 60)
  const total = useMemo(() => Math.max(1, Math.min(180, Math.floor(minutes))) * 60, [minutes])
  const startedAtRef = useRef<number | null>(null)
  const tickRef = useRef<number | null>(null)

  const [history, setHistory] = useState<HistoryItem[]>(loadHistory())
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deletingAll, setDeletingAll] = useState(false)

  
  const popoutRef = useRef<Window | null>(null)

  const stopThreshold = useMemo(() => Math.max(5 * 60, Math.floor(total * 0.25)), [total])
  const elapsed = useMemo(() => total - remaining, [total, remaining])
  const stopAllowed = status === 'running' && elapsed >= stopThreshold

  useEffect(() => {
    if (status === 'running') {
      document.title = `${formatTime(remaining)} • ${task.trim() || 'One Ting'}`
    } else {
      document.title = 'One Ting'
    }
  }, [status, remaining, task])

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (status === 'running') {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [status])

  useEffect(() => {
    if (popoutRef.current && !popoutRef.current.closed) {
      const dark = document.documentElement.classList.contains('dark')
      popoutRef.current.postMessage({ type: 'timer-update', remaining: formatTime(remaining), task, dark }, '*')
    }
  }, [remaining, task])

  const openPopout = () => {
    try {
      const w = window.open('', 'one-ting-popout', 'width=240,height=120,alwaysOnTop=1')
      if (!w) return alert('Pop-out blocked. Please allow pop-ups for this site.')
      popoutRef.current = w
      w.document.write(`
        <!doctype html><html><head>
          <meta charset="utf-8"/>
          <title>Focus</title>
          <style>
            :root{font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif;}
            html,body{height:100%;margin:0}
            body{display:flex;align-items:center;justify-content:center;background:#ffffff;color:#111;transition:background .2s,color .2s}
            .dark{background:#0b0c10;color:#f5f5f5}
            .wrap{padding:8px 14px;border-radius:12px;border:1px solid rgba(0,0,0,.1)}
            .time{font-weight:800;font-size:34px;letter-spacing:-0.02em;line-height:1}
            .task{font-size:12px;opacity:.7;max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
          </style>
        </head><body><div class="wrap">
          <div class="time" id="t">00:00</motion.div>
          <div class="task" id="task"></div>
        </div>
        <script>
          function setDark(on){document.body.classList.toggle('dark',!!on)}
          window.addEventListener('message',(e)=>{
            const msg=e.data||{}
            if(msg.type==='timer-update'){
              document.getElementById('t').textContent = msg.remaining
              document.title = msg.remaining + ' • ' + (msg.task||'One Ting')
              document.getElementById('task').textContent = msg.task||''
              setDark(msg.dark)
            }
            if(msg.type==='done'){
              document.getElementById('task').textContent='Done'
              setTimeout(()=>window.close(),1200)
            }
          });
        </script>
        </body></html>
      `)
      w.document.close()
      const dark = document.documentElement.classList.contains('dark')
      w.postMessage({ type: 'timer-update', remaining: formatTime(remaining), task, dark }, '*')
    } catch (e) {
      console.error(e)
    }
  }

  const start = async () => {
    if (!task.trim()) return
    setStatus('running')
    setRemaining(total)
    startedAtRef.current = Date.now()
    if (tickRef.current) window.clearInterval(tickRef.current)
    tickRef.current = window.setInterval(() => {
      setRemaining(prev => {
        const msElapsed = Date.now() - (startedAtRef.current || Date.now())
        const newRemaining = Math.max(0, total - Math.floor(msElapsed / 1000))
        if (newRemaining <= 0) {
          window.clearInterval(tickRef.current!)
          complete()
        }
        return newRemaining
      })
    }, 250)
    chime().catch(() => {})
  }

  const complete = () => {
    setStatus('completed')
    chime().catch(() => {})
    confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } })
    confetti({ particleCount: 80, spread: 100, origin: { y: 0.7 } })
    const item: HistoryItem = { task: task.trim(), minutes: Math.floor(total/60), finishedAt: new Date().toISOString() }
    const next = [item, ...history].slice(0, 200)
    setHistory(next); saveHistory(next)
    if (popoutRef.current && !popoutRef.current.closed) {
      popoutRef.current.postMessage({ type: 'done' }, '*')
    }
  }

  const stop = () => {
    if (!stopAllowed) return
    const ok = window.confirm('Stop now? This will cancel your session.')
    if (!ok) return
    if (tickRef.current) window.clearInterval(tickRef.current)
    setStatus('stopped')
    beep(440, 100, 0.02).catch(() => {})
    if (popoutRef.current && !popoutRef.current.closed) {
      popoutRef.current.postMessage({ type: 'done' }, '*')
    }
  }

  const reset = () => {
    if (tickRef.current) window.clearInterval(tickRef.current)
    setStatus('idle')
    setRemaining(total)
  }

  useEffect(() => {
    if (status === 'idle') setRemaining(total)
  }, [total, status])

  const streak = calcStreak(history)

  const shareSummary = async () => {
    const text = `I focused ${Math.floor(total/60)} min on “${task.trim() || 'Task'}” — finished with Focus.`
    if (navigator.share) {
      try { await navigator.share({ text, title: 'Focus — One Task' }) } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(text)
        alert('Summary copied to clipboard!')
      } catch {
        alert(text)
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-5 sm:px-8 py-4">
        <div className="font-semibold tracking-tight flex items-center"><Logo />One Ting</div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-5 sm:px-8">
        <div className="w-full max-w-xl">
          
            {status === 'idle' && (
              <motion.section
                key="setup"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
                className="bg-white/70 dark:bg-white/5 backdrop-blur rounded-2xl border border-black/10 dark:border-white/10 shadow-soft p-6 sm:p-8"
              >
                <h1 className="text-2xl sm:text-3xl font-bold mb-4">One task. One timer.</h1>
                <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-6">
                  Type the single thing you’ll focus on, set a duration (max 180 min).
                  Once started, you can’t stop until at least <strong>5 minutes</strong> or <strong>25%</strong> of the session has passed.
                </p>

                <label className="block text-sm font-semibold mb-2" htmlFor="task">Task</label>
                <input
                  id="task"
                  placeholder="e.g., Read chapter 3"
                  value={task}
                  onChange={e => setTask(e.target.value)}
                  className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 mb-5"
                />

                <div className="grid grid-cols-1 gap-3 items-end mb-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2" htmlFor="minutes">Minutes</label>
                    <input
                      id="minutes"
                      type="number"
                      min={1}
                      max={180}
                      value={minutes}
                      onChange={e => setMinutes(Number(e.target.value))}
                    
                      className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
                    />
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={start}
                  disabled={!task.trim()}
                  className="w-full rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 py-3 font-semibold disabled:opacity-50"
                >
                  Start Focus
                </motion.button>
              </motion.section>
            )}

            {status === 'running' && (
              <motion.section
                key="running"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
                className="relative bg-white/70 dark:bg-white/5 backdrop-blur rounded-2xl border border-black/10 dark:border-white/10 shadow-soft p-6 sm:p-8"
              >
                <div className="text-sm text-neutral-600 dark:text-neutral-300 flex items-center justify-between"><span>Streak: <span className="font-semibold">{streak}</span> {streak === 1 ? 'day' : 'days'}</span><button onClick={() => { localStorage.removeItem('focus_history_v1'); setHistory([]); }} className="ml-3 inline-flex items-center justify-center w-8 h-8 rounded-md bg-red-500 hover:bg-red-600 text-white transition"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 6h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button></div>
            {history.length > 0 && (
              <ul className="text-sm text-neutral-700 dark:text-neutral-300 border border-black/10 dark:border-white/10 rounded-lg divide-y divide-black/5 dark:divide-white/5">
                {history.slice(0,5).map((h, i) => (
                  <li key={i} className="p-3 flex items-center justify-between">
                    <span className="truncate">{h.task || 'Untitled task'}</span>
                    <span className="opacity-70">{h.minutes}m</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section className="mt-6">
            <div className="rounded-lg border border-black/10 dark:border-white/10 p-4">
              <div className="font-semibold mb-2">Stats (last 7 days)</div>
              <Stats history={history} />
            </div>
          </section>

          <footer className="text-xs text-neutral-500 dark:text-neutral-400 text-center mt-6">
            Tip: Title shows the countdown if you switch tabs.
          </footer>
        </div>
      </main>
    </div>
  )
}

function Stats({ history }:{history: HistoryItem[]}){
  const now = new Date()
  const cutoff = new Date(now)
  cutoff.setDate(now.getDate() - 6)
  const days: Record<string,{min:number,count:number}> = {}
  for (let i=0;i<7;i++){ const d=new Date(cutoff); d.setDate(cutoff.getDate()+i); days[d.toISOString().slice(0,10)]={min:0,count:0} }
  for (const h of history){
    const day = h.finishedAt.slice(0,10)
    if (day in days){ days[day].min += h.minutes; days[day].count += 1 }
  }
  const totals = Object.values(days)
  const totalMin = totals.reduce((a,b)=>a+b.min,0)
  const totalSessions = totals.reduce((a,b)=>a+b.count,0)
  return (
    <div className="text-sm flex flex-wrap gap-4">
      <div><span className="font-semibold">{totalMin}</span> min</div>
      <div><span className="font-semibold">{totalSessions}</span> sessions</div>
    </div>
  )
}
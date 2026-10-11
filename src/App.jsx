import { useRef, useState } from 'react'
import { Plus } from 'lucide-react'
import TodoItem from './components/TodoItem'
import { FILTERS, ORDER, PRIO } from './constants'

const initialTodos = [
  { id: 1, text: 'ส่งรายงานประจำสัปดาห์', done: false, prio: 'high' },
  { id: 2, text: 'ซื้อของเข้าบ้าน', done: false, prio: 'mid' },
  { id: 3, text: 'อ่านหนังสือ 20 หน้า', done: true, prio: 'low' },
]

const EMPTY_TEXT = {
  all: 'ยังไม่มีงาน เพิ่มงานแรกของคุณด้านบนได้เลย',
  active: 'ไม่มีงานที่กำลังทำ',
  done: 'ยังไม่มีงานที่เสร็จ',
}

export default function App() {
  const [todos, setTodos] = useState(initialTodos)
  const [text, setText] = useState('')
  const [prio, setPrio] = useState('mid')
  const [filter, setFilter] = useState('all')
  const [removing, setRemoving] = useState([])
  const nextId = useRef(4)

  const add = () => {
    const v = text.trim()
    if (!v) return
    setTodos((ts) => [{ id: nextId.current++, text: v, done: false, prio }, ...ts])
    setText('')
  }

  const removeIds = (ids) => {
    setRemoving((r) => [...r, ...ids])
    setTimeout(() => {
      setTodos((ts) => ts.filter((t) => !ids.includes(t.id)))
      setRemoving((r) => r.filter((x) => !ids.includes(x)))
    }, 290)
  }

  const toggle = (id) => setTodos((ts) => ts.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  const save = (id, v) => setTodos((ts) => ts.map((t) => (t.id === id ? { ...t, text: v } : t)))
  const cycle = (id) =>
    setTodos((ts) =>
      ts.map((t) => (t.id === id ? { ...t, prio: ORDER[(ORDER.indexOf(t.prio) + 1) % ORDER.length] } : t))
    )

  const left = todos.filter((t) => !t.done).length
  const doneCount = todos.length - left
  const shown = todos.filter((t) => (filter === 'all' ? true : filter === 'active' ? !t.done : t.done))

  return (
    <main className="max-w-xl mx-auto px-4 py-8 sm:py-14">
      <div
        className="rounded-2xl p-5 sm:p-7"
        style={{
          background: 'var(--card)',
          boxShadow: '0 10px 30px -12px rgba(30,41,80,.22), 0 2px 6px rgba(30,41,80,.06)',
        }}
      >
        <h1 className="text-2xl font-bold mb-5">รายการงานของฉัน</h1>

        <div className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && add()}
            placeholder="วันนี้ต้องทำอะไรบ้าง?"
            className="flex-1 min-w-0 rounded-xl px-4 py-3 text-base outline-none"
            style={{ background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--line)' }}
          />
          <button
            onClick={add}
            aria-label="เพิ่มงาน"
            className="shrink-0 flex items-center gap-1.5 rounded-xl px-4 font-medium text-white active:scale-95 transition-transform"
            style={{ background: 'var(--accent)' }}
          >
            <Plus size={18} strokeWidth={2.5} />
            <span className="hidden sm:inline">เพิ่ม</span>
          </button>
        </div>

        <div className="flex items-center gap-2 mt-3 text-sm" style={{ color: 'var(--muted)' }}>
          <span>ความสำคัญ:</span>
          {ORDER.map((k) => (
            <button
              key={k}
              onClick={() => setPrio(k)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full transition-colors"
              style={{
                border: '1px solid ' + (prio === k ? PRIO[k].dot : 'var(--line)'),
                color: prio === k ? 'var(--text)' : 'var(--muted)',
                background: prio === k ? PRIO[k].dot + '1a' : 'transparent',
              }}
            >
              <span className="w-2 h-2 rounded-full" style={{ background: PRIO[k].dot }} />
              {PRIO[k].label}
            </button>
          ))}
        </div>

        <div className="flex gap-1 mt-6 p-1 rounded-xl" style={{ background: 'var(--bg)' }}>
          {FILTERS.map(([k, label]) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: filter === k ? 'var(--card)' : 'transparent',
                color: filter === k ? 'var(--accent)' : 'var(--muted)',
                boxShadow: filter === k ? '0 1px 3px rgba(0,0,0,.12)' : 'none',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <ul className="mt-3 list-none p-0 m-0">
          {shown.map((t) => (
            <TodoItem
              key={t.id}
              todo={t}
              removing={removing.includes(t.id)}
              onToggle={toggle}
              onDelete={(id) => removeIds([id])}
              onSave={save}
              onCycle={cycle}
            />
          ))}
        </ul>
        {shown.length === 0 && (
          <p className="text-center py-10 text-sm" style={{ color: 'var(--muted)' }}>
            {EMPTY_TEXT[filter]}
          </p>
        )}

        <div className="flex items-center justify-between mt-4 text-sm">
          <span style={{ color: 'var(--muted)' }}>เหลือ {left} งาน</span>
          <button
            onClick={() => removeIds(todos.filter((t) => t.done).map((t) => t.id))}
            disabled={doneCount === 0}
            className="px-3 py-1.5 rounded-lg font-medium transition-colors hover:bg-rose-500/10 hover:text-rose-500 disabled:opacity-40 disabled:pointer-events-none"
            style={{ color: 'var(--muted)' }}
          >
            ล้างงานที่เสร็จแล้ว ({doneCount})
          </button>
        </div>
      </div>

      <p className="text-center text-xs mt-4" style={{ color: 'var(--muted)' }}>
        ดับเบิลคลิกที่ข้อความเพื่อแก้ไข • กดป้ายความสำคัญเพื่อเปลี่ยนระดับ
      </p>
    </main>
  )
}

import { useEffect, useRef, useState } from 'react'
import { Check, Trash2 } from 'lucide-react'
import { PRIO } from '../constants'

export default function TodoItem({ todo, removing, onToggle, onDelete, onSave, onCycle }) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(todo.text)
  const inputRef = useRef(null)
  const p = PRIO[todo.prio]

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editing])

  const commit = () => {
    const v = value.trim()
    if (v) onSave(todo.id, v)
    else setValue(todo.text)
    setEditing(false)
  }

  return (
    <li
      className="row enter"
      style={{
        gridTemplateRows: removing ? '0fr' : '1fr',
        opacity: removing ? 0 : 1,
        transform: removing ? 'translateX(24px)' : 'none',
      }}
    >
      <div className="min-h-0 overflow-hidden">
        <div className="flex items-center gap-3 py-3 px-1" style={{ borderBottom: '1px solid var(--line)' }}>
          <button
            onClick={() => onToggle(todo.id)}
            aria-label={todo.done ? 'ยกเลิกเสร็จสิ้น' : 'ทำเครื่องหมายว่าเสร็จแล้ว'}
            className="shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-white transition-colors"
            style={{
              border: '2px solid ' + (todo.done ? 'var(--accent)' : 'var(--line)'),
              background: todo.done ? 'var(--accent)' : 'transparent',
            }}
          >
            {todo.done && <Check size={14} strokeWidth={3} />}
          </button>

          <div className="flex-1 min-w-0">
            {editing ? (
              <input
                ref={inputRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onBlur={commit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') commit()
                  if (e.key === 'Escape') {
                    setValue(todo.text)
                    setEditing(false)
                  }
                }}
                className="w-full rounded-md px-2 py-1 text-base outline-none"
                style={{ background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--accent)' }}
              />
            ) : (
              <span
                onDoubleClick={() => {
                  setValue(todo.text)
                  setEditing(true)
                }}
                title="ดับเบิลคลิกเพื่อแก้ไข"
                className="block break-words cursor-text select-none transition-colors"
                style={{
                  textDecoration: todo.done ? 'line-through' : 'none',
                  color: todo.done ? 'var(--muted)' : 'var(--text)',
                }}
              >
                {todo.text}
              </span>
            )}
          </div>

          <button
            onClick={() => onCycle(todo.id)}
            title="กดเพื่อเปลี่ยนความสำคัญ"
            className={'shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ' + p.chip}
          >
            {p.label}
          </button>

          <button
            onClick={() => onDelete(todo.id)}
            aria-label="ลบงาน"
            className="shrink-0 p-2 rounded-lg transition-colors hover:text-rose-500 hover:bg-rose-500/10"
            style={{ color: 'var(--muted)' }}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </li>
  )
}

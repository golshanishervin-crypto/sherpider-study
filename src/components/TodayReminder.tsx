import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Bell, X } from 'lucide-react'

const fa = (n: number) => n.toLocaleString('fa-IR')

const startOfDay = (d: Date) => {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

export default function TodayReminder({ userId }: { userId: string }) {
  const [lines, setLines] = useState<string[]>([])
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    if (!userId) return
    let alive = true

    async function load() {
      try {
        const now = new Date()
        const endToday = new Date()
        endToday.setHours(23, 59, 59, 999)
        const in2 = new Date()
        in2.setDate(in2.getDate() + 2)
        in2.setHours(23, 59, 59, 999)

        const hwReq = supabase
          .from('homework')
          .select('title,due_date')
          .eq('user_id', userId)
          .eq('status', 'pending')
          .lte('due_date', endToday.toISOString())
          .limit(5)

        const exReq = supabase
          .from('exams')
          .select('title,exam_date')
          .eq('user_id', userId)
          .gte('exam_date', now.toISOString())
          .lte('exam_date', in2.toISOString())
          .order('exam_date')
          .limit(3)

        const [hw, ex] = await Promise.all([hwReq, exReq])

        const out: string[] = []

        for (const h of hw.data ?? []) {
          const late = new Date(h.due_date) < startOfDay(now)
          out.push('📝 ' + h.title + (late ? ' (عقب‌افتاده)' : ' (مهلت امروز)'))
        }

        for (const e of ex.data ?? []) {
          const n = Math.round(
            (startOfDay(new Date(e.exam_date)).getTime() - startOfDay(now).getTime()) / 86400000
          )
          let when = fa(n) + ' روز دیگر'
          if (n === 0) when = 'امروز'
          if (n === 1) when = 'فردا'
          if (n === 2) when = 'پس‌فردا'
          out.push('🎯 ' + e.title + ' ' + when)
        }

        if (alive) setLines(out)
      } catch (err) {
        // اگر اینترنت نبود، کادر نشان داده نمی‌شود
      }
    }

    load()
    return () => {
      alive = false
    }
  }, [userId])

  if (hidden || lines.length === 0) return null

  return (
    <div className="card flex gap-3 items-start border-primary/40">
      <Bell className="text-primary shrink-0 mt-1" size={20} />
      <div className="flex-1 space-y-1">
        <p className="font-bold">یادآوری امروز</p>
        {lines.map((l, i) => (
          <p key={i} className="text-sm">
            {l}
          </p>
        ))}
      </div>
      <button
        onClick={() => setHidden(true)}
        aria-label="بستن یادآوری"
        className="p-1 opacity-60 hover:opacity-100"
      >
        <X size={18} />
      </button>
    </div>
  )
}
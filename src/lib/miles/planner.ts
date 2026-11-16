export interface ExamLite { title: string; subject?: string | null; date: string; priority?: string | null; }
export interface PlanBlock { subject: string; minutes: number }
export interface PlanDay { date: Date; label: string; blocks: PlanBlock[] }

export const toFa = (v: number | string) => String(v).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)])

export const startOfDay = (d: Date) => {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

export const daysUntil = (iso: string, now = new Date()) =>
  Math.round((startOfDay(new Date(iso)).getTime() - startOfDay(now).getTime()) / 86400000)

export const relDay = (n: number) =>
  n < 0 ? 'گذشته' : n === 0 ? 'امروز' : n === 1 ? 'فردا' : n === 2 ? 'پس‌فردا' : toFa(n) + ' روز دیگه'

export const fmtMin = (m: number) => {
  if (m < 60) return toFa(m) + ' دقیقه'
  const h = Math.floor(m / 60)
  const r = m % 60
  return r ? toFa(h) + ' ساعت و ' + toFa(r) + ' دقیقه' : toFa(h) + ' ساعت'
}

function priorityWeight(p?: string | null) {
  const x = (p ?? '').toLowerCase()
  if (['high', 'بالا', 'زیاد'].includes(x)) return 3
  if (['low', 'کم', 'پایین'].includes(x)) return 1
  return 2
}

export function buildPlan(exams: ExamLite[], minutesPerDay: number, days = 7, now = new Date()): PlanDay[] {
  const today = startOfDay(now)
  const fmt = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { weekday: 'long', month: 'long', day: 'numeric' })
  const result: PlanDay[] = []

  for (let i = 0; i < days; i++) {
    const day = new Date(today)
    day.setDate(today.getDate() + i)
    const budget = Math.max(15, Math.round((minutesPerDay * (day.getDay() === 5 ? 0.6 : 1)) / 5) * 5)
    
    const bySubject = new Map<string, number>()
    for (const e of exams) {
      const left = Math.round((startOfDay(new Date(e.date)).getTime() - day.getTime()) / 86400000)
      if (left < 1) continue
      const key = e.subject || e.title
      bySubject.set(key, (bySubject.get(key) ?? 0) + priorityWeight(e.priority) * (1 + 5 / left))
    }
    
    let items = [...bySubject.entries()].sort((a, b) => b[1] - a[1])
    while (items.length > 1) {
      const total = items.reduce((s, item) => s + item[1], 0)
      if ((budget * items[items.length - 1][1]) / total >= 15) break
      items = items.slice(0, -1)
    }
    
    const total = items.reduce((s, item) => s + item[1], 0)
    const blocks = items.map((item) => ({ 
      subject: item[0], 
      minutes: Math.max(5, Math.round((budget * item[1]) / total / 5) * 5) 
    }))
    
    const prefix = i === 0 ? 'امروز — ' : i === 1 ? 'فردا — ' : ''
    result.push({ date: day, label: prefix + fmt.format(day), blocks })
  }
  return result
}

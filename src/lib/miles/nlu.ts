import { normalize, tokens, similar } from './normalize'

export type IntentId = 'greeting' | 'howAreYou' | 'summary' | 'plan' | 'exams' | 'homework' | 'stats' | 'motivation' | 'stress' | 'startTimer' | 'addHomework' | 'tips' | 'thanks' | 'bye' | 'help'

const RAW: Record<IntentId, string[]> = {
  greeting: ['سلام', 'درود', 'های', 'hi', 'hello', 'صبح بخیر', 'عصر بخیر', 'ظهر بخیر'],
  howAreYou: ['حالت چطوره', 'چطوری', 'خوبی', 'چه خبر'],
  summary: ['وضعیت', 'خلاصه امروز', 'امروز چی دارم', 'گزارش', 'وضعیت امروز'],
  plan: ['برنامه', 'برنامه بده', 'برنامه ریزی', 'چی بخونم', 'چه چیزی بخونم', 'کل هفته', 'برنامه هفته'],
  exams: ['امتحان', 'آزمون', 'کی امتحان دارم', 'امتحانام'],
  homework: ['تکلیف', 'مشق', 'تکالیف', 'تکلیفام'],
  stats: ['آمار', 'چقدر خوندم', 'استریک', 'سطح', 'امتیاز', 'xp', 'پیشرفت'],
  motivation: ['انگیزه', 'حوصله ندارم', 'خسته شدم', 'خسته ام', 'خسته‌ام', 'نمیتونم', 'بی حوصله', 'کمکم کن', 'دلم نمیخواد', 'تنبلی', 'کسل'],
  stress: ['استرس', 'نگرانم', 'میترسم', 'اضطراب', 'ترس'],
  startTimer: ['تایمر', 'شروع کن', 'شروع مطالعه', 'پومودورو', 'بزن بریم'],
  addHomework: ['اضافه کن', 'ثبت کن', 'یادم بنداز', 'تکلیف جدید'],
  tips: ['روش مطالعه', 'چطور بخونم', 'نکته', 'ترفند', 'تمرکز', 'حواسم پرته'],
  thanks: ['مرسی', 'ممنون', 'دمت گرم', 'تشکر', 'thanks'],
  bye: ['خداحافظ', 'بای', 'فعلا', 'شب بخیر', 'برم بخوابم'],
  help: ['کمک', 'چیکار میتونی', 'چه کاری', 'راهنما', 'قابلیت'],
}

const KW = Object.fromEntries(Object.entries(RAW).map(([k, v]) => [k, v.map(normalize)])) as Record<IntentId, string[]>

export function classify(text: string): { intent: IntentId | null, score: number } {
  const norm = normalize(text)
  const compact = norm.replace(/ /g, '')
  const toks = norm.split(' ')
  const scored: [IntentId, number][] = []
  for (const id of Object.keys(KW) as IntentId[]) {
    let s = 0
    for (const kw of KW[id]) {
      const words = kw.split(' ')
      const kwCompact = kw.replace(/ /g, '')
      let k = 0
      if (words.length > 1) {
        if ((' ' + norm + ' ').includes(' ' + kw + ' ')) k = words.length * 2
        else if (kwCompact.length >= 6 && compact.includes(kwCompact)) k = words.length * 1.5
      } else if (toks.includes(kw)) k = 2
      else if (kw.length >= 5 && compact.includes(kw)) k = 1.8
      else if (kw.length > 3 && toks.some((t) => similar(t, kw))) k = 1.2
      if (k > s) s = k
    }
    if (s > 0) scored.push([id, s])
  }
  scored.sort((a, b) => b[1] - a[1])
  const top = scored[0]
  if (!top || top[1] < 1.5) return { intent: null, score: top ? top[1] : 0 }
  return { intent: top[0], score: top[1] }
}

const YES = new Set(['اره', 'بله', 'باشه', 'حتما', 'اوکی', 'ok', 'بزن', 'اهوم', 'آره'].map(normalize))
const NO = new Set(['نه', 'نخیر', 'بیخیال', 'نمیخوام', 'بعدا', 'نمی'].map(normalize))
export const isYes = (t: string) => YES.has(tokens(t)[0] ?? '')
export const isNo = (t: string) => NO.has(tokens(t)[0] ?? '')

const NUM: Record<string, number> = { یک: 1, یه: 1, دو: 2, سه: 3, چهار: 4, پنج: 5, شش: 6, هفت: 7, هشت: 8, ده: 10 }

export function extractMinutes(text: string): number | null {
  const n = normalize(text)
  if (/نیم ساعت/.test(n)) return 30
  const m = n.match(/(\d+|یک|یه|دو|سه|چهار|پنج|شش|هفت|هشت|ده)\s*(ساعت|دقیقه)/)
  if (!m) return null
  const v = /\d/.test(m[1]) ? Number(m[1]) : NUM[m[1]]
  const mins = m[2] === 'ساعت' ? v * 60 : v
  return mins > 0 && mins <= 600 ? mins : null
}

export function looseMinutes(text: string): number | null {
  const e = extractMinutes(text)
  if (e) return e
  const m = normalize(text).match(/\d+/)
  if (!m) return null
  const v = Number(m[0])
  return v <= 12 ? v * 60 : v
}

export function extractDayOffset(text: string): number | null {
  const n = normalize(text)
  if (/پس ?فردا/.test(n)) return 2
  if (/فردا/.test(n)) return 1
  if (/امروز/.test(n)) return 0
  return null
}
export function extractSubject(text: string, subjects: string[]): string | null {
  const toks = tokens(text)
  let best: string | null = null
  let bestHits = 0
  for (const s of subjects) {
    const hits = tokens(s).filter((w) => w.length > 2 && toks.some((t) => similar(t, w))).length
    if (hits > bestHits) { bestHits = hits; best = s; }
  }
  return best
}

const STOP = new Set(['اضافه', 'کن', 'ثبت', 'یادم', 'بنداز', 'تکلیف', 'تکالیف', 'جدید', 'رو', 'را', 'لطفا', 'میخوام', 'می', 'خوام', 'امروز', 'فردا', 'پس'].map(normalize))

export function extractTitle(text: string): string {
  return text.split(/\s+/).filter((w) => !STOP.has(normalize(w))).join(' ').replace(/[،,.!؟?]/g, '').trim()
}

import { classify, extractMinutes, extractSubject, extractTitle, extractDayOffset, looseMinutes, isYes, isNo } from './nlu'
import { buildPlan, daysUntil, relDay, toFa, startOfDay, fmtMin } from './planner'
import type { ExamLite } from './planner'

export interface HomeworkLite { id: string; title: string; subject?: string | null; due_date?: string | null }
export interface MilesData { homework: HomeworkLite[]; exams: ExamLite[]; todayMinutes: number; streak: number; xp: number; }
export interface MilesDeps { userName: string; subjects: string[]; getData(): Promise<MilesData>; actions: { navigate(page: string): void; startTimer(minutes: number, subject: string | null): void; addHomework(title: string, subject: string | null, due: Date | null): Promise<void>; } }
export interface MilesReply { text: string; quickReplies: string[] }

type Awaiting = 'planMinutes' | 'hwTitle' | 'confirmAdd' | null
interface Pending { title: string; subject: string | null; due: Date | null }

const MAIN = ['وضعیت امروز', 'برنامه بده', 'امتحان‌هام', 'انگیزه می‌خوام']
const TIPS = ['قانون ۵۰/۱۰: ۵۰ دقیقه مطالعه، ۱۰ دقیقه استراحت واقعی (بدون گوشی) ⏱', 'به‌جای دوباره‌خوانی، از خودت سؤال بپرس. یادآوری فعال اثرش چندبرابره 🧠', 'سخت‌ترین درس رو اول وقت بخون؛ مغزت تازه‌تره 💪', 'گوشی رو توی اتاق دیگه بذار؛ فقط دیدنش تمرکزت رو کم می‌کنه 📵', 'هر درس رو ۱، ۳ و ۷ روز بعد مرور کن (مرور فاصله‌دار) 🔁', 'آخر هر جلسه ۲ دقیقه بنویس: امروز چی یاد گرفتم؟ ✍️', 'بین جلسه‌ها آب بخور و ۵ دقیقه راه برو 🚶']

export function createMiles(deps: MilesDeps) {
  const name = deps.userName || 'دوست من'
  const ctx = { awaiting: null as Awaiting, pending: null as Pending | null, minutesPerDay: null as number | null, tired: 0, unknown: 0, recent: [] as string[] }
  const R = (text: string, quickReplies: string[] = MAIN): MilesReply => ({ text, quickReplies })
  
  const pick = (arr: string[]) => { 
    const fresh = arr.filter((a) => !ctx.recent.includes(a))
    const pool = fresh.length ? fresh : arr
    const r = pool[Math.floor(Math.random() * pool.length)]
    ctx.recent = [...ctx.recent.slice(-4), r]
    return r
  }
  
  const greet = () => { 
    const h = new Date().getHours()
    return h < 12 ? 'صبح بخیر' : h < 17 ? 'ظهر بخیر' : h < 20 ? 'عصر بخیر' : 'شب بخیر'
  }
  
  const load = async () => { try { return await deps.getData() } catch { return null } }
  const offline = () => R('الان نتونستم به سرور وصل بشم 🌐 اینترنتت رو چک کن و دوباره بپرس.', ['وضعیت امروز'])

  function askConfirm(raw: string): MilesReply {
    const title = extractTitle(raw)
    if (!title) { ctx.awaiting = 'hwTitle'; return R('اسم تکلیف چیه؟', ['بیخیال']) }
    
    const off = extractDayOffset(raw)
    let due: Date | null = null
    if (off !== null) { 
      due = startOfDay(new Date())
      due.setDate(due.getDate() + off)
      due.setHours(23, 59, 0, 0) 
    }
    
    const subject = extractSubject(raw, deps.subjects)
    ctx.pending = { title, subject, due }
    ctx.awaiting = 'confirmAdd'
    
    let confirmMsg = "«" + title + "»"
    if (subject && !title.includes(subject)) confirmMsg += " (" + subject + ")"
    if (off !== null) confirmMsg += " برای " + relDay(off)
    confirmMsg += " رو ثبت کنم؟"
    
    return R(confirmMsg, ['آره ثبت کن', 'نه'])
  }

  async function planReply(full: boolean): Promise<MilesReply> {
    const d = await load()
    if (!d) return offline()
    
    const upcoming = d.exams.filter((e) => daysUntil(e.date) >= 1)
    if (!upcoming.length) return R('امتحان آینده‌ای ثبت نشده، پس چیزی برای چیدن نیست. اول امتحان‌هات رو توی بخش امتحانات اضافه کن 📚', ['امتحان‌هام', 'وضعیت امروز'])
    
    const perDay = ctx.minutesPerDay ?? 120
    const plan = buildPlan(upcoming, perDay, 7)
    const shown = full ? plan : plan.slice(0, 3)
    
    const lines = shown.map((p) => {
let dayText = "📅 " + p.label + "\n"
      if (p.blocks.length) {
        dayText += p.blocks.map((b) => "  • " + b.subject + ": " + fmtMin(b.minutes)).join('\n')
      } else {
        dayText += "  استراحت 😌"
      }
      return dayText
    })
    
    return R("برنامه‌ات با روزی " + fmtMin(perDay) + ":\n\n" + lines.join('\n\n'), full ? ['تایمر شروع کن', 'وضعیت امروز'] : ['کل هفته', 'تایمر شروع کن', 'وضعیت امروز'])
  }

  async function reply(input: string): Promise<MilesReply> {
    const text = input.trim()
    
    if (ctx.awaiting === 'planMinutes') {
      ctx.awaiting = null
      const m = looseMinutes(text)
      if (m) { ctx.minutesPerDay = m; return planReply(false) }
    } else if (ctx.awaiting === 'hwTitle') {
      ctx.awaiting = null
      if (isNo(text)) return R('باشه، بیخیال 👌')
      return askConfirm(text)
    } else if (ctx.awaiting === 'confirmAdd' && ctx.pending) {
      const p = ctx.pending
      ctx.awaiting = null; ctx.pending = null
      if (isYes(text)) {
        try { 
          await deps.actions.addHomework(p.title, p.subject, p.due)
          return R('ثبت شد ✅ موفق باشی!', ['تکلیف‌هام', 'وضعیت امروز']) 
        } catch { 
          return R('ثبت نشد 😕 اینترنتت رو چک کن و دوباره امتحان کن.') 
        }
      }
      if (isNo(text)) return R('باشه، ثبتش نکردم 👌')
    }

    const { intent } = classify(text)
    if (intent) ctx.unknown = 0

    switch (intent) {
      case 'greeting': return R(greet() + " " + name + "! 🕷️ چیکار کنیم امروز؟")
      case 'howAreYou': return R(pick(['من عالیم! آماده‌ام کمکت کنم 💪', 'خوبم، تو چطوری؟ بریم سراغ درس‌ها؟']))
      case 'thanks': return R(pick(['قابلی نداشت 💛', 'خواهش می‌کنم! هر وقت خواستی هستم 🕷️']))
      case 'bye': return R('به امید دیدار! یادت نره استراحت کنی 🌙', [])
      case 'help': return R('این کارها رو بلدم:\n• خلاصه وضعیت امروز\n• چیدن برنامه مطالعه بر اساس امتحان‌ها\n• شروع تایمر («۲۵ دقیقه ریاضی شروع کن»)\n• ثبت تکلیف («تکلیف ریاضی فردا رو اضافه کن»)\n• آمار، سطح و استریک\n• انگیزه و نکته‌های مطالعه')
      case 'tips': { 
        const h = new Date().getHours()
        const sleepy = h >= 23 || h < 5
        return R(sleepy ? 'خواب کافی از ساعت‌های اضافه مطالعه مهم‌تره؛ حافظه موقع خواب تثبیت می‌شه 😴' : pick(TIPS), ['نکته دیگه', 'برنامه بده']) 
      }
      case 'stress': return R('استرس قبل امتحان طبیعیه 💛 یه تمرین سریع: ۴ ثانیه دم، ۴ ثانیه نگه‌دار، ۶ ثانیه بازدم؛ ۵ بار تکرار کن. بعدش یه کار کوچیک بردار، مثلاً مرور یه صفحه.', ['برنامه بده', 'نکته مطالعه', 'وضعیت امروز'])
      case 'motivation': {
        ctx.tired++
        if (ctx.tired >= 3) return R('چند بار گفتی خسته‌ای. این حس طبیعیه، ولی اگه چند روزه ادامه داره با یه نفر که بهش اعتماد داری (خانواده، دوست، مشاور مدرسه) حرف بزن. فعلاً یه استراحت ۱۰ دقیقه‌ای بدون گوشی بده 💛', ['نکته مطالعه', 'بعداً'])
        return R(pick(['می‌فهمم 💛 فقط ۵ دقیقه شروع کنیم؟ شروع از همه‌چیز سخت‌تره، بعدش راحت‌تر می‌شه.', 'هیچ اشکالی نداره. یه هدف خیلی کوچیک: فقط یه صفحه. بزنیم؟']), ['۵ دقیقه شروع کن', 'نکته مطالعه', 'بعداً'])
      }
      case 'startTimer': {
        const minutes = extractMinutes(text) ?? 25
        const subject = extractSubject(text, deps.subjects)
        deps.actions.startTimer(minutes, subject)
        return R("شروع شد! " + fmtMin(minutes) + (subject ? " برای " + subject : "") + " ⏱ گوشی رو بذار کنار، من اینجام.", ['وضعیت امروز'])
      }
      case 'addHomework': return askConfirm(text)
      case 'plan': {
        const full = /هفته|کل|کامل/.test(text)
        if (ctx.minutesPerDay === null) { ctx.awaiting = 'planMinutes'; return R('روزی چقدر وقت برای درس داری؟', ['۱ ساعت', '۲ ساعت', '۳ ساعت', '۴ ساعت']) }
        return planReply(full)
      }
      case 'exams': { 
        const d = await load()
        if (!d) return offline()
        const list = d.exams.filter((e) => daysUntil(e.date) >= 0).slice(0, 4)
if (!list.length) return R('امتحان آینده‌ای ثبت نشده 🎉', ['برنامه بده'])
        return R('امتحان‌های پیش‌رو:\n' + list.map((e) => "🎯 " + e.title + ": " + relDay(daysUntil(e.date))).join('\n'), ['برنامه بده', 'تایمر شروع کن']) 
      }
      case 'homework': { 
        const d = await load()
        if (!d) return offline()
        if (!d.homework.length) return R('تکلیف بازی نداری، آفرین! 🎉')
        const lines = d.homework.slice(0, 4).map((h) => "📝 " + h.title + (h.due_date ? " (" + relDay(daysUntil(h.due_date)) + ")" : ""))
        return R(toFa(d.homework.length) + " تکلیف باز داری:\n" + lines.join('\n'), ['برنامه بده', 'تایمر شروع کن']) 
      }
      case 'stats': { 
        const d = await load()
        if (!d) return offline()
        const level = Math.floor(d.xp / 500) + 1
        const filled = Math.round(((d.xp % 500) / 500) * 10)
        return R("⭐ سطح " + toFa(level) + "\n" + '▰'.repeat(filled) + '▱'.repeat(10 - filled) + " " + toFa(d.xp % 500) + "/۵۰۰ XP\n🔥 استریک: " + toFa(d.streak) + " روز\n⏱ امروز: " + fmtMin(d.todayMinutes), ['وضعیت امروز', 'تایمر شروع کن']) 
      }
      case 'summary': {
        const d = await load()
        if (!d) return offline()
        const nextExam = d.exams.map((e) => ({ e, n: daysUntil(e.date) })).filter((x) => x.n >= 0).sort((a, b) => a.n - b.n)[0]
        const out = [greet() + " " + name + "!"]
        out.push(d.todayMinutes > 0 ? "⏱ امروز " + fmtMin(d.todayMinutes) + " مطالعه کردی" : '⏱ هنوز مطالعه‌ای ثبت نشده')
        if (d.streak > 0) out.push("🔥 استریک " + toFa(d.streak) + " روزه")
        if (d.homework.length) out.push("📝 " + toFa(d.homework.length) + " تکلیف باز: " + d.homework.slice(0, 2).map((h) => h.title).join('، '))
        if (nextExam) out.push("🎯 " + nextExam.e.title + " " + relDay(nextExam.n))
        out.push(d.todayMinutes === 0 ? 'یه جلسه ۲۵ دقیقه‌ای شروع کنیم؟' : 'ادامه بدیم؟ 💪')
        return R(out.join('\n'), nextExam && nextExam.n <= 7 ? ['برنامه بده', 'تایمر شروع کن'] : ['تایمر شروع کن', 'برنامه بده'])
      }
      default: {
        if (isNo(text)) return R('باشه 👌 هر وقت خواستی بگو.')
        const subject = extractSubject(text, deps.subjects)
        if (subject) return R("درباره " + subject + " چیکار کنم؟", ["تایمر " + subject, 'برنامه بده'])
        ctx.unknown++
        if (ctx.unknown >= 2) { ctx.unknown = 0; return reply('کمک') }
        return R(pick(['متوجه نشدم 🤔 می‌تونی یه جور دیگه بگی؟', 'این رو نفهمیدم؛ از دکمه‌های پایین استفاده کن 👇']))
      }
    }
  }

  async function proactive(): Promise<MilesReply | null> {
    const d = await load()
    if (!d) return null
    const h = new Date().getHours()
    const soon = d.exams.map((e) => ({ e, n: daysUntil(e.date) })).filter((x) => x.n >= 0 && x.n <= 2).sort((a, b) => a.n - b.n)[0]
    if (soon) return R(name + "، " + soon.e.title + " " + relDay(soon.n) + " هست! برنامه مرور بچینم؟", ['برنامه بده', 'تایمر شروع کن'])
    if (d.streak > 0 && d.todayMinutes === 0 && h >= 20) return R("🔥 استریک " + toFa(d.streak) + " روزه‌ات در خطره! ۱۵ دقیقه کافیه.", ['۱۵ دقیقه شروع کن', 'بعداً'])
    if (d.todayMinutes === 0 && h >= 17) return R('امروز هنوز درس نخوندی. یه جلسه کوتاه؟', ['۲۵ دقیقه شروع کن', 'بعداً'])
    return null
  }

  return { reply, proactive }
}
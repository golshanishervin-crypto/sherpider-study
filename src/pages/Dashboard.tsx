import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { BookOpen, Calendar, Clock, ChevronLeft, User, Loader2, Flame, Target, Award, Pencil, Check } from 'lucide-react'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import TodayReminder from '../components/TodayReminder'

export default function DashboardPage({ user, onNavigate }: { user: any, onNavigate: (page: string) => void }) {
  const { t } = useTranslation()
  const [data, setData] = useState<any>({ pendingHw: [], upcomingExams: [], todayMinutes: 0, streak: 0, xp: 0, level: 1, nextLevelXp: 500, currentLevelBaseXp: 0 })
  const [isLoading, setIsLoading] = useState(true)
  
  // استیت‌های مربوط به شمارش معکوس
  const [konkurDate, setKonkurDate] = useState(() => {
    return localStorage.getItem('sherpider_konkur_date') || '2026-07-06T08:00'
  })
  const [nahayiDate, setNahayiDate] = useState(() => {
    return localStorage.getItem('sherpider_nahayi_date') || '2025-05-22T08:00'
  })
  const [editingKonkur, setEditingKonkur] = useState(false)
  const [editingNahayi, setEditingNahayi] = useState(false)

  const dailyGoal = 120 // هدف روزانه: ۲ ساعت

  // محاسبه استریک
  const calculateStreak = (sessions: any[]) => {
    if (!sessions || sessions.length === 0) return 0
    const dates = Array.from(new Set(sessions.map(s => s.date.split('T')[0]))).sort().reverse() as string[]
    const today = new Date()
    const todayStr = new Date(today.getTime() - (today.getTimezoneOffset() * 60000)).toISOString().split('T')[0]
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = new Date(yesterday.getTime() - (yesterday.getTimezoneOffset() * 60000)).toISOString().split('T')[0]

    if (!dates.includes(todayStr) && !dates.includes(yesterdayStr)) return 0

    let streak = 0
    let current = dates.includes(todayStr) ? today : yesterday
    
    for (let i = 0; i < dates.length; i++) {
      const currentStr = new Date(current.getTime() - (current.getTimezoneOffset() * 60000)).toISOString().split('T')[0]
      if (dates.includes(currentStr)) {
        streak++
        current.setDate(current.getDate() - 1)
      } else {
        break
      }
    }
    return streak
  }

  useEffect(() => {
    const fetchAll = async () => {
      if (!user.id || user.id === 'offline') { setIsLoading(false); return }
      setIsLoading(true)
      
      try {
        const today = new Date()
        const localDateStr = new Date(today.getTime() - (today.getTimezoneOffset() * 60000)).toISOString().split('T')[0]

        const [hwRes, exRes, ssRes, completedHwRes, completedTasksRes] = await Promise.all([
          supabase.from('homework').select('*').eq('user_id', user.id).eq('status', 'pending').limit(3),
          supabase.from('exams').select('*').eq('user_id', user.id).gte('exam_date', new Date().toISOString()).order('exam_date').limit(2),
          supabase.from('study_sessions').select('date, duration_minutes').eq('user_id', user.id),
          supabase.from('homework').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('status', 'completed'),
          supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('status', 'completed')
        ])

        if (hwRes.error || exRes.error || ssRes.error) {
          toast.error('خطا در دریافت اطلاعات از سرور!')
        }

        const sessions = ssRes.data || []
        const todayMinutes = sessions.filter((s:any) => s.date.startsWith(localDateStr)).reduce((sum:any, s:any) => sum + s.duration_minutes, 0)
        const totalMinutes = sessions.reduce((sum:any, s:any) => sum + s.duration_minutes, 0)
        const streak = calculateStreak(sessions)

        // محاسبه XP و لِوِل
        const hwXp = (completedHwRes.count || 0) * 50
        const tasksXp = (completedTasksRes.count || 0) * 20
        const studyXp = totalMinutes * 10
        const totalXp = hwXp + tasksXp + studyXp

        const currentLevel = Math.floor(totalXp / 500) + 1
        const nextLevelXp = currentLevel * 500
        const currentLevelBaseXp = (currentLevel - 1) * 500
setData({ 
          pendingHw: hwRes.data || [], 
          upcomingExams: exRes.data || [], 
          todayMinutes, 
          streak, 
          xp: totalXp, 
          level: currentLevel,
          nextLevelXp,
          currentLevelBaseXp
        })
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchAll()
  }, [user.id])

 const formatTime = (minutes: number) => {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h > 0) return h + ' ' + t('dashboard.hoursAnd') + ' ' + m + ' ' + t('dashboard.minutes')
  return m + ' ' + t('dashboard.minutes')
}

  const goalProgress = Math.min((data.todayMinutes / dailyGoal) * 100, 100)
  const levelProgress = ((data.xp - data.currentLevelBaseXp) / 500) * 100

const calculateDaysLeft = (targetDate: string) => {
  if (!targetDate) return 0;
  try {
    // تبدیل تاریخ به ساعت 00:00:00 برای محاسبه دقیق روزها بدون تاثیر ساعت
    const target = new Date(targetDate);
    const now = new Date();
    target.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    
    const diffTime = target.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return isNaN(diffDays) ? 0 : Math.max(0, diffDays);
  } catch (e) {
    return 0;
  }
}



  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={40} /></div>

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <TodayReminder userId={user.id} />
      
      {/* بنر بالای داشبورد */}
      <div className="bg-primary/80 backdrop-blur-xl border border-white/30 text-white p-6 rounded-card shadow-lg shadow-primary/20 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border-2 border-white/50 shrink-0">
            {user.avatar ? <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" /> : <User size={32} className="text-white" />}
          </div>
          <div>
<h2 className="text-2xl font-bold">{t('dashboard.hello')} {user.name}! 👋</h2>
<div className="text-white/80 mt-1 flex flex-wrap items-center gap-2 text-sm">
  <span>{user.grade} | {user.major}</span>
  {data.streak > 0 && (
    <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
      <Flame size={12} /> {data.streak} {t('dashboard.consecutiveDays')}
    </span>
  )}
</div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl w-full md:w-64">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium flex items-center gap-1"><Target size={16}/> {t('dashboard.todayGoal')}</span>
            <span className="text-sm font-bold">{formatTime(data.todayMinutes)}</span>
          </div>
          <div className="w-full bg-black/20 rounded-full h-2.5">
            <div className="bg-white h-2.5 rounded-full transition-all duration-1000" style={{ width: goalProgress + '%' }}></div>
          </div>
          <p className="text-xs text-white/70 mt-2 text-center">
  {t('dashboard.goalProgress', { percent: Math.round(goalProgress), goal: dailyGoal })}
</p>
        </div>
      </div>

{/* 🌟 بخش XP و شمارش معکوس‌ها */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  
  {/* کارت لِوِل و XP */}
  <div className="card flex items-center gap-4 p-5 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
    <div className="w-16 h-16 rounded-full bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 shrink-0">
      <Award size={32} />
    </div>
    <div className="flex-1">
      <div className="flex justify-between items-end mb-1">
        <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{t('dashboard.level')} {data.level}</span>
        <span className="text-xs text-gray-500 font-medium">{data.xp}{t('dashboard.xp')}</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-neutral-800 rounded-full h-2">
        <div className="bg-indigo-500 h-2 rounded-full transition-all duration-1000" style={{ width: levelProgress + '%' }}></div>
      </div>
      <p className="text-xs text-gray-500 mt-1">
  {data.nextLevelXp - data.xp} {t('dashboard.nextLevel')}
</p>
    </div>
  </div>

  {/* کارت کنکور */}
  <div className="card flex flex-col p-5 bg-gradient-to-l from-orange-500/10 to-red-500/10 border-orange-500/20 relative">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <Target className="text-orange-500" size={20} />
        <h3 className="font-bold text-ink dark:text-white">{t('dashboard.konkur')}</h3>
      </div>
      <button onClick={() => setEditingKonkur(!editingKonkur)} className="text-gray-400 hover:text-orange-500 transition-colors">
        <Pencil size={16} />
      </button>
    </div>
    
    {editingKonkur ? (
      <div className="flex items-center gap-2 mt-2">
        <input type="datetime-local" value={konkurDate} onChange={e => setKonkurDate(e.target.value)} className="w-full p-1 text-xs rounded border dark:bg-neutral-800 outline-none" />
        <button onClick={() => { localStorage.setItem('sherpider_konkur_date', konkurDate); setEditingKonkur(false); toast.success('تاریخ کنکور تنظیم شد!') }} className="p-1.5 bg-green-500 text-white rounded"><Check size={14}/></button>
      </div>
    ) : (
      <div className="flex items-center justify-between">
        <span className="text-3xl font-black text-orange-500" dir="ltr">{calculateDaysLeft(konkurDate)}</span>
        <span className="text-sm font-bold text-gray-500">{t('dashboard.daysLeft')}</span>
      </div>
    )}
  </div>

  {/* کارت امتحانات نهایی */}
  <div className="card flex flex-col p-5 bg-gradient-to-l from-blue-500/10 to-cyan-500/10 border-blue-500/20 relative">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <BookOpen className="text-blue-500" size={20} />
        <h3 className="font-bold text-ink dark:text-white">{t('dashboard.finalExams')}</h3>
      </div>
      <button onClick={() => setEditingNahayi(!editingNahayi)} className="text-gray-400 hover:text-blue-500 transition-colors">
        <Pencil size={16} />
      </button>
    </div>
    
    {editingNahayi ? (
      <div className="flex items-center gap-2 mt-2">
        <input type="datetime-local" value={nahayiDate} onChange={e => setNahayiDate(e.target.value)} className="w-full p-1 text-xs rounded border dark:bg-neutral-800 outline-none" />
        <button onClick={() => { localStorage.setItem('sherpider_nahayi_date', nahayiDate); setEditingNahayi(false); toast.success('تاریخ امتحانات نهایی تنظیم شد!') }} className="p-1.5 bg-green-500 text-white rounded"><Check size={14}/></button>
      </div>
    ) : (
      <div className="flex items-center justify-between">
        <span className="text-3xl font-black text-blue-500" dir="ltr">{calculateDaysLeft(nahayiDate)}</span>
        <span className="text-sm font-bold text-gray-500">{t('dashboard.daysLeft')}</span>
      </div>
    )}
  </div>

</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card space-y-4 bg-white/40 dark:bg-neutral-900/40 backdrop-blur-md flex flex-col">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-neutral-800 pb-3">
<h3 className="font-bold flex items-center gap-2"><BookOpen className="text-primary" size={20}/> {t('dashboard.pendingHw')}</h3>
            <button onClick={() => onNavigate('homework')} className="text-sm text-primary flex items-center hover:underline">
              {t('dashboard.viewAll')} <ChevronLeft size={16} className="rtl:rotate-180" />
            </button>
          </div>
          <div className="flex-1 space-y-3">
            {data.pendingHw.length === 0 ? <p className="text-sm text-gray-500 text-center py-4">{t('dashboard.noHw')}</p> : data.pendingHw.map((hw: any) => (
              <div key={hw.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50/50 dark:bg-neutral-800/50">
                <div><p className="font-medium text-sm">{hw.title}</p><p className="text-xs text-gray-500">{hw.subject}</p></div>
              </div>
            ))}
          </div>
        </div>

        <div className="card space-y-4 bg-white/40 dark:bg-neutral-900/40 backdrop-blur-md flex flex-col">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-neutral-800 pb-3">
            <h3 className="font-bold flex items-center gap-2"><Calendar className="text-primary" size={20}/> {t('dashboard.upcomingExams')}</h3>
            <button onClick={() => onNavigate('exams')} className="text-sm text-primary flex items-center hover:underline">
              {t('dashboard.viewAll')} <ChevronLeft size={16} className="rtl:rotate-180" />
            </button>
          </div>
          <div className="flex-1 space-y-3">
            {data.upcomingExams.length === 0 ? <p className="text-sm text-gray-500 text-center py-4">{t('dashboard.noExams')}</p> : data.upcomingExams.map((ex: any) => (
              <div key={ex.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50/50 dark:bg-neutral-800/50">
                <div><p className="font-medium text-sm">{ex.title}</p><p className="text-xs text-gray-500">{ex.subject}</p></div>
                <span className="text-xs font-bold text-red-500 bg-red-50 dark:bg-red-950/30 px-2 py-1 rounded">{new Date(ex.exam_date).toLocaleDateString('fa-IR')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <button onClick={() => onNavigate('timer')} className="card flex flex-col items-center justify-center p-6 hover:border-primary/50 transition-colors group">
          <div className="p-3 bg-red-50 text-primary rounded-full mb-3 group-hover:scale-110 transition-transform"><Clock size={24}/></div>
          <span className="font-bold text-sm">{t('dashboard.startStudy')}</span>
        </button>
        <button onClick={() => onNavigate('homework')} className="card flex flex-col items-center justify-center p-6 hover:border-primary/50 transition-colors group">
          <div className="p-3 bg-blue-50 text-blue-500 rounded-full mb-3 group-hover:scale-110 transition-transform"><BookOpen size={24}/></div>
          <span className="font-bold text-sm">{t('dashboard.homeworkBtn')}</span>
        </button>
        <button onClick={() => onNavigate('exams')} className="card flex flex-col items-center justify-center p-6 hover:border-primary/50 transition-colors group">
          <div className="p-3 bg-orange-50 text-orange-500 rounded-full mb-3 group-hover:scale-110 transition-transform"><Calendar size={24}/></div>
          <span className="font-bold text-sm">{t('dashboard.examsBtn')}</span>
        </button>
        <button onClick={() => onNavigate('profile')} className="card flex flex-col items-center justify-center p-6 hover:border-primary/50 transition-colors group">
          <div className="p-3 bg-purple-50 text-purple-500 rounded-full mb-3 group-hover:scale-110 transition-transform"><User size={24}/></div>
          <span className="font-bold text-sm">{t('dashboard.profileBtn')}</span>
        </button>
      </div>
    </div>
  )
}
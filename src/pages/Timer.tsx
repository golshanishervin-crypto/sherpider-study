import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { getSubjects } from '../lib/subjects'
import { Play, Pause, RotateCcw, Save, Timer as TimerIcon, Volume2, VolumeX } from 'lucide-react'
import { toast } from 'sonner'

export default function TimerPage({ user }: { user: any }) {
  const availableSubjects = getSubjects(user.grade, user.major, user.year)
  const [subject, setSubject] = useState(availableSubjects[0])
  const [studyMinutes, setStudyMinutes] = useState(25)
  const [breakMinutes, setBreakMinutes] = useState(5)
  const [timeLeft, setTimeLeft] = useState(25 * 60) 
  const [isRunning, setIsRunning] = useState(false)
  const [isBreak, setIsBreak] = useState(false)
  const [isRainPlaying, setIsRainPlaying] = useState(false)

  // 🌟 تابع ذخیره با اعتبارسنجی (قبل از useEffect تعریف شده تا ارور نده)
  const handleSaveSession = async (minutes: number) => {
    if (minutes < 1) {
      toast.error('زمان مطالعه باید حداقل ۱ دقیقه باشد!')
      return
    }
    if (isBreak) {
      toast.error('در حال استراحت هستید. ذخیره جلسه امکان‌پذیر نیست.')
      return
    }
    if (user.id === 'offline') {
      toast.error('برای ذخیره در ابر، باید با ایمیل وارد شوید.')
      return
    }

    const { error } = await supabase.from('study_sessions').insert([{
      user_id: user.id, 
      subject, 
      duration_minutes: minutes, 
      date: new Date().toISOString()
    }])

    if (!error) { 
      toast.success('جلسه مطالعه در ابر ذخیره شد! ✅')
      resetTimer() 
    } else { 
      toast.error('خطا در ذخیره جلسه!') 
    }
  }

  // 🌟 منطق دقیق تایمر (حتی وقتی تب عوض میشه یا گوشی قفل میشه)
  useEffect(() => {
    let interval: any = null
    let endTime: number | null = null

    if (isRunning) {
      endTime = Date.now() + timeLeft * 1000

      interval = setInterval(() => {
        const now = Date.now()
        const remaining = Math.round((endTime! - now) / 1000)
        
        if (remaining <= 0) {
          setTimeLeft(0)
          setIsRunning(false)
          if (isBreak) {
            toast.info('استراحت تمام شد! دوباره شروع کن. ☕')
          } else {
            toast.success('زمان مطالعه تمام شد! آفرین. 🎉')
            handleSaveSession(studyMinutes)
          }
        } else {
          setTimeLeft(remaining)
        }
      }, 500)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, isBreak, studyMinutes])

  const toggleTimer = () => setIsRunning(!isRunning)

  const resetTimer = () => {
    setIsRunning(false)
    setIsBreak(false)
    setTimeLeft(studyMinutes * 60)
  }

  const switchMode = (breakMode: boolean) => {
    setIsRunning(false)
    setIsBreak(breakMode)
    setTimeLeft(breakMode ? breakMinutes * 60 : studyMinutes * 60)
  }

  const handleStudyMinutesChange = (val: number) => {
    const safeVal = Math.max(1, val) // جلوگیری از صفر یا منفی شدن
    setStudyMinutes(safeVal)
    if (!isBreak && !isRunning) {
      setTimeLeft(safeVal * 60)
    }
  }

  // 🌟 تابع کنترل صدای باران
  const toggleRainSound = () => {
    const audio = document.getElementById('rain-sound') as HTMLAudioElement;
    if (audio) {
      if (isRainPlaying) {
        audio.pause();
      } else {
        audio.play().catch(() => toast.error('مرورگر اجازه پخش صدا را نمی‌دهد.'));
      }
      setIsRainPlaying(!isRainPlaying);
    }
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return m + ':' + s
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold">تایمر مطالعه ⏱️</h2>
      
      {/* فایل صوتی باران */}
      <audio id="rain-sound" loop>
        <source src="https://cdn.pixabay.com/download/audio/2022/07/07/audio_1819335c3e.mp3?filename=rain-and-thunder-16705.mp3" type="audio/mpeg" />
      </audio>
<div className="card max-w-md mx-auto text-center space-y-6 p-8 bg-white/40 dark:bg-neutral-900/40 backdrop-blur-md border border-white/60 dark:border-white/10 shadow-xl">
        <div className="grid grid-cols-2 gap-4 bg-gray-50/50 dark:bg-neutral-800/50 p-3 rounded-input">
          <div>
            <label className="block text-xs text-gray-500 mb-1">مطالعه (دقیقه)</label>
            <input type="number" min="1" value={studyMinutes} onChange={e => handleStudyMinutesChange(Number(e.target.value))} disabled={isRunning} className="w-full p-2 text-center font-bold rounded border dark:bg-neutral-700 disabled:opacity-50 outline-none" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">استراحت (دقیقه)</label>
            <input type="number" min="1" value={breakMinutes} onChange={e => { setBreakMinutes(Number(e.target.value)); if (isBreak && !isRunning) setTimeLeft(Number(e.target.value) * 60); }} disabled={isRunning} className="w-full p-2 text-center font-bold rounded border dark:bg-neutral-700 disabled:opacity-50 outline-none" />
          </div>
        </div>

        <div className="flex bg-gray-100/50 dark:bg-neutral-800/50 p-1 rounded-full">
          <button onClick={() => switchMode(false)} className={"flex-1 py-2 rounded-full font-medium transition-all " + (!isBreak ? 'bg-white dark:bg-neutral-700 shadow-sm text-primary' : 'text-gray-500')}>مطالعه</button>
          <button onClick={() => switchMode(true)} className={"flex-1 py-2 rounded-full font-medium transition-all " + (isBreak ? 'bg-white dark:bg-neutral-700 shadow-sm text-green-500' : 'text-gray-500')}>استراحت</button>
        </div>

        {!isBreak && (
          <select value={subject} onChange={e => setSubject(e.target.value)} disabled={isRunning} className="w-full p-3 rounded-input border border-gray-300 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800 text-center font-bold text-lg focus:ring-2 focus:ring-primary outline-none disabled:opacity-50">
            {availableSubjects.map((s, i) => <option key={i} value={s}>{s}</option>)}
          </select>
        )}

        <div className="relative py-4">
          <div className={"text-7xl font-bold font-en drop-shadow-sm " + (isBreak ? 'text-green-500' : 'text-primary')} dir="ltr">
            {formatTime(timeLeft)}
          </div>
          <TimerIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-100 dark:text-neutral-800/50 -z-10" size={160} />
        </div>

        <div className="flex items-center justify-center gap-3">
          {/* دکمه ریست */}
          <button onClick={resetTimer} className="p-4 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-neutral-800 transition-colors">
            <RotateCcw size={24} />
          </button>
          
          {/* دکمه پلی/پاز */}
          <button onClick={toggleTimer} className="p-6 rounded-full bg-primary text-white shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all">
            {isRunning ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
          </button>
          
          {/* دکمه ذخیره */}
          <button 
            onClick={() => handleSaveSession(Math.floor((studyMinutes*60 - timeLeft) / 60))} 
            disabled={isBreak} 
            className="p-4 rounded-full bg-gray-100 text-green-600 hover:bg-green-50 dark:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
            title="ذخیره دستی"
          >
            <Save size={24} />
          </button>

          {/* 🌟 دکمه صدای باران */}
          <button 
            onClick={toggleRainSound} 
            className={"p-4 rounded-full transition-colors " + (isRainPlaying ? "bg-blue-100 text-blue-600 dark:bg-blue-900/50" : "bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-neutral-800")} 
            title="صدای باران برای تمرکز"
          >
            {isRainPlaying ? <VolumeX size={24} /> : <Volume2 size={24} />}
          </button>
        </div>
      </div>
    </div>
  )
}
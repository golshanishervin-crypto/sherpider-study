import { useState, useEffect, lazy, Suspense, useTransition } from 'react'
import { Menu, Bug, Smartphone, ShieldCheck, User, GraduationCap, ArrowLeft, BookOpen, Mail, Lock, HelpCircle, LogOut, Home, Clock, Calendar, ListTodo, Loader2, Layers, Award, Trophy, History, BarChart, Activity, Gamepad, CheckSquare } from 'lucide-react'
import i18n from './lib/i18n'
import { supabase } from './lib/supabase'
import { Toaster } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import ConfirmDialog from './components/ConfirmDialog'
import EducationSelector from './components/EducationSelector'
import MilesAI from './components/MilesAI'
import { useTranslation } from 'react-i18next'
import BottomNav from './components/BottomNav'

const HomeworkPage = lazy(() => import('./pages/Homework'))
const ExamsPage = lazy(() => import('./pages/Exams'))
const TimerPage = lazy(() => import('./pages/Timer'))
const ProfilePage = lazy(() => import('./pages/Profile'))
const DashboardPage = lazy(() => import('./pages/Dashboard'))
const StatsPage = lazy(() => import('./pages/Stats'))
const CalendarPage = lazy(() => import('./pages/CalendarPage'))
const ActivitiesPage = lazy(() => import('./pages/Activities'))
const TasksPage = lazy(() => import('./pages/Tasks'))
const TimetablePage = lazy(() => import('./pages/Timetable'))
const GuidePage = lazy(() => import('./pages/Guide'))
const FlashcardsPage = lazy(() => import('./pages/Flashcards'))
const FocusGame = lazy(() => import('./pages/FocusGame'))
const QuizzesPage = lazy(() => import('./pages/Quizzes'))

function AuthScreen({ onLogin }: { onLogin: (user: any) => void }) {
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email')
  const [name, setName] = useState('')
  const [grade, setGrade] = useState('متوسطه دوم')
  const [major, setMajor] = useState('علوم تجربی')
  const [year, setYear] = useState('یازدهم')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRegister, setIsRegister] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [isEducationOpen, setIsEducationOpen] = useState(false)

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg('')
    try {
      if (isRegister) {
        const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name, grade, major, year, phone: email } } })
        if (error) throw error
        if (data.user) onLogin({ id: data.user.id, phone: data.user.email, name, grade, major, year })
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        if (data.user) {
          const meta = data.user.user_metadata
          onLogin({ id: data.user.id, phone: meta.phone || data.user.email, name: meta.name || 'کاربر', grade: meta.grade || 'متوسطه دوم', major: meta.major || 'علوم تجربی', year: meta.year || 'یازدهم' })
        }
      }
    } catch (error: any) {
      console.error(error)
      if (error.message.includes("Invalid login")) setErrorMsg('ایمیل یا رمز عبور اشتباه است.')
      else if (error.message.includes("already registered")) setErrorMsg('این ایمیل قبلاً ثبت‌نام کرده است.')
      else if (error.message.includes("Email not confirmed")) setErrorMsg('ایمیل شما تایید نشده است.')
      else setErrorMsg('خطا در ارتباط با سرور: ' + error.message)
    } finally { setIsLoading(false) }
  }

  const handleSendCode = (e: React.FormEvent) => { e.preventDefault(); if (phone.length >= 10) setStep(2) }
  const handleVerify = (e: React.FormEvent) => { 
    e.preventDefault(); 
    if (import.meta.env.DEV && otp === '1234') onLogin({ id: 'offline', phone, name, grade, major, year }) 
    else alert('کد اشتباه است! (در نسخه نهایی این روش غیرفعال است)')
  }
return (
  <div className="min-h-[100dvh] flex items-center justify-center p-4 relative overflow-hidden">
    <Toaster position="top-center" richColors />
    <div className="card max-w-md w-full p-6 md:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 z-10">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-2"><Bug className="text-primary" size={32} /></div>
        <h1 className="text-2xl font-bold text-ink dark:text-white">ورود به Sherpider-Study</h1>
      </div>
      
      <div className="flex bg-gray-100 dark:bg-neutral-800 p-1 rounded-full">
        <button onClick={() => { setAuthMethod('email'); setErrorMsg(''); }} className={"flex-1 py-2 rounded-full font-medium transition-all text-sm " + (authMethod === 'email' ? 'bg-white dark:bg-neutral-700 shadow-sm text-primary' : 'text-gray-500')}>ورود با ایمیل</button>
        <button onClick={() => { setAuthMethod('phone'); setErrorMsg(''); }} className={"flex-1 py-2 rounded-full font-medium transition-all text-sm " + (authMethod === 'phone' ? 'bg-white dark:bg-neutral-700 shadow-sm text-primary' : 'text-gray-500')}>ورود با موبایل</button>
      </div>

      {authMethod === 'email' && (
        <form onSubmit={handleEmailAuth} className="space-y-4 animate-in fade-in">
          {isRegister && (
            <div className="space-y-3">
              <div className="relative"><User className="absolute right-3 top-3 text-gray-400" size={20} /><input type="text" placeholder="نام و نام خانوادگی" value={name} onChange={e => setName(e.target.value)} className="w-full pl-4 pr-10 py-2 rounded-input border dark:bg-neutral-900 focus:ring-2 focus:ring-primary outline-none" required /></div>
              
              <div onClick={() => setIsEducationOpen(true)} className="cursor-pointer p-4 rounded-xl border-2 border-dashed border-primary/30 hover:border-primary bg-primary/5 transition-all flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">مقطع و رشته تحصیلی</p>
                  <p className="font-bold text-sm text-ink dark:text-white">{grade} {major !== 'عمومی' && "- " + major} {year !== 'همه' && "(" + year + ")"}</p>
                </div>
                <div className="bg-primary text-white p-2 rounded-lg"><GraduationCap size={18} /></div>
              </div>
            </div>
          )}
          <div className="relative"><Mail className="absolute right-3 top-3 text-gray-400" size={20} /><input type="email" placeholder="ایمیل" value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-4 pr-10 py-2 rounded-input border dark:bg-neutral-900 focus:ring-2 focus:ring-primary outline-none text-left" dir="ltr" required /></div>
          <div className="relative"><Lock className="absolute right-3 top-3 text-gray-400" size={20} /><input type="password" placeholder="رمز عبور" value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-4 pr-10 py-2 rounded-input border dark:bg-neutral-900 focus:ring-2 focus:ring-primary outline-none text-left" dir="ltr" required minLength={6} /></div>
          {errorMsg && <p className="text-red-500 text-sm text-center font-bold">{errorMsg}</p>}
          <button type="submit" disabled={isLoading} className="btn-primary w-full py-3 disabled:opacity-50">
            {isLoading ? 'در حال پردازش...' : (isRegister ? 'ثبت‌نام' : 'ورود به برنامه')}{!isLoading && <ArrowLeft size={18} />}
          </button>
          <button type="button" onClick={() => { setIsRegister(!isRegister); setErrorMsg(''); }} className="w-full text-sm text-primary hover:underline text-center">
            {isRegister ? 'حساب داری؟ وارد شو' : 'حساب نداری؟ همین الان ثبت‌نام کن'}
          </button>
        </form>
      )}
{authMethod === 'phone' && (
          <div className="animate-in fade-in">
            {step === 1 && (
              <form onSubmit={handleSendCode} className="space-y-4">
                <div className="relative"><Smartphone className="absolute right-3 top-3 text-gray-400" size={20} /><input type="tel" placeholder="۰۹۱۲۳۴۵۶۷۸۹" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full pl-4 pr-10 py-3 rounded-input border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:ring-2 focus:ring-primary outline-none" required dir="ltr" /></div>
                <button type="submit" className="btn-primary w-full py-3">دریافت کد تأیید<ArrowLeft size={18} /></button>
              </form>
            )}
            {step === 2 && (
              <form onSubmit={handleVerify} className="space-y-4">
                <div className="relative"><ShieldCheck className="absolute right-3 top-3 text-gray-400" size={20} /><input type="text" placeholder="کد ۴ رقمی (تست: 1234)" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full pl-4 pr-10 py-3 rounded-input border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-center tracking-widest text-lg focus:ring-2 focus:ring-primary outline-none" required dir="ltr" maxLength={4} /></div>
                <div className="relative"><User className="absolute right-3 top-3 text-gray-400" size={20} /><input type="text" placeholder="نام و نام خانوادگی" value={name} onChange={(e) => setName(e.target.value)} className="w-full pl-4 pr-10 py-3 rounded-input border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:ring-2 focus:ring-primary outline-none" required /></div>
                
                <div onClick={() => setIsEducationOpen(true)} className="cursor-pointer p-4 rounded-xl border-2 border-dashed border-primary/30 hover:border-primary bg-primary/5 transition-all flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">مقطع و رشته تحصیلی</p>
                    <p className="font-bold text-sm text-ink dark:text-white">{grade} {major !== 'عمومی' && "- " + major} {year !== 'همه' && "(" + year + ")"}</p>
                  </div>
                  <div className="bg-primary text-white p-2 rounded-lg"><GraduationCap size={18} /></div>
                </div>

                <button type="submit" className="btn-primary w-full py-3">تأیید و ورود<ArrowLeft size={18} /></button>
              </form>
            )}
          </div>
        )}
      </div>

      {isEducationOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <EducationSelector 
            initialGrade={grade} initialMajor={major} initialYear={year}
            onSave={(g, m, y) => { setGrade(g); setMajor(m); setYear(y); setIsEducationOpen(false); }}
            onCancel={() => setIsEducationOpen(false)}
          />
        </div>
      )}
    </div>
  )
}
function MainApp({ user, setUser, onLogout }: { user: any, setUser: any, onLogout: () => void }) {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentPage, setCurrentPageRaw] = useState('dashboard')

const setCurrentPage = (page: string) => {
  if (page === currentPage) return
  window.history.pushState({ page }, '')
  setCurrentPageRaw(page)
}

useEffect(() => {
  window.history.replaceState({ page: 'dashboard' }, '')
  const onPop = (e: PopStateEvent) => setCurrentPageRaw(e.state?.page ?? 'dashboard')
  window.addEventListener('popstate', onPop)
  return () => window.removeEventListener('popstate', onPop)
}, [])
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('sherpider_theme') === 'dark')
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false)

  useEffect(() => {
    if (darkMode) { document.documentElement.classList.add('dark'); localStorage.setItem('sherpider_theme', 'dark'); }
    else { document.documentElement.classList.remove('dark'); localStorage.setItem('sherpider_theme', 'light'); }
  }, [darkMode])

  useEffect(() => {
    if (i18n.language === 'fa') { document.documentElement.dir = 'rtl'; document.documentElement.lang = 'fa'; document.documentElement.classList.remove('font-en'); }
    else { document.documentElement.dir = 'ltr'; document.documentElement.lang = 'en'; document.documentElement.classList.add('font-en'); }
  }, [i18n.language])

  useEffect(() => {
    if (isMenuOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = 'unset'
    return () => { document.body.style.overflow = 'unset' }
  }, [isMenuOpen])

  const handleNav = (page: string) => { setCurrentPage(page); setIsMenuOpen(false); }
  const updateUser = (newData: any) => {
    const updatedUser = { ...user, ...newData }
    localStorage.setItem('sherpider_user', JSON.stringify(updatedUser))
    setUser(updatedUser)
  }

  const menuItems = [
  { id: 'dashboard', label: 'nav.dashboard', icon: <Home /> },
  { id: 'timetable', label: 'nav.timetable', icon: <Calendar /> },
  { id: 'homework', label: 'nav.homework', icon: <BookOpen /> },
  { id: 'tasks', label: 'nav.tasks', icon: <ListTodo /> },
  { id: 'exams', label: 'nav.exams', icon: <BookOpen /> },
  { id: 'timer', label: 'nav.timer', icon: <Clock /> },
  { id: 'stats', label: 'nav.stats', icon: <BarChart /> },
  { id: 'calendar', label: 'nav.calendar', icon: <Calendar /> },
  { id: 'activities', label: 'nav.activities', icon: <Activity /> },
  { id: 'flashcards', label: 'nav.flashcards', icon: <Layers /> },
  { id: 'game', label: 'nav.game', icon: <Gamepad /> },
  { id: 'quizzes', label: 'nav.quizzes', icon: <CheckSquare /> },
]
return (
  <div className="min-h-[100dvh] w-full relative overflow-hidden pb-24 md:pb-28">
    <Toaster position="top-center" richColors />
    <header className="bg-white/50 dark:bg-neutral-900/50 backdrop-blur-lg shadow-sm sticky top-0 z-40 transition-colors border-b border-white/50 dark:border-white/10">
      <div className="flex items-center justify-between p-4 max-w-5xl mx-auto">
        <div className="flex items-center gap-2"><Bug className="text-primary" size={28} /><h1 className="text-xl font-bold text-primary dark:text-primary-500">Sherpider-Study</h1></div>
        <div className="flex items-center gap-3">
          <button onClick={() => setIsMenuOpen(true)} className="p-2 rounded-input hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors text-ink dark:text-white"><Menu size={24} /></button>
        </div>
      </div>
    </header>

    <div className={"fixed inset-0 bg-black/60 z-[9999] transition-opacity duration-300 " + (isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none")} onClick={() => setIsMenuOpen(false)}>
      <div className={"absolute top-0 end-0 w-72 h-full bg-white/30 dark:bg-neutral-900/30 backdrop-blur-3xl border-s border-white/60 dark:border-neutral-700/50 shadow-[-20px_0_50px_rgba(0,0,0,0.1)] transition-transform duration-300 transform overflow-y-auto " + (isMenuOpen ? "translate-x-0" : "ltr:translate-x-full rtl:-translate-x-full")} onClick={e => e.stopPropagation()}>
        <div className="bg-primary/5 backdrop-blur-md p-6 border-b border-white/40 dark:border-neutral-800/50">
          <div onClick={() => handleNav('profile')} className="w-16 h-16 rounded-full bg-white dark:bg-neutral-800 flex items-center justify-center overflow-hidden border-2 border-primary/20 cursor-pointer mb-3 shadow-sm">
             {user.avatar ? <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" /> : <User size={28} className="text-primary" />}
          </div>
          <h2 className="font-bold text-lg text-ink dark:text-white">{user.name}</h2>
          <p className="text-sm text-gray-500 dir-ltr">{user.phone}</p>
        </div>
        <nav className="p-3 flex flex-col gap-1 pb-10">
          {menuItems.map(item => (
            <button key={item.id} onClick={() => handleNav(item.id)} className={"text-start flex items-center gap-3 p-3 rounded-xl transition-colors " + (currentPage === item.id ? "bg-primary-50 text-primary font-bold dark:bg-red-950/30" : "hover:bg-gray-100 dark:hover:bg-neutral-800 text-ink dark:text-gray-300")}>
              {item.icon} {t(item.label)}
            </button>
          ))}
          <div className="h-px bg-gray-100 dark:bg-neutral-800 my-2"></div>
          <button onClick={() => handleNav('profile')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-800 text-ink dark:text-gray-300 transition-colors">
  <User size={20} /> {t('nav.profile')}
</button>
  <button onClick={() => handleNav('guide')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-800 text-ink dark:text-gray-300 transition-colors">
  <HelpCircle size={20} /> {t('nav.guide')}
</button>
          <div className="h-px bg-gray-100 dark:bg-neutral-800 my-2"></div>
          <button onClick={() => setIsLogoutConfirmOpen(true)} className="text-start flex items-center gap-3 p-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors font-medium"><LogOut size={20} />{t('profile.logout')}</button>
        </nav>
      </div>
    </div>
<main className="max-w-5xl mx-auto p-4 md:p-6 pb-24 z-10 relative">
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-primary mb-4" size={40} />
            <p className="text-gray-500 font-medium animate-pulse">در حال بارگذاری...</p>
          </div>
        }>
          <AnimatePresence mode="wait">
            <motion.div key={currentPage} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3, ease: 'easeInOut' }}>
              {currentPage === 'dashboard' && <DashboardPage user={user} onNavigate={handleNav} />}
              {currentPage === 'timetable' && <TimetablePage user={user} />}
              {currentPage === 'homework' && <HomeworkPage user={user} />}
              {currentPage === 'tasks' && <TasksPage user={user} />}
              {currentPage === 'exams' && <ExamsPage user={user} />}
              {currentPage === 'timer' && <TimerPage user={user} />}
              {currentPage === 'stats' && <StatsPage user={user} />}
              {currentPage === 'calendar' && <CalendarPage user={user} />}
              {currentPage === 'activities' && <ActivitiesPage user={user} />}
              {currentPage === 'flashcards' && <FlashcardsPage user={user} />}
              {currentPage === 'game' && (
                <FocusGame 
                  onBack={() => handleNav('dashboard')} 
                  onGameEnd={async (score) => {
                    if (score > 0 && user.id !== 'offline') {
                      await supabase.from('study_sessions').insert([{ 
                        user_id: user.id, 
                        subject: 'بازی تمرکز', 
                        duration_minutes: Math.floor(score / 10), 
                        date: new Date().toISOString() 
                      }])
                    }
                  }}
                />
              )}
              {currentPage === 'quizzes' && <QuizzesPage user={user} />}
              {currentPage === 'profile' && <ProfilePage user={user} onLogout={onLogout} darkMode={darkMode} toggleTheme={() => setDarkMode(!darkMode)} updateUser={updateUser} />}
              {currentPage === 'guide' && <GuidePage onBack={() => handleNav('dashboard')} />}
            </motion.div>
          </AnimatePresence>
        </Suspense>
      </main>

      <div className="md:hidden">
  <BottomNav
    active={currentPage}
    onSelect={(id) => (id === 'menu' ? setIsMenuOpen(true) : handleNav(id))}
    items={[
      { id: 'dashboard', label: 'خانه', icon: <Home size={22} /> },
      { id: 'homework', label: 'تکالیف', icon: <BookOpen size={22} /> },
      { id: 'timer', label: 'تایمر', icon: <Clock size={22} /> },
      { id: 'calendar', label: 'تقویم', icon: <Calendar size={22} /> },
      { id: 'menu', label: 'منو', icon: <Menu size={22} /> },
    ]}
  />
</div>
      
<MilesAI user={user} onNavigate={handleNav} />

      <ConfirmDialog 
        isOpen={isLogoutConfirmOpen} 
        onClose={() => setIsLogoutConfirmOpen(false)} 
        onConfirm={onLogout}
        title="خروج از حساب"
        message="آیا مطمئنی می‌خوای از حساب کاربریت خارج بشی؟"
        confirmText="بله، خارج شو"
      />
    </div>
  )
}


export default function App() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const savedUser = localStorage.getItem('sherpider_user')
    if (savedUser) setUser(JSON.parse(savedUser))
  }, [])

  const handleLogin = (userData: any) => {
    const newUser = { ...userData, avatar: null }
    localStorage.setItem('sherpider_user', JSON.stringify(newUser))
    setUser(newUser)
  }

  const handleLogout = async () => {
    try { await supabase.auth.signOut() } catch (e) { console.error(e) } 
    localStorage.removeItem('sherpider_user')
    setUser(null)
  }

  if (!user) return <AuthScreen onLogin={handleLogin} />
  return <MainApp user={user} setUser={setUser} onLogout={handleLogout} />
}

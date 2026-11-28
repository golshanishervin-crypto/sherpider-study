import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Flame, Clock, Target, BookOpen, Zap, BrainCircuit, 
  Plus, TrendingUp, Calendar as CalendarIcon, ChevronLeft 
} from 'lucide-react';
import StatCard from '../components/StatCard';

// اینبار پراپ‌ها رو قبول می‌کنیم تا با App.tsx هماهنگ بشه
export default function DashboardPage({ user, onNavigate }: { user: any, onNavigate: (page: string) => void }) {
  const [greeting, setGreeting] = useState('سلام');
  const [homeworks, setHomeworks] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [stats, setStats] = useState({ studyHours: 0, streak: 0, completedHw: 0, totalHw: 0 });

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('صبح بخیر');
    else if (hour < 18) setGreeting('عصر بخیر');
    else setGreeting('شب بخیر');

    try {
      const dbHomework = JSON.parse(localStorage.getItem('db_homework') || '[]');
      const pendingHw = dbHomework.filter((h: any) => h.status !== 'completed' && h.completed !== true);
      setHomeworks(pendingHw.slice(0, 2));

      const dbExams = JSON.parse(localStorage.getItem('db_exams') || '[]');
      setExams(dbExams.slice(0, 2));

      const dbSessions = JSON.parse(localStorage.getItem('db_study_sessions') || '[]');
      let totalMinutes = 0;
      dbSessions.forEach((s: any) => {
        totalMinutes += Number(s.duration_minutes || s.duration || 0);
      });

      const completedCount = dbHomework.filter((h: any) => h.status === 'completed' || h.completed === true).length;

      setStats({
        studyHours: Number((totalMinutes / 60).toFixed(1)),
        streak: dbSessions.length > 0 ? 3 : 0, 
        completedHw: completedCount,
        totalHw: dbHomework.length
      });

    } catch (error) {
      console.error("خطا در خواندن دیتابیس", error);
    }
  }, []);

  // اسم کاربر رو از پراپ‌ها می‌گیریم، اگر نبود از ایمیل
  const userName = user?.name || user?.email?.split('@')[0] || 'دانش‌آموز';

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-24 relative z-10">
      
      {/* ۱. بخش خوش‌آمدگویی */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-l from-red-600 to-red-800 p-8 rounded-3xl shadow-xl shadow-red-500/20 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent bg-[length:20px_20px]"></div>
        
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-black mb-2 flex items-center gap-2">
            {greeting}، {userName} <span className="text-3xl">🕷️</span>
          </h1>
          <p className="text-red-100 text-sm md:text-base max-w-md leading-relaxed">
            امروز بهترین روز برای نابود کردن اون لیست بلندبالای درس‌هاست! مایلز آماده‌ست تا کمکت کنه.
          </p>
        </div>

        <div className="relative z-10 bg-white/20 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/30 text-center cursor-pointer hover:bg-white/30 transition-colors" onClick={() => onNavigate('timetable')}>
          <p className="text-xs text-red-100 mb-1">برنامه امروز</p>
          <p className="font-bold text-lg">مشاهده کلاس‌ها</p>
        </div>
      </motion.div>

      {/* ۲. کارت‌های آماری */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="ساعت مطالعه امروز" value={stats.studyHours + " ساعت"} icon={Clock} color="text-blue-500" bg="bg-blue-500" delay={0.1} />
        <StatCard title="روزهای متوالی (Streak)" value={stats.streak + " روز"} icon={Flame} color="text-orange-500" bg="bg-orange-500" delay={0.2} />
        <StatCard title="تکالیف انجام شده" value={stats.completedHw + " از " + stats.totalHw} icon={Target} color="text-green-500" bg="bg-green-500" delay={0.3} />
      </div>
{/* ۳. اکشن‌های سریع */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
          <Zap className="text-yellow-500" /> دسترسی سریع
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button onClick={() => onNavigate('timer')} className="flex flex-col items-center justify-center p-6 bg-white/50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl hover:border-blue-500/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"><Clock size={24} /></div>
            <span className="font-bold text-sm">شروع تایمر</span>
          </button>
          
          <button onClick={() => onNavigate('homework')} className="flex flex-col items-center justify-center p-6 bg-white/50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl hover:border-purple-500/50 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all group">
            <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"><Plus size={24} /></div>
            <span className="font-bold text-sm">تکلیف جدید</span>
          </button>
          
          <button onClick={() => onNavigate('miles')} className="flex flex-col items-center justify-center p-6 bg-white/50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl hover:border-red-500/50 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all group">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"><BrainCircuit size={24} /></div>
            <span className="font-bold text-sm">چت با مایلز</span>
          </button>
          
          <button onClick={() => onNavigate('quizzes')} className="flex flex-col items-center justify-center p-6 bg-white/50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl hover:border-green-500/50 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all group">
            <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"><TrendingUp size={24} /></div>
            <span className="font-bold text-sm">تست بزن</span>
          </button>
        </div>
      </div>

      {/* ۴. بخش تکالیف و امتحانات */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/70 dark:bg-[#0a0a0a]/70 backdrop-blur-md p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg flex items-center gap-2"><BookOpen size={20} className="text-blue-500"/> تکالیف پیش‌رو</h3>
            <button onClick={() => onNavigate('homework')} className="text-sm text-red-500 flex items-center hover:underline">مشاهده همه <ChevronLeft size={16} /></button>
          </div>
          <div className="space-y-3">
            {homeworks.length > 0 ? (
              homeworks.map((hw, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-transparent">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" className="w-5 h-5 accent-red-500" />
                    <span className="text-sm font-medium">{hw.title || 'بدون عنوان'}</span>
                  </div>
                  <span className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-md">{hw.dueDate || 'بدون تاریخ'}</span>
</div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500 text-sm">تکلیفی برای انجام دادن وجود ندارد. خوش بگذره! 🎉</div>
            )}
          </div>
        </div>

        <div className="bg-white/70 dark:bg-[#0a0a0a]/70 backdrop-blur-md p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg flex items-center gap-2"><CalendarIcon size={20} className="text-orange-500"/> امتحانات نزدیک</h3>
            <button onClick={() => onNavigate('exams')} className="text-sm text-red-500 flex items-center hover:underline">مشاهده همه <ChevronLeft size={16} /></button>
          </div>
          <div className="space-y-3">
            {exams.length > 0 ? (
              exams.map((ex, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl border border-orange-100 dark:border-orange-500/20">
                  <div>
                    <p className="font-bold text-sm">{ex.title || 'امتحان'}</p>
                    <p className="text-xs text-gray-500 mt-1">{ex.subject || 'درس'}</p>
                  </div>
                  <div className="bg-white dark:bg-black px-3 py-1 rounded-lg text-sm font-black text-orange-500">{ex.examDate || 'نامشخص'}</div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500 text-sm">هیچ امتحانی ثبت نشده است. خیالت راحت! ☕️</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

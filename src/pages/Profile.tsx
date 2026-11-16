import { useRef, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User, BookOpen, Clock, LogOut, Moon, Sun, Award, Camera, Globe, Edit2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import EducationSelector from '../components/EducationSelector';

export default function ProfilePage({ user, onLogout, darkMode, toggleTheme, updateUser }: { user: any, onLogout: () => void, darkMode: boolean, toggleTheme: () => void, updateUser: (data: any) => void }) {
  const { t, i18n } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [stats, setStats] = useState({ completedHw: 0, totalHw: 0, exams: 0, hours: 0, mins: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [isEduSelectorOpen, setIsEduSelectorOpen] = useState(false);

  const [editName, setEditName] = useState(user.name || '');
  const [editGrade, setEditGrade] = useState(user.grade || 'متوسطه دوم');
  const [editMajor, setEditMajor] = useState(user.major || 'علوم تجربی');
  const [editYear, setEditYear] = useState(user.year || 'دوازدهم');

  // تغییر زبان به همراه تغییر جهت صفحه (RTL/LTR)
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('sherpider_language', lang);
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    const fetchStats = async () => {
      if (user.id === 'offline') return;
      
      const { data: hw } = await supabase.from('homework').select('status').eq('user_id', user.id);
      const { count: exCount } = await supabase.from('exams').select('*', { count: 'exact', head: true }).eq('user_id', user.id);
      const { data: ss } = await supabase.from('study_sessions').select('duration_minutes').eq('user_id', user.id);

      const completedHw = hw?.filter(h => h.status === 'completed').length || 0;
      const totalHw = hw?.length || 0;
      const totalMinutes = ss?.reduce((sum, s) => sum + s.duration_minutes, 0) || 0;
      
      const hours = Math.floor(totalMinutes / 60);
      const mins = totalMinutes % 60;

      setStats({ completedHw, totalHw, exams: exCount || 0, hours, mins });
    };
    if (user.id) fetchStats();
  }, [user.id]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_SIZE = 300;
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > MAX_SIZE) { height *= MAX_SIZE / width; width = MAX_SIZE; }
          } else {
            if (height > MAX_SIZE) { width *= MAX_SIZE / height; height = MAX_SIZE; }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          updateUser({ avatar: canvas.toDataURL('image/jpeg', 0.8) });
          toast.success(t('profile.picUpdated') || 'عکس پروفایل آپدیت شد');
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    updateUser({ name: editName, grade: editGrade, major: editMajor, year: editYear });
    setIsEditing(false);
    toast.success(t('profile.saveSuccess') || 'اطلاعات با موفقیت ذخیره شد');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-2xl mx-auto pb-10">
      
      {/* کارت اطلاعات کاربر */}
      <div className="card flex flex-col items-center justify-center p-8 bg-gradient-to-b from-white to-gray-50 dark:from-neutral-900 dark:to-neutral-800 relative overflow-hidden rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
<div className="absolute top-0 right-0 w-full h-24 bg-primary/10 -z-10" />
        
        <div className="relative group cursor-pointer mb-4 z-10" onClick={() => fileInputRef.current?.click()}>
          <div className="w-24 h-24 rounded-full bg-white dark:bg-neutral-800 shadow-xl flex items-center justify-center border-4 border-white dark:border-neutral-800 overflow-hidden">
            {user.avatar ? (
              <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User size={48} className="text-gray-400" />
            )}
          </div>
          <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="text-white" size={24} />
          </div>
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
        </div>

        {isEditing ? (
          <div className="w-full max-w-sm space-y-3 mt-2 z-10 animate-in fade-in">
            <div>
              <label className="block text-xs text-gray-500 mb-1">{t('profile.fullName')}</label>
              <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent" />
            </div>
            <div onClick={() => setIsEduSelectorOpen(true)} className="cursor-pointer p-3 rounded-xl border border-primary/30 bg-primary/5 hover:bg-primary/10 transition-all">
              <p className="text-xs text-gray-500 mb-1">برای تغییر رشته و پایه کلیک کنید</p>
              <p className="font-bold text-primary">{editGrade} - {editMajor} - {editYear}</p>
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setIsEditing(false)} className="flex-1 py-2 rounded-xl bg-gray-200 dark:bg-neutral-800 text-sm font-bold">
                {t('profile.cancel')}
              </button>
              <button onClick={handleSaveProfile} className="flex-1 py-2 rounded-xl bg-green-500 text-white text-sm font-bold shadow-md">
                {t('profile.save')}
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-ink dark:text-white z-10">{user.name}</h2>
            <p className="text-gray-500 z-10 dir-ltr">{user.phone}</p>
            <div className="flex flex-wrap justify-center gap-2 mt-4 z-10">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold">{user.grade}</span>
              <span className="bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-sm">{user.major}</span>
              <span className="bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-sm">{user.year}</span>
            </div>
            <button onClick={() => setIsEditing(true)} className="mt-6 flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-lg hover:bg-primary/90 transition-all z-10">
              <Edit2 size={16} /> {t('profile.editInfo')}
            </button>
          </>
        )}
      </div>

      {/* آمار */}
      <div>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Award className="text-primary" /> {t('profile.statsTitle')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card flex items-center gap-4 p-5 bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="p-3 bg-green-100 text-green-600 rounded-full"><Clock size={24} /></div>
<div>
              <p className="text-sm text-gray-500">{t('profile.totalStudyTime')}</p>
              <p className="font-bold text-lg">{stats.hours} {t('profile.hours')} {stats.mins} {t('profile.minutes')}</p>
            </div>
          </div>
          <div className="card flex items-center gap-4 p-5 bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-full"><BookOpen size={24} /></div>
            <div>
              <p className="text-sm text-gray-500">{t('profile.registeredExams')}</p>
              <p className="font-bold text-lg">{stats.exams}</p>
            </div>
          </div>
          <div className="card flex items-center gap-4 p-5 bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-full"><Award size={24} /></div>
            <div>
              <p className="text-sm text-gray-500">{t('profile.completedTasks')}</p>
              <p className="font-bold text-lg">{stats.completedHw} / {stats.totalHw}</p>
            </div>
          </div>
        </div>
      </div>

      {/* تنظیمات */}
      <div>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Sun className="text-primary" /> {t('profile.settingsTitle')}
        </h3>
        <div className="card divide-y divide-gray-100 dark:divide-neutral-800 bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
          
          {/* زبان */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Globe size={20} className="text-blue-500" />
              <span className="font-medium">{t('profile.language')}</span>
            </div>
            <div className="flex gap-1">
              <button 
                onClick={() => changeLanguage('fa')} 
                className={"px-4 py-1.5 text-sm rounded-md transition-colors " + (i18n.language === 'fa' ? 'bg-blue-500 text-white shadow-sm' : 'bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200')}
              >
                فارسی
              </button>
              <button 
                onClick={() => changeLanguage('en')} 
                className={"px-4 py-1.5 text-sm rounded-md transition-colors " + (i18n.language === 'en' ? 'bg-blue-500 text-white shadow-sm' : 'bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200')}
              >
                English
              </button>
            </div>
          </div>

          {/* حالت تاریک */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              {darkMode ? <Moon size={20} className="text-primary" /> : <Sun size={20} className="text-primary" />}
              <span className="font-medium">{t('profile.darkMode')}</span>
            </div>
            <button onClick={toggleTheme} className={"w-12 h-6 rounded-full transition-colors relative " + (darkMode ? 'bg-primary' : 'bg-gray-300')}>
              <div className={"absolute top-1 w-4 h-4 rounded-full bg-white transition-all " + (darkMode ? 'left-7' : 'left-1')} />
            </button>
          </div>

          {/* خروج */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3 text-red-500">
              <LogOut size={20} />
              <span className="font-medium">{t('profile.logout')}</span>
            </div>
            <button onClick={onLogout} className="px-4 py-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 font-medium text-sm transition-colors">
              {t('profile.logout')}
            </button>
          </div>

        </div>
      </div>
{/* مودال انتخاب رشته */}
      {isEduSelectorOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <EducationSelector
            initialGrade={editGrade}
            initialMajor={editMajor}
            initialYear={editYear}
            onSave={(g: string, m: string, y: string) => {
              setEditGrade(g);
              setEditMajor(m);
              setEditYear(y);
              setIsEduSelectorOpen(false);
            }}
            onCancel={() => setIsEduSelectorOpen(false)}
          />
        </div>
      )}
    </div>
  );
}
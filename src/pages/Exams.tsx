import { useState, useEffect } from 'react'
import { getSubjects } from '../lib/subjects'
import { supabase } from '../lib/supabase'
import { Plus, Calendar, MapPin, Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import ConfirmDialog from '../components/ConfirmDialog'

export default function ExamsPage({ user }: { user: any }) {
  const [isAdding, setIsAdding] = useState(false)
  const [exams, setExams] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // استیت‌های مودال حذف
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [examToDelete, setExamToDelete] = useState<string | null>(null)
  
  const availableSubjects = getSubjects(user.grade, user.major, user.year)
  
  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState(availableSubjects[0])
  const [examDate, setExamDate] = useState<any>(new Date().toISOString().slice(0, 16))
  const [location, setLocation] = useState('')

  const fetchExams = async () => {
    setIsLoading(true)
    const { data } = await supabase.from('exams').select('*').eq('user_id', user.id).order('exam_date', { ascending: true })
    if (data) setExams(data)
    setIsLoading(false)
  }

  useEffect(() => { if (user.id) fetchExams() }, [user.id])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title) return
    
    const { error } = await supabase.from('exams').insert([{ 
      user_id: user.id, title, subject, priority: 'high', exam_date: new Date(examDate).toISOString(), location 
    }])
    
    if (!error) { 
      setTitle(''); 
      setLocation(''); 
      setIsAdding(false); 
      fetchExams();
      toast.success('امتحان با موفقیت ثبت شد! ✅')
    } else {
      toast.error('خطا در ذخیره امتحان!')
    }
  }

  const confirmDelete = async () => {
    if (!examToDelete) return
    
    const { error } = await supabase.from('exams').delete().eq('id', examToDelete)
    
    if (!error) {
      toast.success('امتحان حذف شد! 🗑️')
      fetchExams()
    } else {
      toast.error('خطا در حذف امتحان!')
    }
    setExamToDelete(null)
  }

  const getCountdown = (dateStr: string) => {
    const today = new Date(); today.setHours(0,0,0,0)
    const examDate = new Date(dateStr); examDate.setHours(0,0,0,0)
    const diffDays = Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays === 0) return 'امروز!'
    if (diffDays === 1) return 'فردا'
    if (diffDays > 1) return diffDays + ' روز مانده'
    return 'برگزار شده'
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">امتحانات من 📝</h2>
        <button onClick={() => setIsAdding(!isAdding)} className="btn-primary"><Plus size={18} /> امتحان جدید</button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.form 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            onSubmit={handleAdd} 
            className="card bg-red-50/50 dark:bg-neutral-900 border-primary/20 space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* 🌟 تغییرات Accessibility (اتصال لیبل و آیدی) در این بخش اعمال شد */}
              <div>
                <label htmlFor="exam-title" className="block text-sm mb-1">عنوان</label>
                <input id="exam-title" type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 rounded-input border dark:bg-neutral-800" required />
              </div>
              
              <div>
                <label htmlFor="exam-subject" className="block text-sm mb-1">درس</label>
<select id="exam-subject" value={subject} onChange={e => setSubject(e.target.value)} className="w-full p-2 rounded-input border dark:bg-neutral-800">
                  {availableSubjects.map((s, i) => <option key={i} value={s}>{s}</option>)}
                </select>
              </div>
              
              <div>
                <label htmlFor="exam-date" className="block text-sm mb-1">تاریخ و ساعت</label>
                <input id="exam-date" type="datetime-local" value={examDate} onChange={e => setExamDate(e.target.value)} className="w-full p-2 rounded-input border dark:bg-neutral-800 outline-none" required />
              </div>
              
              <div>
                <label htmlFor="exam-location" className="block text-sm mb-1">مکان (اختیاری)</label>
                <input id="exam-location" type="text" value={location} onChange={e => setLocation(e.target.value)} className="w-full p-2 rounded-input border dark:bg-neutral-800" />
              </div>

            </div>
            <div className="flex gap-2 justify-end mt-4">
              <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 rounded-input hover:bg-gray-200 dark:hover:bg-neutral-800">انصراف</button>
              <button type="submit" className="btn-primary">ذخیره</button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {isLoading ? <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary" size={32} /></div> : (
        <div className="grid gap-3">
          <AnimatePresence>
            {exams?.length === 0 && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-gray-500 py-10">هیچ امتحانی ثبت نکردی.</motion.p>}
            
            {exams?.map((exam) => {
              const countdown = getCountdown(exam.exam_date)
              const isPast = countdown === 'برگزار شده'
              
              return (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }} 
                  animate={{ opacity: 1, scale: 1, y: 0 }} 
                  exit={{ opacity: 0, scale: 0.9, x: -50 }} 
                  key={exam.id} 
                  className={"card flex flex-col md:flex-row md:items-center justify-between gap-4 group " + (isPast ? 'opacity-60' : 'hover:border-primary/30')}
                >
                  <div className="flex items-start gap-4">
                    <div className={"p-3 rounded-full " + (isPast ? 'bg-gray-100 text-gray-400' : 'bg-red-50 text-primary dark:bg-red-950/30')}><Calendar size={24} /></div>
                    <div>
                      <h3 className="font-bold text-lg">{exam.title}</h3>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mt-1">
                        <span className="bg-gray-100 dark:bg-neutral-800 px-2 py-0.5 rounded text-xs text-ink">{exam.subject}</span>
                        <span>{new Date(exam.exam_date).toLocaleDateString('fa-IR')} - {new Date(exam.exam_date).toLocaleTimeString('fa-IR', {hour: '2-digit', minute:'2-digit'})}</span>
                        {exam.location && <span className="flex items-center gap-1"><MapPin size={14}/> {exam.location}</span>}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 self-end md:self-auto">
                    <span className={"px-4 py-1.5 rounded-full text-sm font-bold " + (isPast ? 'bg-gray-100 text-gray-500' : countdown === 'امروز!' || countdown === 'فردا' ? 'bg-red-500 text-white animate-pulse' : 'bg-orange-100 text-orange-600 dark:bg-orange-950/50')}>
                      {countdown}
</span>
                    {/* 🌟 اضافه شدن aria-label به دکمه حذف */}
                    <motion.button 
                      whileTap={{ scale: 0.8 }} 
                      onClick={() => { setExamToDelete(exam.id); setIsConfirmOpen(true); }} 
                      className="p-2 text-gray-400 hover:text-red-500 opacity-100 md:opacity-0 group-hover:opacity-100"
                      aria-label="حذف امتحان"
                    >
                      <Trash2 size={20} />
                    </motion.button>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      <ConfirmDialog 
        isOpen={isConfirmOpen} 
        onClose={() => setIsConfirmOpen(false)} 
        onConfirm={confirmDelete}
        title="حذف امتحان"
        message="آیا مطمئنی می‌خوای این امتحان رو حذف کنی؟"
      />
    </div>
  )
}
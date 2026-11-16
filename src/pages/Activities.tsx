import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Plus, Trash2, Dumbbell, BookOpen, Users, Briefcase, Calendar as CalendarIcon, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import JalaliDateInput from '../components/JalaliDateInput'

export default function ActivitiesPage({ user }: { user: any }) {
  const [isAdding, setIsAdding] = useState(false)
  const [activities, setActivities] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('ورزش')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [startTime, setStartTime] = useState('16:00')
  const [endTime, setEndTime] = useState('17:00')
  const [notes, setNotes] = useState('')

  const fetchActivities = async () => {
    setIsLoading(true)
    const { data } = await supabase.from('activities').select('*').eq('user_id', user.id).order('date', { ascending: false })
    if (data) setActivities(data)
    setIsLoading(false)
  }

  useEffect(() => { if (user.id) fetchActivities() }, [user.id])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title) return
    await supabase.from('activities').insert([{ user_id: user.id, title, category, date, start_time: startTime, end_time: endTime, notes }])
    setTitle(''); setNotes(''); setIsAdding(false); fetchActivities()
  }

  const deleteActivity = async (id: string) => {
    if (window.confirm('حذف شود؟')) { await supabase.from('activities').delete().eq('id', id); fetchActivities() }
  }

  const getCategoryIcon = (cat: string) => {
    if (cat === 'ورزش') return <Dumbbell size={20} className="text-blue-500" />
    if (cat === 'مدرسه' || cat === 'دانشگاه') return <BookOpen size={20} className="text-green-500" />
    if (cat === 'دورهمی') return <Users size={20} className="text-purple-500" />
    if (cat === 'کار') return <Briefcase size={20} className="text-orange-500" />
    return <CalendarIcon size={20} className="text-gray-500" />
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">فعالیت‌های من 🏃‍♂️</h2>
        <button onClick={() => setIsAdding(!isAdding)} className="btn-primary"><Plus size={18} /> فعالیت جدید</button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.form initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} onSubmit={handleAdd} className="card bg-red-50/50 dark:bg-neutral-900 border-primary/20 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-sm mb-1">عنوان</label><input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 rounded-input border dark:bg-neutral-800" required /></div>
              <div><label className="block text-sm mb-1">دسته</label><select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-2 rounded-input border dark:bg-neutral-800"><option value="ورزش">ورزش</option><option value="مدرسه">مدرسه</option><option value="دانشگاه">دانشگاه</option><option value="دورهمی">دورهمی</option><option value="کار">کار</option><option value="سایر">سایر</option></select></div>
              <div><label className="block text-sm mb-1">تاریخ</label><JalaliDateInput value={date} onChange={setDate} /></div>
              <div className="grid grid-cols-2 gap-2">
                <div><label className="block text-sm mb-1">شروع</label><input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full p-2 rounded-input border dark:bg-neutral-800" required /></div>
<div><label className="block text-sm mb-1">پایان</label><input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="w-full p-2 rounded-input border dark:bg-neutral-800" required /></div>
              </div>
              <div className="md:col-span-2"><label className="block text-sm mb-1">یادداشت</label><input type="text" value={notes} onChange={e => setNotes(e.target.value)} className="w-full p-2 rounded-input border dark:bg-neutral-800" /></div>
            </div>
            <div className="flex gap-2 justify-end mt-4"><button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 rounded-input hover:bg-gray-200 dark:hover:bg-neutral-800">انصراف</button><button type="submit" className="btn-primary">ذخیره</button></div>
          </motion.form>
        )}
      </AnimatePresence>

      {isLoading ? <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary" size={32} /></div> : (
        <div className="grid gap-3">
          <AnimatePresence>
            {activities?.length === 0 && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-gray-500 py-10">فعالیتی ثبت نکردی.</motion.p>}
            {activities?.map((act) => (
              <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} key={act.id} className="card flex flex-col md:flex-row md:items-center justify-between gap-4 group">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gray-100 dark:bg-neutral-800 rounded-full">{getCategoryIcon(act.category)}</div>
                  <div>
                    <h3 className="font-bold text-lg">{act.title}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mt-1">
                      <span className="bg-gray-100 dark:bg-neutral-800 px-2 py-0.5 rounded text-xs">{act.category}</span>
                      <span>{new Date(act.date).toLocaleDateString('fa-IR')}</span>
                      <span dir="ltr">{act.start_time} - {act.end_time}</span>
                    </div>
                    {act.notes && <p className="text-xs text-gray-400 mt-1">📝 {act.notes}</p>}
                  </div>
                </div>
                <motion.button whileTap={{ scale: 0.8 }} onClick={() => deleteActivity(act.id)} className="p-2 text-gray-400 hover:text-red-500 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity self-end md:self-auto"><Trash2 size={20} /></motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
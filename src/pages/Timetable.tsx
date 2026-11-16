import { useState, useEffect } from 'react'
import { getSubjects } from '../lib/subjects'
import { supabase } from '../lib/supabase'
import { Plus, Trash2, Clock, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const DAYS = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه']

export default function TimetablePage({ user }: { user: any }) {
  const availableSubjects = getSubjects(user.grade, user.major, user.year)
  const [isAdding, setIsAdding] = useState(false)
  const [day, setDay] = useState('شنبه')
  const [subject, setSubject] = useState(availableSubjects[0])
  const [startTime, setStartTime] = useState('08:00')
  const [endTime, setEndTime] = useState('09:30')
  const [classes, setClasses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchClasses = async () => {
    setIsLoading(true)
    const { data } = await supabase.from('classes').select('*').eq('user_id', user.id)
    if (data) setClasses(data)
    setIsLoading(false)
  }

  useEffect(() => { if (user.id) fetchClasses() }, [user.id])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    await supabase.from('classes').insert([{ user_id: user.id, day, subject, start_time: startTime, end_time: endTime }])
    setIsAdding(false); fetchClasses()
  }

  const deleteClass = async (id: string) => {
    if (window.confirm('حذف شود؟')) { await supabase.from('classes').delete().eq('id', id); fetchClasses() }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">برنامه کلاسی 📅</h2>
        <button onClick={() => setIsAdding(!isAdding)} className="btn-primary"><Plus size={18} /> کلاس جدید</button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.form 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            onSubmit={handleAdd} className="card bg-red-50/50 dark:bg-neutral-900 border-primary/20 space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div><label className="block text-sm mb-1">روز</label><select value={day} onChange={e => setDay(e.target.value)} className="w-full p-2 rounded-input border dark:bg-neutral-800">{DAYS.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
              <div><label className="block text-sm mb-1">درس</label><select value={subject} onChange={e => setSubject(e.target.value)} className="w-full p-2 rounded-input border dark:bg-neutral-800">{availableSubjects.map((s, i) => <option key={i} value={s}>{s}</option>)}</select></div>
              <div><label className="block text-sm mb-1">شروع</label><input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full p-2 rounded-input border dark:bg-neutral-800" required /></div>
              <div><label className="block text-sm mb-1">پایان</label><input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="w-full p-2 rounded-input border dark:bg-neutral-800" required /></div>
            </div>
            <div className="flex justify-end gap-2"><button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 rounded-input hover:bg-gray-200 dark:hover:bg-neutral-800">انصراف</button><button type="submit" className="btn-primary">ذخیره</button></div>
          </motion.form>
        )}
      </AnimatePresence>

      {isLoading ? <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary" size={32} /></div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DAYS.map(d => {
const dayClasses = classes?.filter(c => c.day === d).sort((a, b) => a.start_time.localeCompare(b.start_time)) || []
            if (dayClasses.length === 0) return null
            return (
              <motion.div layout key={d} className="card p-0 overflow-hidden bg-white/40 dark:bg-neutral-900/40 backdrop-blur-md">
                <div className="bg-primary/10 p-3 text-center border-b border-primary/20"><h3 className="font-bold text-primary">{d}</h3></div>
                <div className="p-3 space-y-2">
                  <AnimatePresence>
                    {dayClasses.map(c => (
                      <motion.div layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, x: 20 }} key={c.id} className="flex items-center justify-between p-2 rounded bg-gray-50/50 dark:bg-neutral-800/50 group">
                        <div><p className="font-bold text-sm">{c.subject}</p><p className="text-xs text-gray-500 flex items-center gap-1 mt-1"><Clock size={12}/> {c.start_time} تا {c.end_time}</p></div>
                        <motion.button whileTap={{ scale: 0.8 }} onClick={() => deleteClass(c.id)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></motion.button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            )
          })}
          {classes?.length === 0 && <div className="col-span-full text-center py-10 text-gray-500">برنامه‌ای وارد نکردی.</div>}
        </div>
      )}
    </div>
  )
}

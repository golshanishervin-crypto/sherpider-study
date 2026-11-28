import { useState, useEffect } from 'react'
import { getSubjects } from '../lib/subjects'
import { supabase } from '../lib/supabase'
import { Plus, CheckCircle, Clock, Trash2, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import JalaliDateInput from '../components/JalaliDateInput';

export default function HomeworkPage({ user }: { user: any }) {
  const [isAdding, setIsAdding] = useState(false)
  const [homeworks, setHomeworks] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const availableSubjects = getSubjects(user.grade, user.major, user.year)
  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState(availableSubjects[0])
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [dueDate, setDueDate] = useState<any>(new Date().toISOString().slice(0, 16))

  const fetchHomeworks = async () => {
    setIsLoading(true)
    const { data } = await supabase.from('homework').select('*').eq('user_id', user.id).order('due_date', { ascending: false })
    if (data) setHomeworks(data)
    setIsLoading(false)
  }

  useEffect(() => { if (user.id) fetchHomeworks() }, [user.id])

const handleAdd = async (e: React.FormEvent) => {
  e.preventDefault()
  if (!title) return
  
  // 🌟 چک کردن ارور و نمایش دقیق اون
  const { error } = await supabase.from('homework').insert([{ 
    user_id: user.id, title, subject, priority, due_date: new Date(dueDate).toISOString(), status: 'pending' 
  }])
  
  if (!error) { 
    setTitle(''); 
    setIsAdding(false); 
    fetchHomeworks(); 
    toast.success('تکلیف ذخیره شد! ✅') 
  } else {
    console.error("خطای دیتابیس:", error) 
    toast.error('خطای دیتابیس: ' + error.message) // این خط دقیقا میگه مشکل چیه
  }
}

  const toggleStatus = async (id: string, currentStatus: string) => {
    await supabase.from('homework').update({ status: currentStatus === 'pending' ? 'completed' : 'pending' }).eq('id', id)
    fetchHomeworks()
  }

  const deleteHomework = async (id: string) => {
    if (window.confirm('حذف شود؟')) {
      await supabase.from('homework').delete().eq('id', id)
      fetchHomeworks(); toast.success('حذف شد!')
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">تکالیف من 📚</h2>
        <button onClick={() => setIsAdding(!isAdding)} className="btn-primary"><Plus size={18} /> تکلیف جدید</button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.form initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} onSubmit={handleAdd} className="card bg-red-50/50 dark:bg-neutral-900 border-primary/20 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-sm mb-1">عنوان</label><input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 rounded-input border dark:bg-neutral-800" required /></div>
              <div><label className="block text-sm mb-1">درس</label><select value={subject} onChange={e => setSubject(e.target.value)} className="w-full p-2 rounded-input border dark:bg-neutral-800">{availableSubjects.map((s, i) => <option key={i} value={s}>{s}</option>)}</select></div>
              <JalaliDateInput 
  value={dueDate} 
  onChange={(newDate) => setDueDate(newDate)} 
/>
              <div><label className="block text-sm mb-1">اهمیت</label><select value={priority} onChange={e => setPriority(e.target.value as any)} className="w-full p-2 rounded-input border dark:bg-neutral-800"><option value="low">کم</option><option value="medium">متوسط</option><option value="high">زیاد</option></select></div>
            </div>
            <div className="flex gap-2 justify-end mt-4"><button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 rounded-input hover:bg-gray-200 dark:hover:bg-neutral-800">انصراف</button><button type="submit" className="btn-primary">ذخیره</button></div>
          </motion.form>
        )}
      </AnimatePresence>
{isLoading ? <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary" size={32} /></div> : (
        <div className="grid gap-3">
          <AnimatePresence>
            {homeworks?.length === 0 && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-gray-500 py-10">هیچ تکلیفی ثبت نکردی.</motion.p>}
            {homeworks?.map((hw) => (
              <motion.div layout initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, x: -50 }} key={hw.id} className="card flex items-center justify-between group hover:border-primary/30">
                <div className="flex items-center gap-4">
                  <motion.button whileTap={{ scale: 0.8 }} onClick={() => toggleStatus(hw.id, hw.status)} className={"transition-colors " + (hw.status === 'completed' ? 'text-green-500' : 'text-gray-300 dark:text-neutral-600 hover:text-primary')}><CheckCircle size={28} /></motion.button>
                  <div>
                    <h3 className={"font-bold " + (hw.status === 'completed' ? 'line-through text-gray-400' : '')}>{hw.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-gray-500 mt-1"><span className="bg-gray-100 dark:bg-neutral-800 px-2 py-0.5 rounded text-xs">{hw.subject}</span><span className="flex items-center gap-1"><Clock size={14}/> {new Date(hw.due_date).toLocaleDateString('fa-IR')}</span></div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={"w-2 h-10 rounded-full " + (hw.priority === 'high' ? 'bg-red-500' : hw.priority === 'medium' ? 'bg-orange-400' : 'bg-blue-400')} />
                  <motion.button whileTap={{ scale: 0.8 }} onClick={() => deleteHomework(hw.id)} className="p-2 text-gray-300 hover:text-red-500 opacity-100 md:opacity-0 group-hover:opacity-100"><Trash2 size={20} /></motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
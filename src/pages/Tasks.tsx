import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Plus, CheckCircle, Trash2, ListTodo, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function TasksPage({ user }: { user: any }) {
  const [isAdding, setIsAdding] = useState(false)
  const [title, setTitle] = useState('')
  const [tasks, setTasks] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchTasks = async () => {
    setIsLoading(true)
    const { data } = await supabase.from('tasks').select('*').eq('user_id', user.id).order('id', { ascending: false })
    if (data) setTasks(data)
    setIsLoading(false)
  }

  useEffect(() => { if (user.id) fetchTasks() }, [user.id])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title) return
    await supabase.from('tasks').insert([{ user_id: user.id, title, status: 'pending' }])
    setTitle(''); setIsAdding(false); fetchTasks()
  }

  const toggleStatus = async (id: string, currentStatus: string) => {
    await supabase.from('tasks').update({ status: currentStatus === 'pending' ? 'completed' : 'pending' }).eq('id', id)
    fetchTasks()
  }

  const deleteTask = async (id: string) => {
    await supabase.from('tasks').delete().eq('id', id)
    fetchTasks()
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">کارهای روزمره 📝</h2>
        <button onClick={() => setIsAdding(!isAdding)} className="btn-primary"><Plus size={18} /> کار جدید</button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.form initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} onSubmit={handleAdd} className="card flex items-center gap-2 p-3 bg-red-50/50 dark:bg-neutral-900 border-primary/20">
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="flex-1 p-2 rounded-input border dark:bg-neutral-800 outline-none" placeholder="مثلا: خرید نان" autoFocus required />
            <button type="submit" className="btn-primary px-4 py-2">افزودن</button>
          </motion.form>
        )}
      </AnimatePresence>

      {isLoading ? <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary" size={32} /></div> : (
        <div className="card p-4 space-y-2 bg-white/40 dark:bg-neutral-900/40 backdrop-blur-md">
          <AnimatePresence>
            {tasks?.length === 0 && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10 text-gray-400"><ListTodo size={48} className="mx-auto mb-4 opacity-20" /><p>هیچ کاری نداری.</p></motion.div>}
            {tasks?.map((task) => (
              <motion.div layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} key={task.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50/50 dark:hover:bg-neutral-800/50 transition-colors group border-b border-gray-100 dark:border-neutral-800 last:border-0">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => toggleStatus(task.id, task.status)}>
                  <motion.button whileTap={{ scale: 0.8 }} className={"transition-colors " + (task.status === 'completed' ? 'text-green-500' : 'text-gray-300 dark:text-neutral-600')}><CheckCircle size={24} /></motion.button>
                  <span className={"font-medium " + (task.status === 'completed' ? 'line-through text-gray-400' : '')}>{task.title}</span>
                </div>
                <motion.button whileTap={{ scale: 0.8 }} onClick={() => deleteTask(task.id)} className="p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={18} /></motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

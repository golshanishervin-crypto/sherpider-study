import { useState } from 'react'
import { Plus } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { toast } from 'sonner'

export default function QuizAddForm({ user, subjects, onAdded }: { user: any, subjects: string[], onAdded: () => void }) {
  const [subject, setSubject] = useState(subjects[0])
  const [qText, setQText] = useState('')
  const [options, setOptions] = useState(['', '', '', ''])
  const [correctOpt, setCorrectOpt] = useState(1)
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!qText || options.some(o => !o)) return toast.error('لطفاً همه فیلدها را پر کنید')
    if (user.id === 'offline') return toast.error('برای ساخت سوال باید با ایمیل وارد شوید.')

    setIsSaving(true)
    const { error } = await supabase.from('questions').insert([{
      user_id: user.id, subject, question_text: qText,
      option_1: options[0], option_2: options[1], option_3: options[2], option_4: options[3], 
      correct_option: correctOpt
    }])

    if (error) {
      toast.error('خطا در ذخیره سوال!')
    } else {
      toast.success('سوال با موفقیت اضافه شد! ✅')
      setQText(''); setOptions(['', '', '', '']); setCorrectOpt(1)
      onAdded()
    }
    setIsSaving(false)
  }

  return (
    <div className="card p-5 h-fit">
      <h3 className="font-bold mb-4 flex items-center gap-2"><Plus size={18} className="text-primary"/> ساخت سوال جدید</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <select value={subject} onChange={e => setSubject(e.target.value)} className="w-full p-2 text-sm rounded-xl border dark:bg-neutral-800 outline-none">
          {subjects.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <input type="text" placeholder="متن سوال..." value={qText} onChange={e => setQText(e.target.value)} className="w-full p-2 text-sm rounded-xl border dark:bg-neutral-800 outline-none" />
        {options.map((opt, i) => (
          <input key={i} type="text" placeholder={"گزینه " + (i+1)} value={opt} onChange={e => { const newO = [...options]; newO[i] = e.target.value; setOptions(newO); }} className="w-full p-2 text-sm rounded-xl border dark:bg-neutral-800 outline-none" />
        ))}
        <div className="flex gap-1">
          {[1,2,3,4].map(n => (
            <button key={n} type="button" onClick={() => setCorrectOpt(n)} className={"flex-1 py-1 text-xs font-bold rounded-lg border-2 " + (correctOpt === n ? "bg-green-500 text-white border-green-500" : "border-gray-200 dark:border-neutral-700")}>گزینه {n}</button>
          ))}
        </div>
        <button type="submit" disabled={isSaving} className="btn-primary w-full py-2 mt-2 text-sm">{isSaving ? '...' : 'ذخیره سوال'}</button>
      </form>
    </div>
  )
}

import { Trash2, Loader2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export default function QuizList({ questions, isLoading, onDeleted }: { questions: any[], isLoading: boolean, onDeleted: () => void }) {
  
  const handleDelete = async (id: string) => {
    if (window.confirm('این سوال حذف شود؟')) {
      await supabase.from('questions').delete().eq('id', id)
      onDeleted()
    }
  }

  return (
    <div className="lg:col-span-2 space-y-3">
      <h3 className="font-bold text-gray-500">بانک سوالات شما ({questions.length} سوال)</h3>
      {isLoading ? <Loader2 className="animate-spin mx-auto text-primary mt-10" /> : questions.length === 0 ? (
        <div className="text-center py-10 text-gray-400">هنوز سوالی نساختی!</div>
      ) : (
        questions.map((q, idx) => (
          <div key={q.id} className="card p-4 flex justify-between items-start group">
            <div>
              <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-md mb-2 inline-block">{q.subject}</span>
              <h4 className="font-bold text-sm mb-2">{idx + 1}. {q.question_text}</h4>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                <span className={q.correct_option === 1 ? 'text-green-500 font-bold' : ''}>۱. {q.option_1}</span>
                <span className={q.correct_option === 2 ? 'text-green-500 font-bold' : ''}>۲. {q.option_2}</span>
                <span className={q.correct_option === 3 ? 'text-green-500 font-bold' : ''}>۳. {q.option_3}</span>
                <span className={q.correct_option === 4 ? 'text-green-500 font-bold' : ''}>۴. {q.option_4}</span>
              </div>
            </div>
            <button onClick={() => handleDelete(q.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={18}/></button>
          </div>
        ))
      )}
    </div>
  )
}

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { getSubjects } from '../lib/subjects'
import { BookOpen, History, Play } from 'lucide-react'
import { toast } from 'sonner'

// 🌟 ایمپورت کامپوننت‌های جدید
import QuizAddForm from '../components/quizzes/QuizAddForm'
import QuizList from '../components/quizzes/QuizList'
import KonkurExams from '../components/quizzes/KonkurExams'
import QuizTaking from '../components/quizzes/QuizTaking'

export default function QuizzesPage({ user }: { user: any }) {
  const subjects = getSubjects(user.grade, user.major, user.year)
  const [activeTab, setActiveTab] = useState<'my_quizzes' | 'konkur' | 'taking'>('my_quizzes')
  
  const [myQuestions, setMyQuestions] = useState<any[]>([])
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true)

  const [activeQuiz, setActiveQuiz] = useState<any[]>([])
  const [quizTitle, setQuizTitle] = useState('')

  useEffect(() => {
    fetchMyQuestions()
  }, [user.id])

  const fetchMyQuestions = async () => {
    setIsLoadingQuestions(true)
    const { data } = await supabase.from('questions').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    if (data) setMyQuestions(data)
    setIsLoadingQuestions(false)
  }

  const startCustomQuiz = () => {
    if (myQuestions.length === 0) return toast.error('هنوز سوالی نساختی!')
    const shuffled = [...myQuestions].sort(() => Math.random() - 0.5).slice(0, 10)
    setActiveQuiz(shuffled)
    setQuizTitle('آزمون شخصی')
    setActiveTab('taking')
  }

  const startKonkurMock = (year: string, mockQs: any[]) => {
    if (mockQs.length === 0) return toast.error('آزمون تعاملی برای این سال موجود نیست.')
    const shuffled = [...mockQs].sort(() => Math.random() - 0.5)
    setActiveQuiz(shuffled)
    setQuizTitle('آزمون تمرینی کنکور ' + year)
    setActiveTab('taking')
  }

  // 🌟 نمایش کامپوننت آزمون
  if (activeTab === 'taking' && activeQuiz.length > 0) {
    return <QuizTaking quiz={activeQuiz} title={quizTitle} onFinish={() => setActiveTab('my_quizzes')} />
  }

  return (
    <div className="space-y-6 animate-in fade-in max-w-4xl mx-auto">
      <div className="flex bg-gray-100 dark:bg-neutral-800 p-1 rounded-2xl max-w-md mx-auto">
        <button onClick={() => setActiveTab('my_quizzes')} className={"flex-1 py-2 rounded-xl font-bold transition-all flex items-center justify-center gap-2 " + (activeTab === 'my_quizzes' ? 'bg-white dark:bg-neutral-700 shadow-sm text-primary' : 'text-gray-500')}>
          <BookOpen size={18} /> آزمون‌های من
        </button>
        <button onClick={() => setActiveTab('konkur')} className={"flex-1 py-2 rounded-xl font-bold transition-all flex items-center justify-center gap-2 " + (activeTab === 'konkur' ? 'bg-white dark:bg-neutral-700 shadow-sm text-primary' : 'text-gray-500')}>
          <History size={18} /> کنکورهای گذشته
        </button>
      </div>

      {activeTab === 'my_quizzes' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* کامپوننت فرم ساخت سوال */}
          <div className="lg:col-span-1">
            <QuizAddForm user={user} subjects={subjects} onAdded={fetchMyQuestions} />
            <button onClick={startCustomQuiz} className="w-full py-3 mt-4 bg-green-500 text-white rounded-xl font-bold shadow-lg shadow-green-500/30 flex items-center justify-center gap-2 hover:bg-green-600 transition-colors">
              <Play size={18}/> شروع آزمون از سوالات من
            </button>
          </div>

          {/* کامپوننت لیست سوالات */}
          <QuizList questions={myQuestions} isLoading={isLoadingQuestions} onDeleted={fetchMyQuestions} />
        </div>
      )}

      {/* کامپوننت کنکور */}
      {activeTab === 'konkur' && <KonkurExams onStartMock={startKonkurMock} />}
    </div>
  )
}

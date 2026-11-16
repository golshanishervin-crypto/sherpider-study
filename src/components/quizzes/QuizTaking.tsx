import { useState } from 'react'
import { Award, ArrowRight } from 'lucide-react'

export default function QuizTaking({ quiz, title, onFinish }: { quiz: any[], title: string, onFinish: () => void }) {
  const [currentQIndex, setCurrentQIndex] = useState(0)
  const [selectedAns, setSelectedAns] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [isQuizFinished, setIsQuizFinished] = useState(false)

  const handleAnswer = (optIndex: number) => {
    if (selectedAns !== null) return
    setSelectedAns(optIndex + 1)
    
    const q = quiz[currentQIndex]
    const isCorrect = q.correct_option 
      ? q.correct_option === optIndex + 1 
      : q.correct === optIndex
      
    if (isCorrect) setScore(prev => prev + 1)

    setTimeout(() => {
      if (currentQIndex < quiz.length - 1) {
        setCurrentQIndex(prev => prev + 1)
        setSelectedAns(null)
      } else {
        setIsQuizFinished(true)
      }
    }, 800)
  }

  if (isQuizFinished) {
    const percentage = Math.round((score / quiz.length) * 100)
    return (
      <div className="space-y-6 max-w-md mx-auto text-center animate-in zoom-in">
        <div className="card p-8 bg-gradient-to-b from-primary/10 to-transparent border-primary/30 shadow-2xl">
          <div className={"w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl " + (percentage >= 50 ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500')}>
            <Award size={48} />
          </div>
          <h2 className="text-3xl font-bold mb-2">پایان آزمون!</h2>
          <p className="text-gray-500 mb-8">{title}</p>
          <div className="text-6xl font-black text-primary mb-2" dir="ltr">{score} / {quiz.length}</div>
          <p className="text-lg font-bold text-gray-600 dark:text-gray-300 mb-8">{percentage}٪ درست</p>
          <button onClick={onFinish} className="w-full py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/30">بازگشت</button>
        </div>
      </div>
    )
  }

  const q = quiz[currentQIndex]
  const currentQText = q.question_text || q.question
  const currentOptions = q.question_text ? [q.option_1, q.option_2, q.option_3, q.option_4] : q.options

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center">
        <button onClick={onFinish} className="text-gray-500 hover:text-primary"><ArrowRight size={20}/></button>
        <span className="font-bold text-gray-500">سوال {currentQIndex + 1} از {quiz.length}</span>
        <span className="font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">{title}</span>
      </div>
      
      <div className="w-full bg-gray-200 dark:bg-neutral-800 rounded-full h-2 mb-6">
        <div className="bg-primary h-2 rounded-full transition-all" style={{ width: ((currentQIndex) / quiz.length) * 100 + '%' }}></div>
      </div>
      
      <div className="card p-8 text-center bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border-2 border-primary/20 shadow-2xl">
        <h3 className="text-xl md:text-2xl font-bold mb-8">{currentQText}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentOptions.map((opt: string, idx: number) => {
            let btnClass = "p-4 rounded-xl border-2 text-base font-medium transition-all text-right "
            if (selectedAns === null) {
              btnClass += "border-gray-200 dark:border-neutral-700 hover:border-primary hover:bg-primary/5"
            } else if (selectedAns === idx + 1) {
              const isCorrect = q.correct_option ? q.correct_option === idx + 1 : q.correct === idx
              btnClass += isCorrect ? "bg-green-500 text-white border-green-500" : "bg-red-500 text-white border-red-500"
            } else {
              btnClass += "opacity-40 border-gray-200 dark:border-neutral-700"
}
            return (
              <button key={idx} onClick={() => handleAnswer(idx)} disabled={selectedAns !== null} className={btnClass}>
                {opt}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

import { Play, Download, FileText, XCircle } from 'lucide-react'
import { KONKUR_EXAMS } from '../../lib/konkurData'

export default function KonkurExams({ onStartMock }: { onStartMock: (year: string, questions: any[]) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {KONKUR_EXAMS.map(exam => (
        <div key={exam.year} className="card p-6 flex flex-col justify-between bg-gradient-to-br from-indigo-500/5 to-transparent border-indigo-500/20">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-indigo-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 font-bold text-xl">
                {exam.year.split(' ')[0]}
              </div>
              <div>
                <h3 className="font-bold text-lg text-ink dark:text-white">{exam.title}</h3>
                <p className="text-xs text-gray-500">{exam.description}</p>
              </div>
            </div>
            
            <div className="space-y-2 mb-6">
              <a href={exam.pdfLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 hover:border-indigo-500 transition-colors group">
                <span className="text-sm font-medium flex items-center gap-2"><FileText size={16} className="text-indigo-500"/> دانلود دفترچه سوالات</span>
                <Download size={16} className="text-gray-400 group-hover:text-indigo-500"/>
              </a>
              
              {exam.answersLink ? (
                <a href={exam.answersLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 hover:border-green-500 transition-colors group">
                  <span className="text-sm font-medium flex items-center gap-2"><FileText size={16} className="text-green-500"/> دانلود کلید پاسخ‌ها</span>
                  <Download size={16} className="text-gray-400 group-hover:text-green-500"/>
                </a>
              ) : (
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-100 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 opacity-70 cursor-not-allowed">
                  <span className="text-sm font-medium flex items-center gap-2 text-gray-500"><XCircle size={16}/> پاسخنامه برای این سال موجود نیست</span>
                </div>
              )}
            </div>
          </div>

          <button 
            onClick={() => onStartMock(exam.year, exam.mockQuestions)}
            className="w-full py-3 bg-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2"
          >
            <Play size={18} /> شروع سوالات تمرینی نمونه
          </button>
          <p className="text-xs text-center text-gray-500 mt-2">این سوال‌ها تمرینی و نمونه‌اند و از دفترچه رسمی کنکور نیستند.</p>
        </div>
      ))}
    </div>
  )
}

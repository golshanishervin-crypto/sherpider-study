import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GraduationCap, BookOpen, ChevronLeft, CheckCircle2, Award, Briefcase } from 'lucide-react'

interface EducationSelectorProps {
  initialGrade?: string
  initialMajor?: string
  initialYear?: string
  onSave: (grade: string, major: string, year: string) => void
  onCancel?: () => void
}

const GRADES = [
  { id: 'ابتدایی', label: 'ابتدایی', icon: <BookOpen size={24} />, color: 'bg-green-500' },
  { id: 'متوسطه اول', label: 'متوسطه اول', icon: <BookOpen size={24} />, color: 'bg-blue-500' },
  { id: 'متوسطه دوم', label: 'متوسطه دوم (نظری)', icon: <GraduationCap size={24} />, color: 'bg-primary' },
  { id: 'هنرستان', label: 'هنرستان (فنی‌وحرفه‌ای)', icon: <Briefcase size={24} />, color: 'bg-orange-500' },
  { id: 'دانشگاه', label: 'دانشگاه', icon: <Award size={24} />, color: 'bg-purple-500' },
]

const MAJORS: Record<string, { id: string, label: string }[]> = {
  'متوسطه دوم': [
    { id: 'ریاضی و فیزیک', label: 'ریاضی و فیزیک' },
    { id: 'علوم تجربی', label: 'علوم تجربی' },
    { id: 'علوم انسانی', label: 'علوم انسانی' },
    { id: 'معارف اسلامی', label: 'معارف اسلامی' },
  ],
  'هنرستان': [
    { id: 'کامپیوتر', label: 'کامپیوتر' },
    { id: 'شبکه و نرم‌افزار', label: 'شبکه و نرم‌افزار' },
    { id: 'الکترونیک', label: 'الکترونیک' },
    { id: 'الکتروتکنیک', label: 'الکتروتکنیک (برق)' },
    { id: 'مکاترونیک', label: 'مکاترونیک' },
    { id: 'مکانیک خودرو', label: 'مکانیک خودرو' },
    { id: 'ساخت و تولید', label: 'ساخت و تولید' },
    { id: 'گرافیک', label: 'گرافیک' },
    { id: 'معماری داخلی', label: 'معماری داخلی' },
    { id: 'طراحی و دوخت', label: 'طراحی و دوخت' },
    { id: 'حسابداری', label: 'حسابداری' },
    { id: 'مدیریت امور اداری', label: 'مدیریت امور اداری' },
    { id: 'گردشگری', label: 'گردشگری' },
    { id: 'تربیت بدنی', label: 'تربیت بدنی' },
  ],
  'دانشگاه': [
    { id: 'مهندسی کامپیوتر', label: 'مهندسی کامپیوتر' },
    { id: 'مهندسی برق', label: 'مهندسی برق' },
    { id: 'مهندسی مکانیک', label: 'مهندسی مکانیک' },
    { id: 'مهندسی عمران', label: 'مهندسی عمران' },
    { id: 'مهندسی معماری', label: 'مهندسی معماری' },
    { id: 'پزشکی', label: 'پزشکی' },
    { id: 'پرستاری', label: 'پرستاری' },
    { id: 'داروسازی', label: 'داروسازی' },
    { id: 'حقوق', label: 'حقوق' },
    { id: 'روانشناسی', label: 'روانشناسی' },
    { id: 'مدیریت', label: 'مدیریت' },
    { id: 'حسابداری', label: 'حسابداری' },
    { id: 'علوم تربیتی', label: 'علوم تربیتی' },
    { id: 'گرافیک', label: 'گرافیک' },
    { id: 'زبان انگلیسی', label: 'زبان انگلیسی' },
  ]
}

const YEARS = ['دهم', 'یازدهم', 'دوازدهم']

export default function EducationSelector({ initialGrade = 'متوسطه دوم', initialMajor = 'علوم تجربی', initialYear = 'یازدهم', onSave, onCancel }: EducationSelectorProps) {
  const [step, setStep] = useState(1)
  const [grade, setGrade] = useState(initialGrade)
  const [major, setMajor] = useState(initialMajor)
  const [year, setYear] = useState(initialYear)

  const handleGradeSelect = (g: string) => {
    setGrade(g)
    if (g === 'ابتدایی' || g === 'متوسطه اول') {
      setMajor('عمومی')
      setYear('همه')
      setStep(3)
    } else {
      setMajor(MAJORS[g][0].id)
      setStep(2)
    }
  }

  const handleMajorSelect = (m: string) => {
    setMajor(m)
    setStep(3)
  }

  const handleSave = () => {
    onSave(grade, major, year)
  }

  // توابع برای جلوگیری از خطای بک‌تیک (Template Literals)
  const getGradeBtnClass = (id: string) => {
    return "w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all " + (grade === id ? "border-primary bg-primary/5" : "border-gray-100 dark:border-neutral-800 hover:border-primary/30")
  }

  const getMajorBtnClass = (id: string) => {
    return "p-4 rounded-xl border-2 text-center transition-all " + (major === id ? "border-primary bg-primary/5 text-primary" : "border-gray-100 dark:border-neutral-800 hover:border-primary/30 text-ink dark:text-gray-300")
  }
const getYearBtnClass = (y: string) => {
    return "px-6 py-2 rounded-full font-bold transition-all " + (year === y ? "bg-primary text-white shadow-md" : "bg-gray-100 dark:bg-neutral-800 text-gray-500")
  }

  return (
    <div className="bg-white/90 dark:bg-neutral-900/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 dark:border-neutral-700 overflow-hidden w-full max-w-md mx-auto">
      {/* هدر */}
      <div className="bg-primary p-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          {step > 1 && (
            <button onClick={() => setStep(step - 1)} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
              <ChevronLeft size={20} className="rtl:rotate-180" />
            </button>
          )}
          <h3 className="font-bold text-lg">انتخاب مقطع و رشته</h3>
        </div>
        <span className="text-sm bg-white/20 px-2 py-1 rounded-md">مرحله {step} از ۳</span>
      </div>

      <div className="p-6 h-[400px] overflow-y-auto relative">
        <AnimatePresence mode="wait">
          
          {/* مرحله ۱: انتخاب مقطع */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-3">
              <p className="text-sm text-gray-500 mb-4">مقطع تحصیلی خود را انتخاب کنید:</p>
              {GRADES.map(g => (
                <button 
                  key={g.id} 
                  onClick={() => handleGradeSelect(g.id)}
                  className={getGradeBtnClass(g.id)}
                >
                  <div className={"p-3 rounded-full text-white " + g.color}>{g.icon}</div>
                  <span className="font-bold text-ink dark:text-white">{g.label}</span>
                </button>
              ))}
            </motion.div>
          )}

          {/* مرحله ۲: انتخاب رشته */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-3">
              <p className="text-sm text-gray-500 mb-4">رشته تحصیلی خود را انتخاب کنید:</p>
              <div className="grid grid-cols-2 gap-3">
                {MAJORS[grade]?.map(m => (
                  <button 
                    key={m.id} 
                    onClick={() => handleMajorSelect(m.id)}
                    className={getMajorBtnClass(m.id)}
                  >
                    <span className="font-bold text-sm">{m.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* مرحله ۳: انتخاب پایه و تایید */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6 flex flex-col items-center justify-center h-full">
              
              <div className="text-center space-y-2">
                <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={40} />
                </div>
                <h4 className="text-xl font-bold">اطلاعات شما</h4>
                <p className="text-gray-500">{grade} {major !== 'عمومی' && "- " + major}</p>
              </div>

              {grade !== 'ابتدایی' && grade !== 'متوسطه اول' && (
                <div className="w-full">
                  <label className="block text-sm text-center mb-2">پایه تحصیلی:</label>
                  <div className="flex justify-center gap-2">
                    {YEARS.map(y => (
                      <button 
                        key={y} 
                        onClick={() => setYear(y)}
                        className={getYearBtnClass(y)}
                      >
                        {y}
                      </button>
                    ))}
                  </div>
                </div>
              )}
<div className="flex gap-3 w-full mt-8">
                {onCancel && (
                  <button onClick={onCancel} className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-neutral-800 font-bold text-gray-600 dark:text-gray-300">
                    انصراف
                  </button>
                )}
                <button onClick={handleSave} className="flex-1 py-3 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/30 hover:bg-primary/90">
                  ذخیره و ادامه
                </button>
              </div>
              
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}

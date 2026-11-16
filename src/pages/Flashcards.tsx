import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Plus, Trash2, Loader2, ArrowRight, ArrowLeft, Shuffle, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

export default function FlashcardsPage({ user }: { user: any }) {
  const [cards, setCards] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  
  // استیت‌های فرم
  const [front, setFront] = useState('')
  const [back, setBack] = useState('')
  
  // استیت‌های کارت
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  const fetchCards = async () => {
    setIsLoading(true)
    const { data, error } = await supabase.from('flashcards').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    if (error) {
      toast.error('خطا در دریافت کارت‌ها!')
    }
    if (data) setCards(data)
    setIsLoading(false)
  }

  useEffect(() => { 
    if (user.id) fetchCards() 
  }, [user.id])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!front || !back) return
    
    const { error } = await supabase.from('flashcards').insert([{ user_id: user.id, front, back }])
    if (error) {
      toast.error('خطا در ذخیره کارت: ' + error.message)
      return
    }

    setFront('')
    setBack('')
    setIsAdding(false)
    await fetchCards()
    toast.success('کارت جدید به جعبه اضافه شد! 🃏✅')
  }

  const deleteCard = async (id: string) => {
    await supabase.from('flashcards').delete().eq('id', id)
    if (currentIndex >= cards.length - 1 && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
    fetchCards()
    toast.success('کارت حذف شد!')
  }

  const nextCard = () => {
    if (currentIndex < cards.length - 1) {
      setIsFlipped(false)
      setTimeout(() => setCurrentIndex(prev => prev + 1), 150)
    }
  }

  const prevCard = () => {
    if (currentIndex > 0) {
      setIsFlipped(false)
      setTimeout(() => setCurrentIndex(prev => prev - 1), 150)
    }
  }

  const shuffleCards = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5)
    setCards(shuffled)
    setCurrentIndex(0)
    setIsFlipped(false)
    toast.info('کارت‌ها به هم ریخته شدند! 🔀')
  }

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={40} /></div>

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-3xl mx-auto pb-10">
      
      {/* هدر صفحه */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">فلش‌کارت‌ها <Sparkles className="text-yellow-500" size={24}/></h2>
          <p className="text-sm text-gray-500 mt-1">با مرور فاصله‌دار، درس‌ها رو ملکه ذهنت کن.</p>
        </div>
        <button onClick={() => setIsAdding(!isAdding)} className="btn-primary shadow-lg shadow-primary/20">
          <Plus size={18} /> کارت جدید
        </button>
      </div>

      {/* فرم ساخت کارت */}
      <AnimatePresence>
        {isAdding && (
          <motion.form 
            initial={{ opacity: 0, y: -20, height: 0 }} 
            animate={{ opacity: 1, y: 0, height: 'auto' }} 
            exit={{ opacity: 0, y: -20, height: 0 }} 
            onSubmit={handleAdd} 
            className="card space-y-4 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">روی کارت (سوال / کلمه)</label>
                <textarea 
                  value={front}
onChange={e => setFront(e.target.value)} 
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-neutral-700 dark:bg-neutral-800 outline-none focus:ring-2 focus:ring-primary resize-none h-24" 
                  placeholder="مثلا: پایتخت فرانسه چیست؟"
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">پشت کارت (جواب / معنی)</label>
                <textarea 
                  value={back} 
                  onChange={e => setBack(e.target.value)} 
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-neutral-700 dark:bg-neutral-800 outline-none focus:ring-2 focus:ring-primary resize-none h-24" 
                  placeholder="مثلا: پاریس"
                  required 
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 transition-colors">انصراف</button>
              <button type="submit" className="btn-primary rounded-xl">ساخت کارت</button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* بخش نمایش کارت‌ها (حالت خفن) */}
      {cards.length > 0 ? (
        <div className="flex flex-col items-center space-y-8 mt-4 relative">
          
          {/* نوار پیشرفت */}
          <div className="w-full max-w-lg flex items-center gap-3">
            <span className="text-sm font-bold text-gray-500 w-12 text-center">{currentIndex + 1}</span>
            <div className="flex-1 h-2 bg-gray-200 dark:bg-neutral-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300 ease-out" 
                style={{ width: ((currentIndex + 1) / cards.length) * 100 + '%' }}
              />
            </div>
            <span className="text-sm font-bold text-gray-500 w-12 text-center">{cards.length}</span>
          </div>

          {/* کارت سه بعدی شیشه‌ای */}
          <div 
            className="relative w-full max-w-lg h-80 cursor-pointer group"
            onClick={() => setIsFlipped(!isFlipped)}
            style={{ perspective: '1200px' }} 
          >
            <motion.div 
              className="w-full h-full relative"
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6, type: 'spring', stiffness: 200, damping: 20 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* روی کارت */}
              <div 
                className="absolute inset-0 bg-white/70 dark:bg-neutral-800/70 backdrop-blur-xl rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-white/50 dark:border-neutral-700 flex flex-col items-center justify-center p-8 text-center transition-colors group-hover:border-primary/30"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <span className="text-xs font-bold text-primary/60 bg-primary/10 px-3 py-1 rounded-full mb-6 absolute top-6">سوال</span>
                <h3 className="text-2xl md:text-3xl font-bold text-ink dark:text-white leading-relaxed">{cards[currentIndex].front}</h3>
                <p className="text-sm text-gray-400 mt-6 absolute bottom-6 flex items-center gap-2">برای دیدن جواب کلیک کن <ArrowLeft size={16}/></p>
              </div>
              
              {/* پشت کارت */}
              <div 
                className="absolute inset-0 bg-gradient-to-br from-primary to-red-600 text-white rounded-3xl shadow-[0_8px_32px_rgba(229,57,53,0.3)] flex flex-col items-center justify-center p-8 text-center"
style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                <span className="text-xs font-bold text-white/60 bg-white/10 px-3 py-1 rounded-full mb-6 absolute top-6">جواب</span>
                <h3 className="text-2xl md:text-3xl font-bold leading-relaxed">{cards[currentIndex].back}</h3>
              </div>
            </motion.div>
          </div>
          
          {/* دکمه‌های کنترل */}
          <div className="flex items-center gap-4">
            <button onClick={prevCard} disabled={currentIndex === 0} className="p-4 bg-white dark:bg-neutral-800 shadow-md rounded-2xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-all text-gray-600 dark:text-gray-300">
              <ArrowRight size={24} />
            </button>
            <button onClick={shuffleCards} className="p-4 bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 shadow-md rounded-2xl hover:bg-yellow-200 transition-all">
              <Shuffle size={24} />
            </button>
            <button onClick={nextCard} disabled={currentIndex === cards.length - 1} className="p-4 bg-primary text-white shadow-lg shadow-primary/30 rounded-2xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary/90 transition-all">
              <ArrowLeft size={24} />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 space-y-4">
          <div className="w-24 h-24 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center">
            <Sparkles size={40} className="opacity-20" />
          </div>
          <p>هنوز هیچ کارتی نساختی. اولین کارتت رو بساز!</p>
        </div>
      )}

      {/* لیست کارت‌ها */}
      {cards.length > 0 && (
        <div className="mt-16 space-y-3">
          <h3 className="font-bold text-gray-500 mb-4 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary"/> مدیریت کارت‌ها</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {cards.map((c, index) => (
              <div key={c.id} className={"flex justify-between items-center p-4 rounded-xl border transition-all " + (currentIndex === index ? 'bg-primary/5 border-primary/30 shadow-sm' : 'bg-white/50 dark:bg-neutral-900/50 border-gray-100 dark:border-neutral-800')}>
                <div className="flex-1 truncate pr-4">
                  <p className="font-bold text-sm truncate">{c.front}</p>
                  <p className="text-xs text-gray-400 truncate mt-1">{c.back}</p>
                </div>
                <button onClick={() => deleteCard(c.id)} className="text-red-400 p-2 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"><Trash2 size={18}/></button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
import { useState, useRef, useEffect, useMemo } from 'react'
import { Send, X, Sparkles, Volume2, VolumeX } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { getSubjects } from '../lib/subjects'
import { miles } from '../lib/miles/engine'

const SpiderIcon = ({ size = 28, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" fill="currentColor"/>
    <path d="M12 12v7" /><path d="M8 10L4 8" /><path d="M16 10l4-2" />
    <path d="M7 13l-5 2" /><path d="M17 13l5 2" /><path d="M8 16l-3 5" />
    <path d="M16 16l3 5" /><path d="M12 4v2" /><path d="M10 4l2 2 2-2" />
  </svg>
)

export default function MilesAI({ user, onNavigate }: { user: any, onNavigate: (page: string) => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isMuted, setIsMuted] = useState(true) 
  const [hasProacted, setHasProacted] = useState(false)
  
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string, quickReplies?: string[] }[]>([
    { role: 'ai', text: 'سلام! من مایلزم. 🕷️ موتور جدیدم رو روشن کردم! حالا می‌تونم برنامه هفتگی بچینم، تکلیف ثبت کنم یا حتی برات تایمر بزنم. چی کار کنیم؟', quickReplies: ['برنامه بده', 'وضعیت امروز', 'شروع تایمر'] }
  ])
  
  const endOfMessagesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const speak = (text: string) => {
    if (isMuted || !('speechSynthesis' in window)) return
    try {
      window.speechSynthesis.cancel()
      const cleanText = text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
      const utterance = new SpeechSynthesisUtterance(cleanText)
      utterance.lang = 'fa-IR'
      window.speechSynthesis.speak(utterance)
    } catch (e) {
      console.error("TTS not supported", e)
    }
  }

  const addMessage = (role: 'user' | 'ai', text: string, quickReplies?: string[]) => {
    setMessages(prev => [...prev, { role, text, quickReplies }])
    if (role === 'ai') speak(text)
  }

  const getData = async () => {
    if (!user.id || user.id === 'offline') return { homework: [], exams: [], todayMinutes: 0, streak: 0, xp: 0 }
    
    const today = new Date()
    const localDateStr = new Date(today.getTime() - (today.getTimezoneOffset() * 60000)).toISOString().split('T')[0]
    
    const [hwRes, exRes, ssRes] = await Promise.all([
      supabase.from('homework').select('*').eq('user_id', user.id).eq('status', 'pending'),
      supabase.from('exams').select('*').eq('user_id', user.id).gte('exam_date', new Date().toISOString()).order('exam_date'),
      supabase.from('study_sessions').select('duration_minutes').eq('user_id', user.id).gte('date', localDateStr + 'T00:00:00')
    ])
    
    const minutes = ssRes.data?.reduce((sum:any, s:any) => sum + s.duration_minutes, 0) || 0
    return { 
      homework: hwRes.data || [], 
      exams: exRes.data || [], 
      todayMinutes: minutes, 
      streak: 0, 
      xp: 0 
    }
  }

  const actions = {
    navigate: (page: string) => {
      onNavigate(page)
      setIsOpen(false)
    },
    startTimer: (_minutes: number, _subject: string | null) => {
      onNavigate('timer')
      setIsOpen(false)
    },
    addHomework: async (title: string, subject: string | null, due: Date | null) => {
      await supabase.from('homework').insert([{ user_id: user.id, title, subject, priority: 'medium', due_date: due ? due.toISOString() : new Date().toISOString(), status: 'pending' }])
    }
  }
const miles = {
  userName: user.name,
  subjects: getSubjects(user.grade, user.major, user.year),
  getData,
  actions
};

  useEffect(() => {
    if (isOpen && !hasProacted) {
      setHasProacted(true)
      miles.getData().then((p: any) => {
        if (p) addMessage('ai', p.text, p.quickReplies)
      }).catch(console.error)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, hasProacted, miles])

  const send = async (text: string) => {
  if (!text.trim()) return;
  addMessage('user', text);
  setIsTyping(true);

  try {
    const response = await fetch('https://keylessai.thryx.workers.dev/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'تو مایلز هستی، دستیار هوشمند و صمیمی دانش‌آموزان. فارسی و کوتاه جواب بده.' },
          { role: 'user', content: text }
        ]
      })
    });
    
    const data = await response.json();
    addMessage('ai', data.choices[0].message.content);
    
  } catch (error) {
    addMessage('ai', 'مشکلی پیش اومد! دوباره امتحان کن.');
  } finally {
    setIsTyping(false);
  }
}


  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    send(input)
  }

  const msgContainerClass = (role: string) => "flex " + (role === 'user' ? 'justify-end' : 'justify-start')
  const msgBubbleClass = (role: string) => {
    if (role === 'user') return "max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed bg-primary text-white rounded-br-none shadow-md whitespace-pre-line"
    return "max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed bg-white dark:bg-neutral-800 text-ink dark:text-gray-200 rounded-bl-none border border-gray-200 dark:border-neutral-700 shadow-sm whitespace-pre-line"
  }

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
        onClick={() => { setIsOpen(true); if (messages.length === 1) speak(messages[0].text); }}
        className="fixed bottom-28 left-4 z-50 p-4 bg-gradient-to-tr from-primary to-red-600 text-white rounded-full shadow-[0_0_20px_rgba(229,57,53,0.6)] border-2 border-white/30 flex items-center justify-center group"
        aria-label="گفتگو با مایلز"
      >
        <Sparkles className="absolute -top-2 -right-2 text-yellow-300 animate-pulse" size={18} />
        <SpiderIcon size={28} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white/95 dark:bg-neutral-900/95 backdrop-blur-2xl w-full max-w-sm h-[600px] rounded-3xl shadow-2xl border border-white/50 dark:border-neutral-700 flex flex-col overflow-hidden pointer-events-auto">
              
              <div className="bg-gradient-to-r from-primary to-red-600 p-4 flex items-center justify-between text-white shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center relative">
                    <SpiderIcon size={24} />
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-primary rounded-full animate-pulse"></span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight">مایلز (Miles)</h3>
                    <p className="text-xs text-white/80">{isTyping ? 'در حال پردازش...' : 'موتور جدید فعال است'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => { setIsMuted(!isMuted); if(!isMuted) window.speechSynthesis.cancel(); }} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                  <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/20 rounded-lg transition-colors"><X size={20} /></button>
                </div>
              </div>
<div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50/50 dark:bg-neutral-950/50">
                {messages.map((msg, idx) => (
                  <div key={idx}>
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={msgContainerClass(msg.role)}>
                      <div className={msgBubbleClass(msg.role)}>
                        {msg.text}
                      </div>
                    </motion.div>
                    {msg.role === 'ai' && msg.quickReplies && msg.quickReplies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2 ml-2 rtl:mr-2">
                        {msg.quickReplies.map((reply, i) => (
                          <button key={i} onClick={() => send(reply)} className="px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-medium hover:bg-primary hover:text-white transition-colors">
                            {reply}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white dark:bg-neutral-800 p-3 rounded-2xl rounded-bl-none flex gap-1 border border-gray-200 dark:border-neutral-700 shadow-sm">
                      <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-primary/70 rounded-full animate-bounce delay-100"></span>
                      <span className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200"></span>
                    </div>
                  </div>
                )}
                <div ref={endOfMessagesRef} />
              </div>

              <form onSubmit={handleSend} className="p-3 bg-white dark:bg-neutral-900 border-t border-gray-100 dark:border-neutral-800 flex gap-2">
                <input
                  type="text" value={input} onChange={e => setInput(e.target.value)} disabled={isTyping}
                  placeholder={isTyping ? "مایلز در حال فکر کردن..." : "با مایلز حرف بزن..."}
                  className="flex-1 bg-gray-100 dark:bg-neutral-800 rounded-full px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary text-sm border border-transparent disabled:opacity-50"
                />
                <button type="submit" disabled={!input.trim() || isTyping} className="w-11 h-11 bg-primary text-white rounded-full flex items-center justify-center disabled:opacity-50 transition-colors shadow-md">
                  <Send size={18} className="rtl:-scale-x-100" />
                </button>
              </form>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
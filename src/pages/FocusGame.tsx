import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Play, RotateCcw, Heart, Trophy } from 'lucide-react'
import { toast } from 'sonner'

interface GameItem {
  id: number
  x: number
  y: number
  type: 'good' | 'bad'
  emoji: string
  speed: number
}

const GOOD_ITEMS = ['📚', '✏️', '⭐', '📝']
const BAD_ITEMS = ['📱', '✈️', '📷', '🎮']

export default function FocusGame({ onBack, onGameEnd }: { onBack: () => void, onGameEnd: (score: number) => void }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isGameOver, setIsGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [health, setHealth] = useState(3)
  const [playerX, setPlayerX] = useState(50)
  const [items, setItems] = useState<GameItem[]>([])
  
  const gameLoopRef = useRef<any>(null)
  const itemSpawnerRef = useRef<any>(null)
  const playerXRef = useRef(50)

  const startGame = () => {
    setIsPlaying(true)
    setIsGameOver(false)
    setScore(0)
    setHealth(3)
    setPlayerX(50)
    playerXRef.current = 50
    setItems([])
  }

  // کنترل با کیبورد
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying) return
      if (e.key === 'ArrowRight' || e.key === 'd') {
        setPlayerX(prev => {
          const next = Math.min(prev + 5, 90)
          playerXRef.current = next
          return next
        })
      } else if (e.key === 'ArrowLeft' || e.key === 'a') {
        setPlayerX(prev => {
          const next = Math.max(prev - 5, 10)
          playerXRef.current = next
          return next
        })
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isPlaying])

  // حلقه بازی
  useEffect(() => {
    if (isPlaying) {
      gameLoopRef.current = setInterval(() => {
        setItems(prevItems => {
          const newItems: GameItem[] = []
          
          for (const item of prevItems) {
            const newY = item.y + item.speed
            
            if (newY > 80 && newY < 90 && Math.abs(item.x - playerXRef.current) < 15) {
              if (item.type === 'good') {
                setScore(s => s + 10)
              } else {
                setHealth(h => {
                  const newHealth = h - 1
                  if (newHealth <= 0) {
                    setIsPlaying(false)
                    setIsGameOver(true)
                  }
                  return newHealth
                })
              }
            } else if (newY < 110) {
              newItems.push({ ...item, y: newY })
            }
          }
          return newItems
        })
      }, 50)
    }
    
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current)
    }
  }, [isPlaying])

  // تولید آیتم
  useEffect(() => {
    if (isPlaying) {
      itemSpawnerRef.current = setInterval(() => {
        const isGood = Math.random() > 0.5
        const newItem: GameItem = {
          id: Date.now() + Math.random(),
          x: Math.floor(Math.random() * 80) + 10,
          y: -10,
          type: isGood ? 'good' : 'bad',
          emoji: isGood ? GOOD_ITEMS[Math.floor(Math.random() * GOOD_ITEMS.length)] : BAD_ITEMS[Math.floor(Math.random() * BAD_ITEMS.length)],
          speed: 2 + (score / 100)
        }
        setItems(prev => [...prev, newItem])
      }, 800)
    }
    
    return () => {
      if (itemSpawnerRef.current) clearInterval(itemSpawnerRef.current)
    }
  }, [isPlaying, score])

  const movePlayer = (direction: 'left' | 'right') => {
    if (!isPlaying) return
    setPlayerX(prev => {
      const next = direction === 'left' ? Math.max(prev - 15, 10) : Math.min(prev + 15, 90)
      playerXRef.current = next
      return next
    })
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-2xl mx-auto">
<div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 bg-gray-100 dark:bg-neutral-800 rounded-full hover:bg-gray-200 transition-colors">
          <ArrowLeft size={20} className="text-ink dark:text-white" />
        </button>
        <h2 className="text-2xl font-bold">فرار از حواس‌پرتی 🎮</h2>
      </div>

      <div className="card relative overflow-hidden bg-slate-900 rounded-3xl border-4 border-primary/20 shadow-2xl h-[500px] flex flex-col">
        
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-20">
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-white font-bold flex items-center gap-2">
            <Trophy size={18} className="text-yellow-400" /> {score}
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-red-500 font-bold flex items-center gap-1">
            {[1, 2, 3].map(i => (
              <Heart key={i} size={20} className={i <= health ? "fill-red-500" : "opacity-30"} />
            ))}
          </div>
        </div>

        <div className="relative flex-1 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] bg-repeat">
          
          {items.map(item => (
            <div 
              key={item.id}
              className="absolute text-3xl transition-all duration-50 ease-linear"
              style={{ left: item.x + '%', top: item.y + '%' }}
            >
              {item.emoji}
            </div>
          ))}

          <div 
            className="absolute bottom-6 text-4xl transition-all duration-75 ease-out z-10"
            style={{ left: playerX + '%', transform: 'translateX(-50%)' }}
          >
            🕷️
          </div>
        </div>

        {isPlaying && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-between px-6 z-20">
            <button onClick={() => movePlayer('left')} className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white text-2xl active:scale-95 md:hidden">◀</button>
            <button onClick={() => movePlayer('right')} className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white text-2xl active:scale-95 md:hidden">▶</button>
          </div>
        )}

        {(!isPlaying && !isGameOver) && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-30 flex flex-col items-center justify-center text-center p-6">
            <div className="text-6xl mb-6">🕷️</div>
            <h3 className="text-3xl font-bold text-white mb-2">آماده‌ای؟</h3>
            <p className="text-gray-300 mb-8 max-w-xs leading-relaxed">با کلیدهای جهت‌دار یا دکمه‌های روی صفحه حرکت کن. کتاب‌ها رو بگیر و از گوشی و تلگرام فرار کن!</p>
            <button onClick={startGame} className="bg-primary text-white px-8 py-3 rounded-full font-bold text-lg shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
              <Play size={20} /> شروع بازی
            </button>
          </div>
        )}

        {isGameOver && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-30 flex flex-col items-center justify-center text-center p-6 animate-in zoom-in">
            <div className="text-6xl mb-4">💀</div>
            <h3 className="text-3xl font-bold text-white mb-2">بازی تموم شد!</h3>
            <p className="text-gray-300 mb-4">امتیاز تو:</p>
            <p className="text-5xl font-black text-primary mb-8">{score}</p>
            
            <div className="flex gap-3">
              <button onClick={startGame} className="bg-white text-gray-900 px-6 py-3 rounded-full font-bold shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
<RotateCcw size={20} /> دوباره
              </button>
              <button 
                onClick={() => {
                  onGameEnd(score);
                  toast.success('امتیازت به XP برنامه اضافه شد!');
                  onBack();
                }} 
                className="bg-primary text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all"
              >
                ذخیره و خروج
              </button>
            </div>
          </div>
        )}
      </div>
      
      <p className="text-center text-sm text-gray-500">با کلیدهای ⬅️ ➡️ روی کیبورد یا دکمه‌های روی صفحه حرکت کن.</p>
    </div>
  )
}

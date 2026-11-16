import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, CheckCircle } from 'lucide-react'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message?: string
  confirmText?: string
  isDanger?: boolean
}

export default function ConfirmDialog({ 
  isOpen, onClose, onConfirm, title = 'حذف آیتم', message = 'آیا مطمئن هستی؟', confirmText = 'بله، حذف کن', isDanger = true 
}: ConfirmDialogProps) {
  
  const iconBgClass = "w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 " + (isDanger ? 'bg-red-100 dark:bg-red-950/50 text-red-500' : 'bg-primary/10 text-primary')
  const confirmBtnClass = "flex-1 py-2.5 rounded-xl text-white font-medium shadow-lg transition-colors " + (isDanger ? 'bg-red-500 shadow-red-500/30 hover:bg-red-600' : 'bg-primary shadow-primary/30 hover:bg-primary/90')

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-sm bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl border border-white/40 dark:border-neutral-700/50 rounded-2xl shadow-2xl p-6 text-center z-10">
            
            <div className={iconBgClass}>
              {isDanger ? <AlertTriangle size={32} /> : <CheckCircle size={32} />}
            </div>
            
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{message}</p>
            
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-green-500 text-white font-medium shadow-lg shadow-green-500/30 hover:bg-green-600 transition-colors">
                انصراف
              </button>
              <button onClick={() => { onConfirm(); onClose(); }} className={confirmBtnClass}>
                {confirmText}
              </button>
            </div>
            
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'

export interface NavItem {
  id: string
  label: string
  icon: ReactNode
  badge?: boolean
}

interface Props {
  items: NavItem[]
  active: string
  onSelect: (id: string) => void
}

export default function BottomNav({ items, active, onSelect }: Props) {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    const handleFocusIn = (e: FocusEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        setIsKeyboardOpen(true);
      }
    };
    const handleFocusOut = (e: FocusEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        setIsKeyboardOpen(false);
      }
    };
    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);
    return () => {
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
    };
  }, []);

  if (isKeyboardOpen) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[90] flex justify-center w-full px-3 pb-3">
      <nav 
        className="w-full max-w-[460px] h-[56px] bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-xl border border-red-200 dark:border-red-900/40 shadow-[0_-8px_30px_rgba(226,54,54,0.15)] rounded-2xl flex items-center justify-around px-2 transition-all duration-300" 
        aria-label="ناوبری اصلی"
      >
        {items.map((it) => {
          const on = it.id === active;
          return (
            <button
              key={it.id}
              type="button"
              className={"relative flex flex-col items-center justify-center w-12 h-full transition-colors duration-300 " + (on ? 'text-red-500' : 'text-gray-400 dark:text-gray-500 hover:text-red-400')}
              aria-label={it.label}
              aria-current={on ? 'page' : undefined}
              onClick={() => {
                if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(8);
                onSelect(it.id);
              }}
            >
              {on && (
                <span className="absolute top-0 w-8 h-[3px] bg-red-500 rounded-b-full shadow-[0_0_8px_rgba(226,54,54,0.8)]" />
              )}
              
              <span className={"transition-transform duration-300 " + (on ? '-translate-y-1 scale-110' : '')}>
                {it.icon}
              </span>
              
              {it.badge && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_5px_rgba(226,54,54,1)]" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

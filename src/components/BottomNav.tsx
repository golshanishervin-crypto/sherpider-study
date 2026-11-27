import type { ReactNode } from 'react'

export interface NavItem {
  id: string
  label: string
  icon: ReactNode
  badge?: boolean
}

const CSS = [
  '.sbn-wrap{position:fixed;left:0;right:0;bottom:0;z-index:50;display:flex;justify-content:center;padding:0 14px calc(10px + env(safe-area-inset-bottom,0px));pointer-events:none}',
  '.sbn-bar{pointer-events:auto;position:relative;display:flex;width:100%;max-width:460px;height:62px;overflow:hidden;border-radius:9999px;padding:0 6px;',
  'background:linear-gradient(180deg,#1d1d26,#0c0c11);border:1px solid rgba(255,255,255,.09);',
  'box-shadow:0 14px 40px rgba(0,0,0,.45),0 0 0 1px rgba(229,57,53,.14),inset 0 1px 0 rgba(255,255,255,.08)}',
  '.sbn-btn{position:relative;flex:1;display:flex;align-items:center;justify-content:center;border:0;background:transparent;color:rgba(255,255,255,.5);cursor:pointer;outline:none;-webkit-tap-highlight-color:transparent;transition:color .3s}',
  '.sbn-btn:focus-visible{box-shadow:inset 0 0 0 2px rgba(255,255,255,.6);border-radius:9999px}',
  '.sbn-btn:active .sbn-icon{transform:scale(.88)}',
  '.sbn-icon{position:relative;z-index:2;display:flex;transition:transform .35s cubic-bezier(.34,1.56,.64,1)}',
  '.sbn-on{color:#fff}',
  '.sbn-on .sbn-icon{transform:translateY(-2px) scale(1.14)}',
  '.sbn-beam{position:absolute;top:0;left:50%;width:70px;height:100%;margin-left:-35px;pointer-events:none;opacity:0;',
  'background:linear-gradient(180deg,rgba(255,255,255,.62),rgba(255,255,255,.05) 88%);',
  'clip-path:polygon(26% 0,74% 0,96% 100%,4% 100%);filter:blur(4px);transform:scaleY(.1);transform-origin:top;',
  'transition:transform .42s cubic-bezier(.2,.8,.2,1),opacity .3s}',
  '.sbn-on .sbn-beam{opacity:.95;transform:scaleY(1)}',
  '.sbn-line{position:absolute;bottom:9px;left:50%;width:26px;height:2px;margin-left:-13px;border-radius:2px;background:#fff;',
  'box-shadow:0 0 10px 2px rgba(229,57,53,.9);transform:scaleX(0);transition:transform .35s}',
  '.sbn-on .sbn-line{transform:scaleX(1)}',
  '.sbn-dot{position:absolute;top:13px;left:calc(50% + 9px);z-index:3;width:7px;height:7px;border-radius:50%;background:#ff5a52;box-shadow:0 0 0 2px #14141a}',
  '@media (prefers-reduced-motion:reduce){.sbn-beam,.sbn-line,.sbn-icon{transition:none}}',
].join('')

interface Props {
  items: NavItem[]
  active: string
  onSelect: (id: string) => void
}

export default function BottomNav({ items, active, onSelect }: Props) {
  return (
    <nav className="sbn-wrap" aria-label="ناوبری اصلی">
      <style>{CSS}</style>
      <div className="sbn-bar">
        {items.map((it) => {
          const on = it.id === active
          return (
            <button
              key={it.id}
              type="button"
              className={'sbn-btn' + (on ? ' sbn-on' : '')}
              aria-label={it.label}
              aria-current={on ? 'page' : undefined}
              onClick={() => {
                if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(8)
                onSelect(it.id)
              }}
            >
              <span className="sbn-beam" />
              <span className="sbn-icon">{it.icon}</span>
              {it.badge ? <span className="sbn-dot" /> : null}
              <span className="sbn-line" />
            </button>
          )
        })}
      </div>
    </nav>
  )
}

'use client'
import { useState, useEffect, useRef } from 'react'

const languages = [
  { code: 'en',    label: 'English',    native: 'EN' },
  { code: 'zh-CN', label: 'Mandarin',   native: '中文' },
  { code: 'es',    label: 'Spanish',    native: 'ES' },
  { code: 'pt',    label: 'Portuguese', native: 'PT' },
]

export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('en')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function switchLanguage(code: string) {
    setActive(code)
    setOpen(false)
    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null
    if (select) {
      select.value = code
      select.dispatchEvent(new Event('change'))
    }
  }

  const current = languages.find(l => l.code === active)

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-muted hover:text-ink transition-colors duration-200 group"
        aria-label="Select language"
      >
        {/* Globe icon */}
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent/70 group-hover:text-accent transition-colors">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        <span className="text-xs font-semibold tracking-widest uppercase">{current?.native}</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 bg-surface border border-border rounded-lg shadow-lg overflow-hidden z-50 min-w-[130px]">
          {languages.map(({ code, label, native }) => (
            <button
              key={code}
              onClick={() => switchLanguage(code)}
              className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 text-xs text-left transition-colors duration-150 ${
                active === code
                  ? 'bg-accentLight text-accent font-semibold'
                  : 'text-muted hover:text-ink hover:bg-surfaceAlt'
              }`}
            >
              <span className="tracking-wide">{label}</span>
              <span className={`font-bold tracking-widest ${active === code ? 'text-accent' : 'text-muted/50'}`}>{native}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

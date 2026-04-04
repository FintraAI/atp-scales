'use client'
// src/components/portal/theme-toggle.tsx

import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/components/providers/theme-provider'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex items-center gap-1 p-1 rounded-xl border border-[var(--border)] bg-[var(--bg)] w-fit">
      {(['dark', 'light'] as const).map((t) => (
        <button
          key={t}
          onClick={() => setTheme(t)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium transition-all ${
            theme === t
              ? 'bg-[var(--card)] text-[var(--text-primary)] shadow-sm border border-[var(--border-hover)]'
              : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
          }`}
        >
          {t === 'dark' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
          {t === 'dark' ? 'Dark' : 'Light'}
        </button>
      ))}
    </div>
  )
}

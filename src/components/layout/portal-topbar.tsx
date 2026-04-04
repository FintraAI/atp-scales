'use client'
// src/components/layout/portal-topbar.tsx

import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { LogOut, ChevronDown, Settings } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import type { Role } from '@prisma/client'

interface TopbarProps {
  user: { name?: string | null; email?: string | null; role: Role }
}

export function PortalTopbar({ user }: TopbarProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <header
      className="h-16 backdrop-blur-sm border-b flex items-center justify-between px-6 lg:px-8 shrink-0"
      style={{
        background: 'var(--topbar-bg)',
        borderColor: 'var(--border)',
      }}
    >
      {/* Page title placeholder — filled by child pages */}
      <div id="page-title" />

      <div className="ml-auto" ref={ref}>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors"
          style={{ ['--hover-bg' as string]: 'var(--card-hover)' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--card-hover)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{
              background: 'rgba(212,175,55,0.10)',
              border: '1px solid rgba(212,175,55,0.20)',
            }}
          >
            <span className="text-[11px] font-bold" style={{ color: 'var(--gold)' }}>
              {user.name?.[0]?.toUpperCase() || 'U'}
            </span>
          </div>
          <span className="text-[13px] font-medium hidden sm:block" style={{ color: 'var(--text-primary)' }}>
            {user.name || user.email}
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`}
            style={{ color: 'var(--text-muted)' }}
          />
        </button>

        {open && (
          <div
            className="absolute right-6 top-14 w-52 rounded-xl shadow-2xl z-50 overflow-hidden"
            style={{
              background: 'var(--card-elevated)',
              border: '1px solid var(--border)',
            }}
          >
            <div className="p-3" style={{ borderBottom: '1px solid var(--border)' }}>
              <p className="text-[13px] font-medium" style={{ color: 'var(--text-primary)' }}>{user.name}</p>
              <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{user.email}</p>
            </div>
            <div className="p-1">
              <button
                onClick={() => { router.push('/portal/profile'); setOpen(false) }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] transition-colors"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'var(--card-hover)'
                  e.currentTarget.style.color = 'var(--text-primary)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = 'var(--text-secondary)'
                }}
              >
                <Settings className="w-4 h-4" />
                Account Settings
              </button>
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] transition-colors"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(239,68,68,0.05)'
                  e.currentTarget.style.color = '#f87171'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = 'var(--text-secondary)'
                }}
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

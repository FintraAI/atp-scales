'use client'
// src/components/admin/sync-button.tsx

import { useState } from 'react'
import { RefreshCw, Check, AlertCircle } from 'lucide-react'

interface SyncButtonProps {
  label: string
  endpoint: string
  body: object
  small?: boolean
}

export function SyncButton({ label, endpoint, body, small }: SyncButtonProps) {
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSync() {
    setState('loading')
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (res.ok && (data.success !== false)) {
        setState('success')
        setMessage(data.daysSync ? `${data.daysSync} days synced` : 'Synced!')
      } else {
        setState('error')
        setMessage(data.error || 'Sync failed')
      }
    } catch {
      setState('error')
      setMessage('Network error')
    }
    setTimeout(() => { setState('idle'); setMessage('') }, 4000)
  }

  const baseClass = small
    ? 'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border transition-all'
    : 'flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-semibold border transition-all'

  const stateClass =
    state === 'loading' ? 'bg-[rgba(212,175,55,0.05)] border-[rgba(212,175,55,0.15)] text-[#D4AF37]'
    : state === 'success' ? 'bg-emerald-400/5 border-emerald-400/20 text-emerald-400'
    : state === 'error'   ? 'bg-red-400/5 border-red-400/20 text-red-400'
    : 'bg-[rgba(212,175,55,0.05)] border-[rgba(212,175,55,0.15)] text-[#D4AF37] hover:bg-[rgba(212,175,55,0.1)]'

  return (
    <button onClick={handleSync} disabled={state === 'loading'} className={`${baseClass} ${stateClass}`}>
      {state === 'loading' && <RefreshCw className={`${small ? 'w-3 h-3' : 'w-3.5 h-3.5'} animate-spin`} />}
      {state === 'success' && <Check className={`${small ? 'w-3 h-3' : 'w-3.5 h-3.5'}`} />}
      {state === 'error'   && <AlertCircle className={`${small ? 'w-3 h-3' : 'w-3.5 h-3.5'}`} />}
      {state === 'idle'    && <RefreshCw className={`${small ? 'w-3 h-3' : 'w-3.5 h-3.5'}`} />}
      {state === 'idle' ? label : state === 'loading' ? 'Syncing...' : message || label}
    </button>
  )
}

'use client'
// src/components/dashboard/mark-read-button.tsx

import { useState } from 'react'
import { Check } from 'lucide-react'

export function MarkReadButton({ updateId }: { updateId: string }) {
  const [marked, setMarked] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleMark() {
    setLoading(true)
    await fetch(`/api/updates/${updateId}/read`, { method: 'POST' })
    setMarked(true)
    setLoading(false)
  }

  if (marked) return null

  return (
    <button
      onClick={handleMark}
      disabled={loading}
      className="flex items-center gap-1.5 text-[12px] text-[#555] hover:text-[#c8ff00] transition-colors shrink-0 font-medium"
    >
      <Check className="w-3.5 h-3.5" />
      {loading ? 'Marking...' : 'Mark read'}
    </button>
  )
}

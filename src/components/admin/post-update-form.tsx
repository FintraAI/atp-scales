'use client'
// src/components/admin/post-update-form.tsx

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Send, ChevronDown } from 'lucide-react'

const CATEGORIES = [
  { value: 'WEEKLY_RECAP', label: 'Weekly Recap' },
  { value: 'STRATEGY_CHANGE', label: 'Strategy Update' },
  { value: 'CREATIVE_UPDATE', label: 'Creative Update' },
  { value: 'PERFORMANCE_ALERT', label: 'Performance Alert' },
  { value: 'GENERAL', label: 'General Update' },
]

export function PostUpdateForm({ clientProfileId, authorId }: { clientProfileId: string; authorId: string }) {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('WEEKLY_RECAP')
  const [isPinned, setIsPinned] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return
    setIsLoading(true)

    const res = await fetch('/api/admin/updates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientProfileId, authorId, title, content, category, isPinned }),
    })

    if (res.ok) {
      setTitle('')
      setContent('')
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      router.refresh()
    }
    setIsLoading(false)
  }

  return (
    <div className="bg-[#181818] border border-[#1e1e1e] rounded-2xl p-5">
      <h3 className="font-display font-semibold text-white text-sm mb-4">Post Client Update</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Update title..."
            required
            className="flex-1 bg-[#0e0e0e] border border-[#1e1e1e] rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#6B6B6B] focus:outline-none focus:border-[#c8ff00]/30 transition-colors"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-[#0e0e0e] border border-[#1e1e1e] rounded-lg px-3 py-2.5 text-sm text-[#B3B3B3] focus:outline-none focus:border-[#c8ff00]/30 transition-colors"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your update... (Markdown supported: **bold**, bullet points with -, numbered lists)"
          required
          rows={6}
          className="w-full bg-[#0e0e0e] border border-[#1e1e1e] rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#6B6B6B] focus:outline-none focus:border-[#c8ff00]/30 transition-colors resize-y font-mono text-[12px] leading-relaxed"
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-[12px] text-[#B3B3B3] cursor-pointer">
            <input
              type="checkbox"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
              className="accent-[#c8ff00]"
            />
            Pin this update
          </label>

          <button
            type="submit"
            disabled={isLoading || !title || !content}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              success
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                : 'bg-[#c8ff00] hover:bg-[#d4ff33] text-black disabled:opacity-40 disabled:cursor-not-allowed'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            {isLoading ? 'Posting...' : success ? 'Posted!' : 'Post Update'}
          </button>
        </div>
      </form>
    </div>
  )
}

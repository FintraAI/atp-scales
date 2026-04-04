// src/components/dashboard/recent-updates.tsx

import Link from 'next/link'
import { formatRelativeTime } from '@/lib/utils'
import { MessageSquare, Pin, ArrowRight } from 'lucide-react'
import type { ClientUpdateItem } from '@/types'

interface RecentUpdatesProps {
  updates: ClientUpdateItem[]
}

const CATEGORY_CONFIG: Record<string, { label: string; color: string }> = {
  WEEKLY_RECAP: { label: 'Weekly Recap', color: 'text-blue-400 bg-blue-400/10' },
  STRATEGY_CHANGE: { label: 'Strategy', color: 'text-purple-400 bg-purple-400/10' },
  CREATIVE_UPDATE: { label: 'Creative', color: 'text-pink-400 bg-pink-400/10' },
  PERFORMANCE_ALERT: { label: 'Alert', color: 'text-amber-400 bg-amber-400/10' },
  GENERAL: { label: 'Update', color: 'text-gray-400 bg-gray-400/10' },
}

export function RecentUpdates({ updates }: RecentUpdatesProps) {
  return (
    <div className="bg-[#181818] border border-[#1e1e1e] rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e1e1e]">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#c8ff00]" />
          <h2 className="font-display font-semibold text-white text-base">Recent Updates</h2>
        </div>
        <Link href="/portal/updates" className="flex items-center gap-1 text-[#c8ff00] text-xs font-medium hover:gap-2 transition-all">
          View all <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {updates.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-[#6B6B6B] text-sm">No updates yet. Your account manager will post updates here.</p>
        </div>
      ) : (
        <div className="divide-y divide-[#1a1a1a]">
          {updates.map((update) => {
            const cat = CATEGORY_CONFIG[update.category] || CATEGORY_CONFIG.GENERAL
            return (
              <Link key={update.id} href="/portal/updates" className="block px-6 py-4 hover:bg-white/[0.02] transition-colors group">
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      {!update.isRead && (
                        <span className="w-2 h-2 rounded-full bg-[#c8ff00] shrink-0" />
                      )}
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${cat.color}`}>
                        {cat.label}
                      </span>
                      {update.isPinned && (
                        <Pin className="w-3 h-3 text-[#6B6B6B]" />
                      )}
                    </div>
                    <p className="text-[13px] font-semibold text-white group-hover:text-[#c8ff00] transition-colors line-clamp-1">
                      {update.title}
                    </p>
                    <p className="text-[12px] text-[#6B6B6B] mt-0.5 line-clamp-2 leading-relaxed">
                      {update.content.replace(/\*\*/g, '').replace(/\n/g, ' ')}
                    </p>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <p className="text-[11px] text-[#6B6B6B]">
                      {update.publishedAt ? formatRelativeTime(update.publishedAt) : formatRelativeTime(update.createdAt)}
                    </p>
                    <p className="text-[11px] text-[#6B6B6B] mt-0.5">{update.author.name}</p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

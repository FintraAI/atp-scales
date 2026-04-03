// src/app/(portal)/updates/page.tsx

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { formatDate, formatRelativeTime } from '@/lib/utils'
import { Pin, Bell } from 'lucide-react'
import { MarkReadButton } from '@/components/dashboard/mark-read-button'

const CATEGORY_CONFIG: Record<string, { label: string; color: string; border: string }> = {
  WEEKLY_RECAP: { label: 'Weekly Recap', color: 'text-blue-400 bg-blue-400/10', border: 'border-blue-400/20' },
  STRATEGY_CHANGE: { label: 'Strategy Update', color: 'text-purple-400 bg-purple-400/10', border: 'border-purple-400/20' },
  CREATIVE_UPDATE: { label: 'Creative Update', color: 'text-pink-400 bg-pink-400/10', border: 'border-pink-400/20' },
  PERFORMANCE_ALERT: { label: '⚠️ Performance Alert', color: 'text-amber-400 bg-amber-400/10', border: 'border-amber-400/30' },
  GENERAL: { label: 'Update', color: 'text-gray-400 bg-gray-400/10', border: 'border-gray-400/20' },
}

async function getUpdates(clientProfileId: string) {
  return prisma.clientUpdate.findMany({
    where: { clientProfileId },
    include: { author: { select: { name: true, email: true } } },
    orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
  })
}

function renderMarkdown(text: string) {
  // Basic markdown rendering (bold, line breaks, bullets)
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    .replace(/\n\n/g, '</p><p class="mt-3 text-[#aaa] text-[13px] leading-relaxed">')
    .replace(/\n/g, '<br/>')
    .replace(/^(\d+)\. (.+)$/gm, '<div class="flex gap-2 mt-1"><span class="text-[#c8ff00] font-bold text-[12px] mt-0.5 shrink-0">$1.</span><span>$2</span></div>')
    .replace(/^- (.+)$/gm, '<div class="flex gap-2 mt-1"><span class="text-[#c8ff00] mt-1.5 shrink-0">·</span><span>$1</span></div>')
}

export default async function UpdatesPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')

  const isAdmin = session.user.role === 'SUPER_ADMIN' || session.user.role === 'TEAM_MEMBER'
  
  // Admins see all updates (for demo, show client 1's updates)
  // In production, admin would select a client
  let clientProfileId = session.user.clientProfileId
  if (isAdmin && !clientProfileId) {
    const firstClient = await prisma.clientProfile.findFirst({ select: { id: true } })
    clientProfileId = firstClient?.id || null
  }

  if (!clientProfileId) {
    return <div className="text-[#888] text-sm">No client selected.</div>
  }

  const updates = await getUpdates(clientProfileId)
  const unreadCount = updates.filter((u) => !u.isRead).length

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Updates</h1>
          <p className="text-[#888] text-sm mt-1">
            {unreadCount > 0 ? (
              <span className="flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-[#c8ff00]" />
                <span className="text-[#c8ff00] font-medium">{unreadCount} new update{unreadCount !== 1 ? 's' : ''}</span>
              </span>
            ) : (
              'All caught up'
            )}
          </p>
        </div>
      </div>

      {/* Update cards */}
      <div className="space-y-4">
        {updates.length === 0 ? (
          <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-12 text-center">
            <Bell className="w-8 h-8 text-[#333] mx-auto mb-3" />
            <p className="text-[#555] text-sm">No updates yet. Your account manager will post updates here.</p>
          </div>
        ) : (
          updates.map((update) => {
            const cat = CATEGORY_CONFIG[update.category] || CATEGORY_CONFIG.GENERAL
            return (
              <article
                key={update.id}
                className={`bg-[#141414] border rounded-2xl overflow-hidden transition-colors ${
                  !update.isRead ? 'border-[#c8ff00]/20' : 'border-[#1e1e1e]'
                }`}
              >
                {/* Card header */}
                <div className="px-6 py-4 border-b border-[#1a1a1a] flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      {!update.isRead && (
                        <span className="w-2 h-2 rounded-full bg-[#c8ff00] shrink-0" />
                      )}
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border ${cat.color} ${cat.border}`}>
                        {cat.label}
                      </span>
                      {update.isPinned && (
                        <span className="flex items-center gap-1 text-[10px] text-[#555] font-medium">
                          <Pin className="w-3 h-3" /> Pinned
                        </span>
                      )}
                    </div>
                    <h2 className="font-display font-bold text-white text-lg leading-tight">{update.title}</h2>
                  </div>
                  {!update.isRead && !isAdmin && (
                    <MarkReadButton updateId={update.id} />
                  )}
                </div>

                {/* Content */}
                <div className="px-6 py-5">
                  <p
                    className="text-[#aaa] text-[13px] leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(update.content) }}
                  />
                </div>

                {/* Footer */}
                <div className="px-6 py-3 border-t border-[#1a1a1a] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-[#1e1e1e] rounded-full flex items-center justify-center">
                      <span className="text-[9px] font-bold text-[#888]">
                        {update.author.name?.[0]?.toUpperCase() || 'A'}
                      </span>
                    </div>
                    <span className="text-[12px] text-[#555]">{update.author.name || 'ATP Scales'}</span>
                  </div>
                  <span className="text-[11px] text-[#444]">
                    {update.publishedAt
                      ? `${formatRelativeTime(update.publishedAt)} · ${formatDate(update.publishedAt)}`
                      : formatRelativeTime(update.createdAt)}
                  </span>
                </div>
              </article>
            )
          })
        )}
      </div>
    </div>
  )
}

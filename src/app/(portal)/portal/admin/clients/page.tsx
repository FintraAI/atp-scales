// src/app/(portal)/admin/clients/page.tsx

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { formatCurrency, PERFORMANCE_CONFIG, CLIENT_STATUS_CONFIG } from '@/lib/utils'
import { Plus, Search, ChevronRight, Users } from 'lucide-react'
import type { PerformanceStatus, ClientStatus } from '@prisma/client'
import { subDays, startOfDay } from 'date-fns'

export default async function AdminClientsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')
  if (!['SUPER_ADMIN', 'TEAM_MEMBER'].includes(session.user.role)) redirect('/portal/dashboard')

  const thirtyDaysAgo = startOfDay(subDays(new Date(), 30))

  const clients = await prisma.clientProfile.findMany({
    include: {
      user: { select: { email: true, name: true, lastLoginAt: true } },
      plan: { select: { name: true, priceMonthly: true } },
      accountManager: { select: { name: true } },
      _count: { select: { updates: { where: { isRead: false } } } },
      metrics: {
        where: { date: { gte: thirtyDaysAgo } },
        select: { adSpend: true, revenue: true, leads: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const enriched = clients.map((c) => {
    const totals = c.metrics.reduce(
      (acc, m) => ({ spend: acc.spend + Number(m.adSpend), revenue: acc.revenue + Number(m.revenue), leads: acc.leads + m.leads }),
      { spend: 0, revenue: 0, leads: 0 }
    )
    return { ...c, totals }
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Clients</h1>
          <p className="text-[#B3B3B3] text-sm mt-1">{clients.length} total clients</p>
        </div>
        <Link
          href="/portal/admin/clients/new"
          className="flex items-center gap-2 bg-[#c8ff00] hover:bg-[#d4ff33] text-black font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Client
        </Link>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total', value: clients.length, color: 'text-white' },
          { label: 'Active', value: clients.filter((c) => c.status === 'ACTIVE').length, color: 'text-emerald-400' },
          { label: 'Onboarding', value: clients.filter((c) => c.status === 'ONBOARDING').length, color: 'text-purple-400' },
          { label: 'Needs Attention', value: clients.filter((c) => c.performanceStatus === 'NEEDS_ATTENTION' || c.performanceStatus === 'CRITICAL').length, color: 'text-amber-400' },
        ].map((s) => (
          <div key={s.label} className="bg-[#181818] border border-[#1e1e1e] rounded-xl px-4 py-3">
            <p className="text-[11px] text-[#6B6B6B] uppercase tracking-wider mb-1">{s.label}</p>
            <p className={`font-display font-bold text-xl ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Client table */}
      <div className="bg-[#181818] border border-[#1e1e1e] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full data-table">
            <thead>
              <tr>
                <th className="text-left">Client</th>
                <th className="text-left">Plan</th>
                <th className="text-left">Manager</th>
                <th className="text-right">30d Spend</th>
                <th className="text-right">30d Revenue</th>
                <th className="text-right">ROAS</th>
                <th className="text-left">Status</th>
                <th className="text-left">Performance</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {enriched.map((client) => {
                const roas = client.totals.spend > 0 ? client.totals.revenue / client.totals.spend : 0
                const perfCfg = PERFORMANCE_CONFIG[client.performanceStatus as PerformanceStatus]
                const statusCfg = CLIENT_STATUS_CONFIG[client.status as ClientStatus]

                return (
                  <tr key={client.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#1e1e1e] rounded-lg flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-[#B3B3B3]">{client.companyName[0]}</span>
                        </div>
                        <div>
                          <p className="font-medium text-white text-[13px]">{client.companyName}</p>
                          <p className="text-[11px] text-[#6B6B6B]">{client.user.email}</p>
                        </div>
                        {client._count.updates > 0 && (
                          <span className="text-[10px] bg-[#c8ff00] text-black font-bold px-1.5 py-0.5 rounded-full">
                            {client._count.updates}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="text-[12px] text-[#B3B3B3]">{client.plan?.name || '—'}</span>
                    </td>
                    <td>
                      <span className="text-[12px] text-[#B3B3B3]">{client.accountManager?.name || '—'}</span>
                    </td>
                    <td className="text-right">
                      <span className="text-[13px] font-medium">{formatCurrency(client.totals.spend, true)}</span>
                    </td>
                    <td className="text-right">
                      <span className="text-[13px] font-medium text-[#c8ff00]">{formatCurrency(client.totals.revenue, true)}</span>
                    </td>
                    <td className="text-right">
                      <span className={`font-bold font-display text-[13px] ${roas >= 3 ? 'text-emerald-400' : roas >= 1.5 ? 'text-amber-400' : 'text-red-400'}`}>
                        {roas > 0 ? `${roas.toFixed(2)}x` : '—'}
                      </span>
                    </td>
                    <td>
                      <span className={`text-[11px] font-semibold px-2 py-1 rounded-md ${statusCfg.bg} ${statusCfg.color}`}>
                        {statusCfg.label}
                      </span>
                    </td>
                    <td>
                      <span className={`text-[11px] font-semibold px-2 py-1 rounded-md flex items-center gap-1.5 w-fit ${perfCfg.bg} ${perfCfg.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${perfCfg.dot}`} />
                        {perfCfg.label}
                      </span>
                    </td>
                    <td>
                      <Link href={`/portal/admin/clients/${client.id}`} className="text-[#6B6B6B] hover:text-[#c8ff00] transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

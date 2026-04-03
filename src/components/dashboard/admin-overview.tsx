// src/components/dashboard/admin-overview.tsx

import Link from 'next/link'
import { formatCurrency, formatNumber, PERFORMANCE_CONFIG, CLIENT_STATUS_CONFIG } from '@/lib/utils'
import { Users, TrendingUp, DollarSign, Target, ArrowRight, ChevronRight, Zap } from 'lucide-react'
import type { PerformanceStatus, ClientStatus } from '@prisma/client'

interface AdminOverviewProps {
  data: {
    clients:      any[]
    totalClients: number
    activeClients: number
    totalAdSpend:  number
    totalRevenue:  number
    totalLeads:    number
  }
}

export function AdminOverview({ data }: AdminOverviewProps) {
  const overallRoas = data.totalAdSpend > 0 ? data.totalRevenue / data.totalAdSpend : 0

  const topStats = [
    {
      label: 'Active Clients',
      value: `${data.activeClients}`,
      sub: `of ${data.totalClients} total`,
      icon: Users,
      gold: false,
    },
    {
      label: 'Total Ad Spend',
      value: formatCurrency(data.totalAdSpend, true),
      sub: 'Last 30 days',
      icon: DollarSign,
      gold: false,
    },
    {
      label: 'Total Revenue',
      value: formatCurrency(data.totalRevenue, true),
      sub: 'Last 30 days',
      icon: TrendingUp,
      gold: true,
    },
    {
      label: 'Blended ROAS',
      value: `${overallRoas.toFixed(2)}x`,
      sub: 'Across all clients',
      icon: Zap,
      gold: true,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white tracking-wide">Agency Overview</h1>
          <p className="text-[#555] text-sm mt-1">All clients · Last 30 days</p>
        </div>
        <Link
          href="/portal/admin/clients"
          className="btn-outline text-sm py-2 px-4"
        >
          Manage Clients <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {topStats.map((stat) => (
          <div key={stat.label} className={stat.gold ? 'atp-card-gold kpi-card' : 'kpi-card'}>
            <div className="flex items-start justify-between mb-3">
              <div className={`p-1.5 rounded-lg ${stat.gold ? 'bg-[rgba(201,168,76,0.1)]' : 'bg-white/[0.04]'}`}>
                <stat.icon className={`w-3.5 h-3.5 ${stat.gold ? 'text-[#C9A84C]' : 'text-[#555]'}`} />
              </div>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#444] mb-1">{stat.label}</p>
            <p className={`text-[22px] font-display font-bold leading-none ${stat.gold ? 'gold-text' : 'text-[#EBEBEB]'}`}>
              {stat.value}
            </p>
            <p className="text-[11px] text-[#333] mt-1.5">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Client list */}
      <div className="bg-[#111111] border border-[#1C1C1C] rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1C1C1C]">
          <div>
            <h2 className="font-display font-semibold text-white tracking-wide">All Clients</h2>
            <p className="text-[#444] text-[11px] mt-0.5">{data.clients.length} accounts</p>
          </div>
          <Link
            href="/portal/admin/clients"
            className="flex items-center gap-1.5 text-[#C9A84C] text-xs font-semibold hover:text-[#E2C06A] transition-colors"
          >
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="divide-y divide-[rgba(255,255,255,0.03)]">
          {data.clients.map((client) => {
            const perfCfg   = PERFORMANCE_CONFIG[client.performanceStatus as PerformanceStatus]   || PERFORMANCE_CONFIG.STABLE
            const statusCfg = CLIENT_STATUS_CONFIG[client.status as ClientStatus] || CLIENT_STATUS_CONFIG.ACTIVE
            const unread    = client._count?.updates || 0

            return (
              <Link
                key={client.id}
                href={`/portal/admin/clients/${client.id}`}
                className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.015] transition-colors group"
              >
                {/* Avatar */}
                <div className="w-10 h-10 bg-[#1A1A1A] border border-[#222] rounded-xl flex items-center justify-center shrink-0 group-hover:border-[rgba(201,168,76,0.2)] transition-colors">
                  {client.logoUrl ? (
                    <img src={client.logoUrl} alt={client.companyName} className="w-8 h-8 rounded-lg object-cover" />
                  ) : (
                    <span className="text-[13px] font-bold text-[#666] group-hover:text-[#C9A84C] transition-colors">
                      {client.companyName[0]}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-semibold text-[#D8D8D8] text-[13px] group-hover:text-white transition-colors truncate">
                      {client.companyName}
                    </p>
                    {unread > 0 && (
                      <span className="shrink-0 text-[9px] bg-[#C9A84C] text-black font-black px-1.5 py-0.5 rounded-full leading-none">
                        {unread}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-[#444]">
                    {client.industry && <span>{client.industry}</span>}
                    {client.plan && <><span>·</span><span>{client.plan.name} Plan</span></>}
                    {client.accountManager && <><span>·</span><span>{client.accountManager.name}</span></>}
                  </div>
                </div>

                {/* Badges */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg ${statusCfg.bg} ${statusCfg.color}`}>
                    {statusCfg.label}
                  </span>
                  <span className={`hidden sm:flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg ${perfCfg.bg} ${perfCfg.color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${perfCfg.dot} ${
                      client.performanceStatus === 'NEEDS_ATTENTION' || client.performanceStatus === 'CRITICAL'
                        ? 'animate-pulse' : ''
                    }`} />
                    {perfCfg.label}
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#2A2A2A] group-hover:text-[#555] transition-colors" />
                </div>
              </Link>
            )
          })}

          {data.clients.length === 0 && (
            <div className="px-6 py-12 text-center">
              <Users className="w-8 h-8 text-[#2A2A2A] mx-auto mb-3" />
              <p className="text-[#555] text-sm">No clients yet.</p>
              <Link href="/portal/admin/clients/new" className="inline-flex items-center gap-1.5 mt-3 text-[#C9A84C] text-sm font-medium hover:text-[#E2C06A] transition-colors">
                Add your first client <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

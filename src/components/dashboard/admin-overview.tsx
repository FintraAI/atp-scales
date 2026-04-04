// src/components/dashboard/admin-overview.tsx
// Admin dashboard — full agency-level reporting view.

import Link from 'next/link'
import {
  formatCurrency, formatNumber, formatPercent,
  PERFORMANCE_CONFIG, CLIENT_STATUS_CONFIG,
} from '@/lib/utils'
import {
  Users, TrendingUp, DollarSign, Target, ArrowRight,
  ChevronRight, Zap, BarChart2, Percent, MousePointer,
} from 'lucide-react'
import type { PerformanceStatus, ClientStatus } from '@prisma/client'
import type { AdminDashboardData } from '@/lib/services/dashboard.service'
import { PerformanceCharts } from './performance-charts'
import { ClientComparison }  from './client-comparison'
import { AudienceBreakdown } from './audience-breakdown'
import { HourlyPerformance } from './hourly-performance'
import { ConversionInsights } from './conversion-insights'

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display font-bold text-white text-lg tracking-wide">{title}</h2>
        {sub && <p className="text-[#6B6B6B] text-[11px] mt-0.5">{sub}</p>}
      </div>
      {children}
    </div>
  )
}

// ─── KPI card ─────────────────────────────────────────────────────────────────

function KPICard({
  label, value, sub, icon: Icon, gold = false,
}: {
  label: string; value: string; sub?: string; icon: React.ElementType; gold?: boolean
}) {
  return (
    <div className={gold ? 'atp-card-gold kpi-card' : 'kpi-card'}>
      <div className="flex items-start justify-between mb-3">
        <div className={`p-1.5 rounded-lg ${gold ? 'bg-[rgba(212,175,55,0.1)]' : 'bg-white/[0.04]'}`}>
          <Icon className={`w-3.5 h-3.5 ${gold ? 'text-[#D4AF37]' : 'text-[#6B6B6B]'}`} />
        </div>
      </div>
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#6B6B6B] mb-1">{label}</p>
      <p className={`text-[22px] font-display font-bold leading-none ${gold ? 'gold-text' : 'text-white'}`}>{value}</p>
      {sub && <p className="text-[11px] text-[#333] mt-1.5">{sub}</p>}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function AdminOverview({ data }: { data: AdminDashboardData }) {
  const overallRoas = data.totalAdSpend > 0 ? data.totalRevenue / data.totalAdSpend : 0

  return (
    <div className="space-y-12">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white tracking-wide">Agency Overview</h1>
          <p className="text-[#6B6B6B] text-sm mt-1">All clients · Last 30 days</p>
        </div>
        <Link href="/portal/admin/clients" className="btn-outline text-sm py-2 px-4">
          Manage Clients <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* ── 1. Executive Summary ────────────────────────────────────────────── */}
      <Section title="Executive Summary" sub="Aggregated performance across all active clients">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <KPICard label="Active Clients"  value={`${data.activeClients}`}               sub={`of ${data.totalClients} total`} icon={Users}         />
          <KPICard label="Total Ad Spend"  value={formatCurrency(data.totalAdSpend, true)} sub="Last 30 days"                  icon={DollarSign}     />
          <KPICard label="Total Revenue"   value={formatCurrency(data.totalRevenue, true)} sub="Last 30 days"                  icon={TrendingUp} gold />
          <KPICard label="Blended ROAS"    value={`${overallRoas.toFixed(2)}x`}            sub="Across all clients"            icon={Zap}        gold />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <KPICard label="Total Leads"     value={formatNumber(data.totalLeads)}           sub="Last 30 days"                  icon={Target}         />
          <KPICard label="Avg CPL"         value={formatCurrency(data.avgCpl)}             sub="Across all clients"            icon={BarChart2}      />
          <KPICard label="Avg CTR"         value={formatPercent(data.avgCtr, 2)}           sub="Click-through rate"            icon={Percent}        />
          <KPICard label="Avg CPC"         value={formatCurrency(data.avgCpc)}             sub="Cost per click"                icon={MousePointer}   />
        </div>
      </Section>

      {/* ── 2. Performance Trends ───────────────────────────────────────────── */}
      <Section title="Performance Trends" sub="Cross-client aggregated trends over the last 30 days">
        <PerformanceCharts chartData={data.trends} />
      </Section>

      {/* ── 3. Client Comparison ────────────────────────────────────────────── */}
      <Section title="Client Comparison" sub="Ranked performance by spend, leads, and cost per lead">
        <ClientComparison rows={data.clientComparison} />
      </Section>

      {/* ── 4. Audience Insights + Hourly ───────────────────────────────────── */}
      <Section title="Audience & Delivery Insights" sub="Breakdown by demographic and time of day">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AudienceBreakdown data={data.audienceBreakdown} />
          <HourlyPerformance rows={data.hourlyPerformance} />
        </div>
      </Section>

      {/* ── 5. Conversion Actions ───────────────────────────────────────────── */}
      <Section title="Conversion Insights" sub="What actions are being taken after ad clicks">
        <ConversionInsights rows={data.conversionInsights} />
      </Section>

      {/* ── 6. All Clients ──────────────────────────────────────────────────── */}
      <Section title="All Clients" sub={`${data.clients.length} accounts`}>
        <ClientList clients={data.clients} />
      </Section>

    </div>
  )
}

// ─── Client list (extracted for clarity) ─────────────────────────────────────

function ClientList({ clients }: { clients: AdminDashboardData['clients'] }) {
  return (
    <div className="bg-[#0F0F0F] border border-[#222222] rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#222222]">
        <p className="text-[#6B6B6B] text-[11px]">{clients.length} accounts</p>
        <Link
          href="/portal/admin/clients"
          className="flex items-center gap-1.5 text-[#D4AF37] text-xs font-semibold hover:text-[#E6C65C] transition-colors"
        >
          View all <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="divide-y divide-[rgba(255,255,255,0.03)]">
        {clients.map(client => {
          const perfCfg   = PERFORMANCE_CONFIG[client.performanceStatus as PerformanceStatus] || PERFORMANCE_CONFIG.STABLE
          const statusCfg = CLIENT_STATUS_CONFIG[client.status as ClientStatus] || CLIENT_STATUS_CONFIG.ACTIVE
          const unread    = client._count?.updates || 0

          return (
            <Link
              key={client.id}
              href={`/portal/admin/clients/${client.id}`}
              className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.015] transition-colors group"
            >
              {/* Avatar */}
              <div className="w-10 h-10 bg-[#1A1A1A] border border-[#222] rounded-xl flex items-center justify-center shrink-0 group-hover:border-[rgba(212,175,55,0.2)] transition-colors">
                {client.logoUrl ? (
                  <img src={client.logoUrl} alt={client.companyName} className="w-8 h-8 rounded-lg object-cover" />
                ) : (
                  <span className="text-[13px] font-bold text-[#B3B3B3] group-hover:text-[#D4AF37] transition-colors">
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
                    <span className="shrink-0 text-[9px] bg-[#D4AF37] text-black font-black px-1.5 py-0.5 rounded-full leading-none">
                      {unread}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-[#6B6B6B]">
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
                    client.performanceStatus === 'NEEDS_ATTENTION' || client.performanceStatus === 'CRITICAL' ? 'animate-pulse' : ''
                  }`} />
                  {perfCfg.label}
                </span>
                <ChevronRight className="w-4 h-4 text-[#2A2A2A] group-hover:text-[#6B6B6B] transition-colors" />
              </div>
            </Link>
          )
        })}

        {clients.length === 0 && (
          <div className="px-6 py-12 text-center">
            <Users className="w-8 h-8 text-[#2A2A2A] mx-auto mb-3" />
            <p className="text-[#6B6B6B] text-sm">No clients yet.</p>
            <Link href="/portal/admin/clients/new" className="inline-flex items-center gap-1.5 mt-3 text-[#D4AF37] text-sm font-medium hover:text-[#E6C65C] transition-colors">
              Add your first client <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

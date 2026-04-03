// src/app/(portal)/portal/reports/page.tsx — Analytics (plan-gated)

import { getServerSession }          from 'next-auth'
import { authOptions }               from '@/lib/auth'
import { redirect }                  from 'next/navigation'
import { prisma }                    from '@/lib/prisma'
import { getClientPlan, planAtLeast, type PlanName } from '@/lib/client-plan'
import { getAnalyticsData }          from '@/lib/services/dashboard.service'
import { formatCurrency, formatNumber, formatPercent, formatRoas } from '@/lib/utils'
import { Lock, BarChart2, ArrowRight } from 'lucide-react'
import { PerformanceCharts } from '@/components/dashboard/performance-charts'
import type { ChartDataPoint, CampaignRow } from '@/types'
import Link from 'next/link'

// ── Locked section overlay ───────────────────────────────────────────────────
function LockedSection({ requiredPlan, children }: { requiredPlan: string; children: React.ReactNode }) {
  return (
    <div className="relative rounded-2xl overflow-hidden">
      <div className="blur-[3px] pointer-events-none select-none opacity-30" aria-hidden>
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-[#080808]/60 backdrop-blur-[1px]">
        <div className="atp-card p-6 text-center max-w-sm mx-4 shadow-2xl">
          <div className="w-10 h-10 rounded-xl bg-[rgba(201,168,76,0.08)] border border-[rgba(201,168,76,0.15)] flex items-center justify-center mx-auto mb-3">
            <Lock className="w-4 h-4 text-[#C9A84C]" />
          </div>
          <p className="font-display font-bold text-[#EBEBEB] tracking-wide mb-1">
            Available on {requiredPlan}
          </p>
          <p className="text-[#555] text-[12px] leading-relaxed mb-4">
            Upgrade your plan to unlock deeper analytics and campaign insights.
          </p>
          <Link href="/portal/profile" className="btn-gold text-[12px] px-4 py-2 inline-flex items-center gap-1.5">
            Upgrade Plan <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  )
}

// ── Funnel bar component (Scale plan) ────────────────────────────────────────
function FunnelBar({ label, value, max, sub }: { label: string; value: number; max: number; sub: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0
  return (
    <div className="space-y-2">
      <div className="flex items-end justify-between">
        <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#555]">{label}</span>
        <div className="text-right">
          <span className="font-display font-bold text-[20px] text-[#EBEBEB]">{formatNumber(value, true)}</span>
          <span className="text-[10px] text-[#333] ml-1.5">{sub}</span>
        </div>
      </div>
      <div className="h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#9A7A35] to-[#C9A84C] transition-all duration-700"
          style={{ width: `${Math.max(pct, 2)}%` }}
        />
      </div>
      <p className="text-[11px] text-[#444]">{pct.toFixed(1)}% of total</p>
    </div>
  )
}

// ── Placeholder charts for locked overlay preview ────────────────────────────
function FakeChartPlaceholder() {
  return (
    <div className="atp-card p-6">
      <div className="h-[180px] flex items-end gap-1 px-4 pb-4">
        {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
          <div key={i} className="flex-1 rounded-t-sm" style={{ height: `${h}%`, background: 'rgba(201,168,76,0.15)' }} />
        ))}
      </div>
    </div>
  )
}

function FakeTablePlaceholder() {
  return (
    <div className="atp-card overflow-hidden">
      <div className="px-6 py-4 border-b border-[#1C1C1C]">
        <div className="h-4 w-36 bg-[#1A1A1A] rounded" />
      </div>
      {[1, 2, 3].map(i => (
        <div key={i} className="px-6 py-4 border-b border-[#111] flex items-center justify-between">
          <div className="h-3 w-40 bg-[#161616] rounded" />
          <div className="flex gap-6">
            <div className="h-3 w-16 bg-[#161616] rounded" />
            <div className="h-3 w-16 bg-[#161616] rounded" />
            <div className="h-3 w-16 bg-[#161616] rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')

  const isAdmin = session.user.role === 'SUPER_ADMIN' || session.user.role === 'TEAM_MEMBER'
  let clientProfileId = session.user.clientProfileId

  if (isAdmin && !clientProfileId) {
    const first = await prisma.clientProfile.findFirst({ select: { id: true } })
    clientProfileId = first?.id || null
  }

  if (!clientProfileId) {
    return <div className="text-[#555] text-sm p-4">No client data available.</div>
  }

  const [plan, analyticsData] = await Promise.all([
    getClientPlan(clientProfileId),
    getAnalyticsData(clientProfileId),
  ])
  const { metrics30d: totals, chartData30d: chartData, chartData90d: trend90Data, campaignRows } = analyticsData

  const PLAN_BADGE: Record<PlanName, { label: string; color: string }> = {
    Starter: { label: 'Starter',  color: 'text-[#888]  bg-[#1A1A1A] border-[#2A2A2A]' },
    Growth:  { label: 'Growth',   color: 'text-blue-400 bg-blue-400/8 border-blue-400/20' },
    Scale:   { label: 'Scale',    color: 'gold-text bg-[rgba(201,168,76,0.06)] border-[rgba(201,168,76,0.18)]' },
  }
  const badge = PLAN_BADGE[plan]

  return (
    <div className="space-y-10">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#EBEBEB] tracking-wide">Analytics</h1>
          <p className="text-[#555] text-sm mt-1">Last 30 days · performance deep-dive</p>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.12em] border ${badge.color}`}>
          <BarChart2 className="w-3 h-3" />
          {badge.label} Plan
        </span>
      </div>

      {/* ── Section 1: 30-Day Summary (all plans) ──────────────────────── */}
      <section className="space-y-4">
        <h2 className="font-display font-bold text-[#EBEBEB] tracking-wide">30-Day Summary</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total Spend',     value: formatCurrency(totals.spend),                                       gold: false },
            { label: 'Leads Generated', value: formatNumber(totals.leads),                                         gold: true  },
            { label: 'Cost Per Lead',   value: totals.leads > 0 ? formatCurrency(totals.spend / totals.leads) : '—', gold: false },
            { label: 'CTR',             value: totals.impressions > 0 ? formatPercent(totals.clicks / totals.impressions, 2) : '—', gold: false },
          ].map(s => (
            <div key={s.label} className={s.gold ? 'atp-card-gold kpi-card' : 'kpi-card'}>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#444] mb-1.5">{s.label}</p>
              <p className={`font-display font-bold text-xl leading-none ${s.gold ? 'gold-text' : 'text-[#EBEBEB]'}`}>
                {s.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 2: Performance Over Time (all plans) ───────────────── */}
      <section className="space-y-4">
        <h2 className="font-display font-bold text-[#EBEBEB] tracking-wide">Performance Over Time</h2>
        <PerformanceCharts chartData={chartData} />
      </section>

      {/* ── Section 3: Campaign Breakdown (Growth+) ────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="font-display font-bold text-[#EBEBEB] tracking-wide">Campaign Breakdown</h2>
          {!planAtLeast(plan, 'Growth') && (
            <span className="badge-silver flex items-center gap-1">
              <Lock className="w-2.5 h-2.5" /> Growth+
            </span>
          )}
        </div>

        {planAtLeast(plan, 'Growth') ? (
          <div className="atp-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full data-table">
                <thead>
                  <tr>
                    <th className="text-left">Campaign</th>
                    <th className="text-right">Spend</th>
                    <th className="text-right">Leads</th>
                    <th className="text-right">CPL</th>
                    <th className="text-right">CTR</th>
                    <th className="text-right">CPC</th>
                    <th className="text-right">ROAS</th>
                  </tr>
                </thead>
                <tbody>
                  {campaignRows.map(c => (
                    <tr key={c.id}>
                      <td>
                        <p className="font-semibold text-[#EBEBEB] text-[13px] max-w-[220px] truncate">{c.name}</p>
                        <p className="text-[10px] text-[#333] mt-0.5">{c.platform}</p>
                      </td>
                      <td className="text-right font-semibold">{formatCurrency(c.spend)}</td>
                      <td className="text-right font-semibold text-[#D8D8D8]">{formatNumber(c.leads)}</td>
                      <td className="text-right text-[#666]">{formatCurrency(c.cpl)}</td>
                      <td className="text-right text-[#666]">{formatPercent(c.ctr, 2)}</td>
                      <td className="text-right text-[#666]">{formatCurrency(c.cpc)}</td>
                      <td className="text-right">
                        <span className={`font-display font-bold text-[14px] ${
                          c.roas >= 4 ? 'gold-text' : c.roas >= 2 ? 'text-[#D8D8D8]' : 'text-red-400'
                        }`}>{formatRoas(c.roas)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <LockedSection requiredPlan="Growth">
            <FakeTablePlaceholder />
          </LockedSection>
        )}
      </section>

      {/* ── Section 4: 90-Day Trend (Growth+) ──────────────────────────── */}
      {planAtLeast(plan, 'Growth') && (
        <section className="space-y-4">
          <h2 className="font-display font-bold text-[#EBEBEB] tracking-wide">90-Day Trend</h2>
          <PerformanceCharts chartData={trend90Data} />
        </section>
      )}

      {/* ── Section 5: Full Funnel (Scale) ──────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="font-display font-bold text-[#EBEBEB] tracking-wide">Full Funnel Analysis</h2>
          {!planAtLeast(plan, 'Scale') && (
            <span className="badge-gold flex items-center gap-1">
              <Lock className="w-2.5 h-2.5" /> Scale
            </span>
          )}
        </div>

        {planAtLeast(plan, 'Scale') ? (
          <div className="atp-card p-6 space-y-1">
            <p className="text-[11px] text-[#444] font-bold uppercase tracking-[0.12em] mb-6">
              Last 30 days · {formatNumber(totals.impressions, true)} total impressions
            </p>
            <div className="space-y-6 max-w-2xl">
              <FunnelBar
                label="Impressions"
                value={totals.impressions}
                max={totals.impressions}
                sub="total reach"
              />
              <FunnelBar
                label="Clicks"
                value={totals.clicks}
                max={totals.impressions}
                sub={`${formatPercent(totals.impressions > 0 ? totals.clicks / totals.impressions : 0, 2)} CTR`}
              />
              <FunnelBar
                label="Leads"
                value={totals.leads}
                max={totals.impressions}
                sub={`${formatPercent(totals.clicks > 0 ? totals.leads / totals.clicks : 0, 1)} CVR`}
              />
              <FunnelBar
                label="Appointments"
                value={totals.appointments}
                max={totals.impressions}
                sub={`${formatPercent(totals.leads > 0 ? totals.appointments / totals.leads : 0, 1)} of leads`}
              />
              {totals.purchases > 0 && (
                <FunnelBar
                  label="Conversions"
                  value={totals.purchases}
                  max={totals.impressions}
                  sub={`${formatPercent(totals.appointments > 0 ? totals.purchases / totals.appointments : 0, 1)} close rate`}
                />
              )}
            </div>

            {/* Key funnel metrics */}
            <div className="mt-8 pt-6 border-t border-[#1C1C1C] grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                {
                  label: 'Lead CVR',
                  value: formatPercent(totals.clicks > 0 ? totals.leads / totals.clicks : 0, 1),
                  sub:   'clicks → leads',
                },
                {
                  label: 'Appt Rate',
                  value: formatPercent(totals.leads > 0 ? totals.appointments / totals.leads : 0, 1),
                  sub:   'leads → appointments',
                },
                {
                  label: 'Cost / Appt',
                  value: totals.appointments > 0 ? formatCurrency(totals.spend / totals.appointments) : '—',
                  sub:   'per appointment',
                },
                {
                  label: 'ROAS',
                  value: totals.spend > 0 ? formatRoas(totals.revenue / totals.spend) : '—',
                  sub:   'return on ad spend',
                },
              ].map(m => (
                <div key={m.label}>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#444] mb-1">{m.label}</p>
                  <p className="font-display font-bold text-[18px] gold-text">{m.value}</p>
                  <p className="text-[10px] text-[#333] mt-0.5">{m.sub}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <LockedSection requiredPlan="Scale">
            <div className="atp-card p-6 space-y-4">
              <div className="max-w-lg space-y-4">
                {['Impressions', 'Clicks', 'Leads', 'Appointments', 'Conversions'].map((s, i) => (
                  <div key={s} className="space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-[#555]">{s}</span>
                      <span className="text-[#333]">—</span>
                    </div>
                    <div className="h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-[#9A7A35] to-[#C9A84C]"
                        style={{ width: `${100 - i * 18}%`, opacity: 0.3 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </LockedSection>
        )}
      </section>

    </div>
  )
}

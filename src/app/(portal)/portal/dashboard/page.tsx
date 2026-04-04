// src/app/(portal)/portal/dashboard/page.tsx

import { getServerSession }     from 'next-auth'
import { authOptions }          from '@/lib/auth'
import { redirect }             from 'next/navigation'
import { KPICards }             from '@/components/dashboard/kpi-cards'
import { PerformanceCharts }    from '@/components/dashboard/performance-charts'
import { CampaignTable }        from '@/components/dashboard/campaign-table'
import { RecentUpdates }        from '@/components/dashboard/recent-updates'
import { AdminOverview }        from '@/components/dashboard/admin-overview'
import { InsightsFeed }         from '@/components/dashboard/insights-feed'
import { AudienceBreakdown }    from '@/components/dashboard/audience-breakdown'
import { HourlyPerformance }    from '@/components/dashboard/hourly-performance'
import { CreativeInsights }     from '@/components/dashboard/creative-insights'
import { ConversionInsights }   from '@/components/dashboard/conversion-insights'
import { computeInsights }      from '@/lib/metrics'
import {
  getClientDashboardData,
  getAdminDashboardData,
} from '@/lib/services/dashboard.service'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')

  const isAdmin = session.user.role === 'SUPER_ADMIN' || session.user.role === 'TEAM_MEMBER'

  if (isAdmin) {
    const data = await getAdminDashboardData()
    return <AdminOverview data={data} />
  }

  if (!session.user.clientProfileId) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[#6B6B6B] text-sm">No dashboard found. Contact your account manager.</p>
      </div>
    )
  }

  const data     = await getClientDashboardData(session.user.clientProfileId)
  const insights = computeInsights(data.campaignRows)

  return (
    <div className="space-y-10">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">
            {data.profile?.companyName || 'Dashboard'}
          </h1>
          <p className="text-[#6B6B6B] text-sm mt-1">Last 30 days performance overview</p>
        </div>
        {data.profile?.performanceStatus && (
          <PerformanceBadge status={data.profile.performanceStatus} />
        )}
      </div>

      {/* KPI Cards */}
      <KPICards kpis={data.kpis} />

      {/* Performance Trends */}
      <PerformanceCharts chartData={data.chartData} />

      {/* Actionable Insights */}
      {insights.length > 0 && <InsightsFeed insights={insights} />}

      {/* Audience + Hourly — side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AudienceBreakdown data={data.audienceBreakdown} />
        <HourlyPerformance rows={data.hourlyPerformance} />
      </div>

      {/* Creative Insights */}
      <CreativeInsights rows={data.creativeInsights} simplified />

      {/* Conversion Actions */}
      <ConversionInsights rows={data.conversionInsights} simplified />

      {/* Campaign Table */}
      <CampaignTable campaigns={data.campaignRows} />

      {/* Recent Updates */}
      <RecentUpdates updates={data.updates} />

    </div>
  )
}

function PerformanceBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; color: string; dot: string }> = {
    IMPROVING:       { label: 'Improving',      color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20', dot: 'bg-emerald-400' },
    STABLE:          { label: 'Stable',          color: 'text-blue-400 bg-blue-400/10 border-blue-400/20',         dot: 'bg-blue-400' },
    NEEDS_ATTENTION: { label: 'Needs Attention', color: 'text-amber-400 bg-amber-400/10 border-amber-400/20',      dot: 'bg-amber-400 animate-pulse' },
    CRITICAL:        { label: 'Critical',        color: 'text-red-400 bg-red-400/10 border-red-400/20',            dot: 'bg-red-400 animate-pulse' },
  }
  const c = config[status] || config.STABLE
  return (
    <span className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${c.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  )
}

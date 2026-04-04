// src/lib/services/dashboard.service.ts
// Dashboard data for both client and admin views.
// Pages call this — never raw Prisma or providers directly.

import { prisma }             from '@/lib/prisma'
import { getProvider }        from '@/lib/providers'
import { computeTrendChange, computeCPL, computeCTR, computeCPC } from '@/lib/metrics'
import { subDays, startOfDay, format } from 'date-fns'
import { getClientBreakdownData, getAdminBreakdownData } from '@/lib/services/breakdown.service'
import type {
  KPIData, ChartDataPoint, CampaignRow, ClientUpdateItem,
  AudienceBreakdown, HourlyPerformanceRow, CreativeAssetRow,
  ConversionActionRow, ClientComparisonRow,
} from '@/types'

// ─── Client dashboard ─────────────────────────────────────────────────────────

export interface ClientDashboardData {
  kpis:            KPIData
  chartData:       ChartDataPoint[]
  campaignRows:    CampaignRow[]
  updates:         ClientUpdateItem[]
  profile:         { companyName: string; performanceStatus: string; status: string } | null
  // Breakdown data
  audienceBreakdown:  AudienceBreakdown
  hourlyPerformance:  HourlyPerformanceRow[]
  creativeInsights:   CreativeAssetRow[]
  conversionInsights: ConversionActionRow[]
}

export async function getClientDashboardData(
  clientProfileId: string
): Promise<ClientDashboardData> {
  const now            = new Date()
  const thirtyDaysAgo  = startOfDay(subDays(now, 30))

  const provider = await getProvider(clientProfileId)

  const [metrics, timeSeries, campaignRows, breakdown] = await Promise.all([
    provider.getDashboardMetrics(clientProfileId, { from: thirtyDaysAgo, to: now }),
    provider.getTimeSeries(clientProfileId, { from: thirtyDaysAgo, to: now }),
    provider.getCampaignRows(clientProfileId, { from: thirtyDaysAgo, to: now }),
    getClientBreakdownData(clientProfileId),
  ])

  const kpis: KPIData = {
    adSpend:              metrics.spend,
    revenue:              metrics.revenue,
    roas:                 metrics.roas,
    leads:                metrics.leads,
    costPerLead:          metrics.cpl,
    appointments:         metrics.appointments,
    costPerAppointment:   metrics.costPerAppt,
    conversionRate:       metrics.convRate,
    adSpendChange:        computeTrendChange(metrics.spend,   metrics.prevSpend),
    revenueChange:        computeTrendChange(metrics.revenue, metrics.prevRevenue),
    roasChange:           computeTrendChange(metrics.roas,    metrics.prevRoas),
    leadsChange:          computeTrendChange(metrics.leads,   metrics.prevLeads),
  }

  const chartData: ChartDataPoint[] = timeSeries.map(p => ({
    date:         p.date,
    adSpend:      p.spend,
    revenue:      p.revenue,
    roas:         p.roas,
    leads:        p.leads,
    appointments: p.appointments,
    clicks:       p.clicks,
    impressions:  p.impressions,
    cpl:          p.leads > 0 ? p.spend / p.leads : 0,
    ctr:          p.impressions > 0 ? p.clicks / p.impressions : 0,
  }))

  const [updates, profile] = await Promise.all([
    prisma.clientUpdate.findMany({
      where:   { clientProfileId },
      include: { author: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
      take:    3,
    }),
    prisma.clientProfile.findUnique({
      where:  { id: clientProfileId },
      select: { companyName: true, performanceStatus: true, status: true },
    }),
  ])

  return {
    kpis,
    chartData,
    campaignRows,
    updates: updates as ClientUpdateItem[],
    profile: profile
      ? { companyName: profile.companyName, performanceStatus: profile.performanceStatus, status: profile.status }
      : null,
    audienceBreakdown:  breakdown.audience,
    hourlyPerformance:  breakdown.hourly,
    creativeInsights:   breakdown.creatives,
    conversionInsights: breakdown.conversions,
  }
}

// ─── Admin dashboard ──────────────────────────────────────────────────────────

export interface AdminDashboardData {
  clients:            Awaited<ReturnType<typeof fetchAdminClients>>
  totalClients:       number
  activeClients:      number
  totalAdSpend:       number
  totalRevenue:       number
  totalLeads:         number
  totalImpressions:   number
  avgCpl:             number
  avgCtr:             number
  avgCpc:             number
  // Trend charts
  trends:             ChartDataPoint[]
  // Per-client comparison
  clientComparison:   ClientComparisonRow[]
  // Aggregated breakdowns
  audienceBreakdown:  AudienceBreakdown
  hourlyPerformance:  HourlyPerformanceRow[]
  conversionInsights: ConversionActionRow[]
}

async function fetchAdminClients() {
  return prisma.clientProfile.findMany({
    include: {
      user:           { select: { name: true, email: true } },
      plan:           { select: { name: true } },
      accountManager: { select: { name: true } },
      _count:         { select: { updates: { where: { isRead: false } }, campaigns: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
}

async function buildAdminTrends(thirtyDaysAgo: Date): Promise<ChartDataPoint[]> {
  const snapshots = await prisma.metricSnapshot.findMany({
    where:   { date: { gte: thirtyDaysAgo } },
    orderBy: { date: 'asc' },
  })

  // Group by date across all clients
  const byDate = new Map<string, { spend: number; revenue: number; leads: number; appointments: number; clicks: number; impressions: number }>()

  for (const s of snapshots) {
    const key = format(new Date(s.date), 'MMM d')
    const existing = byDate.get(key)
    if (!existing) {
      byDate.set(key, {
        spend:        Number(s.adSpend),
        revenue:      Number(s.revenue),
        leads:        s.leads,
        appointments: s.appointments,
        clicks:       s.clicks,
        impressions:  s.impressions,
      })
    } else {
      existing.spend        += Number(s.adSpend)
      existing.revenue      += Number(s.revenue)
      existing.leads        += s.leads
      existing.appointments += s.appointments
      existing.clicks       += s.clicks
      existing.impressions  += s.impressions
    }
  }

  return Array.from(byDate.entries()).map(([date, d]) => ({
    date,
    adSpend:      d.spend,
    revenue:      d.revenue,
    roas:         d.spend > 0 ? d.revenue / d.spend : 0,
    leads:        d.leads,
    appointments: d.appointments,
    clicks:       d.clicks,
    impressions:  d.impressions,
    cpl:          d.leads > 0 ? d.spend / d.leads : 0,
    ctr:          d.impressions > 0 ? d.clicks / d.impressions : 0,
  }))
}

async function buildClientComparison(
  clients: Awaited<ReturnType<typeof fetchAdminClients>>,
  thirtyDaysAgo: Date
): Promise<ClientComparisonRow[]> {
  const allSnapshots = await prisma.metricSnapshot.findMany({
    where:   { date: { gte: thirtyDaysAgo } },
    select:  { clientProfileId: true, adSpend: true, revenue: true, leads: true, impressions: true, clicks: true },
  })

  const byClient = new Map<string, { spend: number; revenue: number; leads: number; impressions: number; clicks: number }>()
  for (const s of allSnapshots) {
    const existing = byClient.get(s.clientProfileId)
    if (!existing) {
      byClient.set(s.clientProfileId, {
        spend:       Number(s.adSpend),
        revenue:     Number(s.revenue),
        leads:       s.leads,
        impressions: s.impressions,
        clicks:      s.clicks,
      })
    } else {
      existing.spend       += Number(s.adSpend)
      existing.revenue     += Number(s.revenue)
      existing.leads       += s.leads
      existing.impressions += s.impressions
      existing.clicks      += s.clicks
    }
  }

  return clients
    .map(c => {
      const metrics = byClient.get(c.id) ?? { spend: 0, revenue: 0, leads: 0, impressions: 0, clicks: 0 }
      return {
        clientId:    c.id,
        companyName: c.companyName,
        spend:       metrics.spend,
        leads:       metrics.leads,
        cpl:         computeCPL(metrics.spend, metrics.leads),
        ctr:         computeCTR(metrics.clicks, metrics.impressions),
        roas:        metrics.spend > 0 ? metrics.revenue / metrics.spend : 0,
        campaigns:   c._count.campaigns,
      }
    })
    .sort((a, b) => b.spend - a.spend)
}

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const thirtyDaysAgo = startOfDay(subDays(new Date(), 30))

  const [clients, metrics] = await Promise.all([
    fetchAdminClients(),
    prisma.metricSnapshot.aggregate({
      where: { date: { gte: thirtyDaysAgo } },
      _sum:  { adSpend: true, revenue: true, leads: true, impressions: true, clicks: true },
    }),
  ])

  const totalAdSpend    = Number(metrics._sum.adSpend    || 0)
  const totalLeads      = metrics._sum.leads              || 0
  const totalImpressions = metrics._sum.impressions       || 0
  const totalClicks     = metrics._sum.clicks             || 0

  const clientIds = clients.map(c => c.id)

  const [trends, clientComparison, breakdown] = await Promise.all([
    buildAdminTrends(thirtyDaysAgo),
    buildClientComparison(clients, thirtyDaysAgo),
    getAdminBreakdownData(clientIds),
  ])

  return {
    clients,
    totalClients:       clients.length,
    activeClients:      clients.filter(c => c.status === 'ACTIVE').length,
    totalAdSpend,
    totalRevenue:       Number(metrics._sum.revenue || 0),
    totalLeads,
    totalImpressions,
    avgCpl:             computeCPL(totalAdSpend, totalLeads),
    avgCtr:             computeCTR(totalClicks, totalImpressions),
    avgCpc:             computeCPC(totalAdSpend, totalClicks),
    trends,
    clientComparison,
    audienceBreakdown:  breakdown.audience,
    hourlyPerformance:  breakdown.hourly,
    conversionInsights: breakdown.conversions,
  }
}

// ─── Analytics page data ──────────────────────────────────────────────────────

export interface AnalyticsData {
  metrics30d:   ReturnType<typeof buildAnalyticsTotals>
  chartData30d: ChartDataPoint[]
  chartData90d: ChartDataPoint[]
  campaignRows: CampaignRow[]
}

function buildAnalyticsTotals(snapshots: {
  adSpend: any; revenue: any; leads: number; appointments: number;
  impressions: number; clicks: number; purchases: number
}[]) {
  return snapshots.reduce(
    (a, m) => ({
      spend:        a.spend        + Number(m.adSpend),
      revenue:      a.revenue      + Number(m.revenue),
      leads:        a.leads        + m.leads,
      appointments: a.appointments + m.appointments,
      impressions:  a.impressions  + m.impressions,
      clicks:       a.clicks       + m.clicks,
      purchases:    a.purchases    + m.purchases,
    }),
    { spend: 0, revenue: 0, leads: 0, appointments: 0, impressions: 0, clicks: 0, purchases: 0 }
  )
}

export async function getAnalyticsData(clientProfileId: string): Promise<AnalyticsData> {
  const now            = new Date()
  const thirtyDaysAgo  = startOfDay(subDays(now, 30))
  const ninetyDaysAgo  = startOfDay(subDays(now, 90))

  const provider = await getProvider(clientProfileId)

  const [snapshots30d, timeSeries30d, timeSeries90d, campaignRows] = await Promise.all([
    prisma.metricSnapshot.findMany({
      where:   { clientProfileId, date: { gte: thirtyDaysAgo } },
      orderBy: { date: 'asc' },
    }),
    provider.getTimeSeries(clientProfileId, { from: thirtyDaysAgo, to: now }),
    provider.getTimeSeries(clientProfileId, { from: ninetyDaysAgo, to: now }),
    provider.getCampaignRows(clientProfileId, { from: thirtyDaysAgo, to: now }),
  ])

  const toChartData = (pts: typeof timeSeries30d): ChartDataPoint[] =>
    pts.map(p => ({
      date:         p.date,
      adSpend:      p.spend,
      revenue:      p.revenue,
      roas:         p.roas,
      leads:        p.leads,
      appointments: p.appointments,
      clicks:       p.clicks,
      impressions:  p.impressions,
      cpl:          p.leads > 0 ? p.spend / p.leads : 0,
      ctr:          p.impressions > 0 ? p.clicks / p.impressions : 0,
    }))

  return {
    metrics30d:   buildAnalyticsTotals(snapshots30d),
    chartData30d: toChartData(timeSeries30d),
    chartData90d: toChartData(timeSeries90d),
    campaignRows,
  }
}

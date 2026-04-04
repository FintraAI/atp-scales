// src/lib/services/dashboard.service.ts
// Dashboard data for both client and admin views.
// Pages call this — never raw Prisma or providers directly.

import { prisma }             from '@/lib/prisma'
import { getProvider }        from '@/lib/providers'
import { computeTrendChange } from '@/lib/metrics'
import { subDays, startOfDay } from 'date-fns'
import type { KPIData, ChartDataPoint, CampaignRow, ClientUpdateItem } from '@/types'

// ─── Client dashboard ─────────────────────────────────────────────────────────

export interface ClientDashboardData {
  kpis:         KPIData
  chartData:    ChartDataPoint[]
  campaignRows: CampaignRow[]
  updates:      ClientUpdateItem[]
  profile:      { companyName: string; performanceStatus: string; status: string } | null
}

export async function getClientDashboardData(
  clientProfileId: string
): Promise<ClientDashboardData> {
  const now          = new Date()
  const thirtyDaysAgo = startOfDay(subDays(now, 30))
  const sixtyDaysAgo  = startOfDay(subDays(now, 60))

  const provider = await getProvider(clientProfileId)

  const [metrics, timeSeries, campaignRows] = await Promise.all([
    provider.getDashboardMetrics(clientProfileId, { from: thirtyDaysAgo, to: now }),
    provider.getTimeSeries(clientProfileId, { from: thirtyDaysAgo, to: now }),
    provider.getCampaignRows(clientProfileId, { from: thirtyDaysAgo, to: now }),
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
  }))

  // Updates and profile come from DB regardless of provider
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
      ? {
          companyName:       profile.companyName,
          performanceStatus: profile.performanceStatus,
          status:            profile.status,
        }
      : null,
  }
}

// ─── Admin dashboard ──────────────────────────────────────────────────────────

export interface AdminDashboardData {
  clients:       Awaited<ReturnType<typeof fetchAdminClients>>
  totalClients:  number
  activeClients: number
  totalAdSpend:  number
  totalRevenue:  number
  totalLeads:    number
}

async function fetchAdminClients() {
  return prisma.clientProfile.findMany({
    include: {
      user:           { select: { name: true, email: true } },
      plan:           { select: { name: true } },
      accountManager: { select: { name: true } },
      _count:         { select: { updates: { where: { isRead: false } } } },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const thirtyDaysAgo = startOfDay(subDays(new Date(), 30))

  const [clients, metrics] = await Promise.all([
    fetchAdminClients(),
    prisma.metricSnapshot.aggregate({
      where: { date: { gte: thirtyDaysAgo } },
      _sum:  { adSpend: true, revenue: true, leads: true },
    }),
  ])

  return {
    clients,
    totalClients:  clients.length,
    activeClients: clients.filter(c => c.status === 'ACTIVE').length,
    totalAdSpend:  Number(metrics._sum.adSpend  || 0),
    totalRevenue:  Number(metrics._sum.revenue  || 0),
    totalLeads:    metrics._sum.leads            || 0,
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
  const now           = new Date()
  const thirtyDaysAgo = startOfDay(subDays(now, 30))
  const ninetyDaysAgo = startOfDay(subDays(now, 90))

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
    }))

  return {
    metrics30d:   buildAnalyticsTotals(snapshots30d),
    chartData30d: toChartData(timeSeries30d),
    chartData90d: toChartData(timeSeries90d),
    campaignRows,
  }
}

// src/lib/providers/local.provider.ts
// LocalAdsProvider — reads from Prisma (seeded data + manually entered metrics).
// This is the default provider when no platform integration is connected.

import { prisma } from '@/lib/prisma'
import { subDays, startOfDay, format } from 'date-fns'
import { computeCPL, computeCTR, computeCPC, computeROAS } from '@/lib/metrics'
import type { AdsDataProvider, DashboardMetrics, TimeSeriesPoint, AdRow, DateRange } from './types'
import type { CampaignRow } from '@/types'

export class LocalAdsProvider implements AdsDataProvider {

  async getDashboardMetrics(
    clientProfileId: string,
    range: DateRange
  ): Promise<DashboardMetrics> {
    const { from, to } = range
    const prevFrom = new Date(from.getTime() - (to.getTime() - from.getTime()))

    const [current, previous] = await Promise.all([
      prisma.metricSnapshot.findMany({
        where: { clientProfileId, date: { gte: from, lte: to } },
      }),
      prisma.metricSnapshot.findMany({
        where: { clientProfileId, date: { gte: prevFrom, lt: from } },
      }),
    ])

    const agg = (rows: typeof current) =>
      rows.reduce(
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

    const curr = agg(current)
    const prev = agg(previous)

    return {
      spend:        curr.spend,
      revenue:      curr.revenue,
      roas:         computeROAS(curr.revenue, curr.spend),
      leads:        curr.leads,
      cpl:          computeCPL(curr.spend, curr.leads),
      appointments: curr.appointments,
      costPerAppt:  computeCPL(curr.spend, curr.appointments),
      convRate:     curr.leads > 0 ? curr.appointments / curr.leads : 0,
      impressions:  curr.impressions,
      clicks:       curr.clicks,
      ctr:          computeCTR(curr.clicks, curr.impressions),
      cpc:          computeCPC(curr.spend, curr.clicks),
      purchases:    curr.purchases,
      prevSpend:    prev.spend,
      prevRevenue:  prev.revenue,
      prevLeads:    prev.leads,
      prevRoas:     computeROAS(prev.revenue, prev.spend),
    }
  }

  async getTimeSeries(
    clientProfileId: string,
    range: DateRange
  ): Promise<TimeSeriesPoint[]> {
    const snapshots = await prisma.metricSnapshot.findMany({
      where: { clientProfileId, date: { gte: range.from, lte: range.to } },
      orderBy: { date: 'asc' },
    })

    return snapshots.map(m => ({
      date:         format(new Date(m.date), 'MMM d'),
      spend:        Number(m.adSpend),
      revenue:      Number(m.revenue),
      roas:         Number(m.roas),
      leads:        m.leads,
      appointments: m.appointments,
      clicks:       m.clicks,
      impressions:  m.impressions,
    }))
  }

  async getCampaignRows(
    clientProfileId: string,
    range: DateRange
  ): Promise<CampaignRow[]> {
    const campaigns = await prisma.campaign.findMany({
      where: { clientProfileId },
      include: {
        stats: { where: { date: { gte: range.from, lte: range.to } } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return campaigns.map(c => {
      const s = c.stats.reduce(
        (a, s) => ({
          spend:       a.spend       + Number(s.spend),
          impressions: a.impressions + s.impressions,
          clicks:      a.clicks      + s.clicks,
          leads:       a.leads       + s.leads,
          purchases:   a.purchases   + s.purchases,
          revenue:     a.revenue     + Number(s.revenue),
        }),
        { spend: 0, impressions: 0, clicks: 0, leads: 0, purchases: 0, revenue: 0 }
      )

      return {
        id:         c.id,
        name:       c.name,
        platform:   c.platform,
        status:     c.status,
        objective:  c.objective,
        spend:      s.spend,
        impressions: s.impressions,
        clicks:     s.clicks,
        ctr:        computeCTR(s.clicks, s.impressions),
        cpc:        computeCPC(s.spend, s.clicks),
        leads:      s.leads,
        cpl:        computeCPL(s.spend, s.leads),
        purchases:  s.purchases,
        roas:       computeROAS(s.revenue, s.spend),
      }
    })
  }

  async getAdRows(clientProfileId: string): Promise<AdRow[]> {
    const campaigns = await prisma.campaign.findMany({
      where: { clientProfileId },
      select: { id: true, name: true, platform: true },
    })

    const campaignMap = new Map(campaigns.map(c => [c.id, c]))

    const creatives = await prisma.creative.findMany({
      where: { campaignId: { in: campaigns.map(c => c.id) } },
      orderBy: { ctr: 'desc' },
    })

    return creatives.map(cr => {
      const camp = campaignMap.get(cr.campaignId)
      return {
        id:           cr.id,
        name:         cr.name,
        headline:     cr.headline,
        bodyText:     cr.description,
        type:         cr.type,
        status:       cr.status,
        campaignId:   cr.campaignId,
        campaignName: camp?.name ?? 'Unknown Campaign',
        platform:     camp?.platform ?? 'OTHER',
        impressions:  cr.impressions,
        clicks:       cr.clicks,
        spend:        Number(cr.spend),
        leads:        cr.leads,
        ctr:          Number(cr.ctr),
        cpc:          Number(cr.cpc),
        cpl:          Number(cr.cpl),
        externalId:   cr.externalId ?? undefined,
      }
    })
  }
}

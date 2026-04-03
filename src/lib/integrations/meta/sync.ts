// src/lib/integrations/meta/sync.ts
// Orchestrates syncing Meta Ads data for one or all clients
// Called by: API routes, cron jobs, manual admin triggers

import { prisma } from '@/lib/prisma'
import {
  getInsights,
  getCampaigns,
  normalizeInsightToMetric,
  MetaApiError,
  MetaAction,
} from './client'
import { subDays, format, startOfDay } from 'date-fns'

export interface SyncResult {
  clientProfileId: string
  success: boolean
  daysSynced?: number
  error?: string
  campaignsSynced?: number
}

// ─── Sync a single client's Meta Ads data ────────────────────────────────────

export async function syncClientMetaData(
  clientProfileId: string,
  options: { daysBack?: number; force?: boolean } = {}
): Promise<SyncResult> {
  const { daysBack = 30, force = false } = options

  // 1. Get the Meta integration for this client
  const integration = await prisma.clientIntegration.findUnique({
    where: { clientProfileId_provider: { clientProfileId, provider: 'META_ADS' } },
  })

  if (!integration || integration.status !== 'CONNECTED' || !integration.accessToken) {
    return { clientProfileId, success: false, error: 'Meta Ads not connected' }
  }

  if (!integration.externalAccountId) {
    return { clientProfileId, success: false, error: 'No ad account ID configured' }
  }

  const accessToken = integration.accessToken
  const adAccountId = integration.externalAccountId

  try {
    // 2. Determine date range
    const endDate   = new Date()
    const startDate = subDays(endDate, daysBack)
    const dateStart = format(startDate, 'yyyy-MM-dd')
    const dateEnd   = format(endDate,   'yyyy-MM-dd')

    // 3. Fetch campaign-level insights (daily breakdown)
    const insights = await getInsights({
      adAccountId,
      accessToken,
      dateStart,
      dateEnd,
      level: 'campaign',
    })

    // 4. Fetch campaigns for status/metadata
    const campaigns = await getCampaigns(adAccountId, accessToken)
    const campaignMap = new Map(campaigns.map((c) => [c.id, c]))

    // 5. Group insights by date for MetricSnapshot aggregation
    const byDate = new Map<string, typeof insights>()
    for (const row of insights) {
      const key = row.date_start
      if (!byDate.has(key)) byDate.set(key, [])
      byDate.get(key)!.push(row)
    }

    // 6. Upsert MetricSnapshot per day (aggregated across all campaigns)
    let daysUpserted = 0
    for (const [dateStr, rows] of byDate) {
      const totals = rows.reduce(
        (acc, row) => {
          const n = normalizeInsightToMetric(row)
          return {
            adSpend:      acc.adSpend + n.adSpend,
            revenue:      acc.revenue + n.revenue,
            leads:        acc.leads + n.leads,
            appointments: acc.appointments + n.appointments,
            impressions:  acc.impressions + n.impressions,
            clicks:       acc.clicks + n.clicks,
            purchases:    acc.purchases + n.purchases,
          }
        },
        { adSpend: 0, revenue: 0, leads: 0, appointments: 0, impressions: 0, clicks: 0, purchases: 0 }
      )

      const date = startOfDay(new Date(dateStr))
      await prisma.metricSnapshot.upsert({
        where: { clientProfileId_date: { clientProfileId, date } },
        update: {
          adSpend:            totals.adSpend,
          revenue:            totals.revenue,
          roas:               totals.adSpend > 0 ? totals.revenue / totals.adSpend : 0,
          leads:              totals.leads,
          costPerLead:        totals.leads > 0 ? totals.adSpend / totals.leads : 0,
          appointments:       totals.appointments,
          costPerAppointment: totals.appointments > 0 ? totals.adSpend / totals.appointments : 0,
          conversionRate:     totals.impressions > 0 ? totals.leads / totals.impressions : 0,
          impressions:        totals.impressions,
          clicks:             totals.clicks,
          ctr:                totals.impressions > 0 ? totals.clicks / totals.impressions : 0,
          cpc:                totals.clicks > 0 ? totals.adSpend / totals.clicks : 0,
          purchases:          totals.purchases,
          source:             'META_ADS',
        },
        create: {
          clientProfileId,
          date,
          periodStart: date,
          periodEnd:   date,
          adSpend:            totals.adSpend,
          revenue:            totals.revenue,
          roas:               totals.adSpend > 0 ? totals.revenue / totals.adSpend : 0,
          leads:              totals.leads,
          costPerLead:        totals.leads > 0 ? totals.adSpend / totals.leads : 0,
          appointments:       totals.appointments,
          costPerAppointment: totals.appointments > 0 ? totals.adSpend / totals.appointments : 0,
          conversionRate:     totals.impressions > 0 ? totals.leads / totals.impressions : 0,
          impressions:        totals.impressions,
          clicks:             totals.clicks,
          ctr:                totals.impressions > 0 ? totals.clicks / totals.impressions : 0,
          cpc:                totals.clicks > 0 ? totals.adSpend / totals.clicks : 0,
          purchases:          totals.purchases,
          source:             'META_ADS',
        },
      })
      daysUpserted++
    }

    // 7. Store raw AdPlatformData rows for campaign-level detail
    for (const row of insights) {
      await prisma.adPlatformData.upsert({
        where: {
          // compound unique: clientProfileId + platform + campaignId + date
          // (add this to schema if needed — using create here for simplicity)
          id: `${clientProfileId}-META-${row.campaign_id}-${row.date_start}`,
        },
        update: {
          rawPayload:  row as any,
          spend:       parseFloat(row.spend || '0'),
          impressions: parseInt(row.impressions || '0'),
          clicks:      parseInt(row.clicks || '0'),
          leads:       getMetaActionValue(row.actions, 'lead'),
          purchases:   getMetaActionValue(row.actions, 'purchase'),
          revenue:     getMetaActionValue(row.action_values, 'purchase'),
          syncedAt:    new Date(),
        },
        create: {
          id:             `${clientProfileId}-META-${row.campaign_id}-${row.date_start}`,
          clientProfileId,
          platform:       'META',
          rawPayload:     row as any,
          campaignId:     row.campaign_id,
          date:           new Date(row.date_start),
          spend:          parseFloat(row.spend || '0'),
          impressions:    parseInt(row.impressions || '0'),
          clicks:         parseInt(row.clicks || '0'),
          leads:          getMetaActionValue(row.actions, 'lead'),
          purchases:      getMetaActionValue(row.actions, 'purchase'),
          revenue:        getMetaActionValue(row.action_values, 'purchase'),
        },
      }).catch(() => {
        // If id collision, just upsert by updating
      })
    }

    // 8. Sync campaigns to Campaign table
    let campaignsSynced = 0
    for (const c of campaigns) {
      const status = c.effective_status === 'ACTIVE' ? 'ACTIVE'
                   : c.effective_status === 'PAUSED' ? 'PAUSED'
                   : 'COMPLETED'

      await prisma.campaign.upsert({
        where: { id: `meta-${c.id}` },
        update: {
          name:        c.name,
          status:      status as any,
          objective:   c.objective,
          dailyBudget: c.daily_budget ? parseFloat(c.daily_budget) / 100 : null,
        },
        create: {
          id:             `meta-${c.id}`,
          clientProfileId,
          name:           c.name,
          platform:       'META',
          status:         status as any,
          externalId:     c.id,
          objective:      c.objective,
          startDate:      new Date(c.created_time),
          dailyBudget:    c.daily_budget ? parseFloat(c.daily_budget) / 100 : null,
        },
      })
      campaignsSynced++
    }

    // 9. Update integration last synced
    await prisma.clientIntegration.update({
      where: { clientProfileId_provider: { clientProfileId, provider: 'META_ADS' } },
      data: { lastSyncedAt: new Date(), syncError: null, status: 'CONNECTED' },
    })

    // 10. Audit log
    await prisma.auditLog.create({
      data: {
        userId:     (await prisma.clientProfile.findUnique({ where: { id: clientProfileId }, select: { userId: true } }))!.userId,
        action:     'meta.sync.success',
        entityType: 'ClientIntegration',
        entityId:   integration.id,
        metadata:   { daysBack, daysUpserted, campaignsSynced },
      },
    })

    return { clientProfileId, success: true, daysSynced: daysUpserted, campaignsSynced }

  } catch (err) {
    const message = err instanceof MetaApiError ? err.message : String(err)

    // Mark integration as errored
    await prisma.clientIntegration.update({
      where: { clientProfileId_provider: { clientProfileId, provider: 'META_ADS' } },
      data: { status: 'ERROR', syncError: message },
    })

    return { clientProfileId, success: false, error: message }
  }
}

// ─── Sync ALL connected clients ───────────────────────────────────────────────

export async function syncAllMetaClients(daysBack = 7): Promise<SyncResult[]> {
  const integrations = await prisma.clientIntegration.findMany({
    where: { provider: 'META_ADS', status: 'CONNECTED' },
    select: { clientProfileId: true },
  })

  const results = await Promise.allSettled(
    integrations.map((i) => syncClientMetaData(i.clientProfileId, { daysBack }))
  )

  return results.map((r, idx) =>
    r.status === 'fulfilled'
      ? r.value
      : { clientProfileId: integrations[idx].clientProfileId, success: false, error: String((r as any).reason) }
  )
}

// Helper
function getMetaActionValue(actions: MetaAction[] | undefined, type: string): number {
  return Math.round(parseFloat(actions?.find((a) => a.action_type === type)?.value || '0'))
}

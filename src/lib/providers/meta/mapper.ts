// src/lib/providers/meta/mapper.ts
// Maps raw Meta Ads API response shapes → internal UI models (AdsDataProvider types).
//
// IMPORTANT: This mapper is for LIVE UI consumption (direct API → dashboard).
// For the DB-sync path (Meta API → MetricSnapshot table), see:
//   src/lib/integrations/meta/client.ts → normalizeInsightToMetric()
//
// When Meta credentials are plugged in, MetaAdsProvider calls these mappers
// to transform API responses into the same types that LocalAdsProvider returns,
// keeping the service layer and UI completely unaware of which provider is active.

import {
  MetaInsightRow,
  MetaCampaign,
  getActionValue,
  META_ACTION_TYPES,
} from '@/lib/integrations/meta/client'
import type { DashboardMetrics, TimeSeriesPoint, AdRow } from '../types'
import type { CampaignRow } from '@/types'
import { format } from 'date-fns'

// ─── Account-level insights → DashboardMetrics ───────────────────────────────
// TODO: Call fetchAccountInsights() in MetaAdsProvider when credentials are set.

export function mapMetaInsightsToDashboardMetrics(
  currentRows: MetaInsightRow[],
  previousRows: MetaInsightRow[]
): DashboardMetrics {
  const agg = (rows: MetaInsightRow[]) =>
    rows.reduce(
      (a, r) => {
        const spend       = parseFloat(r.spend || '0')
        const revenue     = getActionValue(r.action_values, META_ACTION_TYPES.purchases)
        const leads       = getActionValue(r.actions, META_ACTION_TYPES.leads)
                         || getActionValue(r.actions, META_ACTION_TYPES.formLeads)
        const schedule    = getActionValue(r.actions, META_ACTION_TYPES.schedule)
        const purchases   = getActionValue(r.actions, META_ACTION_TYPES.purchases)
        const impressions = parseInt(r.impressions || '0')
        const clicks      = parseInt(r.clicks || '0')
        return {
          spend:        a.spend        + spend,
          revenue:      a.revenue      + revenue,
          leads:        a.leads        + leads,
          appointments: a.appointments + schedule,
          impressions:  a.impressions  + impressions,
          clicks:       a.clicks       + clicks,
          purchases:    a.purchases    + purchases,
        }
      },
      { spend: 0, revenue: 0, leads: 0, appointments: 0, impressions: 0, clicks: 0, purchases: 0 }
    )

  const curr = agg(currentRows)
  const prev = agg(previousRows)

  return {
    spend:        curr.spend,
    revenue:      curr.revenue,
    roas:         curr.spend > 0 ? curr.revenue / curr.spend : 0,
    leads:        curr.leads,
    cpl:          curr.leads > 0 ? curr.spend / curr.leads : 0,
    appointments: curr.appointments,
    costPerAppt:  curr.appointments > 0 ? curr.spend / curr.appointments : 0,
    convRate:     curr.leads > 0 ? curr.appointments / curr.leads : 0,
    impressions:  curr.impressions,
    clicks:       curr.clicks,
    ctr:          curr.impressions > 0 ? curr.clicks / curr.impressions : 0,
    cpc:          curr.clicks > 0 ? curr.spend / curr.clicks : 0,
    purchases:    curr.purchases,
    prevSpend:    prev.spend,
    prevRevenue:  prev.revenue,
    prevLeads:    prev.leads,
    prevRoas:     prev.spend > 0 ? prev.revenue / prev.spend : 0,
  }
}

// ─── Daily insight rows → TimeSeriesPoint[] ──────────────────────────────────
// Meta returns one row per day when time_increment=1 is set.
// TODO: called by MetaAdsProvider.getTimeSeries() after fetchAccountInsights().

export function mapMetaInsightsToTimeSeries(rows: MetaInsightRow[]): TimeSeriesPoint[] {
  // Group by date (rows may have multiple campaigns per date at account level)
  const byDate = new Map<string, typeof rows>()
  for (const r of rows) {
    const key = r.date_start
    if (!byDate.has(key)) byDate.set(key, [])
    byDate.get(key)!.push(r)
  }

  return Array.from(byDate.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, dayRows]) => {
      const totals = dayRows.reduce(
        (a, r) => ({
          spend:        a.spend        + parseFloat(r.spend || '0'),
          revenue:      a.revenue      + getActionValue(r.action_values, META_ACTION_TYPES.purchases),
          leads:        a.leads        + (getActionValue(r.actions, META_ACTION_TYPES.leads) || getActionValue(r.actions, META_ACTION_TYPES.formLeads)),
          appointments: a.appointments + getActionValue(r.actions, META_ACTION_TYPES.schedule),
          impressions:  a.impressions  + parseInt(r.impressions || '0'),
          clicks:       a.clicks       + parseInt(r.clicks || '0'),
        }),
        { spend: 0, revenue: 0, leads: 0, appointments: 0, impressions: 0, clicks: 0 }
      )
      return {
        date:         format(new Date(date), 'MMM d'),
        spend:        totals.spend,
        revenue:      totals.revenue,
        roas:         totals.spend > 0 ? totals.revenue / totals.spend : 0,
        leads:        totals.leads,
        appointments: totals.appointments,
        clicks:       totals.clicks,
        impressions:  totals.impressions,
      }
    })
}

// ─── Campaign-level insight rows → CampaignRow[] ─────────────────────────────
// Meta returns one row per campaign_id when level=campaign is set.
// Merge with MetaCampaign for objective/status/budget fields.
// TODO: called by MetaAdsProvider.getCampaignRows() after fetchCampaignInsights().

export function mapMetaInsightsToCampaignRows(
  insightRows: MetaInsightRow[],
  campaigns: MetaCampaign[]
): CampaignRow[] {
  const campaignMeta = new Map(campaigns.map(c => [c.id, c]))

  // Group by campaign_id (sum across date range)
  const byCampaign = new Map<string, typeof insightRows>()
  for (const r of insightRows) {
    const key = r.campaign_id ?? 'unknown'
    if (!byCampaign.has(key)) byCampaign.set(key, [])
    byCampaign.get(key)!.push(r)
  }

  return Array.from(byCampaign.entries()).map(([campaignId, rows]) => {
    const meta   = campaignMeta.get(campaignId)
    const totals = rows.reduce(
      (a, r) => ({
        spend:       a.spend       + parseFloat(r.spend || '0'),
        impressions: a.impressions + parseInt(r.impressions || '0'),
        clicks:      a.clicks      + parseInt(r.clicks || '0'),
        leads:       a.leads       + (getActionValue(r.actions, META_ACTION_TYPES.leads) || getActionValue(r.actions, META_ACTION_TYPES.formLeads)),
        purchases:   a.purchases   + getActionValue(r.actions, META_ACTION_TYPES.purchases),
        revenue:     a.revenue     + getActionValue(r.action_values, META_ACTION_TYPES.purchases),
      }),
      { spend: 0, impressions: 0, clicks: 0, leads: 0, purchases: 0, revenue: 0 }
    )

    const status = meta?.effective_status === 'ACTIVE' ? 'ACTIVE'
                 : meta?.effective_status === 'PAUSED' ? 'PAUSED'
                 : 'COMPLETED'

    return {
      id:         `meta-${campaignId}`,
      name:       rows[0]?.campaign_name ?? campaignId,
      platform:   'META' as const,
      status:     status as CampaignRow['status'],
      objective:  meta?.objective ?? null,
      spend:      totals.spend,
      impressions: totals.impressions,
      clicks:     totals.clicks,
      ctr:        totals.impressions > 0 ? totals.clicks / totals.impressions : 0,
      cpc:        totals.clicks > 0 ? totals.spend / totals.clicks : 0,
      leads:      totals.leads,
      cpl:        totals.leads > 0 ? totals.spend / totals.leads : 0,
      purchases:  totals.purchases,
      roas:       totals.spend > 0 ? totals.revenue / totals.spend : 0,
    }
  })
}

// ─── Ad-level insight row → AdRow ────────────────────────────────────────────
// Called per-ad when level=ad is set in getInsights().
// TODO: called by MetaAdsProvider.getAdRows() after fetchAdInsights() + fetchAdCreatives().

export interface MetaAdCreative {
  id:             string
  name?:          string
  title?:         string        // ad headline
  body?:          string        // primary text
  image_url?:     string
  thumbnail_url?: string
  call_to_action?: { type: string }
  object_type?:    string       // IMAGE | VIDEO | etc
}

export function mapMetaAdToAdRow(
  insightRow: MetaInsightRow,
  creative: MetaAdCreative | null
): AdRow {
  const spend       = parseFloat(insightRow.spend || '0')
  const leads       = getActionValue(insightRow.actions, META_ACTION_TYPES.leads)
                   || getActionValue(insightRow.actions, META_ACTION_TYPES.formLeads)
  const impressions = parseInt(insightRow.impressions || '0')
  const clicks      = parseInt(insightRow.clicks || '0')

  const type: AdRow['type'] =
    creative?.object_type === 'VIDEO' ? 'VIDEO' :
    creative?.object_type === 'CAROUSEL' ? 'CAROUSEL' : 'IMAGE'

  return {
    id:           insightRow.ad_id ?? `meta-${Date.now()}`,
    name:         insightRow.ad_name ?? 'Unnamed Ad',
    headline:     creative?.title ?? null,
    bodyText:     creative?.body ?? null,
    type,
    status:       (insightRow.status as AdRow['status']) ?? 'ACTIVE',
    campaignId:   `meta-${insightRow.campaign_id}`,
    campaignName: insightRow.campaign_name ?? 'Unknown Campaign',
    platform:     'META',
    impressions,
    clicks,
    spend,
    leads,
    ctr:          impressions > 0 ? clicks / impressions : 0,
    cpc:          clicks > 0 ? spend / clicks : 0,
    cpl:          leads > 0 ? spend / leads : 0,
    previewUrl:   creative?.image_url ?? creative?.thumbnail_url,
    ctaType:      creative?.call_to_action?.type,
    externalId:   insightRow.ad_id,
  }
}

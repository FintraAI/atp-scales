// src/lib/providers/meta/provider.ts
// MetaAdsProvider — fetches live data from Meta Ads API and maps to internal models.
//
// ─── HOW TO ACTIVATE ─────────────────────────────────────────────────────────
// 1. Connect a client's Meta account via /portal/integrations/meta/connect
//    (OAuth flow stores access_token + ad_account_id in ClientIntegration table)
// 2. The provider factory (providers/index.ts) will automatically return this
//    provider instead of LocalAdsProvider for clients with a connected integration.
// 3. No UI changes required — the service layer and pages are provider-agnostic.
//
// ─── CURRENT STATE ───────────────────────────────────────────────────────────
// The Meta API calls are fully scaffolded and typed.
// Until a real integration is connected, this provider falls back to LocalAdsProvider
// so the dashboard always shows data (from seed/manual entry).

import { prisma }           from '@/lib/prisma'
import { format, subDays }  from 'date-fns'
import {
  getInsights,
  getCampaigns,
  MetaApiError,
}                           from '@/lib/integrations/meta/client'
import {
  mapMetaInsightsToDashboardMetrics,
  mapMetaInsightsToTimeSeries,
  mapMetaInsightsToCampaignRows,
  mapMetaAdToAdRow,
}                           from './mapper'
import { LocalAdsProvider } from '../local.provider'
import type {
  AdsDataProvider,
  DashboardMetrics,
  TimeSeriesPoint,
  AdRow,
  DateRange,
}                           from '../types'
import type { CampaignRow } from '@/types'

// ─── Meta API scaffold functions ─────────────────────────────────────────────
// These are the future integration points. Each function documents:
//   - The Meta API endpoint it calls
//   - The env vars / credentials it needs
//   - The internal mapper it uses

/**
 * Fetch account-level daily insights.
 * Meta endpoint: GET /act_{adAccountId}/insights?level=account&time_increment=1
 * Requires: accessToken, adAccountId from ClientIntegration table
 * Maps to: DashboardMetrics via mapMetaInsightsToDashboardMetrics()
 *
 * TODO: call this in getDashboardMetrics() once Meta is connected
 */
async function fetchAccountInsights(
  adAccountId: string,
  accessToken: string,
  dateStart: string,
  dateEnd: string
) {
  return getInsights({ adAccountId, accessToken, dateStart, dateEnd, level: 'account' })
}

/**
 * Fetch campaign-level daily insights.
 * Meta endpoint: GET /act_{adAccountId}/insights?level=campaign&time_increment=1
 * Maps to: CampaignRow[] via mapMetaInsightsToCampaignRows()
 *
 * TODO: call this in getCampaignRows() once Meta is connected
 */
async function fetchCampaignInsights(
  adAccountId: string,
  accessToken: string,
  dateStart: string,
  dateEnd: string
) {
  return getInsights({ adAccountId, accessToken, dateStart, dateEnd, level: 'campaign' })
}

/**
 * Fetch ad-level insights.
 * Meta endpoint: GET /act_{adAccountId}/insights?level=ad
 * Maps to: AdRow[] via mapMetaAdToAdRow() after joining with fetchAdCreatives()
 *
 * TODO: call this in getAdRows() once Meta is connected
 */
async function fetchAdInsights(
  adAccountId: string,
  accessToken: string,
  dateStart: string,
  dateEnd: string
) {
  return getInsights({
    adAccountId, accessToken, dateStart, dateEnd, level: 'ad',
    fields: [
      'ad_id', 'ad_name', 'campaign_id', 'campaign_name',
      'spend', 'impressions', 'clicks', 'ctr', 'cpc',
      'actions', 'action_values', 'date_start', 'date_stop',
    ],
  })
}

/**
 * Fetch creative details (headline, body, preview URL) for a list of ad IDs.
 * Meta endpoint: GET /{adId}?fields=creative{title,body,image_url,thumbnail_url,call_to_action,object_type}
 *
 * TODO: call this in getAdRows() to enrich AdRow with previewUrl, headline, bodyText
 */
async function fetchAdCreatives(
  adIds: string[],
  accessToken: string
): Promise<Map<string, any>> {
  // TODO: implement batch fetch of ad creatives
  // Meta batch endpoint: POST /v19.0?batch=[...]
  // For now returns empty map
  return new Map()
}

/**
 * Fetch campaign status and budget details.
 * Meta endpoint: GET /act_{adAccountId}/campaigns?fields=id,name,status,objective,daily_budget,lifetime_budget
 *
 * TODO: call this in getCampaignRows() to enrich rows with budget data
 */
async function fetchCampaignStatusAndBudget(
  adAccountId: string,
  accessToken: string
) {
  return getCampaigns(adAccountId, accessToken)
}

// ─── MetaAdsProvider implementation ──────────────────────────────────────────

export class MetaAdsProvider implements AdsDataProvider {
  private readonly clientProfileId: string
  private readonly accessToken:     string
  private readonly adAccountId:     string
  private readonly fallback:        LocalAdsProvider

  constructor(clientProfileId: string, accessToken: string, adAccountId: string) {
    this.clientProfileId = clientProfileId
    this.accessToken     = accessToken
    this.adAccountId     = adAccountId
    this.fallback        = new LocalAdsProvider()
  }

  private dateFormat(d: Date) {
    return format(d, 'yyyy-MM-dd')
  }

  async getDashboardMetrics(
    clientProfileId: string,
    range: DateRange
  ): Promise<DashboardMetrics> {
    // TODO: PLUG IN META API
    // Replace this fallback with:
    //
    //   const prevRange = computePrevRange(range)
    //   const [currentRows, previousRows] = await Promise.all([
    //     fetchAccountInsights(this.adAccountId, this.accessToken,
    //       this.dateFormat(range.from), this.dateFormat(range.to)),
    //     fetchAccountInsights(this.adAccountId, this.accessToken,
    //       this.dateFormat(prevRange.from), this.dateFormat(prevRange.to)),
    //   ])
    //   return mapMetaInsightsToDashboardMetrics(currentRows, previousRows)
    //
    // When ready, remove this fallback line:
    return this.fallback.getDashboardMetrics(clientProfileId, range)
  }

  async getTimeSeries(
    clientProfileId: string,
    range: DateRange
  ): Promise<TimeSeriesPoint[]> {
    // TODO: PLUG IN META API
    // Replace this fallback with:
    //
    //   const rows = await fetchAccountInsights(this.adAccountId, this.accessToken,
    //     this.dateFormat(range.from), this.dateFormat(range.to))
    //   return mapMetaInsightsToTimeSeries(rows)
    //
    return this.fallback.getTimeSeries(clientProfileId, range)
  }

  async getCampaignRows(
    clientProfileId: string,
    range: DateRange
  ): Promise<CampaignRow[]> {
    // TODO: PLUG IN META API
    // Replace this fallback with:
    //
    //   const [insightRows, campaigns] = await Promise.all([
    //     fetchCampaignInsights(this.adAccountId, this.accessToken,
    //       this.dateFormat(range.from), this.dateFormat(range.to)),
    //     fetchCampaignStatusAndBudget(this.adAccountId, this.accessToken),
    //   ])
    //   return mapMetaInsightsToCampaignRows(insightRows, campaigns)
    //
    return this.fallback.getCampaignRows(clientProfileId, range)
  }

  async getAdRows(clientProfileId: string): Promise<AdRow[]> {
    // TODO: PLUG IN META API
    // Replace this fallback with:
    //
    //   const thirtyDaysAgo = this.dateFormat(subDays(new Date(), 30))
    //   const today         = this.dateFormat(new Date())
    //   const insightRows = await fetchAdInsights(this.adAccountId, this.accessToken,
    //     thirtyDaysAgo, today)
    //   const adIds   = [...new Set(insightRows.map(r => r.ad_id).filter(Boolean))] as string[]
    //   const creativeMap = await fetchAdCreatives(adIds, this.accessToken)
    //   return insightRows.map(r =>
    //     mapMetaAdToAdRow(r, creativeMap.get(r.ad_id ?? '') ?? null)
    //   )
    //
    return this.fallback.getAdRows(clientProfileId)
  }
}

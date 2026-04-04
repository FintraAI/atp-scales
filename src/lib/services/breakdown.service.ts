// src/lib/services/breakdown.service.ts
// Provides breakdown data (audience, hourly, creative, conversion) for dashboards.
//
// Currently returns mock data that mirrors Meta API structures.
// When live Meta credentials are connected for a client, swap the mock functions
// here for real MetaAdsProvider calls — the UI consumes the same types either way.

import {
  getMockAudienceBreakdown,
  getMockHourlyPerformance,
  getMockCreativeAssets,
  getMockConversionActions,
  getAggregatedAudienceBreakdown,
  getAggregatedHourlyPerformance,
  getAggregatedConversionActions,
} from '@/lib/mock/meta-breakdown-data'
import type {
  AudienceBreakdown,
  HourlyPerformanceRow,
  CreativeAssetRow,
  ConversionActionRow,
} from '@/types'

// ─── Client-level breakdown ───────────────────────────────────────────────────

export interface ClientBreakdownData {
  audience:    AudienceBreakdown
  hourly:      HourlyPerformanceRow[]
  creatives:   CreativeAssetRow[]
  conversions: ConversionActionRow[]
}

/**
 * Returns all breakdown data for a single client.
 * TODO: When MetaAdsProvider has credentials, call:
 *   - fetchMetaBreakdowns(clientId, 'age')
 *   - fetchMetaBreakdowns(clientId, 'gender')
 *   - fetchMetaBreakdowns(clientId, 'country')
 *   - fetchMetaHourlyData(clientId)
 *   - fetchMetaCreativeAssetData(clientId)
 *   - fetchMetaActionData(clientId)
 * and pipe results through breakdown-mapper.ts functions.
 */
export async function getClientBreakdownData(
  clientProfileId: string
): Promise<ClientBreakdownData> {
  // Future: check if client has connected Meta integration
  // const integration = await prisma.clientIntegration.findUnique({
  //   where: { clientProfileId_provider: { clientProfileId, provider: 'META_ADS' } },
  // })
  // if (integration?.status === 'CONNECTED') {
  //   return fetchLiveBreakdownData(clientProfileId, integration.accessToken!)
  // }

  return {
    audience:    getMockAudienceBreakdown(clientProfileId),
    hourly:      getMockHourlyPerformance(clientProfileId),
    creatives:   getMockCreativeAssets(clientProfileId),
    conversions: getMockConversionActions(clientProfileId),
  }
}

// ─── Admin-level (aggregated) breakdown ───────────────────────────────────────

export interface AdminBreakdownData {
  audience:    AudienceBreakdown
  hourly:      HourlyPerformanceRow[]
  conversions: ConversionActionRow[]
}

/**
 * Returns aggregated breakdown data across all active clients.
 * Creatives are not aggregated at admin level (too noisy cross-client).
 */
export async function getAdminBreakdownData(
  clientIds: string[]
): Promise<AdminBreakdownData> {
  return {
    audience:    getAggregatedAudienceBreakdown(clientIds),
    hourly:      getAggregatedHourlyPerformance(clientIds),
    conversions: getAggregatedConversionActions(clientIds),
  }
}

// ─── Top-performing hour helper ───────────────────────────────────────────────

export function findTopHour(rows: HourlyPerformanceRow[]): HourlyPerformanceRow | null {
  if (rows.length === 0) return null
  return rows.reduce((best, r) => r.leads > best.leads ? r : best, rows[0])
}

// ─── Top-performing country helper ───────────────────────────────────────────

export function findTopCountry(breakdown: AudienceBreakdown) {
  return breakdown.countries[0] ?? null
}

// ─── Best audience segment helper ────────────────────────────────────────────

export function findBestAgeSegment(breakdown: AudienceBreakdown) {
  return [...breakdown.age].sort((a, b) => {
    if (a.leads === 0 && b.leads === 0) return b.spend - a.spend
    if (a.leads === 0) return 1
    if (b.leads === 0) return -1
    return a.cpl - b.cpl   // lowest CPL = best
  })[0] ?? null
}

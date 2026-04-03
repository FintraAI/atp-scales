// src/lib/providers/types.ts
// Internal data model types + AdsDataProvider interface.
// These types are platform-agnostic — they sit between raw API responses
// and the UI. All providers (Local, Meta, Google) must conform to this interface.

import type { CampaignRow } from '@/types'

// ─── Shared primitives ────────────────────────────────────────────────────────

export interface DateRange {
  from: Date
  to:   Date
}

// ─── Dashboard metrics ────────────────────────────────────────────────────────
// Aggregated account-level metrics for a given date range.
// Providers compute these from their underlying data source.

export interface DashboardMetrics {
  // Current period
  spend:        number
  revenue:      number
  roas:         number
  leads:        number
  cpl:          number
  appointments: number
  costPerAppt:  number
  convRate:     number
  impressions:  number
  clicks:       number
  ctr:          number
  cpc:          number
  purchases:    number
  // Previous period (for trend arrows)
  prevSpend:    number
  prevRevenue:  number
  prevLeads:    number
  prevRoas:     number
}

// ─── Time-series point ────────────────────────────────────────────────────────
// Used for all chart data. One point per day (or week).

export interface TimeSeriesPoint {
  date:         string   // display label, e.g. "May 12"
  spend:        number
  revenue:      number
  roas:         number
  leads:        number
  appointments: number
  clicks:       number
  impressions:  number
}

// ─── Ad / Creative row ────────────────────────────────────────────────────────
// Internal model for a single creative/ad unit.
// Maps from either DB (Creative table) or live Meta API response.

export interface AdRow {
  id:           string
  name:         string
  headline:     string | null
  bodyText?:    string | null
  type:         'IMAGE' | 'VIDEO' | 'CAROUSEL'
  status:       'ACTIVE' | 'PAUSED' | 'ARCHIVED'
  campaignId:   string
  campaignName: string
  platform:     string
  impressions:  number
  clicks:       number
  spend:        number
  leads:        number
  ctr:          number
  cpc:          number
  cpl:          number
  // Future Meta fields — populated when provider is MetaAdsProvider
  previewUrl?:  string
  ctaType?:     string
  externalId?:  string
}

// ─── AdsDataProvider interface ────────────────────────────────────────────────
// All ad-platform providers must implement this.
// The service layer depends on this interface, never on a concrete provider.
//
// Current implementations:
//   - LocalAdsProvider  → reads from Prisma (seeded / manually entered data)
//   - MetaAdsProvider   → reads from Meta Ads API (requires connected integration)
//
// To add Google Ads: implement this interface in providers/google/provider.ts

export interface AdsDataProvider {
  /** Aggregated KPI metrics for a client over a date range */
  getDashboardMetrics(clientProfileId: string, range: DateRange): Promise<DashboardMetrics>

  /** Time-series data points for charts */
  getTimeSeries(clientProfileId: string, range: DateRange): Promise<TimeSeriesPoint[]>

  /** All campaigns with aggregated stats for the given range */
  getCampaignRows(clientProfileId: string, range: DateRange): Promise<CampaignRow[]>

  /** All creatives/ads with per-creative performance stats */
  getAdRows(clientProfileId: string): Promise<AdRow[]>
}

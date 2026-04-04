// src/lib/providers/meta/breakdown-mapper.ts
// Transforms raw Meta Ads API breakdown responses into internal dashboard models.
//
// Meta API breakdown fields covered:
//   age, gender, country, hourly_stats_aggregated_by_advertiser_time_zone,
//   title_asset, body_asset, call_to_action_asset, image_asset, video_asset,
//   action_type, action_destination, is_conversion_id_modeled
//
// When live Meta credentials are connected, MetaAdsProvider calls these mappers
// instead of the mock data functions, keeping all UI components unchanged.

import { getActionValue, META_ACTION_TYPES } from '@/lib/integrations/meta/client'
import type {
  AudienceAgeRow,
  AudienceGenderRow,
  GeoCountryRow,
  HourlyPerformanceRow,
  CreativeAssetRow,
  ConversionActionRow,
  AudienceBreakdown,
} from '@/types'

// ─── Raw Meta breakdown row shapes ───────────────────────────────────────────
// These mirror the Meta API response when breakdown fields are set.

export interface MetaAgeBreakdownRow {
  age:         string
  spend:       string
  impressions: string
  clicks:      string
  actions?:    Array<{ action_type: string; value: string }>
  action_values?: Array<{ action_type: string; value: string }>
}

export interface MetaGenderBreakdownRow {
  gender:      'male' | 'female' | 'unknown'
  spend:       string
  impressions: string
  clicks:      string
  actions?:    Array<{ action_type: string; value: string }>
}

export interface MetaCountryBreakdownRow {
  country:     string
  spend:       string
  impressions: string
  clicks:      string
  actions?:    Array<{ action_type: string; value: string }>
}

export interface MetaHourlyBreakdownRow {
  hourly_stats_aggregated_by_advertiser_time_zone: string  // "HH:00:00 - HH:00:00"
  spend:       string
  impressions: string
  clicks:      string
  actions?:    Array<{ action_type: string; value: string }>
}

export interface MetaAssetBreakdownRow {
  // One of these will be populated depending on which breakdown was requested
  title_asset?:             { text: string }
  body_asset?:              { text: string }
  call_to_action_asset?:    { type: string }
  image_asset?:             { hash: string; url?: string }
  video_asset?:             { video_id: string; thumbnail_url?: string }
  spend:                    string
  impressions:              string
  clicks:                   string
  actions?:                 Array<{ action_type: string; value: string }>
}

export interface MetaActionBreakdownRow {
  action_type:               string
  is_conversion_id_modeled?: boolean
  value:                     string   // count of this action
  '28d_click'?:              string
  action_values?:            Array<{ action_type: string; value: string }>
}

// ─── Age breakdown mapper ─────────────────────────────────────────────────────

export function mapMetaAgeBreakdowns(rows: MetaAgeBreakdownRow[]): AudienceAgeRow[] {
  const totalSpend = rows.reduce((a, r) => a + parseFloat(r.spend || '0'), 0)

  return rows.map(r => {
    const spend       = parseFloat(r.spend       || '0')
    const impressions = parseInt(r.impressions   || '0')
    const clicks      = parseInt(r.clicks        || '0')
    const leads       = getActionValue(r.actions, META_ACTION_TYPES.leads)
                     || getActionValue(r.actions, META_ACTION_TYPES.formLeads)

    return {
      ageRange:    r.age,
      impressions,
      clicks,
      spend,
      leads,
      ctr:         impressions > 0 ? clicks / impressions : 0,
      cpl:         leads > 0 ? spend / leads : 0,
      share:       totalSpend > 0 ? spend / totalSpend : 0,
    }
  }).sort((a, b) => b.spend - a.spend)
}

// ─── Gender breakdown mapper ──────────────────────────────────────────────────

const GENDER_LABELS: Record<string, string> = {
  male: 'Male', female: 'Female', unknown: 'Unknown',
}

export function mapMetaGenderBreakdowns(rows: MetaGenderBreakdownRow[]): AudienceGenderRow[] {
  const totalSpend = rows.reduce((a, r) => a + parseFloat(r.spend || '0'), 0)

  return rows.map(r => {
    const spend       = parseFloat(r.spend       || '0')
    const impressions = parseInt(r.impressions   || '0')
    const clicks      = parseInt(r.clicks        || '0')
    const leads       = getActionValue(r.actions, META_ACTION_TYPES.leads)
                     || getActionValue(r.actions, META_ACTION_TYPES.formLeads)

    return {
      gender:      r.gender,
      label:       GENDER_LABELS[r.gender] ?? r.gender,
      impressions,
      clicks,
      spend,
      leads,
      ctr:         impressions > 0 ? clicks / impressions : 0,
      cpl:         leads > 0 ? spend / leads : 0,
      share:       totalSpend > 0 ? spend / totalSpend : 0,
    }
  })
}

// ─── Country breakdown mapper ─────────────────────────────────────────────────

export function mapMetaCountryBreakdowns(rows: MetaCountryBreakdownRow[]): GeoCountryRow[] {
  const totalSpend = rows.reduce((a, r) => a + parseFloat(r.spend || '0'), 0)

  return rows
    .map(r => {
      const spend       = parseFloat(r.spend       || '0')
      const impressions = parseInt(r.impressions   || '0')
      const clicks      = parseInt(r.clicks        || '0')
      const leads       = getActionValue(r.actions, META_ACTION_TYPES.leads)
                       || getActionValue(r.actions, META_ACTION_TYPES.formLeads)

      return {
        country:      r.country,
        countryCode:  r.country,   // Meta returns ISO codes here
        spend,
        leads,
        impressions,
        cpl:          leads > 0 ? spend / leads : 0,
        ctr:          impressions > 0 ? clicks / impressions : 0,
        share:        totalSpend > 0 ? spend / totalSpend : 0,
      }
    })
    .sort((a, b) => b.spend - a.spend)
    .slice(0, 10)
}

// ─── Hourly breakdown mapper ──────────────────────────────────────────────────

const HOUR_LABELS = [
  '12am','1am','2am','3am','4am','5am','6am','7am',
  '8am','9am','10am','11am','12pm','1pm','2pm','3pm',
  '4pm','5pm','6pm','7pm','8pm','9pm','10pm','11pm',
]

export function mapMetaHourlyBreakdowns(rows: MetaHourlyBreakdownRow[]): HourlyPerformanceRow[] {
  // Group by hour — Meta returns range strings like "08:00:00 - 09:00:00"
  const byHour = new Map<number, HourlyPerformanceRow>()

  for (const r of rows) {
    const match = r.hourly_stats_aggregated_by_advertiser_time_zone?.match(/^(\d{2})/)
    const hour  = match ? parseInt(match[1]) : 0
    const spend       = parseFloat(r.spend       || '0')
    const impressions = parseInt(r.impressions   || '0')
    const clicks      = parseInt(r.clicks        || '0')
    const leads       = getActionValue(r.actions, META_ACTION_TYPES.leads)
                     || getActionValue(r.actions, META_ACTION_TYPES.formLeads)

    const existing = byHour.get(hour)
    if (!existing) {
      byHour.set(hour, { hour, label: HOUR_LABELS[hour] ?? `${hour}:00`, leads, spend, clicks, impressions, cpl: 0 })
    } else {
      existing.spend      += spend
      existing.impressions += impressions
      existing.clicks     += clicks
      existing.leads      += leads
    }
  }

  return Array.from(byHour.values())
    .sort((a, b) => a.hour - b.hour)
    .map(r => ({ ...r, cpl: r.leads > 0 ? r.spend / r.leads : 0 }))
}

// ─── Asset breakdown mapper ───────────────────────────────────────────────────

export function mapMetaAssetBreakdowns(rows: MetaAssetBreakdownRow[]): CreativeAssetRow[] {
  return rows
    .map((r, i) => {
      const spend       = parseFloat(r.spend       || '0')
      const impressions = parseInt(r.impressions   || '0')
      const clicks      = parseInt(r.clicks        || '0')
      const leads       = getActionValue(r.actions, META_ACTION_TYPES.leads)
                       || getActionValue(r.actions, META_ACTION_TYPES.formLeads)

      let assetType: CreativeAssetRow['assetType'] = 'title'
      let assetValue = 'Unknown'

      if (r.title_asset)             { assetType = 'title'; assetValue = r.title_asset.text }
      else if (r.body_asset)         { assetType = 'body';  assetValue = r.body_asset.text }
      else if (r.call_to_action_asset){ assetType = 'cta';  assetValue = r.call_to_action_asset.type }
      else if (r.image_asset)        { assetType = 'image'; assetValue = r.image_asset.url ?? r.image_asset.hash }
      else if (r.video_asset)        { assetType = 'video'; assetValue = r.video_asset.video_id }

      return {
        id:          `asset-${assetType}-${i}`,
        assetType,
        assetValue,
        impressions,
        clicks,
        leads,
        spend,
        ctr:         impressions > 0 ? clicks / impressions : 0,
        cpl:         leads > 0 ? spend / leads : 0,
      }
    })
    .sort((a, b) => b.leads - a.leads)
}

// ─── Action type mapper ───────────────────────────────────────────────────────

const ACTION_LABELS: Record<string, string> = {
  'lead':                              'Leads',
  'onsite_conversion.lead_grouped':    'Form Submissions',
  'landing_page_view':                 'Landing Page Views',
  'link_click':                        'Link Clicks',
  'purchase':                          'Purchases',
  'schedule':                          'Appointments Booked',
  'contact':                           'Contact Actions',
  'add_to_cart':                       'Add to Cart',
  'initiate_checkout':                 'Checkout Started',
  'complete_registration':             'Registrations',
  'view_content':                      'Content Views',
}

export function mapMetaActionBreakdowns(rows: MetaActionBreakdownRow[]): ConversionActionRow[] {
  const totalCount = rows.reduce((a, r) => a + parseFloat(r.value || '0'), 0)

  return rows
    .map(r => ({
      actionType:  r.action_type,
      actionLabel: ACTION_LABELS[r.action_type] ?? r.action_type,
      count:       Math.round(parseFloat(r.value || '0')),
      value:       parseFloat(r['28d_click'] ?? '0'),
      share:       totalCount > 0 ? parseFloat(r.value || '0') / totalCount : 0,
      isModeled:   r.is_conversion_id_modeled ?? false,
    }))
    .sort((a, b) => b.count - a.count)
}

// ─── Convenience aggregator ───────────────────────────────────────────────────

export function mapMetaBreakdownsToAudienceInsights(
  ageRows:    MetaAgeBreakdownRow[],
  genderRows: MetaGenderBreakdownRow[],
  countryRows: MetaCountryBreakdownRow[],
): AudienceBreakdown {
  return {
    age:       mapMetaAgeBreakdowns(ageRows),
    gender:    mapMetaGenderBreakdowns(genderRows),
    countries: mapMetaCountryBreakdowns(countryRows),
  }
}

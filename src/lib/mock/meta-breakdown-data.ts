// src/lib/mock/meta-breakdown-data.ts
// Realistic Meta Ads breakdown mock data.
// Mirrors the shapes returned by the Meta Ads API breakdown fields.
// All dashboard breakdown sections use this until live API credentials are connected.

import type {
  AudienceAgeRow,
  AudienceGenderRow,
  GeoCountryRow,
  HourlyPerformanceRow,
  CreativeAssetRow,
  ConversionActionRow,
  AudienceBreakdown,
} from '@/types'

// ─── Seed helper ──────────────────────────────────────────────────────────────
// Makes mock data slightly different per client without being random on each render.
function seed(clientId: string): number {
  let h = 0
  for (let i = 0; i < clientId.length; i++) {
    h = Math.imul(31, h) + clientId.charCodeAt(i) | 0
  }
  return Math.abs(h) / 2147483647
}

function jitter(base: number, variance: number, s: number): number {
  return base + (s - 0.5) * 2 * variance
}

// ─── Age Breakdown ────────────────────────────────────────────────────────────
// Maps: Meta breakdown = "age"
// Fields: age range → impressions, clicks, spend, leads

export function getMockAgeBreakdown(clientId: string): AudienceAgeRow[] {
  const s = seed(clientId)
  const totalSpend = jitter(8400, 1200, s)

  const raw = [
    { ageRange: '18-24', spendShare: 0.08, ctrMult: 0.75,  leadsPerK: 1.2 },
    { ageRange: '25-34', spendShare: 0.30, ctrMult: 1.30,  leadsPerK: 4.8 },
    { ageRange: '35-44', spendShare: 0.28, ctrMult: 1.15,  leadsPerK: 4.2 },
    { ageRange: '45-54', spendShare: 0.20, ctrMult: 1.00,  leadsPerK: 3.1 },
    { ageRange: '55-64', spendShare: 0.09, ctrMult: 0.85,  leadsPerK: 2.0 },
    { ageRange: '65+',   spendShare: 0.05, ctrMult: 0.70,  leadsPerK: 1.1 },
  ]

  return raw.map(r => {
    const spend       = totalSpend * r.spendShare * jitter(1, 0.1, seed(clientId + r.ageRange))
    const impressions = Math.round(spend / 0.014)   // ~$14 CPM
    const ctr         = 0.022 * r.ctrMult
    const clicks      = Math.round(impressions * ctr)
    const leads       = Math.round(clicks * (r.leadsPerK / 100))
    const cpl         = leads > 0 ? spend / leads : 0
    return {
      ageRange: r.ageRange,
      impressions,
      clicks,
      spend: Math.round(spend * 100) / 100,
      leads,
      ctr,
      cpl: Math.round(cpl * 100) / 100,
      share: r.spendShare,
    }
  })
}

// ─── Gender Breakdown ─────────────────────────────────────────────────────────

export function getMockGenderBreakdown(clientId: string): AudienceGenderRow[] {
  const s = seed(clientId)
  const totalSpend = jitter(8400, 1200, s)

  const raw = [
    { gender: 'female' as const, label: 'Female', spendShare: 0.52, ctrMult: 1.1,  leadsPerK: 4.5 },
    { gender: 'male'   as const, label: 'Male',   spendShare: 0.44, ctrMult: 0.92, leadsPerK: 3.8 },
    { gender: 'unknown'as const, label: 'Unknown',spendShare: 0.04, ctrMult: 0.7,  leadsPerK: 1.5 },
  ]

  return raw.map(r => {
    const spend       = totalSpend * r.spendShare
    const impressions = Math.round(spend / 0.014)
    const ctr         = 0.022 * r.ctrMult
    const clicks      = Math.round(impressions * ctr)
    const leads       = Math.round(clicks * (r.leadsPerK / 100))
    const cpl         = leads > 0 ? spend / leads : 0
    return {
      gender:     r.gender,
      label:      r.label,
      impressions,
      clicks,
      spend:      Math.round(spend * 100) / 100,
      leads,
      ctr,
      cpl:        Math.round(cpl * 100) / 100,
      share:      r.spendShare,
    }
  })
}

// ─── Geo / Country Breakdown ──────────────────────────────────────────────────
// Maps: Meta breakdown = "country"

export function getMockGeoBreakdown(clientId: string): GeoCountryRow[] {
  const s = seed(clientId)
  const totalSpend = jitter(8400, 1200, s)

  const raw = [
    { country: 'United States', countryCode: 'US', spendShare: 0.74, ctrMult: 1.0,  leadsPerK: 4.2 },
    { country: 'Canada',        countryCode: 'CA', spendShare: 0.12, ctrMult: 1.05, leadsPerK: 3.9 },
    { country: 'Australia',     countryCode: 'AU', spendShare: 0.07, ctrMult: 0.98, leadsPerK: 3.5 },
    { country: 'United Kingdom',countryCode: 'GB', spendShare: 0.04, ctrMult: 0.92, leadsPerK: 3.2 },
    { country: 'New Zealand',   countryCode: 'NZ', spendShare: 0.03, ctrMult: 0.88, leadsPerK: 2.8 },
  ]

  return raw.map(r => {
    const spend       = totalSpend * r.spendShare * jitter(1, 0.08, seed(clientId + r.countryCode))
    const impressions = Math.round(spend / 0.013)
    const ctr         = 0.021 * r.ctrMult
    const clicks      = Math.round(impressions * ctr)
    const leads       = Math.round(clicks * (r.leadsPerK / 100))
    const cpl         = leads > 0 ? spend / leads : 0
    return {
      country:     r.country,
      countryCode: r.countryCode,
      spend:       Math.round(spend * 100) / 100,
      leads,
      impressions,
      cpl:         Math.round(cpl * 100) / 100,
      ctr,
      share:       r.spendShare,
    }
  })
}

// ─── Audience Breakdown (combined) ────────────────────────────────────────────

export function getMockAudienceBreakdown(clientId: string): AudienceBreakdown {
  return {
    age:       getMockAgeBreakdown(clientId),
    gender:    getMockGenderBreakdown(clientId),
    countries: getMockGeoBreakdown(clientId),
  }
}

// ─── Aggregated breakdown (admin — across all clients) ────────────────────────

export function getAggregatedAudienceBreakdown(clientIds: string[]): AudienceBreakdown {
  if (clientIds.length === 0) return getMockAudienceBreakdown('default')

  const allAge     = clientIds.map(id => getMockAgeBreakdown(id))
  const allGender  = clientIds.map(id => getMockGenderBreakdown(id))
  const allCountry = clientIds.map(id => getMockGeoBreakdown(id))

  const mergeAge = (): AudienceAgeRow[] => {
    const map = new Map<string, AudienceAgeRow>()
    for (const rows of allAge) {
      for (const r of rows) {
        const existing = map.get(r.ageRange)
        if (!existing) {
          map.set(r.ageRange, { ...r })
        } else {
          existing.spend      += r.spend
          existing.impressions += r.impressions
          existing.clicks     += r.clicks
          existing.leads      += r.leads
        }
      }
    }
    const merged = Array.from(map.values())
    const totalSpend = merged.reduce((a, r) => a + r.spend, 0)
    return merged.map(r => ({
      ...r,
      ctr:   r.impressions > 0 ? r.clicks / r.impressions : 0,
      cpl:   r.leads > 0 ? r.spend / r.leads : 0,
      share: totalSpend > 0 ? r.spend / totalSpend : 0,
    }))
  }

  const mergeGender = (): AudienceGenderRow[] => {
    const map = new Map<string, AudienceGenderRow>()
    for (const rows of allGender) {
      for (const r of rows) {
        const existing = map.get(r.gender)
        if (!existing) {
          map.set(r.gender, { ...r })
        } else {
          existing.spend      += r.spend
          existing.impressions += r.impressions
          existing.clicks     += r.clicks
          existing.leads      += r.leads
        }
      }
    }
    const merged = Array.from(map.values())
    const totalSpend = merged.reduce((a, r) => a + r.spend, 0)
    return merged.map(r => ({
      ...r,
      ctr:   r.impressions > 0 ? r.clicks / r.impressions : 0,
      cpl:   r.leads > 0 ? r.spend / r.leads : 0,
      share: totalSpend > 0 ? r.spend / totalSpend : 0,
    }))
  }

  const mergeCountry = (): GeoCountryRow[] => {
    const map = new Map<string, GeoCountryRow>()
    for (const rows of allCountry) {
      for (const r of rows) {
        const existing = map.get(r.countryCode)
        if (!existing) {
          map.set(r.countryCode, { ...r })
        } else {
          existing.spend      += r.spend
          existing.impressions += r.impressions
          existing.leads      += r.leads
        }
      }
    }
    const merged = Array.from(map.values()).sort((a, b) => b.spend - a.spend)
    const totalSpend = merged.reduce((a, r) => a + r.spend, 0)
    return merged.map(r => ({
      ...r,
      ctr:   r.impressions > 0 ? (r.leads / r.impressions) : 0,
      cpl:   r.leads > 0 ? r.spend / r.leads : 0,
      share: totalSpend > 0 ? r.spend / totalSpend : 0,
    }))
  }

  return { age: mergeAge(), gender: mergeGender(), countries: mergeCountry() }
}

// ─── Hourly Performance ───────────────────────────────────────────────────────
// Maps: Meta breakdown = "hourly_stats_aggregated_by_advertiser_time_zone"

const HOUR_LABELS = [
  '12am','1am','2am','3am','4am','5am','6am','7am',
  '8am','9am','10am','11am','12pm','1pm','2pm','3pm',
  '4pm','5pm','6pm','7pm','8pm','9pm','10pm','11pm',
]

// Relative lead weight by hour (0-23), peaking mid-morning and evening
const HOURLY_WEIGHTS = [
  0.3, 0.2, 0.15, 0.1, 0.1, 0.15, 0.3, 0.55,
  0.80, 1.00, 0.95, 0.90, 0.85, 0.80, 0.75, 0.70,
  0.65, 0.68, 0.72, 0.85, 0.88, 0.75, 0.60, 0.45,
]

export function getMockHourlyPerformance(clientId: string): HourlyPerformanceRow[] {
  const s           = seed(clientId)
  const baseLeads   = jitter(4.2, 0.8, s)  // avg leads per hour
  const baseSpend   = jitter(280, 40, s)    // avg spend per hour

  return HOURLY_WEIGHTS.map((w, hour) => {
    const hourSeed   = seed(clientId + hour)
    const variance   = jitter(1, 0.15, hourSeed)
    const leads      = Math.round(baseLeads * w * variance)
    const spend      = baseSpend * w * variance
    const impressions = Math.round(spend / 0.013)
    const clicks     = Math.round(impressions * 0.022 * w)
    const cpl        = leads > 0 ? spend / leads : 0
    return {
      hour,
      label:       HOUR_LABELS[hour],
      leads,
      spend:       Math.round(spend * 100) / 100,
      clicks,
      impressions,
      cpl:         Math.round(cpl * 100) / 100,
    }
  })
}

export function getAggregatedHourlyPerformance(clientIds: string[]): HourlyPerformanceRow[] {
  if (clientIds.length === 0) return getMockHourlyPerformance('default')
  const all = clientIds.map(id => getMockHourlyPerformance(id))
  return HOURLY_WEIGHTS.map((_, hour) => {
    const rows = all.map(h => h[hour])
    const leads      = rows.reduce((a, r) => a + r.leads, 0)
    const spend      = rows.reduce((a, r) => a + r.spend, 0)
    const clicks     = rows.reduce((a, r) => a + r.clicks, 0)
    const impressions = rows.reduce((a, r) => a + r.impressions, 0)
    return {
      hour,
      label:        HOUR_LABELS[hour],
      leads,
      spend:        Math.round(spend * 100) / 100,
      clicks,
      impressions,
      cpl:          leads > 0 ? Math.round((spend / leads) * 100) / 100 : 0,
    }
  })
}

// ─── Creative Asset Performance ───────────────────────────────────────────────
// Maps: title_asset, body_asset, cta_asset, image_asset, video_asset

const MOCK_TITLES = [
  'Get Your Free Quote Today',
  'Transform Your Business Results',
  'Stop Losing Money on Ads',
  'See Why 500+ Businesses Choose Us',
  '30-Day Money-Back Guarantee',
]

const MOCK_BODIES = [
  'Join hundreds of businesses seeing 3x ROAS or better. Our team manages your ads so you can focus on closing deals.',
  'Are your ads not converting? We fix underperforming campaigns and build systems that scale. Book a free strategy call.',
  'From campaign setup to daily optimization — we handle everything. Average client sees results within 14 days.',
  'No long-term contracts. No fluff. Just results. See our case studies and start growing this week.',
  'We\'ve generated $40M+ in revenue for clients just like you. Let\'s build something that works.',
]

const MOCK_CTAS = ['LEARN_MORE', 'GET_QUOTE', 'SIGN_UP', 'CONTACT_US', 'BOOK_NOW']
const CTA_LABELS: Record<string, string> = {
  LEARN_MORE:  'Learn More',
  GET_QUOTE:   'Get Quote',
  SIGN_UP:     'Sign Up',
  CONTACT_US:  'Contact Us',
  BOOK_NOW:    'Book Now',
}

// CTR multipliers for each asset — determines which ones appear "top performing"
const TITLE_PERFORMANCE  = [1.35, 1.20, 0.95, 0.82, 0.68]
const BODY_PERFORMANCE   = [1.28, 1.12, 0.98, 0.84, 0.72]
const CTA_PERFORMANCE    = [0.88, 1.25, 1.05, 0.92, 1.10]

export function getMockCreativeAssets(clientId: string): CreativeAssetRow[] {
  const s         = seed(clientId)
  const baseImpr  = jitter(120000, 20000, s)
  const baseCtr   = jitter(0.022, 0.004, s)
  const baseLeadR = jitter(0.042, 0.008, s)  // leads / clicks

  const titles: CreativeAssetRow[] = MOCK_TITLES.map((t, i) => {
    const perf        = TITLE_PERFORMANCE[i]
    const impressions = Math.round((baseImpr / 5) * perf)
    const ctr         = baseCtr * perf
    const clicks      = Math.round(impressions * ctr)
    const leads       = Math.round(clicks * baseLeadR * perf)
    const spend       = impressions * 0.013
    return {
      id:          `title-${i}`,
      assetType:   'title' as const,
      assetValue:  t,
      impressions,
      clicks,
      leads,
      spend:       Math.round(spend * 100) / 100,
      ctr,
      cpl:         leads > 0 ? Math.round((spend / leads) * 100) / 100 : 0,
    }
  }).sort((a, b) => b.leads - a.leads)

  const bodies: CreativeAssetRow[] = MOCK_BODIES.map((b, i) => {
    const perf        = BODY_PERFORMANCE[i]
    const impressions = Math.round((baseImpr / 5) * perf)
    const ctr         = baseCtr * perf
    const clicks      = Math.round(impressions * ctr)
    const leads       = Math.round(clicks * baseLeadR * perf)
    const spend       = impressions * 0.013
    return {
      id:          `body-${i}`,
      assetType:   'body' as const,
      assetValue:  b,
      impressions,
      clicks,
      leads,
      spend:       Math.round(spend * 100) / 100,
      ctr,
      cpl:         leads > 0 ? Math.round((spend / leads) * 100) / 100 : 0,
    }
  }).sort((a, b) => b.leads - a.leads)

  const ctas: CreativeAssetRow[] = MOCK_CTAS.map((cta, i) => {
    const perf        = CTA_PERFORMANCE[i]
    const impressions = Math.round((baseImpr / 5) * perf)
    const ctr         = baseCtr * perf
    const clicks      = Math.round(impressions * ctr)
    const leads       = Math.round(clicks * baseLeadR * perf)
    const spend       = impressions * 0.013
    return {
      id:          `cta-${i}`,
      assetType:   'cta' as const,
      assetValue:  CTA_LABELS[cta] ?? cta,
      impressions,
      clicks,
      leads,
      spend:       Math.round(spend * 100) / 100,
      ctr,
      cpl:         leads > 0 ? Math.round((spend / leads) * 100) / 100 : 0,
    }
  }).sort((a, b) => b.leads - a.leads)

  return [...titles.slice(0, 3), ...bodies.slice(0, 3), ...ctas.slice(0, 3)]
}

// ─── Conversion / Action Type Data ────────────────────────────────────────────
// Maps: action_type, action_destination, is_conversion_id_modeled

export function getMockConversionActions(clientId: string): ConversionActionRow[] {
  const s = seed(clientId)

  const raw = [
    { actionType: 'lead',                           label: 'Leads',               count: Math.round(jitter(148, 30, s)),    value: 0,    modeled: false },
    { actionType: 'onsite_conversion.lead_grouped', label: 'Form Submissions',    count: Math.round(jitter(82, 18, s * 1.1)), value: 0,  modeled: false },
    { actionType: 'landing_page_view',              label: 'Landing Page Views',  count: Math.round(jitter(2380, 400, s * 0.9)), value: 0, modeled: false },
    { actionType: 'link_click',                     label: 'Link Clicks',         count: Math.round(jitter(3150, 500, s * 1.2)), value: 0, modeled: false },
    { actionType: 'purchase',                       label: 'Purchases',           count: Math.round(jitter(42, 12, s * 0.8)),  value: jitter(18400, 4000, s), modeled: true },
    { actionType: 'schedule',                       label: 'Appointments Booked', count: Math.round(jitter(64, 14, s * 1.3)), value: 0,   modeled: false },
    { actionType: 'contact',                        label: 'Contact Actions',     count: Math.round(jitter(31, 8, s * 0.7)),  value: 0,   modeled: false },
  ]

  const totalCount = raw.reduce((a, r) => a + r.count, 0)

  return raw
    .sort((a, b) => b.count - a.count)
    .map(r => ({
      actionType:  r.actionType,
      actionLabel: r.label,
      count:       r.count,
      value:       Math.round(r.value * 100) / 100,
      share:       totalCount > 0 ? r.count / totalCount : 0,
      isModeled:   r.modeled,
    }))
}

export function getAggregatedConversionActions(clientIds: string[]): ConversionActionRow[] {
  if (clientIds.length === 0) return getMockConversionActions('default')

  const all = clientIds.map(id => getMockConversionActions(id))
  const map  = new Map<string, ConversionActionRow>()

  for (const rows of all) {
    for (const r of rows) {
      const existing = map.get(r.actionType)
      if (!existing) {
        map.set(r.actionType, { ...r })
      } else {
        existing.count += r.count
        existing.value += r.value
      }
    }
  }

  const merged     = Array.from(map.values()).sort((a, b) => b.count - a.count)
  const totalCount = merged.reduce((a, r) => a + r.count, 0)
  return merged.map(r => ({ ...r, share: totalCount > 0 ? r.count / totalCount : 0 }))
}

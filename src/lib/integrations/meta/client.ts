// src/lib/integrations/meta/client.ts
// Meta Marketing API v19.0 — full integration layer
// Supports: OAuth, ad account listing, campaign/adset/ad insights, lead data

import { prisma } from '@/lib/prisma'

const META_API_VERSION = 'v19.0'
const META_BASE = `https://graph.facebook.com/${META_API_VERSION}`

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MetaInsightsParams {
  adAccountId: string
  accessToken: string
  dateStart: string  // YYYY-MM-DD
  dateEnd:   string  // YYYY-MM-DD
  level?: 'account' | 'campaign' | 'adset' | 'ad'
  fields?: string[]
  breakdowns?: string[]
}

export interface MetaInsightRow {
  campaign_id?:    string
  campaign_name?:  string
  adset_id?:       string
  adset_name?:     string
  ad_id?:          string
  ad_name?:        string
  date_start:      string
  date_stop:       string
  spend:           string
  impressions:     string
  clicks:          string
  ctr:             string
  cpc:             string
  cpm:             string
  reach:           string
  frequency:       string
  actions?:        MetaAction[]
  action_values?:  MetaAction[]
  cost_per_action_type?: MetaAction[]
  status?:         string
}

export interface MetaAction {
  action_type: string
  value:       string
}

export interface MetaCampaign {
  id:         string
  name:       string
  status:     string
  objective:  string
  created_time: string
  effective_status: string
  daily_budget?: string
  lifetime_budget?: string
}

export interface MetaAdAccount {
  id:             string
  name:           string
  account_id:     string
  account_status: number
  currency:       string
  timezone_name:  string
}

// ─── Core API fetch helper ─────────────────────────────────────────────────────

async function metaFetch<T>(
  endpoint: string,
  params: Record<string, string>,
  accessToken: string
): Promise<T> {
  const url = new URL(`${META_BASE}/${endpoint}`)
  url.searchParams.set('access_token', accessToken)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))

  const res = await fetch(url.toString(), { next: { revalidate: 0 } })
  const data = await res.json()

  if (data.error) {
    throw new MetaApiError(data.error.message, data.error.code, data.error.type)
  }
  return data as T
}

export class MetaApiError extends Error {
  code: number
  type: string
  constructor(message: string, code: number, type: string) {
    super(message)
    this.name = 'MetaApiError'
    this.code = code
    this.type = type
  }
}

// ─── Token exchange ────────────────────────────────────────────────────────────

export async function exchangeCodeForToken(code: string, redirectUri: string): Promise<{
  access_token: string
  token_type: string
  expires_in?: number
}> {
  const res = await fetch(`${META_BASE}/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id:     process.env.META_APP_ID,
      client_secret: process.env.META_APP_SECRET,
      redirect_uri:  redirectUri,
      code,
    }),
  })
  const data = await res.json()
  if (data.error) throw new MetaApiError(data.error.message, data.error.code, data.error.type)
  return data
}

export async function getLongLivedToken(shortToken: string): Promise<string> {
  const data = await metaFetch<{ access_token: string }>(
    'oauth/access_token',
    {
      grant_type:    'fb_exchange_token',
      client_id:     process.env.META_APP_ID!,
      client_secret: process.env.META_APP_SECRET!,
      fb_exchange_token: shortToken,
    },
    shortToken
  )
  return data.access_token
}

// ─── Ad Account listing ─────────────────────────────────────────────────────────

export async function getAdAccounts(accessToken: string): Promise<MetaAdAccount[]> {
  const data = await metaFetch<{ data: MetaAdAccount[] }>(
    'me/adaccounts',
    { fields: 'id,name,account_id,account_status,currency,timezone_name' },
    accessToken
  )
  return data.data
}

// ─── Campaigns ─────────────────────────────────────────────────────────────────

export async function getCampaigns(
  adAccountId: string,
  accessToken: string,
  statusFilter: 'ACTIVE' | 'ALL' = 'ALL'
): Promise<MetaCampaign[]> {
  const fields = 'id,name,status,objective,created_time,effective_status,daily_budget,lifetime_budget'
  const params: Record<string, string> = { fields }
  if (statusFilter === 'ACTIVE') params.effective_status = '["ACTIVE"]'

  const data = await metaFetch<{ data: MetaCampaign[] }>(
    `act_${adAccountId}/campaigns`,
    params,
    accessToken
  )
  return data.data
}

// ─── Insights ──────────────────────────────────────────────────────────────────

const DEFAULT_INSIGHT_FIELDS = [
  'campaign_id', 'campaign_name',
  'adset_id', 'adset_name',
  'spend', 'impressions', 'clicks',
  'ctr', 'cpc', 'cpm', 'reach', 'frequency',
  'actions', 'action_values', 'cost_per_action_type',
  'date_start', 'date_stop',
]

export async function getInsights(params: MetaInsightsParams): Promise<MetaInsightRow[]> {
  const {
    adAccountId, accessToken, dateStart, dateEnd,
    level = 'campaign',
    fields = DEFAULT_INSIGHT_FIELDS,
  } = params

  const allRows: MetaInsightRow[] = []
  let after: string | undefined

  // Paginate through all results
  do {
    const apiParams: Record<string, string> = {
      fields:       fields.join(','),
      level,
      time_range:   JSON.stringify({ since: dateStart, until: dateEnd }),
      time_increment: '1', // daily breakdown
      limit:        '500',
    }
    if (after) apiParams.after = after

    const data = await metaFetch<{
      data:   MetaInsightRow[]
      paging: { cursors?: { after?: string }; next?: string }
    }>(`act_${adAccountId}/insights`, apiParams, accessToken)

    allRows.push(...data.data)
    after = data.paging?.cursors?.after && data.paging.next ? data.paging.cursors.after : undefined
  } while (after)

  return allRows
}

// ─── Helpers: extract action value by type ─────────────────────────────────────

export function getActionValue(actions: MetaAction[] | undefined, type: string): number {
  const a = actions?.find((a) => a.action_type === type)
  return a ? parseFloat(a.value) : 0
}

// Standard action types for lead gen / ecomm / appointments
export const META_ACTION_TYPES = {
  leads:        'lead',
  purchases:    'purchase',
  formLeads:    'onsite_conversion.lead_grouped',
  clicks:       'link_click',
  landing:      'landing_page_view',
  addToCart:    'add_to_cart',
  viewContent:  'view_content',
  initiated:    'initiate_checkout',
  completed:    'complete_registration',
  schedule:     'schedule',                    // Calendly/booking actions
  contact:      'contact',
}

// ─── Normalize a MetaInsightRow → our DB MetricSnapshot shape ─────────────────

export function normalizeInsightToMetric(row: MetaInsightRow) {
  const spend      = parseFloat(row.spend || '0')
  const revenue    = getActionValue(row.action_values, META_ACTION_TYPES.purchases)
  const leads      = getActionValue(row.actions, META_ACTION_TYPES.leads)
               || getActionValue(row.actions, META_ACTION_TYPES.formLeads)
  const purchases  = getActionValue(row.actions, META_ACTION_TYPES.purchases)
  const schedule   = getActionValue(row.actions, META_ACTION_TYPES.schedule)
  const impressions = parseInt(row.impressions || '0')
  const clicks     = parseInt(row.clicks || '0')

  return {
    date:              new Date(row.date_start),
    periodStart:       new Date(row.date_start),
    periodEnd:         new Date(row.date_stop),
    adSpend:           spend,
    revenue,
    roas:              spend > 0 ? revenue / spend : 0,
    leads:             Math.round(leads),
    costPerLead:       leads > 0 ? spend / leads : 0,
    appointments:      Math.round(schedule),
    costPerAppointment: schedule > 0 ? spend / schedule : 0,
    conversionRate:    impressions > 0 ? leads / impressions : 0,
    impressions,
    clicks,
    ctr:               parseFloat(row.ctr || '0') / 100, // Meta returns as percentage
    cpc:               parseFloat(row.cpc || '0'),
    purchases:         Math.round(purchases),
    source:            'META_ADS' as const,
    // Raw for AdPlatformData table
    rawCampaignId:     row.campaign_id,
    rawCampaignName:   row.campaign_name,
    rawAdSetId:        row.adset_id,
  }
}

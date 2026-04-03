// src/lib/metrics.ts
// Pure computed-metric helpers for ATP Scales dashboard.
// All functions are stateless — no DB or API calls.
// Used by services, components, and alert generation.

import { formatCurrency, formatPercent } from './utils'
import type { CampaignRow } from '@/types'

// ─── Core computed metrics ────────────────────────────────────────────────────

export function computeCPL(spend: number, leads: number): number {
  return leads > 0 ? spend / leads : 0
}

export function computeCTR(clicks: number, impressions: number): number {
  return impressions > 0 ? clicks / impressions : 0
}

export function computeCPC(spend: number, clicks: number): number {
  return clicks > 0 ? spend / clicks : 0
}

export function computeROAS(revenue: number, spend: number): number {
  return spend > 0 ? revenue / spend : 0
}

export function computeConversionRate(conversions: number, clicks: number): number {
  return clicks > 0 ? conversions / clicks : 0
}

export function computeCostPerResult(spend: number, results: number): number {
  return results > 0 ? spend / results : 0
}

// ─── Trend / period comparison ────────────────────────────────────────────────

/** Returns percentage change from previous to current period. Returns 0 if no prior data. */
export function computeTrendChange(current: number, previous: number): number {
  if (previous === 0) return 0
  return ((current - previous) / previous) * 100
}

/** Formats a trend change into a display string like "+12.4%" or "-3.1%" */
export function formatTrendChange(change: number): string {
  const sign = change >= 0 ? '+' : ''
  return `${sign}${change.toFixed(1)}%`
}

// ─── Performance scoring ──────────────────────────────────────────────────────

export type PerformanceRank = 'top' | 'average' | 'low' | 'inactive'

/**
 * Classify a campaign or creative relative to an account average.
 * Uses CTR as the primary signal (most reliable cross-objective metric).
 */
export function classifyPerformance(
  ctr: number,
  accountAvgCtr: number,
  impressions: number,
  spend: number
): PerformanceRank {
  if (spend === 0 && impressions === 0) return 'inactive'
  if (impressions < 1_000) return 'average' // insufficient data
  if (accountAvgCtr === 0) return 'average'
  if (ctr > accountAvgCtr * 1.4) return 'top'
  if (ctr < accountAvgCtr * 0.6) return 'low'
  return 'average'
}

/**
 * Score a campaign 0–100 based on ROAS + CPL relative to account average.
 * Used for winner/loser sorting.
 */
export function computePerformanceScore(
  roas: number,
  cpl: number,
  avgRoas: number,
  avgCpl: number
): number {
  const roasScore = avgRoas > 0 ? Math.min((roas / avgRoas) * 50, 100) : 50
  const cplScore  = avgCpl > 0 && cpl > 0 ? Math.min((avgCpl / cpl) * 50, 100) : 50
  return Math.round((roasScore + cplScore) / 2)
}

/** Returns top and worst campaign from a list (by performance score). */
export function rankCampaigns(campaigns: CampaignRow[]): {
  winner: CampaignRow | null
  loser: CampaignRow | null
} {
  const withData = campaigns.filter(c => c.spend > 100 && c.leads > 0)
  if (withData.length === 0) return { winner: null, loser: null }

  const avgRoas = withData.reduce((a, c) => a + c.roas, 0) / withData.length
  const avgCpl  = withData.reduce((a, c) => a + c.cpl, 0) / withData.length

  const scored = withData.map(c => ({
    campaign: c,
    score: computePerformanceScore(c.roas, c.cpl, avgRoas, avgCpl),
  })).sort((a, b) => b.score - a.score)

  return {
    winner: scored[0]?.campaign ?? null,
    loser:  scored[scored.length - 1]?.campaign ?? null,
  }
}

// ─── Alert / insight generation ───────────────────────────────────────────────

export type InsightType = 'winning' | 'warning' | 'critical' | 'info'

export interface Insight {
  id:          string
  type:        InsightType
  title:       string
  description: string
}

/**
 * Compute actionable insights from the current campaign set.
 * Designed to be extended — add new rules by appending to the returned array.
 */
export function computeInsights(campaigns: CampaignRow[]): Insight[] {
  const insights: Insight[] = []
  const withSpend = campaigns.filter(c => c.spend > 50)
  if (withSpend.length === 0) return insights

  // ── Winner: best ROAS with real spend ──────────────────────────────────────
  const byRoas = [...withSpend].sort((a, b) => b.roas - a.roas)
  const best   = byRoas[0]
  if (best && best.roas >= 3) {
    insights.push({
      id:          `win-roas-${best.id}`,
      type:        'winning',
      title:       'Top Performing Campaign',
      description: `${best.name} is delivering ${best.roas.toFixed(1)}x ROAS with ${best.leads} leads at ${formatCurrency(best.cpl)} CPL.`,
    })
  }

  // ── High CPL: >60% above account average ─────────────────────────────────
  const leadCampaigns = withSpend.filter(c => c.leads > 0)
  if (leadCampaigns.length > 0) {
    const avgCpl  = leadCampaigns.reduce((a, c) => a + c.cpl, 0) / leadCampaigns.length
    const highCpl = leadCampaigns.filter(c => c.cpl > avgCpl * 1.6)
    for (const c of highCpl.slice(0, 2)) {
      insights.push({
        id:          `warn-cpl-${c.id}`,
        type:        'warning',
        title:       'High Cost Per Lead',
        description: `${c.name} is generating leads at ${formatCurrency(c.cpl)} — ${Math.round((c.cpl / avgCpl - 1) * 100)}% above account average.`,
      })
    }
  }

  // ── Low CTR: <1% with >10k impressions ────────────────────────────────────
  const lowCtr = withSpend.filter(c => c.ctr > 0 && c.ctr < 0.01 && c.impressions > 10_000)
  for (const c of lowCtr.slice(0, 1)) {
    insights.push({
      id:          `info-ctr-${c.id}`,
      type:        'info',
      title:       'Low Click-Through Rate',
      description: `${c.name} has a ${formatPercent(c.ctr, 2)} CTR across ${c.impressions.toLocaleString()} impressions. Consider refreshing the ad creative.`,
    })
  }

  // ── Not spending: ACTIVE campaigns with $0 ────────────────────────────────
  const notSpending = campaigns.filter(c => c.status === 'ACTIVE' && c.spend === 0)
  for (const c of notSpending.slice(0, 2)) {
    insights.push({
      id:          `crit-ns-${c.id}`,
      type:        'critical',
      title:       'Campaign Not Spending',
      description: `${c.name} is Active but has $0 spend in the last 30 days. Check campaign delivery and budget settings.`,
    })
  }

  // ── Loser: worst-performing campaign (not already flagged) ────────────────
  const { loser } = rankCampaigns(campaigns)
  const alreadyFlagged = new Set(insights.map(i => i.id.split('-').pop()))
  if (loser && !alreadyFlagged.has(loser.id) && loser.roas < 1.5 && loser.spend > 200) {
    insights.push({
      id:          `warn-low-${loser.id}`,
      type:        'warning',
      title:       'Underperforming Campaign',
      description: `${loser.name} has the lowest performance score in your account — ${loser.roas.toFixed(2)}x ROAS with ${formatCurrency(loser.cpl)} CPL. Consider pausing or restructuring.`,
    })
  }

  return insights
}

// src/lib/services/ads.service.ts

import { getProvider }        from '@/lib/providers'
import { classifyPerformance } from '@/lib/metrics'
import type { AdRow }          from '@/lib/providers/types'

export interface AdsPageData {
  rows:              AdRow[]
  accountAvgCtr:     number
  totalImpressions:  number
  totalLeads:        number
  blendedCtr:        number
}

export async function getAdsPageData(clientProfileId: string): Promise<AdsPageData> {
  const provider = await getProvider(clientProfileId)
  const rows     = await provider.getAdRows(clientProfileId)

  const active  = rows.filter(r => r.status === 'ACTIVE')
  const avgCtr  = active.length > 0
    ? active.reduce((a, r) => a + r.ctr, 0) / active.length
    : 0

  const totalImpressions = rows.reduce((a, r) => a + r.impressions, 0)
  const totalLeads       = rows.reduce((a, r) => a + r.leads, 0)
  const totalClicks      = rows.reduce((a, r) => a + r.clicks, 0)
  const blendedCtr       = totalImpressions > 0 ? totalClicks / totalImpressions : 0

  return { rows, accountAvgCtr: avgCtr, totalImpressions, totalLeads, blendedCtr }
}

/** Rank a single AdRow relative to the account average CTR */
export function getAdRank(
  row: AdRow,
  accountAvgCtr: number
): 'top' | 'average' | 'low' | 'inactive' {
  return classifyPerformance(row.ctr, accountAvgCtr, row.impressions, row.spend)
}

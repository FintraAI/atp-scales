// src/lib/services/campaign.service.ts

import { getProvider }     from '@/lib/providers'
import { subDays, startOfDay } from 'date-fns'
import type { CampaignRow } from '@/types'

export interface CampaignPageData {
  rows:         CampaignRow[]
  totalSpend:   number
  totalLeads:   number
  blendedRoas:  number
}

export async function getCampaignPageData(
  clientProfileId: string,
  days = 30
): Promise<CampaignPageData> {
  const now   = new Date()
  const from  = startOfDay(subDays(now, days))
  const provider = await getProvider(clientProfileId)

  const rows = await provider.getCampaignRows(clientProfileId, { from, to: now })

  const totalSpend = rows.reduce((a, r) => a + r.spend, 0)
  const totalLeads = rows.reduce((a, r) => a + r.leads, 0)
  const blendedRoas =
    totalSpend > 0
      ? rows.reduce((a, r) => a + r.roas * (r.spend / totalSpend), 0)
      : 0

  return { rows, totalSpend, totalLeads, blendedRoas }
}

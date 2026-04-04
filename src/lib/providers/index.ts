// src/lib/providers/index.ts
// Provider factory — returns the right AdsDataProvider for a given client.
//
// Logic:
//   1. Check if the client has a CONNECTED Meta integration in the DB
//   2. If yes → return MetaAdsProvider (live data, falls back to local)
//   3. If no  → return LocalAdsProvider (seed / manually entered data)
//
// Extending for Google Ads in the future:
//   Add a GOOGLE_ADS check below and return a GoogleAdsProvider when connected.

import { prisma }           from '@/lib/prisma'
import { LocalAdsProvider } from './local.provider'
import { MetaAdsProvider }  from './meta/provider'
import type { AdsDataProvider } from './types'

export async function getProvider(clientProfileId: string): Promise<AdsDataProvider> {
  // Check for a connected Meta integration
  const metaIntegration = await prisma.clientIntegration.findUnique({
    where: {
      clientProfileId_provider: {
        clientProfileId,
        provider: 'META_ADS',
      },
    },
    select: {
      status:            true,
      accessToken:       true,
      externalAccountId: true,
    },
  })

  if (
    metaIntegration?.status === 'CONNECTED' &&
    metaIntegration.accessToken &&
    metaIntegration.externalAccountId
  ) {
    return new MetaAdsProvider(
      clientProfileId,
      metaIntegration.accessToken,
      metaIntegration.externalAccountId
    )
  }

  // TODO: Add Google Ads provider check here when implementing Google integration
  //   const googleIntegration = await prisma.clientIntegration.findUnique(...)
  //   if (googleIntegration?.status === 'CONNECTED') return new GoogleAdsProvider(...)

  return new LocalAdsProvider()
}

// Re-export types for convenience
export type { AdsDataProvider, DashboardMetrics, TimeSeriesPoint, AdRow, DateRange } from './types'

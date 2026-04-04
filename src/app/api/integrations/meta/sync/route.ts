// src/app/api/integrations/meta/sync/route.ts
// POST: trigger a Meta Ads sync for a specific client (or all clients)
// Used by admin UI "Sync Now" button + cron job

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { syncClientMetaData, syncAllMetaClients } from '@/lib/integrations/meta/sync'
import { z } from 'zod'

const schema = z.object({
  clientProfileId: z.string().optional(), // if omitted, sync all
  daysBack: z.number().int().min(1).max(90).default(30),
})

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user || !['SUPER_ADMIN', 'TEAM_MEMBER'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Allow cron key as alternative auth (for server-side cron jobs)
  const cronKey = req.headers.get('x-cron-key')
  const isCron  = cronKey === process.env.CRON_SECRET_KEY

  const body = await req.json().catch(() => ({}))
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { clientProfileId, daysBack } = parsed.data

  if (clientProfileId) {
    const result = await syncClientMetaData(clientProfileId, { daysBack })
    return NextResponse.json(result)
  } else {
    const results = await syncAllMetaClients(daysBack)
    return NextResponse.json({ results, synced: results.filter((r) => r.success).length })
  }
}

// GET: check sync status for a client
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user || !['SUPER_ADMIN', 'TEAM_MEMBER'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const clientProfileId = searchParams.get('clientProfileId')

  if (!clientProfileId) return NextResponse.json({ error: 'Missing clientProfileId' }, { status: 400 })

  const { prisma } = await import('@/lib/prisma')
  const integration = await prisma.clientIntegration.findUnique({
    where: { clientProfileId_provider: { clientProfileId, provider: 'META_ADS' } },
    select: { status: true, lastSyncedAt: true, syncError: true, externalAccountId: true },
  })

  return NextResponse.json(integration || { status: 'NOT_CONNECTED' })
}

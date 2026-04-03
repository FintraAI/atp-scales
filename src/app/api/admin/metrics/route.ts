// src/app/api/admin/metrics/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const schema = z.object({
  clientProfileId: z.string(),
  date: z.string(),
  adSpend: z.number().min(0),
  revenue: z.number().min(0),
  roas: z.number().min(0),
  leads: z.number().int().min(0),
  costPerLead: z.number().min(0),
  appointments: z.number().int().min(0),
  costPerAppointment: z.number().min(0),
  conversionRate: z.number().min(0),
  impressions: z.number().int().min(0),
  clicks: z.number().int().min(0),
  ctr: z.number().min(0),
  cpc: z.number().min(0),
  purchases: z.number().int().min(0).default(0),
})

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user || !['SUPER_ADMIN', 'TEAM_MEMBER'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { date, ...rest } = parsed.data
  const dateObj = new Date(date)

  const metric = await prisma.metricSnapshot.upsert({
    where: { clientProfileId_date: { clientProfileId: rest.clientProfileId, date: dateObj } },
    update: { ...rest, periodStart: dateObj, periodEnd: dateObj },
    create: { ...rest, date: dateObj, periodStart: dateObj, periodEnd: dateObj },
  })

  return NextResponse.json({ success: true, data: metric })
}

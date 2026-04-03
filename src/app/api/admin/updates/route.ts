// src/app/api/admin/updates/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const schema = z.object({
  clientProfileId: z.string(),
  authorId: z.string(),
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(10000),
  category: z.enum(['WEEKLY_RECAP', 'STRATEGY_CHANGE', 'CREATIVE_UPDATE', 'PERFORMANCE_ALERT', 'GENERAL']),
  isPinned: z.boolean().default(false),
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

  const update = await prisma.clientUpdate.create({
    data: {
      ...parsed.data,
      publishedAt: new Date(),
    },
  })

  return NextResponse.json({ success: true, data: update })
}

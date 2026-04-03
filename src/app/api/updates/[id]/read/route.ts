// src/app/api/updates/[id]/read/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Ensure the update belongs to this client
  const update = await prisma.clientUpdate.findUnique({
    where: { id: params.id },
    select: { clientProfileId: true },
  })

  if (!update) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Security: clients can only mark their own updates
  if (session.user.role === 'CLIENT' && update.clientProfileId !== session.user.clientProfileId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await prisma.clientUpdate.update({
    where: { id: params.id },
    data: { isRead: true },
  })

  return NextResponse.json({ success: true })
}

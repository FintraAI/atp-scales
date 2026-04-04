// src/app/api/admin/clients/route.ts
// POST: Create a new client user + profile + optional onboarding record

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(8),

  companyName: z.string().min(1),
  industry: z.string().optional(),
  website: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  monthlyBudget: z.string().optional(),
  planName: z.string().optional(),
  status: z
    .enum(['ACTIVE', 'PAUSED', 'CHURNED', 'ONBOARDING', 'PROSPECT'])
    .default('ONBOARDING'),

  offerName: z.string().optional(),
  targetAudience: z.string().optional(),
  callNotes: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || !['SUPER_ADMIN', 'TEAM_MEMBER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const {
      email,
      name,
      password,
      companyName,
      industry,
      website,
      phone,
      address,
      monthlyBudget,
      planName,
      status,
      offerName,
      targetAudience,
      callNotes,
    } = parsed.data

    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'A user with this email already exists.' },
        { status: 409 }
      )
    }

    let planId: string | undefined

    if (planName) {
      const plan = await prisma.plan.findFirst({
        where: { name: planName },
      })
      planId = plan?.id
    }

    const hashed = await bcrypt.hash(password, 12)

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: email.toLowerCase(),
          name,
          password: hashed,
          role: 'CLIENT',
          isActive: true,
        },
      })

      const profile = await tx.clientProfile.create({
        data: {
          userId: user.id,
          companyName,
          industry: industry || null,
          website: website || null,
          phone: phone || null,
          address: address || null,
          monthlyBudget: monthlyBudget ? parseFloat(monthlyBudget) : null,
          planId: planId || null,
          status,
          accountManagerId: session.user.id,
        },
      })

      if (offerName || targetAudience || callNotes) {
        await tx.onboarding.create({
          data: {
            clientProfileId: profile.id,
            offerName: offerName || null,
            targetAudience: targetAudience || null,
            callNotes: callNotes || null,
            callDate: callNotes ? new Date() : null,
          },
        })
      }

      await tx.auditLog.create({
        data: {
          userId: session.user.id,
          action: 'client.create',
          entityType: 'ClientProfile',
          entityId: profile.id,
          metadata: { companyName, email },
        },
      })

      return { userId: user.id, clientProfileId: profile.id }
    })

    return NextResponse.json({ success: true, ...result }, { status: 201 })
  } catch (error) {
    console.error('POST /api/admin/clients failed:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
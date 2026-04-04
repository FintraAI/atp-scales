// src/lib/client-plan.ts
// Helpers for plan-based feature gating

import { prisma } from './prisma'

export type PlanName = 'Starter' | 'Growth' | 'Scale'

const PLAN_LEVELS: Record<PlanName, number> = { Starter: 1, Growth: 2, Scale: 3 }

export async function getClientPlan(clientProfileId: string): Promise<PlanName> {
  const profile = await prisma.clientProfile.findUnique({
    where: { id: clientProfileId },
    select: { plan: { select: { name: true } } },
  })
  const n = profile?.plan?.name
  if (n === 'Growth') return 'Growth'
  if (n === 'Scale') return 'Scale'
  return 'Starter'
}

/** Returns true if the client's plan is at least `required` */
export function planAtLeast(plan: PlanName, required: PlanName): boolean {
  return PLAN_LEVELS[plan] >= PLAN_LEVELS[required]
}

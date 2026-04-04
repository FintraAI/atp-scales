// src/lib/auth-guards.ts
// Server-only auth helpers. Do NOT import from client components.

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import type { Role } from '@prisma/client'

export async function requireAuth(allowedRoles?: Role[]) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/login')
  }

  if (allowedRoles && !allowedRoles.includes(session.user.role)) {
    redirect('/portal/dashboard')
  }

  return session
}

export async function requireAdmin() {
  return requireAuth(['SUPER_ADMIN'])
}

export async function requireAdminOrTeam() {
  return requireAuth(['SUPER_ADMIN', 'TEAM_MEMBER'])
}

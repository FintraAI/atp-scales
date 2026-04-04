// src/app/(portal)/integrations/meta/connect/page.tsx
// OAuth flow entry point - redirects to Meta for authorization

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function MetaConnectPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')
  if (!['SUPER_ADMIN', 'TEAM_MEMBER'].includes(session.user.role)) redirect('/portal/dashboard')

  const metaAuthUrl = new URL('https://www.facebook.com/v19.0/dialog/oauth')
  metaAuthUrl.searchParams.set('client_id',     process.env.META_APP_ID || '')
  metaAuthUrl.searchParams.set('redirect_uri',  `${process.env.NEXTAUTH_URL}/api/integrations/meta/callback`)
  metaAuthUrl.searchParams.set('scope',         'ads_read,ads_management,business_management,leads_retrieval')
  metaAuthUrl.searchParams.set('response_type', 'code')
  metaAuthUrl.searchParams.set('state',         session.user.id)

  redirect(metaAuthUrl.toString())
}

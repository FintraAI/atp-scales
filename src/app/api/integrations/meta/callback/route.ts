// src/app/api/integrations/meta/callback/route.ts
// Handles Meta OAuth redirect, exchanges code for long-lived token, stores integration

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { exchangeCodeForToken, getLongLivedToken, getAdAccounts } from '@/lib/integrations/meta/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code    = searchParams.get('code')
  const state   = searchParams.get('state')  // userId
  const errorParam = searchParams.get('error')

  if (errorParam) {
    return NextResponse.redirect(
      new URL(`/portal/admin/integrations?error=${encodeURIComponent(errorParam)}`, req.url)
    )
  }

  if (!code || !state) {
    return NextResponse.redirect(new URL('/portal/admin/integrations?error=missing_params', req.url))
  }

  try {
    const redirectUri = `${process.env.NEXTAUTH_URL}/api/integrations/meta/callback`

    // 1. Exchange code for short token
    const { access_token: shortToken } = await exchangeCodeForToken(code, redirectUri)

    // 2. Get long-lived token (60-day expiry)
    const longToken = await getLongLivedToken(shortToken)

    // 3. Get ad accounts so admin can pick which one to assign to a client
    const adAccounts = await getAdAccounts(longToken)

    // 4. Find the user making this request
    const user = await prisma.user.findUnique({
      where: { id: state },
      include: { clientProfile: { select: { id: true } } },
    })

    if (!user) {
      return NextResponse.redirect(new URL('/portal/admin/integrations?error=user_not_found', req.url))
    }

    // 5. For now, store token on the super admin's first client (admin can reassign in UI)
    // In a full flow, you'd show a UI to select which client to assign this to
    const clientProfileId = user.clientProfile?.id

    if (clientProfileId) {
      // Use first ad account if only one, otherwise store all + let admin pick
      const primaryAccount = adAccounts[0]

      await prisma.clientIntegration.upsert({
        where: { clientProfileId_provider: { clientProfileId, provider: 'META_ADS' } },
        update: {
          accessToken:       longToken,
          tokenExpiresAt:    new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
          externalAccountId: primaryAccount?.account_id,
          externalData:      adAccounts as any,
          status:            'CONNECTED',
          syncError:         null,
        },
        create: {
          clientProfileId,
          provider:          'META_ADS',
          accessToken:       longToken,
          tokenExpiresAt:    new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
          externalAccountId: primaryAccount?.account_id,
          externalData:      adAccounts as any,
          status:            'CONNECTED',
        },
      })
    }

    // Store the token at user level for admin usage (can assign to any client)
    // Encode accounts in redirect so UI can display the selector
    const encoded = encodeURIComponent(JSON.stringify({
      token: longToken,
      accounts: adAccounts,
    }))

    return NextResponse.redirect(
      new URL(`/portal/admin/integrations?meta_connected=1&data=${encoded}`, req.url)
    )

  } catch (err: any) {
    console.error('Meta OAuth error:', err)
    return NextResponse.redirect(
      new URL(`/portal/admin/integrations?error=${encodeURIComponent(err.message)}`, req.url)
    )
  }
}

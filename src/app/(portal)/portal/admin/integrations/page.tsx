// src/app/(portal)/admin/integrations/page.tsx
// Manage integrations for all clients: Meta Ads, Google Ads, Stripe, Calendly

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { SyncButton } from '@/components/admin/sync-button'
import { CheckCircle, XCircle, AlertCircle, Clock, RefreshCw } from 'lucide-react'

const PROVIDERS = [
  {
    key: 'META_ADS',
    name: 'Meta Ads',
    description: 'Facebook & Instagram campaigns, leads, ROAS',
    color: 'text-blue-400',
    bg: 'bg-blue-400/8',
    border: 'border-blue-400/20',
    connectPath: '/portal/integrations/meta/connect',
    docUrl: 'https://developers.facebook.com/docs/marketing-api',
  },
  {
    key: 'GOOGLE_ADS',
    name: 'Google Ads',
    description: 'Search, Display & YouTube campaigns',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/8',
    border: 'border-emerald-400/20',
    connectPath: '#',
    docUrl: 'https://developers.google.com/google-ads/api',
    comingSoon: true,
  },
  {
    key: 'STRIPE',
    name: 'Stripe',
    description: 'Revenue, payments, subscriptions',
    color: 'text-purple-400',
    bg: 'bg-purple-400/8',
    border: 'border-purple-400/20',
    connectPath: '#',
    docUrl: 'https://stripe.com/docs/api',
    comingSoon: true,
  },
  {
    key: 'CALENDLY',
    name: 'Calendly',
    description: 'Appointments booked, cancellations, attribution',
    color: 'text-teal-400',
    bg: 'bg-teal-400/8',
    border: 'border-teal-400/20',
    connectPath: '#',
    docUrl: 'https://developer.calendly.com',
    comingSoon: true,
  },
]

export default async function IntegrationsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')
  if (!['SUPER_ADMIN', 'TEAM_MEMBER'].includes(session.user.role)) redirect('/portal/dashboard')

  const clients = await prisma.clientProfile.findMany({
    select: {
      id: true,
      companyName: true,
      integrations: {
        select: {
          provider: true,
          status: true,
          lastSyncedAt: true,
          syncError: true,
          externalAccountId: true,
        },
      },
    },
    orderBy: { companyName: 'asc' },
  })

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-[#EBEBEB] tracking-wide">Integrations</h1>
        <p className="text-[#555] text-sm mt-1">
          Connect data sources per client. Synced data flows directly into each client&apos;s dashboard.
        </p>
      </div>

      {/* Provider cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        {PROVIDERS.map((provider) => (
          <div key={provider.key} className={`atp-card p-5 border ${provider.comingSoon ? 'opacity-60' : ''}`}>
            <div className="flex items-start justify-between mb-3">
              <div className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${provider.bg} ${provider.color} ${provider.border}`}>
                {provider.name}
              </div>
              {provider.comingSoon && (
                <span className="badge-silver">Coming Soon</span>
              )}
            </div>
            <p className="text-[#666] text-[12px] leading-relaxed mb-4">{provider.description}</p>
            {!provider.comingSoon && (
              <a
                href={provider.connectPath}
                className="inline-flex items-center gap-1.5 text-[#C9A84C] text-xs font-semibold hover:text-[#E2C06A] transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Connect via OAuth →
              </a>
            )}
          </div>
        ))}
      </div>

      {/* Per-client integration status */}
      <div className="atp-card overflow-hidden">
        <div className="px-6 py-4 border-b border-[#1C1C1C] flex items-center justify-between">
          <h2 className="font-display font-bold text-[#EBEBEB] tracking-wide">Client Integration Status</h2>
          <SyncButton label="Sync All Meta" endpoint="/api/integrations/meta/sync" body={{}} />
        </div>

        <div className="divide-y divide-[#1A1A1A]">
          {clients.map((client) => {
            const intByProvider = Object.fromEntries(
              client.integrations.map((i) => [i.provider, i])
            )

            return (
              <div key={client.id} className="px-6 py-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#1C1C1C] rounded-lg flex items-center justify-center">
                      <span className="text-xs font-bold text-[#888]">{client.companyName[0]}</span>
                    </div>
                    <span className="font-semibold text-[#EBEBEB] text-sm">{client.companyName}</span>
                  </div>
                  <SyncButton
                    label="Sync Meta"
                    endpoint="/api/integrations/meta/sync"
                    body={{ clientProfileId: client.id, daysBack: 30 }}
                    small
                  />
                </div>

                {/* Provider status row */}
                <div className="grid grid-cols-4 gap-3 mt-3">
                  {PROVIDERS.map((provider) => {
                    const integration = intByProvider[provider.key]
                    const status = integration?.status

                    return (
                      <div key={provider.key} className="bg-[#0C0C0C] border border-[#1C1C1C] rounded-xl p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-[11px] font-bold ${provider.color}`}>{provider.name}</span>
                          {status === 'CONNECTED'    && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                          {status === 'ERROR'        && <AlertCircle className="w-3.5 h-3.5 text-red-400" />}
                          {status === 'DISCONNECTED' && <XCircle className="w-3.5 h-3.5 text-[#444]" />}
                          {!status                   && <XCircle className="w-3.5 h-3.5 text-[#333]" />}
                        </div>
                        <div>
                          <p className={`text-[10px] font-bold ${
                            status === 'CONNECTED' ? 'text-emerald-400'
                            : status === 'ERROR'   ? 'text-red-400'
                            : 'text-[#333]'
                          }`}>
                            {status === 'CONNECTED'    ? 'Connected'
                            : status === 'ERROR'        ? 'Error'
                            : status === 'PENDING'      ? 'Pending'
                            : status === 'DISCONNECTED' ? 'Disconnected'
                            : 'Not connected'}
                          </p>
                          {integration?.lastSyncedAt && (
                            <p className="text-[9px] text-[#333] mt-0.5 flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5" />
                              {formatDate(integration.lastSyncedAt)}
                            </p>
                          )}
                          {integration?.syncError && (
                            <p className="text-[9px] text-red-400/70 mt-0.5 truncate">{integration.syncError}</p>
                          )}
                          {integration?.externalAccountId && (
                            <p className="text-[9px] text-[#333] font-mono mt-0.5">
                              ID: {integration.externalAccountId}
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Architecture note */}
      <div className="bg-[rgba(201,168,76,0.04)] border border-[rgba(201,168,76,0.1)] rounded-2xl p-5">
        <p className="text-[11px] font-bold uppercase tracking-wider text-[#C9A84C] mb-2">Data Architecture</p>
        <p className="text-[#666] text-sm leading-relaxed">
          Each integration stores raw payloads in platform-specific tables (AdPlatformData, StripeData, CalendlyData)
          and normalizes the data into MetricSnapshot for dashboard display. This means you can add Google Ads,
          Stripe, or Calendly without touching the dashboard UI — the data schema is already ready.
        </p>
      </div>
    </div>
  )
}

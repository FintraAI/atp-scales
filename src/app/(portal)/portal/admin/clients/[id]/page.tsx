// src/app/(portal)/admin/clients/[id]/page.tsx

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { formatCurrency, formatDate, PERFORMANCE_CONFIG, CLIENT_STATUS_CONFIG } from '@/lib/utils'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import type { PerformanceStatus, ClientStatus } from '@prisma/client'
import { PostUpdateForm } from '@/components/admin/post-update-form'
import { EditMetricsForm } from '@/components/admin/edit-metrics-form'

export default async function AdminClientDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')
  if (!['SUPER_ADMIN', 'TEAM_MEMBER'].includes(session.user.role)) redirect('/portal/dashboard')

  const client = await prisma.clientProfile.findUnique({
    where: { id: params.id },
    include: {
      user: { select: { email: true, name: true, lastLoginAt: true, isActive: true } },
      plan: true,
      accountManager: { select: { id: true, name: true, email: true } },
      onboarding: true,
      integrations: true,
      updates: {
        include: { author: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
      files: {
        include: { uploadedBy: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!client) notFound()

  const perfCfg = PERFORMANCE_CONFIG[client.performanceStatus as PerformanceStatus]
  const statusCfg = CLIENT_STATUS_CONFIG[client.status as ClientStatus]

  const teamMembers = await prisma.user.findMany({
    where: { role: { in: ['SUPER_ADMIN', 'TEAM_MEMBER'] } },
    select: { id: true, name: true, email: true },
  })

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Back + Header */}
      <div>
        <Link href="/portal/admin/clients" className="flex items-center gap-2 text-[#6B6B6B] hover:text-white text-sm transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" /> All Clients
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-2xl font-bold text-white">{client.companyName}</h1>
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${statusCfg.bg} ${statusCfg.color}`}>
                {statusCfg.label}
              </span>
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${perfCfg.bg} ${perfCfg.color}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${perfCfg.dot}`} />
                {perfCfg.label}
              </span>
            </div>
            <p className="text-[#B3B3B3] text-sm mt-1">{client.industry} · {client.user.email}</p>
          </div>
          {client.website && (
            <a href={client.website} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-[#6B6B6B] hover:text-[#c8ff00] transition-colors">
              <ExternalLink className="w-3.5 h-3.5" /> Website
            </a>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left column - Info */}
        <div className="col-span-1 space-y-4">
          {/* Account info */}
          <div className="bg-[#181818] border border-[#1e1e1e] rounded-2xl p-5 space-y-4">
            <h3 className="font-display font-semibold text-white text-sm">Account Details</h3>
            <InfoRow label="Plan" value={client.plan?.name || '—'} />
            <InfoRow label="Monthly Budget" value={client.monthlyBudget ? formatCurrency(Number(client.monthlyBudget)) : '—'} />
            <InfoRow label="Account Manager" value={client.accountManager?.name || '—'} />
            <InfoRow label="Last Login" value={client.user.lastLoginAt ? formatDate(client.user.lastLoginAt) : 'Never'} />
            <InfoRow label="Client Since" value={formatDate(client.createdAt)} />
          </div>

          {/* Onboarding access status */}
          {client.onboarding && (
            <div className="bg-[#181818] border border-[#1e1e1e] rounded-2xl p-5 space-y-3">
              <h3 className="font-display font-semibold text-white text-sm">Access Status</h3>
              <AccessRow label="Meta Ads" granted={client.onboarding.metaAccessGranted} />
              <AccessRow label="Google Ads" granted={client.onboarding.googleAccessGranted} />
              <AccessRow label="Website" granted={client.onboarding.websiteAccessGranted} />
              <AccessRow label="CRM" granted={client.onboarding.crmAccessGranted} />
            </div>
          )}

          {/* Integrations */}
          <div className="bg-[#181818] border border-[#1e1e1e] rounded-2xl p-5 space-y-3">
            <h3 className="font-display font-semibold text-white text-sm">Integrations</h3>
            {client.integrations.length === 0 ? (
              <p className="text-[#6B6B6B] text-xs">No integrations connected</p>
            ) : (
              client.integrations.map((int) => (
                <div key={int.id} className="flex items-center justify-between">
                  <span className="text-[12px] text-[#B3B3B3]">{int.provider.replace('_', ' ')}</span>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                    int.status === 'CONNECTED' ? 'text-emerald-400 bg-emerald-400/10' :
                    int.status === 'ERROR' ? 'text-red-400 bg-red-400/10' :
                    'text-amber-400 bg-amber-400/10'
                  }`}>
                    {int.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right column - Actions */}
        <div className="col-span-2 space-y-4">
          {/* Onboarding */}
          {client.onboarding && (
            <div className="bg-[#181818] border border-[#1e1e1e] rounded-2xl p-5 space-y-4">
              <h3 className="font-display font-semibold text-white text-sm">Onboarding Info</h3>
              {client.onboarding.offerName && (
                <div>
                  <p className="text-[11px] text-[#6B6B6B] uppercase tracking-wider mb-1">Offer</p>
                  <p className="text-[13px] font-semibold text-white">{client.onboarding.offerName}</p>
                  {client.onboarding.offerPrice && (
                    <p className="text-[12px] text-[#B3B3B3] mt-0.5">{client.onboarding.offerPrice}</p>
                  )}
                </div>
              )}
              {client.onboarding.targetAudience && (
                <div>
                  <p className="text-[11px] text-[#6B6B6B] uppercase tracking-wider mb-1">Target Audience</p>
                  <p className="text-[13px] text-[#aaa]">{client.onboarding.targetAudience}</p>
                </div>
              )}
              {client.onboarding.callNotes && (
                <div>
                  <p className="text-[11px] text-[#6B6B6B] uppercase tracking-wider mb-1">Call Notes</p>
                  <p className="text-[13px] text-[#aaa] leading-relaxed whitespace-pre-wrap">{client.onboarding.callNotes}</p>
                </div>
              )}
            </div>
          )}

          {/* Post update form */}
          <PostUpdateForm clientProfileId={client.id} authorId={session.user.id} />

          {/* Edit metrics */}
          <EditMetricsForm clientProfileId={client.id} />
        </div>
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[12px] text-[#6B6B6B]">{label}</span>
      <span className="text-[12px] font-medium text-[#aaa]">{value}</span>
    </div>
  )
}

function AccessRow({ label, granted }: { label: string; granted: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[12px] text-[#B3B3B3]">{label}</span>
      {granted
        ? <CheckCircle className="w-4 h-4 text-emerald-400" />
        : <XCircle className="w-4 h-4 text-[#6B6B6B]" />
      }
    </div>
  )
}

// src/app/(portal)/portal/campaigns/page.tsx

import { getServerSession } from 'next-auth'
import { authOptions }      from '@/lib/auth'
import { redirect }         from 'next/navigation'
import { prisma }           from '@/lib/prisma'
import { getCampaignPageData } from '@/lib/services/campaign.service'
import { formatCurrency, formatNumber, formatPercent, formatRoas } from '@/lib/utils'

const PLATFORM_BADGE: Record<string, string> = {
  META:     'bg-blue-400/10 text-blue-400',
  GOOGLE:   'bg-emerald-400/10 text-emerald-400',
  TIKTOK:   'bg-pink-400/10 text-pink-400',
  LINKEDIN: 'bg-blue-300/10 text-blue-300',
  YOUTUBE:  'bg-red-400/10 text-red-400',
  OTHER:    'bg-[#222222] text-[#6B6B6B]',
}

const STATUS_CONFIG: Record<string, { label: string; dot: string; text: string }> = {
  ACTIVE:    { label: 'Active',   dot: 'bg-emerald-400', text: 'text-emerald-400' },
  PAUSED:    { label: 'Paused',   dot: 'bg-amber-400',   text: 'text-amber-400'   },
  COMPLETED: { label: 'Complete', dot: 'bg-[#6B6B6B]',      text: 'text-[#6B6B6B]'      },
  DRAFT:     { label: 'Draft',    dot: 'bg-purple-400',  text: 'text-purple-400'  },
}

export default async function CampaignsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')

  const isAdmin = session.user.role === 'SUPER_ADMIN' || session.user.role === 'TEAM_MEMBER'
  let clientProfileId = session.user.clientProfileId

  if (isAdmin && !clientProfileId) {
    const first = await prisma.clientProfile.findFirst({ select: { id: true } })
    clientProfileId = first?.id || null
  }

  if (!clientProfileId) {
    return <div className="text-[#6B6B6B] text-sm">No client data available.</div>
  }

  const { rows, totalSpend, totalLeads, blendedRoas } =
    await getCampaignPageData(clientProfileId)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[#FFFFFF] tracking-wide">Campaigns</h1>
        <p className="text-[#6B6B6B] text-sm mt-1">Last 30 days · {rows.length} campaigns</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Active Campaigns', value: String(rows.filter(r => r.status === 'ACTIVE').length), gold: false },
          { label: 'Total Spend',      value: formatCurrency(totalSpend), gold: false },
          { label: 'Total Leads',      value: formatNumber(totalLeads),   gold: false },
        ].map(s => (
          <div key={s.label} className={s.gold ? 'atp-card-gold kpi-card' : 'kpi-card'}>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B6B6B] mb-1.5">{s.label}</p>
            <p className={`font-display font-bold text-xl ${s.gold ? 'gold-text' : 'text-[#FFFFFF]'}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="atp-card overflow-hidden">
        <div className="px-6 py-4 border-b border-[#222222]">
          <h2 className="font-display font-bold text-[#FFFFFF] tracking-wide">Campaign Breakdown</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full data-table">
            <thead>
              <tr>
                <th className="text-left">Campaign</th>
                <th className="text-left">Platform</th>
                <th className="text-right">Spend</th>
                <th className="text-right">Impr.</th>
                <th className="text-right">Clicks</th>
                <th className="text-right">CTR</th>
                <th className="text-right">CPC</th>
                <th className="text-right">Leads</th>
                <th className="text-right">CPL</th>
                <th className="text-right">Purchases</th>
                <th className="text-right">ROAS</th>
                <th className="text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(c => {
                const status    = STATUS_CONFIG[c.status] || STATUS_CONFIG.DRAFT
                const platClass = PLATFORM_BADGE[c.platform] || PLATFORM_BADGE.OTHER
                return (
                  <tr key={c.id}>
                    <td>
                      <p className="font-semibold text-[#FFFFFF] text-[13px] max-w-[200px] truncate">{c.name}</p>
                      {c.objective && <p className="text-[10px] text-[#6B6B6B] mt-0.5">{c.objective}</p>}
                    </td>
                    <td>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${platClass}`}>{c.platform}</span>
                    </td>
                    <td className="text-right font-semibold">{formatCurrency(c.spend)}</td>
                    <td className="text-right text-[#B3B3B3]">{formatNumber(c.impressions, true)}</td>
                    <td className="text-right text-[#B3B3B3]">{formatNumber(c.clicks, true)}</td>
                    <td className="text-right text-[#B3B3B3]">{formatPercent(c.ctr, 2)}</td>
                    <td className="text-right text-[#B3B3B3]">{formatCurrency(c.cpc)}</td>
                    <td className="text-right font-semibold text-[#D8D8D8]">{formatNumber(c.leads)}</td>
                    <td className="text-right text-[#B3B3B3]">{formatCurrency(c.cpl)}</td>
                    <td className="text-right text-[#B3B3B3]">{formatNumber(c.purchases)}</td>
                    <td className="text-right">
                      <span className={`font-display font-bold text-[15px] ${
                        c.roas >= 4 ? 'gold-text' : c.roas >= 2 ? 'text-[#D8D8D8]' : 'text-red-400'
                      }`}>{formatRoas(c.roas)}</span>
                    </td>
                    <td>
                      <span className={`flex items-center gap-1.5 text-[12px] font-semibold ${status.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                        {status.label}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

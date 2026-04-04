// src/app/(portal)/portal/creatives/page.tsx

import { getServerSession }       from 'next-auth'
import { authOptions }            from '@/lib/auth'
import { redirect }               from 'next/navigation'
import { prisma }                 from '@/lib/prisma'
import { getAdsPageData, getAdRank } from '@/lib/services/ads.service'
import { formatCurrency, formatPercent, formatNumber } from '@/lib/utils'
import { Image, Video, LayoutGrid, TrendingUp, TrendingDown } from 'lucide-react'

const TYPE_CONFIG = {
  IMAGE:    { label: 'Image',    icon: Image,      color: 'text-blue-400',   bg: 'bg-blue-400/8' },
  VIDEO:    { label: 'Video',    icon: Video,      color: 'text-purple-400', bg: 'bg-purple-400/8' },
  CAROUSEL: { label: 'Carousel', icon: LayoutGrid, color: 'text-amber-400',  bg: 'bg-amber-400/8' },
}

const STATUS_DOT: Record<string, string> = {
  ACTIVE:   'bg-emerald-400',
  PAUSED:   'bg-amber-400',
  ARCHIVED: 'bg-[#333]',
}

export default async function CreativesPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')

  const isAdmin = session.user.role === 'SUPER_ADMIN' || session.user.role === 'TEAM_MEMBER'
  let clientProfileId = session.user.clientProfileId

  if (isAdmin && !clientProfileId) {
    const first = await prisma.clientProfile.findFirst({ select: { id: true } })
    clientProfileId = first?.id || null
  }

  if (!clientProfileId) {
    return <div className="text-[#6B6B6B] text-sm p-4">No client data available.</div>
  }

  const { rows, accountAvgCtr, totalImpressions, totalLeads, blendedCtr } =
    await getAdsPageData(clientProfileId)

  const active   = rows.filter(r => r.status === 'ACTIVE')
  const paused   = rows.filter(r => r.status === 'PAUSED')
  const archived = rows.filter(r => r.status === 'ARCHIVED')

  // For the campaign summary table
  const campaigns = await prisma.campaign.findMany({
    where: { clientProfileId },
    select: { id: true, name: true, platform: true },
    orderBy: { createdAt: 'asc' },
  })

  if (rows.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#FFFFFF] tracking-wide">Creatives</h1>
          <p className="text-[#6B6B6B] text-sm mt-1">Ad creative performance across all campaigns</p>
        </div>
        <div className="atp-card p-12 text-center">
          <div className="w-12 h-12 bg-[rgba(212,175,55,0.08)] border border-[rgba(212,175,55,0.15)] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Image className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <p className="font-display font-bold text-[#FFFFFF] text-lg tracking-wide mb-2">No creatives yet</p>
          <p className="text-[#6B6B6B] text-sm max-w-xs mx-auto">Creative performance data will appear here once your ads are running.</p>
        </div>
      </div>
    )
  }

  const allGrouped = [
    { label: 'Active',   items: active },
    { label: 'Paused',   items: paused },
    { label: 'Archived', items: archived },
  ].filter(g => g.items.length > 0)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-[#FFFFFF] tracking-wide">Creatives</h1>
        <p className="text-[#6B6B6B] text-sm mt-1">
          {rows.length} creatives across {campaigns.length} campaigns
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Active Creatives',  value: String(active.length),                gold: false },
          { label: 'Total Impressions', value: formatNumber(totalImpressions, true),  gold: false },
          { label: 'Blended CTR',       value: formatPercent(blendedCtr, 2),          gold: false },
          { label: 'Total Leads',       value: formatNumber(totalLeads),              gold: true  },
        ].map(s => (
          <div key={s.label} className={s.gold ? 'atp-card-gold kpi-card' : 'kpi-card'}>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#6B6B6B] mb-1.5">{s.label}</p>
            <p className={`font-display font-bold text-xl leading-none ${s.gold ? 'gold-text' : 'text-[#FFFFFF]'}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {allGrouped.map(group => (
        <div key={group.label} className="space-y-3">
          <div className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[group.label.toUpperCase()] || 'bg-[#333]'}`} />
            <h2 className="font-display font-bold text-[#FFFFFF] tracking-wide">{group.label}</h2>
            <span className="text-[#333] text-[11px] font-bold">({group.items.length})</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {group.items.map(row => {
              const rank     = getAdRank(row, accountAvgCtr)
              const tCfg     = TYPE_CONFIG[row.type]
              const TypeIcon = tCfg.icon
              return (
                <div key={row.id} className="atp-card overflow-hidden flex flex-col">
                  <div className="relative h-[140px] bg-[#0C0C0C] border-b border-[#222222] flex items-center justify-center overflow-hidden">
                    <div className={`absolute inset-0 opacity-[0.04] ${
                      row.type === 'VIDEO'    ? 'bg-gradient-to-br from-purple-500 to-blue-500'
                      : row.type === 'CAROUSEL' ? 'bg-gradient-to-br from-amber-500 to-orange-500'
                      : 'bg-gradient-to-br from-blue-500 to-cyan-500'
                    }`} />
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${tCfg.bg} border-current/20`}>
                      <TypeIcon className={`w-5 h-5 ${tCfg.color}`} />
                    </div>
                    {rank === 'top' && (
                      <span className="absolute top-3 right-3 badge-gold text-[10px] flex items-center gap-1">
                        <TrendingUp className="w-2.5 h-2.5" /> Top
                      </span>
                    )}
                    {rank === 'low' && (
                      <span className="absolute top-3 right-3 badge-red text-[10px] flex items-center gap-1">
                        <TrendingDown className="w-2.5 h-2.5" /> Low
                      </span>
                    )}
                    <span className={`absolute top-3 left-3 text-[9px] font-bold px-2 py-0.5 rounded-md border ${tCfg.bg} ${tCfg.color} border-current/20`}>
                      {tCfg.label}
                    </span>
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <p className="text-[13px] font-semibold text-[#FFFFFF] leading-snug line-clamp-2 mb-1">
                      {row.headline || row.name}
                    </p>
                    <p className="text-[11px] text-[#6B6B6B] truncate mb-4">{row.campaignName}</p>
                    <div className="grid grid-cols-4 gap-1 mt-auto">
                      {[
                        { label: 'CTR',   value: formatPercent(row.ctr, 2) },
                        { label: 'CPC',   value: formatCurrency(row.cpc) },
                        { label: 'CPL',   value: row.leads > 0 ? formatCurrency(row.cpl) : '—' },
                        { label: 'Leads', value: formatNumber(row.leads) },
                      ].map(m => (
                        <div key={m.label} className="text-center">
                          <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#333] mb-0.5">{m.label}</p>
                          <p className="text-[12px] font-bold text-[#FFFFFF]">{m.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}

      {/* Campaign summary table */}
      {campaigns.length > 1 && (
        <div className="atp-card overflow-hidden">
          <div className="px-6 py-4 border-b border-[#222222]">
            <h2 className="font-display font-bold text-[#FFFFFF] tracking-wide">By Campaign</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full data-table">
              <thead>
                <tr>
                  <th className="text-left">Campaign</th>
                  <th className="text-right">Creatives</th>
                  <th className="text-right">Avg CTR</th>
                  <th className="text-right">Total Spend</th>
                  <th className="text-right">Total Leads</th>
                  <th className="text-right">Best CTR</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map(camp => {
                  const campCreatives = rows.filter(r => r.campaignId === camp.id)
                  if (campCreatives.length === 0) return null
                  const campAvgCtr = campCreatives.reduce((a, r) => a + r.ctr, 0) / campCreatives.length
                  const campSpend  = campCreatives.reduce((a, r) => a + r.spend, 0)
                  const campLeads  = campCreatives.reduce((a, r) => a + r.leads, 0)
                  const bestCtr    = Math.max(...campCreatives.map(r => r.ctr))
                  return (
                    <tr key={camp.id}>
                      <td>
                        <p className="text-[13px] font-semibold text-[#FFFFFF] max-w-[240px] truncate">{camp.name}</p>
                        <p className="text-[10px] text-[#333] mt-0.5">{camp.platform}</p>
                      </td>
                      <td className="text-right text-[#B3B3B3]">{campCreatives.length}</td>
                      <td className="text-right text-[#B3B3B3]">{formatPercent(campAvgCtr, 2)}</td>
                      <td className="text-right font-semibold">{formatCurrency(campSpend)}</td>
                      <td className="text-right font-semibold text-[#D8D8D8]">{formatNumber(campLeads)}</td>
                      <td className="text-right">
                        <span className="gold-text font-display font-bold text-[14px]">{formatPercent(bestCtr, 2)}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

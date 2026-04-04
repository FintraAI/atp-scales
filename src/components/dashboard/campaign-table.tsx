'use client'
// src/components/dashboard/campaign-table.tsx

import { formatCurrency, formatNumber, formatPercent, formatRoas } from '@/lib/utils'
import type { CampaignRow } from '@/types'

interface CampaignTableProps {
  campaigns: CampaignRow[]
}

const PLATFORM_COLORS: Record<string, string> = {
  META: 'text-blue-400 bg-blue-400/10',
  GOOGLE: 'text-emerald-400 bg-emerald-400/10',
  TIKTOK: 'text-pink-400 bg-pink-400/10',
  LINKEDIN: 'text-blue-300 bg-blue-300/10',
  YOUTUBE: 'text-red-400 bg-red-400/10',
  OTHER: 'text-gray-400 bg-gray-400/10',
}

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'text-emerald-400',
  PAUSED: 'text-amber-400',
  COMPLETED: 'text-gray-400',
  DRAFT: 'text-purple-400',
}

export function CampaignTable({ campaigns }: CampaignTableProps) {
  if (campaigns.length === 0) {
    return (
      <div className="bg-[#181818] border border-[#1e1e1e] rounded-2xl p-8 text-center">
        <p className="text-[#6B6B6B] text-sm">No campaigns found for this period.</p>
      </div>
    )
  }

  return (
    <div className="bg-[#181818] border border-[#1e1e1e] rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e1e1e]">
        <h2 className="font-display font-semibold text-white text-base">Campaign Performance</h2>
        <span className="text-[#6B6B6B] text-xs">{campaigns.length} campaigns · Last 30 days</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full data-table">
          <thead>
            <tr>
              <th className="text-left">Campaign</th>
              <th className="text-left">Platform</th>
              <th className="text-right">Spend</th>
              <th className="text-right">Impressions</th>
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
            {campaigns.map((c) => (
              <tr key={c.id}>
                <td>
                  <div className="max-w-[200px]">
                    <p className="font-medium text-white text-[13px] truncate">{c.name}</p>
                    {c.objective && (
                      <p className="text-[11px] text-[#6B6B6B] mt-0.5">{c.objective}</p>
                    )}
                  </div>
                </td>
                <td>
                  <span className={`text-[11px] font-semibold px-2 py-1 rounded-md ${PLATFORM_COLORS[c.platform] || PLATFORM_COLORS.OTHER}`}>
                    {c.platform}
                  </span>
                </td>
                <td className="text-right font-semibold">{formatCurrency(c.spend)}</td>
                <td className="text-right text-[#B3B3B3]">{formatNumber(c.impressions, true)}</td>
                <td className="text-right text-[#B3B3B3]">{formatNumber(c.clicks, true)}</td>
                <td className="text-right text-[#B3B3B3]">{formatPercent(c.ctr, 2)}</td>
                <td className="text-right text-[#B3B3B3]">{formatCurrency(c.cpc)}</td>
                <td className="text-right font-medium text-blue-400">{formatNumber(c.leads)}</td>
                <td className="text-right text-[#B3B3B3]">{formatCurrency(c.cpl)}</td>
                <td className="text-right text-[#B3B3B3]">{formatNumber(c.purchases)}</td>
                <td className="text-right">
                  <span className={`font-bold font-display ${c.roas >= 3 ? 'text-[#c8ff00]' : c.roas >= 1.5 ? 'text-amber-400' : 'text-red-400'}`}>
                    {formatRoas(c.roas)}
                  </span>
                </td>
                <td>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${c.status === 'ACTIVE' ? 'bg-emerald-400' : c.status === 'PAUSED' ? 'bg-amber-400' : 'bg-gray-500'}`} />
                    <span className={`text-[12px] font-medium ${STATUS_COLORS[c.status] || 'text-gray-400'}`}>
                      {c.status.charAt(0) + c.status.slice(1).toLowerCase()}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

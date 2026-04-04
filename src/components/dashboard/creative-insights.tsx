'use client'
// src/components/dashboard/creative-insights.tsx
// Top performing creative assets from Meta breakdown fields:
// title_asset, body_asset, call_to_action_asset, image_asset, video_asset

import { useState } from 'react'
import { Type, AlignLeft, MousePointer, Image, Video } from 'lucide-react'
import { formatCurrency, formatPercent } from '@/lib/utils'
import type { CreativeAssetRow } from '@/types'

const ASSET_CONFIG = {
  title: { label: 'Headlines',   icon: Type,          color: 'text-[#D4AF37]',  bg: 'bg-[rgba(212,175,55,0.08)]' },
  body:  { label: 'Body Copy',   icon: AlignLeft,     color: 'text-blue-400',    bg: 'bg-blue-400/[0.08]' },
  cta:   { label: 'CTAs',        icon: MousePointer,  color: 'text-emerald-400', bg: 'bg-emerald-400/[0.08]' },
  image: { label: 'Images',      icon: Image,         color: 'text-purple-400',  bg: 'bg-purple-400/[0.08]' },
  video: { label: 'Videos',      icon: Video,         color: 'text-pink-400',    bg: 'bg-pink-400/[0.08]' },
} as const

type AssetType = keyof typeof ASSET_CONFIG

export function CreativeInsights({
  rows,
  simplified = false,
}: {
  rows: CreativeAssetRow[]
  simplified?: boolean
}) {
  const availableTypes = [...new Set(rows.map(r => r.assetType))] as AssetType[]
  const [activeType, setActiveType] = useState<AssetType>(availableTypes[0] ?? 'title')

  const filtered = rows
    .filter(r => r.assetType === activeType)
    .slice(0, simplified ? 3 : 5)

  if (rows.length === 0) return null

  return (
    <div className="atp-card p-6">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="font-display font-bold text-white text-base tracking-wide">Creative Insights</h2>
          <p className="text-[#6B6B6B] text-[11px] mt-0.5">
            {simplified ? 'Top performing assets' : 'Asset performance by type · Last 30 days'}
          </p>
        </div>
      </div>

      {/* Asset type tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {availableTypes.map(type => {
          const cfg  = ASSET_CONFIG[type]
          const Icon = cfg.icon
          return (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all border ${
                activeType === type
                  ? `${cfg.color} ${cfg.bg} border-current/20`
                  : 'text-[#6B6B6B] bg-transparent border-[#222] hover:border-[#333]'
              }`}
            >
              <Icon className="w-3 h-3" />
              {cfg.label}
            </button>
          )
        })}
      </div>

      {/* Asset rows */}
      <div className="space-y-2">
        {filtered.map((row, i) => {
          const cfg     = ASSET_CONFIG[row.assetType as AssetType]
          const maxLeads = filtered[0]?.leads ?? 1
          const barPct   = maxLeads > 0 ? (row.leads / maxLeads) * 100 : 0

          return (
            <div key={row.id} className="group">
              <div className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-white/[0.02] transition-colors">
                {/* Rank */}
                <span className={`text-[11px] font-bold w-4 shrink-0 ${i === 0 ? 'text-[#D4AF37]' : 'text-[#333]'}`}>
                  {i + 1}
                </span>

                {/* Asset value */}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-[#D8D8D8] truncate font-medium leading-snug">
                    {row.assetValue}
                  </p>
                  {/* Bar */}
                  <div className="h-1 bg-[#1A1A1A] rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${barPct}%`,
                        background: i === 0 ? '#D4AF37' : 'rgba(212,175,55,0.35)',
                      }}
                    />
                  </div>
                </div>

                {/* Metrics */}
                <div className="flex items-center gap-4 shrink-0 text-right">
                  <div>
                    <p className="text-[11px] text-[#6B6B6B]">Leads</p>
                    <p className={`text-[13px] font-bold ${i === 0 ? 'text-white' : 'text-[#B3B3B3]'}`}>{row.leads}</p>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-[11px] text-[#6B6B6B]">CTR</p>
                    <p className="text-[13px] font-bold text-[#B3B3B3]">{formatPercent(row.ctr, 2)}</p>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-[11px] text-[#6B6B6B]">CPL</p>
                    <p className={`text-[13px] font-bold ${i === 0 ? 'text-[#D4AF37]' : 'text-[#B3B3B3]'}`}>
                      {formatCurrency(row.cpl)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {!simplified && filtered.length === 0 && (
        <p className="text-[#6B6B6B] text-sm text-center py-6">No {activeType} asset data available.</p>
      )}
    </div>
  )
}

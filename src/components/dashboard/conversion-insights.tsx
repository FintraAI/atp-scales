'use client'
// src/components/dashboard/conversion-insights.tsx
// Action type breakdown from Meta action_type field.
// Shows what conversions are happening and where users are going.

import { formatNumber, formatCurrency } from '@/lib/utils'
import type { ConversionActionRow } from '@/types'
import { Sparkles } from 'lucide-react'

const COLORS = [
  '#D4AF37', '#D8D8D8', 'rgba(212,175,55,0.65)', 'rgba(212,175,55,0.45)',
  'rgba(216,216,216,0.5)', 'rgba(212,175,55,0.3)', 'rgba(216,216,216,0.3)',
]

export function ConversionInsights({
  rows,
  simplified = false,
}: {
  rows: ConversionActionRow[]
  simplified?: boolean
}) {
  if (rows.length === 0) return null

  const displayRows = simplified ? rows.slice(0, 5) : rows
  const maxCount    = displayRows[0]?.count ?? 1
  const totalCount  = displayRows.reduce((a, r) => a + r.count, 0)
  const totalValue  = displayRows.reduce((a, r) => a + r.value, 0)

  return (
    <div className="atp-card p-6">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="font-display font-bold text-white text-base tracking-wide">Conversion Actions</h2>
          <p className="text-[#6B6B6B] text-[11px] mt-0.5">
            What's happening after your ads · Last 30 days
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-[#6B6B6B] font-bold uppercase tracking-wider">Total</p>
          <p className="text-white font-display font-bold text-base">{formatNumber(totalCount)}</p>
          {totalValue > 0 && (
            <p className="text-[11px] text-[#D4AF37]">{formatCurrency(totalValue)} value</p>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {displayRows.map((row, i) => {
          const color  = COLORS[i] ?? COLORS[COLORS.length - 1]
          const barPct = maxCount > 0 ? (row.count / maxCount) * 100 : 0

          return (
            <div key={row.actionType}>
              <div className="flex items-center gap-3 mb-1">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-[13px] text-[#D8D8D8] font-medium truncate">
                      {row.actionLabel}
                    </p>
                    {row.isModeled && (
                      <span className="shrink-0 flex items-center gap-0.5 text-[9px] text-[#6B6B6B] bg-[#1A1A1A] border border-[#222] px-1.5 py-0.5 rounded-md font-semibold">
                        <Sparkles className="w-2.5 h-2.5" />
                        modeled
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0 text-right">
                  <span className="text-[13px] font-bold text-white">{formatNumber(row.count)}</span>
                  <span className="text-[11px] text-[#6B6B6B] w-10">
                    {(row.share * 100).toFixed(1)}%
                  </span>
                  {row.value > 0 && (
                    <span className="text-[12px] text-[#D4AF37] font-semibold hidden sm:block">
                      {formatCurrency(row.value)}
                    </span>
                  )}
                </div>
              </div>
              <div className="h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${barPct}%`, background: color }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Modeled conversion note */}
      {rows.some(r => r.isModeled) && (
        <p className="mt-4 flex items-center gap-1.5 text-[11px] text-[#333]">
          <Sparkles className="w-3 h-3" />
          Modeled conversions use statistical signals to estimate results where direct measurement is limited.
        </p>
      )}
    </div>
  )
}

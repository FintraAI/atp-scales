'use client'
// src/components/dashboard/hourly-performance.tsx
// Bar chart showing lead volume and spend by hour of day.
// Maps: hourly_stats_aggregated_by_advertiser_time_zone

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, ReferenceLine,
} from 'recharts'
import { formatCurrency } from '@/lib/utils'
import type { HourlyPerformanceRow } from '@/types'

const GOLD = '#D4AF37'

const Tip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#0A0A0A] border border-[#262626] rounded-xl p-3 shadow-2xl text-[12px] min-w-[140px]">
      <p className="text-[#6B6B6B] text-[10px] font-bold uppercase tracking-wider mb-2">{label}</p>
      {payload.map((e: any) => (
        <div key={e.name} className="flex justify-between gap-3 items-center mb-0.5">
          <span className="text-[#B3B3B3]">{e.name}</span>
          <span className="font-bold text-white">{e.value}</span>
        </div>
      ))}
    </div>
  )
}

export function HourlyPerformance({ rows }: { rows: HourlyPerformanceRow[] }) {
  if (rows.length === 0) return null

  const maxLeads   = Math.max(...rows.map(r => r.leads), 1)
  const topRow     = rows.reduce((best, r) => r.leads > best.leads ? r : best, rows[0])
  const avgLeads   = rows.reduce((a, r) => a + r.leads, 0) / rows.length

  // Show every 3rd label on X-axis to avoid clutter
  const tickFormatter = (v: string, i: number) => i % 3 === 0 ? v : ''

  return (
    <div className="atp-card p-6">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="font-display font-bold text-white text-base tracking-wide">Best Performing Hours</h2>
          <p className="text-[#6B6B6B] text-[11px] mt-0.5">Lead volume by hour · Advertiser timezone</p>
        </div>
        {topRow && (
          <div className="text-right">
            <p className="text-[10px] text-[#6B6B6B] font-bold uppercase tracking-wider">Peak Hour</p>
            <p className="text-[#D4AF37] font-display font-bold text-base">{topRow.label}</p>
            <p className="text-[11px] text-[#6B6B6B]">{topRow.leads} leads · {formatCurrency(topRow.spend)}</p>
          </div>
        )}
      </div>

      <div className="h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barSize={8}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: '#6B6B6B', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={tickFormatter}
            />
            <YAxis tick={{ fill: '#6B6B6B', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip content={<Tip />} />
            <ReferenceLine
              y={avgLeads}
              stroke="rgba(212,175,55,0.25)"
              strokeDasharray="4 2"
            />
            <Bar dataKey="leads" name="Leads" radius={[3, 3, 0, 0]}>
              {rows.map(r => (
                <Cell
                  key={r.hour}
                  fill={r.hour === topRow.hour
                    ? GOLD
                    : `rgba(212,175,55,${0.15 + (r.leads / maxLeads) * 0.45})`
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top 3 hours summary */}
      <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-[#1A1A1A]">
        {[...rows].sort((a, b) => b.leads - a.leads).slice(0, 3).map((r, i) => (
          <div key={r.hour} className="text-center">
            <p className={`text-[11px] font-bold ${i === 0 ? 'text-[#D4AF37]' : 'text-[#6B6B6B]'}`}>
              #{i + 1} · {r.label}
            </p>
            <p className="text-[13px] font-bold text-white">{r.leads} leads</p>
            <p className="text-[11px] text-[#6B6B6B]">{formatCurrency(r.cpl)} CPL</p>
          </div>
        ))}
      </div>
    </div>
  )
}

'use client'
// src/components/dashboard/client-comparison.tsx
// Admin-only — ranks all clients by key performance metrics.

import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts'
import { formatCurrency, formatPercent } from '@/lib/utils'
import type { ClientComparisonRow } from '@/types'

const GOLD = '#D4AF37'

const Tip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#0A0A0A] border border-[#262626] rounded-xl p-3 shadow-2xl text-[12px] min-w-[160px]">
      <p className="text-white font-semibold mb-1 truncate max-w-[150px]">{label}</p>
      {payload.map((e: any) => (
        <div key={e.name} className="flex justify-between gap-3">
          <span className="text-[#6B6B6B]">{e.name}</span>
          <span className="font-bold text-[#D4AF37]">{e.value}</span>
        </div>
      ))}
    </div>
  )
}

type Metric = 'spend' | 'leads' | 'cpl'

const METRIC_CONFIG: Record<Metric, { label: string; format: (v: number) => string; higher: 'better' | 'worse' }> = {
  spend: { label: 'Ad Spend',    format: v => formatCurrency(v, true), higher: 'better' },
  leads: { label: 'Leads',       format: v => v.toString(),            higher: 'better' },
  cpl:   { label: 'Cost / Lead', format: v => formatCurrency(v),       higher: 'worse'  },
}

export function ClientComparison({ rows }: { rows: ClientComparisonRow[] }) {
  const [metric, setMetric] = useState<Metric>('spend')

  if (rows.length === 0) return null

  const cfg = METRIC_CONFIG[metric]

  // Sort: for CPL lower = better (sort asc); for others, desc
  const sorted = [...rows]
    .filter(r => r[metric] > 0)
    .sort((a, b) => cfg.higher === 'better' ? b[metric] - a[metric] : a[metric] - b[metric])
    .slice(0, 8)

  const best = sorted[0]
  const maxVal = Math.max(...sorted.map(r => r[metric]), 1)

  const chartData = sorted.map(r => ({
    name:  r.companyName.length > 14 ? r.companyName.slice(0, 12) + '…' : r.companyName,
    full:  r.companyName,
    value: r[metric],
    fmt:   cfg.format(r[metric]),
  }))

  return (
    <div className="atp-card p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-display font-bold text-white text-base tracking-wide">Client Comparison</h2>
          <p className="text-[#6B6B6B] text-[11px] mt-0.5">Ranked by {cfg.label.toLowerCase()} · Last 30 days</p>
        </div>
        <div className="flex gap-1 bg-[#0C0C0C] p-1 rounded-lg border border-[#222]">
          {(Object.keys(METRIC_CONFIG) as Metric[]).map(m => (
            <button
              key={m}
              onClick={() => setMetric(m)}
              className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all ${
                metric === m ? 'bg-[#D4AF37] text-black' : 'text-[#6B6B6B] hover:text-[#B3B3B3]'
              }`}
            >
              {METRIC_CONFIG[m].label}
            </button>
          ))}
        </div>
      </div>

      {/* Bar chart */}
      <div className="h-[200px] mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }} barSize={24}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: '#6B6B6B', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis
              tick={{ fill: '#6B6B6B', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={v => cfg.format(v).replace(' ', '')}
              width={52}
            />
            <Tooltip
              content={<Tip />}
              formatter={(v: number) => [cfg.format(v), cfg.label]}
            />
            <Bar dataKey="value" name={cfg.label} radius={[3, 3, 0, 0]}>
              {chartData.map((d, i) => (
                <Cell
                  key={d.name}
                  fill={i === 0 ? GOLD : `rgba(212,175,55,${0.5 - i * 0.05})`}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Ranked list */}
      <div className="space-y-1.5 border-t border-[#1A1A1A] pt-4">
        {sorted.slice(0, 5).map((r, i) => (
          <div key={r.clientId} className="flex items-center gap-3">
            <span className={`text-[11px] font-bold w-4 ${i === 0 ? 'text-[#D4AF37]' : 'text-[#333]'}`}>
              {i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <p className="text-[12px] text-[#D8D8D8] font-medium truncate">{r.companyName}</p>
                <span className={`text-[13px] font-bold shrink-0 ml-2 ${i === 0 ? 'text-[#D4AF37]' : 'text-white'}`}>
                  {cfg.format(r[metric])}
                </span>
              </div>
              <div className="h-1 bg-[#1A1A1A] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(r[metric] / maxVal) * 100}%`,
                    background: i === 0 ? GOLD : `rgba(212,175,55,${0.4 - i * 0.06})`,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

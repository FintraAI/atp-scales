'use client'
// src/components/dashboard/performance-charts.tsx

import { useState } from 'react'
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import type { ChartDataPoint } from '@/types'

const GOLD = '#D4AF37'
const TEAL = '#2DD4BF'

const Tip = ({ active, payload, label, formatter }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#0A0A0A] border border-[#262626] rounded-xl p-3 shadow-2xl text-[12px] min-w-[150px]">
      <p className="text-[#6B6B6B] uppercase tracking-wider text-[10px] font-bold mb-2">{label}</p>
      {payload.map((e: any) => (
        <div key={e.name} className="flex justify-between gap-4 items-center mb-0.5">
          <span className="flex items-center gap-1.5 text-[#B3B3B3]">
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: e.color }} />
            {e.name}
          </span>
          <span className="font-bold text-[#FFFFFF]">
            {formatter ? formatter(e.name, e.value) : e.value}
          </span>
        </div>
      ))}
    </div>
  )
}

const fmtCurrency = (v: number) => v >= 1000 ? `$${(v / 1000).toFixed(1)}k` : `$${v.toFixed(0)}`
const fmtCpl      = (v: number) => `$${v.toFixed(0)}`

const TABS = [
  { id: 'revenue', label: 'Ad Spend' },
  { id: 'leads',   label: 'Leads' },
  { id: 'cpl',     label: 'CPL Trend' },
]

export function PerformanceCharts({ chartData }: { chartData: ChartDataPoint[] }) {
  const [tab, setTab] = useState('revenue')

  // Compute avg CPL for reference line
  const cplValues = chartData.map(d => d.cpl ?? 0).filter(v => v > 0)
  const avgCpl = cplValues.length > 0 ? cplValues.reduce((a, v) => a + v, 0) / cplValues.length : 0

  return (
    <div className="atp-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display font-bold text-[#FFFFFF] text-lg tracking-wide">Performance Trends</h2>
        <div className="flex gap-1 bg-[#0C0C0C] p-1 rounded-lg border border-[#222222]">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-3 py-1.5 rounded-md text-[11px] font-semibold transition-all ${
                tab === t.id ? 'bg-[#D4AF37] text-black' : 'text-[#6B6B6B] hover:text-[#B3B3B3]'
              }`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[250px]">
        {tab === 'revenue' && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="spendG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={GOLD} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={GOLD} stopOpacity={0}   />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fill: '#6B6B6B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6B6B6B', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={fmtCurrency} />
              <Tooltip content={<Tip formatter={(_: string, v: number) => fmtCurrency(v)} />} />
              <Area type="monotone" dataKey="adSpend" name="Ad Spend" stroke={GOLD} strokeWidth={2} fill="url(#spendG)" />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {tab === 'leads' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fill: '#6B6B6B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6B6B6B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<Tip />} />
              <Bar dataKey="leads" name="Leads" fill={GOLD} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}

        {tab === 'cpl' && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="cplG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={TEAL} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={TEAL} stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fill: '#6B6B6B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6B6B6B', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={fmtCpl} />
              <Tooltip content={<Tip formatter={(_: string, v: number) => fmtCpl(v)} />} />
              {avgCpl > 0 && (
                <ReferenceLine y={avgCpl} stroke={GOLD} strokeDasharray="4 2" strokeOpacity={0.5}
                  label={{ value: `Avg $${avgCpl.toFixed(0)}`, fill: '#D4AF37', fontSize: 10, position: 'insideTopRight' }} />
              )}
              <Line type="monotone" dataKey="cpl" name="CPL" stroke={TEAL} strokeWidth={2.5} dot={false}
                activeDot={{ r: 5, fill: TEAL, stroke: '#050505', strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}

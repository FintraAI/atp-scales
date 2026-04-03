'use client'
// src/components/dashboard/performance-charts.tsx — ATP gold theme

import { useState } from 'react'
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import type { ChartDataPoint } from '@/types'

const GOLD   = '#C9A84C'
const SILVER = '#D8D8D8'
const DIM    = '#555555'

const Tip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#111] border border-[#262626] rounded-xl p-3 shadow-2xl text-[12px] min-w-[140px]">
      <p className="text-[#555] uppercase tracking-wider text-[10px] font-bold mb-2">{label}</p>
      {payload.map((e: any) => (
        <div key={e.name} className="flex justify-between gap-4 items-center">
          <span className="flex items-center gap-1.5 text-[#888]">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: e.color }} />
            {e.name}
          </span>
          <span className="font-bold text-[#EBEBEB]">{
            typeof e.value === 'number' && e.name !== 'ROAS'
              ? e.value.toLocaleString()
              : typeof e.value === 'number'
              ? `${e.value.toFixed(2)}x`
              : e.value
          }</span>
        </div>
      ))}
    </div>
  )
}

const TABS = [
  { id: 'revenue', label: 'Spend vs Revenue' },
  { id: 'roas',    label: 'ROAS' },
  { id: 'leads',   label: 'Leads & Appts' },
]

export function PerformanceCharts({ chartData }: { chartData: ChartDataPoint[] }) {
  const [tab, setTab] = useState('revenue')

  return (
    <div className="atp-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display font-bold text-[#EBEBEB] text-lg tracking-wide">Performance Trends</h2>
        <div className="flex gap-1 bg-[#0C0C0C] p-1 rounded-lg border border-[#1C1C1C]">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-3 py-1.5 rounded-md text-[11px] font-semibold transition-all ${
                tab === t.id ? 'bg-[#C9A84C] text-black' : 'text-[#555] hover:text-[#888]'
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
                  <stop offset="5%"  stopColor={DIM}  stopOpacity={0.2} />
                  <stop offset="95%" stopColor={DIM}  stopOpacity={0}   />
                </linearGradient>
                <linearGradient id="revG"   x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={GOLD} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={GOLD} stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fill:'#444', fontSize:11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:'#444', fontSize:11 }} axisLine={false} tickLine={false} tickFormatter={v=>`$${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<Tip />} />
              <Area type="monotone" dataKey="adSpend" name="Ad Spend" stroke={DIM}  strokeWidth={1.5} fill="url(#spendG)" />
              <Area type="monotone" dataKey="revenue" name="Revenue"  stroke={GOLD} strokeWidth={2}   fill="url(#revG)"   />
            </AreaChart>
          </ResponsiveContainer>
        )}
        {tab === 'roas' && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fill:'#444', fontSize:11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:'#444', fontSize:11 }} axisLine={false} tickLine={false} tickFormatter={v=>`${v.toFixed(1)}x`} />
              <Tooltip content={<Tip />} />
              <Line type="monotone" dataKey="roas" name="ROAS" stroke={GOLD} strokeWidth={2.5} dot={false}
                activeDot={{ r:5, fill: GOLD, stroke:'#060606', strokeWidth:2 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
        {tab === 'leads' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fill:'#444', fontSize:11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:'#444', fontSize:11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<Tip />} />
              <Bar dataKey="leads"        name="Leads"        fill={SILVER} radius={[3,3,0,0]} opacity={0.7} />
              <Bar dataKey="appointments" name="Appointments" fill={GOLD}   radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}

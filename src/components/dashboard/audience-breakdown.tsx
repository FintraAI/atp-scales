'use client'
// src/components/dashboard/audience-breakdown.tsx
// Age, gender, and country breakdown charts powered by Meta breakdown fields.

import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts'
import { formatCurrency, formatPercent } from '@/lib/utils'
import type { AudienceBreakdown, AudienceAgeRow, AudienceGenderRow, GeoCountryRow } from '@/types'

const GOLD   = '#D4AF37'
const SILVER = '#D8D8D8'
const DIM    = '#444444'

const Tip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#0A0A0A] border border-[#262626] rounded-xl p-3 shadow-2xl text-[12px] min-w-[160px]">
      <p className="text-[#6B6B6B] text-[10px] font-bold uppercase tracking-wider mb-2">{label}</p>
      {payload.map((e: any) => (
        <div key={e.name} className="flex justify-between gap-4 items-center mb-0.5">
          <span className="flex items-center gap-1.5 text-[#B3B3B3]">
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: e.color }} />
            {e.name}
          </span>
          <span className="font-bold text-white">{e.value}</span>
        </div>
      ))}
    </div>
  )
}

const TABS = [
  { id: 'age',     label: 'Age' },
  { id: 'gender',  label: 'Gender' },
  { id: 'country', label: 'Country' },
]

// Highlight the best-performing age segment (lowest CPL with meaningful leads)
function bestAgeRange(rows: AudienceAgeRow[]): string | null {
  const withLeads = rows.filter(r => r.leads > 0)
  if (!withLeads.length) return null
  return [...withLeads].sort((a, b) => a.cpl - b.cpl)[0].ageRange
}

export function AudienceBreakdown({ data }: { data: AudienceBreakdown }) {
  const [tab, setTab] = useState<'age' | 'gender' | 'country'>('age')
  const best = bestAgeRange(data.age)

  return (
    <div className="atp-card p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-display font-bold text-white text-base tracking-wide">Audience Insights</h2>
          <p className="text-[#6B6B6B] text-[11px] mt-0.5">Breakdown by {tab} · Last 30 days</p>
        </div>
        <div className="flex gap-1 bg-[#0C0C0C] p-1 rounded-lg border border-[#222]">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id as any)}
              className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all ${
                tab === t.id ? 'bg-[#D4AF37] text-black' : 'text-[#6B6B6B] hover:text-[#B3B3B3]'
              }`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === 'age' && <AgeChart rows={data.age} best={best} />}
      {tab === 'gender' && <GenderChart rows={data.gender} />}
      {tab === 'country' && <CountryChart rows={data.countries} />}
    </div>
  )
}

// ─── Age Chart ────────────────────────────────────────────────────────────────

function AgeChart({ rows, best }: { rows: AudienceAgeRow[]; best: string | null }) {
  const data = rows.map(r => ({
    name: r.ageRange,
    Leads: r.leads,
    Spend: Math.round(r.spend),
    CPL:   Math.round(r.cpl),
  }))

  return (
    <div className="space-y-4">
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 40, left: 8, bottom: 0 }} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
            <XAxis type="number" tick={{ fill: '#6B6B6B', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" tick={{ fill: '#B3B3B3', fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
            <Tooltip content={<Tip />} />
            <Bar dataKey="Leads" radius={[0, 3, 3, 0]} barSize={10}>
              {data.map(d => (
                <Cell key={d.name} fill={d.name === best ? GOLD : DIM} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary stats row */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#1A1A1A]">
        {rows.slice(0, 3).map(r => (
          <div key={r.ageRange} className="text-center">
            <p className={`text-[11px] font-bold ${r.ageRange === best ? 'text-[#D4AF37]' : 'text-[#B3B3B3]'}`}>{r.ageRange}</p>
            <p className="text-[13px] font-bold text-white">{r.leads} leads</p>
            <p className="text-[11px] text-[#6B6B6B]">{formatCurrency(r.cpl)} CPL</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Gender Chart ─────────────────────────────────────────────────────────────

function GenderChart({ rows }: { rows: AudienceGenderRow[] }) {
  return (
    <div className="space-y-3">
      {rows.map((r, i) => {
        const color = i === 0 ? GOLD : i === 1 ? SILVER : DIM
        return (
          <div key={r.gender} className="space-y-1">
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-[#B3B3B3] font-medium">{r.label}</span>
              <div className="flex items-center gap-4 text-[#6B6B6B]">
                <span>{r.leads} leads</span>
                <span>{formatCurrency(r.cpl)} CPL</span>
                <span className="text-white font-semibold">{formatPercent(r.share)}</span>
              </div>
            </div>
            <div className="h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${r.share * 100}%`, background: color }}
              />
            </div>
          </div>
        )
      })}

      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#1A1A1A]">
        {rows.map((r, i) => {
          const color = i === 0 ? 'text-[#D4AF37]' : i === 1 ? 'text-[#D8D8D8]' : 'text-[#6B6B6B]'
          return (
            <div key={r.gender} className="text-center">
              <p className={`text-[11px] font-bold ${color}`}>{r.label}</p>
              <p className="text-[13px] font-bold text-white">{formatPercent(r.ctr, 2)} CTR</p>
              <p className="text-[11px] text-[#6B6B6B]">{formatCurrency(r.spend)} spend</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Country Chart ─────────────────────────────────────────────────────────────

function CountryChart({ rows }: { rows: GeoCountryRow[] }) {
  const top5 = rows.slice(0, 5)
  const maxLeads = Math.max(...top5.map(r => r.leads), 1)

  return (
    <div className="space-y-2.5">
      {top5.map((r, i) => (
        <div key={r.countryCode} className="space-y-1">
          <div className="flex items-center justify-between text-[12px]">
            <span className="text-[#D8D8D8] font-medium flex items-center gap-2">
              <span className="text-[10px] text-[#6B6B6B] w-4 text-right">{i + 1}</span>
              {r.country}
            </span>
            <div className="flex items-center gap-3 text-[#6B6B6B]">
              <span>{r.leads} leads</span>
              <span className="text-white font-semibold">{formatCurrency(r.cpl)} CPL</span>
            </div>
          </div>
          <div className="h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${(r.leads / maxLeads) * 100}%`,
                background: i === 0 ? GOLD : `rgba(212,175,55,${0.6 - i * 0.1})`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

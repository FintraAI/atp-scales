'use client'
// src/components/dashboard/kpi-cards.tsx — ATP gold/silver brand theme

<<<<<<< HEAD
import { TrendingUp, TrendingDown, DollarSign, Target, Users, Calendar, Percent, Zap, PhoneCall, BarChart2 } from 'lucide-react'
import { formatCurrency, formatNumber, formatPercent, formatRoas } from '@/lib/utils'
=======
import { TrendingUp, TrendingDown, DollarSign, Target, Users } from 'lucide-react'
import { formatCurrency, formatNumber } from '@/lib/utils'
>>>>>>> dashboard-refactor
import type { KPIData } from '@/types'

export function KPICards({ kpis }: { kpis: KPIData }) {
  const cards = [
<<<<<<< HEAD
    { label: 'Ad Spend',       value: formatCurrency(kpis.adSpend),            change: kpis.adSpendChange,  icon: DollarSign, gold: false },
    { label: 'Revenue',        value: formatCurrency(kpis.revenue),             change: kpis.revenueChange,  icon: TrendingUp, gold: true  },
    { label: 'ROAS',           value: formatRoas(kpis.roas),                    change: kpis.roasChange,     icon: Zap,        gold: true  },
    { label: 'Leads',          value: formatNumber(kpis.leads),                 change: kpis.leadsChange,    icon: Users,      gold: false },
    { label: 'Cost Per Lead',  value: formatCurrency(kpis.costPerLead),         change: kpis.leadsChange ? -kpis.leadsChange : undefined, icon: Target,    gold: false },
    { label: 'Appointments',   value: formatNumber(kpis.appointments),          icon: Calendar,   gold: false },
    { label: 'Cost / Appt',    value: formatCurrency(kpis.costPerAppointment),  icon: PhoneCall,  gold: false },
    { label: 'Conv. Rate',     value: formatPercent(kpis.conversionRate),       icon: Percent,    gold: false },
  ]
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
=======
    { label: 'Ad Spend',      value: formatCurrency(kpis.adSpend),    change: kpis.adSpendChange, icon: DollarSign, gold: false },
    { label: 'Leads',         value: formatNumber(kpis.leads),         change: kpis.leadsChange,   icon: Users,      gold: false },
    { label: 'Cost Per Lead', value: formatCurrency(kpis.costPerLead), change: kpis.leadsChange ? -kpis.leadsChange : undefined, icon: Target, gold: false },
  ]
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
>>>>>>> dashboard-refactor
      {cards.map(c => <KPICard key={c.label} {...c} />)}
    </div>
  )
}

function KPICard({ label, value, change, icon: Icon, gold }: {
  label: string; value: string; change?: number; icon: React.ElementType; gold: boolean
}) {
  const hasChange = change !== undefined && Math.abs(change) >= 0.4
  const up = (change || 0) > 0
  return (
    <div className={gold ? 'atp-card-gold kpi-card' : 'kpi-card'}>
      <div className="flex items-start justify-between mb-3">
        <div className={`p-1.5 rounded-lg ${gold ? 'bg-[rgba(212,175,55,0.1)]' : 'bg-[rgba(255,255,255,0.04)]'}`}>
          <Icon className={`w-3.5 h-3.5 ${gold ? 'text-[#D4AF37]' : 'text-[#6B6B6B]'}`} />
        </div>
        {hasChange && (
          <span className={`flex items-center gap-0.5 text-[11px] font-bold ${up ? 'text-[#00D278]' : 'text-[#FF5A5A]'}`}>
            {up ? <TrendingUp className="w-3 h-3"/> : <TrendingDown className="w-3 h-3"/>}
            {Math.abs(change!).toFixed(1)}%
          </span>
        )}
      </div>
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#6B6B6B] mb-1.5">{label}</p>
      <p className={`text-[20px] font-display font-bold leading-none ${gold ? 'gold-text' : 'text-[#FFFFFF]'}`}>{value}</p>
    </div>
  )
}

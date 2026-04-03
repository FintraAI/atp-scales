// src/components/dashboard/insights-feed.tsx
// UI component only — business logic lives in src/lib/metrics.ts

import { TrendingUp, AlertTriangle, WifiOff, TrendingDown } from 'lucide-react'
import type { Insight } from '@/lib/metrics'

export type { Insight } from '@/lib/metrics'
export { computeInsights } from '@/lib/metrics'

const CONFIG = {
  winning:  { icon: TrendingUp,    color: 'text-emerald-400', bg: 'bg-emerald-400/[0.07]', border: 'border-emerald-400/20' },
  warning:  { icon: AlertTriangle, color: 'text-amber-400',   bg: 'bg-amber-400/[0.07]',   border: 'border-amber-400/20'   },
  critical: { icon: WifiOff,       color: 'text-red-400',     bg: 'bg-red-400/[0.07]',     border: 'border-red-400/20'     },
  info:     { icon: TrendingDown,  color: 'text-[#666]',      bg: 'bg-[#111]',             border: 'border-[#1C1C1C]'      },
}

export function InsightsFeed({ insights }: { insights: Insight[] }) {
  if (insights.length === 0) return null

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold text-[#EBEBEB] tracking-wide text-lg">Insights</h2>
        <span className="text-[10px] text-[#333] font-bold uppercase tracking-[0.12em]">
          {insights.length} {insights.length === 1 ? 'alert' : 'alerts'}
        </span>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {insights.map(ins => {
          const cfg  = CONFIG[ins.type]
          const Icon = cfg.icon
          return (
            <div key={ins.id} className={`flex items-start gap-3 p-4 rounded-xl border ${cfg.bg} ${cfg.border}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${cfg.bg} border ${cfg.border}`}>
                <Icon className={`w-[15px] h-[15px] ${cfg.color}`} />
              </div>
              <div className="min-w-0">
                <p className={`text-[13px] font-semibold leading-snug ${cfg.color}`}>{ins.title}</p>
                <p className="text-[12px] text-[#555] mt-0.5 leading-relaxed">{ins.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

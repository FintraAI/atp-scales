'use client'
// src/components/admin/edit-metrics-form.tsx

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BarChart2 } from 'lucide-react'

export function EditMetricsForm({ clientProfileId }: { clientProfileId: string }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const today = new Date().toISOString().split('T')[0]

  const [form, setForm] = useState({
    date: today,
    adSpend: '',
    revenue: '',
    leads: '',
    appointments: '',
    impressions: '',
    clicks: '',
    purchases: '',
  })

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    const spend = parseFloat(form.adSpend) || 0
    const revenue = parseFloat(form.revenue) || 0
    const leads = parseInt(form.leads) || 0
    const appointments = parseInt(form.appointments) || 0
    const impressions = parseInt(form.impressions) || 0
    const clicks = parseInt(form.clicks) || 0
    const purchases = parseInt(form.purchases) || 0

    const payload = {
      clientProfileId,
      date: form.date,
      adSpend: spend,
      revenue,
      roas: spend > 0 ? revenue / spend : 0,
      leads,
      costPerLead: leads > 0 ? spend / leads : 0,
      appointments,
      costPerAppointment: appointments > 0 ? spend / appointments : 0,
      conversionRate: leads > 0 ? appointments / leads : 0,
      impressions,
      clicks,
      ctr: impressions > 0 ? clicks / impressions : 0,
      cpc: clicks > 0 ? spend / clicks : 0,
      purchases,
    }

    const res = await fetch('/api/admin/metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      setSuccess(true)
      setTimeout(() => { setSuccess(false); setOpen(false) }, 2000)
      router.refresh()
    }
    setIsLoading(false)
  }

  return (
    <div className="bg-[#181818] border border-[#1e1e1e] rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-[#c8ff00]" />
          <span className="font-display font-semibold text-white text-sm">Enter Daily Metrics</span>
        </div>
        <span className="text-[#6B6B6B] text-xs">{open ? '▲ Close' : '▼ Open'}</span>
      </button>

      {open && (
        <form onSubmit={handleSubmit} className="px-5 pb-5 space-y-4 border-t border-[#1e1e1e]">
          <div className="pt-4">
            <label className="text-[11px] text-[#6B6B6B] uppercase tracking-wider mb-1.5 block">Date</label>
            <input type="date" value={form.date} onChange={set('date')}
              className="bg-[#0e0e0e] border border-[#1e1e1e] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#c8ff00]/30 w-40" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { k: 'adSpend', label: 'Ad Spend ($)', placeholder: '0.00' },
              { k: 'revenue', label: 'Revenue ($)', placeholder: '0.00' },
              { k: 'leads', label: 'Leads', placeholder: '0' },
              { k: 'appointments', label: 'Appointments', placeholder: '0' },
              { k: 'impressions', label: 'Impressions', placeholder: '0' },
              { k: 'clicks', label: 'Clicks', placeholder: '0' },
            ].map(({ k, label, placeholder }) => (
              <div key={k}>
                <label className="text-[11px] text-[#6B6B6B] uppercase tracking-wider mb-1.5 block">{label}</label>
                <input
                  type="number" step="any" min="0"
                  value={form[k as keyof typeof form]}
                  onChange={set(k)}
                  placeholder={placeholder}
                  className="w-full bg-[#0e0e0e] border border-[#1e1e1e] rounded-lg px-3 py-2 text-sm text-white placeholder-[#333] focus:outline-none focus:border-[#c8ff00]/30 transition-colors"
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all ${
              success ? 'bg-emerald-500/20 text-emerald-400' : 'bg-[#c8ff00] hover:bg-[#d4ff33] text-black'
            }`}
          >
            {isLoading ? 'Saving...' : success ? '✓ Saved!' : 'Save Metrics'}
          </button>
        </form>
      )}
    </div>
  )
}

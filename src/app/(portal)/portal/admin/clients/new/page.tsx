'use client'
// src/app/(portal)/admin/clients/new/page.tsx

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, User, Building2, CreditCard, Loader2, CheckCircle2 } from 'lucide-react'

const PLANS = [
  { value: 'Starter', label: 'Starter — $1,997/mo' },
  { value: 'Growth',  label: 'Growth — $3,997/mo'  },
  { value: 'Scale',   label: 'Scale — $7,997/mo'   },
]

const STATUSES = [
  { value: 'ONBOARDING',  label: 'Onboarding'  },
  { value: 'ACTIVE',      label: 'Active'      },
  { value: 'PAUSED',      label: 'Paused'      },
  { value: 'PROSPECT',    label: 'Prospect'    },
]

export default function NewClientPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError]         = useState('')
  const [success, setSuccess]     = useState(false)

  const [form, setForm] = useState({
    // User fields
    email:       '',
    name:        '',
    password:    '',
    // Client profile fields
    companyName: '',
    industry:    '',
    website:     '',
    phone:       '',
    address:     '',
    monthlyBudget: '',
    planName:    'Growth',
    status:      'ONBOARDING',
    // Onboarding quick-fill
    offerName:   '',
    targetAudience: '',
    callNotes:   '',
  })

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.email || !form.name || !form.companyName || !form.password) return
    setIsLoading(true)
    setError('')

    const res = await fetch('/api/admin/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Failed to create client. Please try again.')
      setIsLoading(false)
      return
    }

    setSuccess(true)
    setTimeout(() => {
      router.push(`/portal/admin/clients/${data.clientProfileId}`)
    }, 1000)
  }

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <Link href="/portal/admin/clients"
          className="inline-flex items-center gap-1.5 text-[#555] hover:text-[#C9A84C] text-sm transition-colors mb-5">
          <ArrowLeft className="w-3.5 h-3.5" /> All Clients
        </Link>
        <h1 className="font-display text-2xl font-bold text-white tracking-wide">Create New Client</h1>
        <p className="text-[#555] text-sm mt-1">
          Creates a login account and dashboard for the new client.
        </p>
      </div>

      {error && (
        <div className="bg-red-500/5 border border-red-500/15 rounded-xl px-4 py-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* ─── Section: Login Credentials ─── */}
        <SectionCard icon={User} title="Login Credentials" subtitle="The client will use these to access their portal">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Full Name *" >
              <input value={form.name} onChange={set('name')} required placeholder="Mike Harrington" className="atp-input" />
            </Field>
            <Field label="Email Address *">
              <input type="email" value={form.email} onChange={set('email')} required placeholder="mike@company.com" className="atp-input" />
            </Field>
            <Field label="Initial Password *" hint="Client can change this after first login">
              <input type="password" value={form.password} onChange={set('password')} required minLength={8} placeholder="Min 8 characters" className="atp-input" />
            </Field>
          </div>
        </SectionCard>

        {/* ─── Section: Company Info ─── */}
        <SectionCard icon={Building2} title="Company Information" subtitle="Displayed on the client's dashboard and profile">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Company Name *">
              <input value={form.companyName} onChange={set('companyName')} required placeholder="Velocity Roofing" className="atp-input" />
            </Field>
            <Field label="Industry">
              <input value={form.industry} onChange={set('industry')} placeholder="Home Services" className="atp-input" />
            </Field>
            <Field label="Website">
              <input type="url" value={form.website} onChange={set('website')} placeholder="https://company.com" className="atp-input" />
            </Field>
            <Field label="Phone">
              <input type="tel" value={form.phone} onChange={set('phone')} placeholder="(555) 123-4567" className="atp-input" />
            </Field>
            <Field label="Address" className="sm:col-span-2">
              <input value={form.address} onChange={set('address')} placeholder="City, State" className="atp-input" />
            </Field>
          </div>
        </SectionCard>

        {/* ─── Section: Plan & Status ─── */}
        <SectionCard icon={CreditCard} title="Plan & Account Status" subtitle="Assign a plan and set the initial account status">
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Service Plan">
              <select value={form.planName} onChange={set('planName')} className="atp-input">
                {PLANS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </Field>
            <Field label="Account Status">
              <select value={form.status} onChange={set('status')} className="atp-input">
                {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </Field>
            <Field label="Monthly Ad Budget ($)" hint="Optional">
              <input type="number" min="0" value={form.monthlyBudget} onChange={set('monthlyBudget')} placeholder="5000" className="atp-input" />
            </Field>
          </div>
        </SectionCard>

        {/* ─── Section: Onboarding Notes ─── */}
        <SectionCard icon={Building2} title="Onboarding Notes" subtitle="Quick-fill key onboarding info (can be expanded later)">
          <div className="space-y-4">
            <Field label="Offer Name / Product">
              <input value={form.offerName} onChange={set('offerName')} placeholder="Free Roof Inspection + Insurance Help" className="atp-input" />
            </Field>
            <Field label="Target Audience">
              <input value={form.targetAudience} onChange={set('targetAudience')} placeholder="Homeowners 35–65 in suburban Dallas..." className="atp-input" />
            </Field>
            <Field label="Call Notes">
              <textarea value={form.callNotes} onChange={set('callNotes')} rows={3} placeholder="Key insights from onboarding call, goals, KPIs..." className="atp-input resize-none" />
            </Field>
          </div>
        </SectionCard>

        {/* Submit */}
        <div className="flex items-center justify-between pt-2">
          <Link href="/portal/admin/clients"
            className="btn-outline px-5 py-2.5 text-sm">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isLoading || success || !form.email || !form.name || !form.companyName || !form.password}
            className={`btn-gold min-w-[160px] justify-center ${success ? '!bg-emerald-500' : ''}`}
          >
            {success ? (
              <><CheckCircle2 className="w-4 h-4" /> Created!</>
            ) : isLoading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Creating…</>
            ) : (
              'Create Client Account'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

function SectionCard({
  icon: Icon, title, subtitle, children,
}: {
  icon: React.ElementType; title: string; subtitle: string; children: React.ReactNode
}) {
  return (
    <div className="bg-[#111111] border border-[#1C1C1C] rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-[#1C1C1C] flex items-center gap-3">
        <div className="w-7 h-7 bg-[rgba(201,168,76,0.08)] border border-[rgba(201,168,76,0.15)] rounded-lg flex items-center justify-center shrink-0">
          <Icon className="w-3.5 h-3.5 text-[#C9A84C]" />
        </div>
        <div>
          <p className="font-display font-semibold text-white text-sm tracking-wide">{title}</p>
          <p className="text-[11px] text-[#444]">{subtitle}</p>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}

function Field({
  label, hint, children, className = '',
}: {
  label: string; hint?: string; children: React.ReactNode; className?: string
}) {
  return (
    <div className={className}>
      <div className="flex items-baseline gap-2 mb-1.5">
        <label className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#444]">{label}</label>
        {hint && <span className="text-[10px] text-[#333]">{hint}</span>}
      </div>
      {children}
    </div>
  )
}

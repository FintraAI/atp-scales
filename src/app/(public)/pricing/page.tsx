// src/app/(public)/pricing/page.tsx

import Link from 'next/link'
import { ArrowRight, Check, Zap } from 'lucide-react'
import { MarketingNav }    from '@/components/marketing/nav'
import { MarketingFooter } from '@/components/marketing/footer'

export const metadata = {
  title:       'Pricing — ATP Scales',
  description: 'Simple, transparent pricing. First 30 days at $1,000 to prove results.',
}

const PLANS = [
  {
    name:     'Essential',
    price:    '$1,500',
    bestFor:  'Getting started, testing, steady lead flow',
    featured: false,
    cta:      'Get Started',
    features: [
      '1 core offer',
      'Basic creative set (2–3 ads)',
      'Lead generation system',
      'SMS lead notifications',
      'Light optimization (weekly tweaks)',
      'Bi-weekly reports',
    ],
  },
  {
    name:     'Growth',
    price:    '$2,000',
    bestFor:  'Scaling revenue and maximizing bookings',
    featured: true,
    cta:      'Book a Call',
    features: [
      'Everything in Essential',
      'More creatives (4–6 ads running/testing)',
      'Faster optimization (multiple adjustments/week)',
      'Offer testing (finding better-performing angles)',
      'Scaling strategy (increasing budget on winners)',
      'Priority support',
      'Weekly reports',
      'Monthly strategy call',
    ],
  },
]

const AD_SPEND_ROWS = [
  {
    spend: '$1,500 / mo',
    campaigns: '1 campaign',
    at15: '100 leads',
    at25: '60 leads',
    realistic: '60–100 leads/mo',
  },
  {
    spend: '$2,000 / mo',
    campaigns: '1 campaign',
    at15: '130 leads',
    at25: '80 leads',
    realistic: '80–130 leads/mo',
  },
  {
    spend: '$3,000 / mo',
    campaigns: '1 campaign',
    at15: '200 leads',
    at25: '120 leads',
    realistic: '120–200 leads/mo',
  },
  {
    spend: '$5,000 / mo',
    campaigns: '2 campaigns',
    at15: '330 leads',
    at25: '200 leads',
    realistic: '200–330 leads/mo',
  },
]

export default function PricingPage() {
  return (
    <div className="bg-[#050505] min-h-screen">
      <MarketingNav />

      <div className="pt-28 pb-24">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 space-y-20">

          {/* ── Header ────────────────────────────────────────── */}
          <div className="text-center">
            <p className="text-[#D4AF37] text-[11px] font-bold uppercase tracking-[0.2em] mb-4">Pricing</p>
            <h1 className="font-display font-black text-5xl lg:text-6xl text-white leading-tight mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-[#888] text-base leading-relaxed max-w-xl mx-auto">
              No lock-ins. We start with a pilot month at $1,000 to prove results —
              then you choose your plan.
            </p>
          </div>

          {/* ── Pilot Month Banner ────────────────────────────── */}
          <div
            className="rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
            style={{
              background:   'linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(212,175,55,0.03) 100%)',
              border:       '1px solid rgba(212,175,55,0.25)',
            }}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[rgba(212,175,55,0.12)] border border-[rgba(212,175,55,0.2)] flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <p className="text-white font-bold text-[15px]">Pilot Month — $1,000 flat</p>
                <p className="text-[#888] text-[13px] mt-0.5">
                  First 30 days on either plan. We prove results, then you transition into your chosen plan.
                </p>
              </div>
            </div>
            <Link href="/book" className="btn-gold shrink-0 py-2.5 px-6 text-[13px]">
              Start the Pilot
            </Link>
          </div>

          {/* ── Plan Cards ────────────────────────────────────── */}
          <div className="grid md:grid-cols-2 gap-6">
            {PLANS.map(plan => (
              <div
                key={plan.name}
                className={`rounded-2xl p-7 border relative flex flex-col ${
                  plan.featured
                    ? 'bg-[#0F0F0F] border-[rgba(212,175,55,0.3)] shadow-gold'
                    : 'bg-[#0A0A0A] border-[#1A1A1A]'
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#8A6E2F] via-[#D4AF37] to-[#E6C65C] text-black text-[10px] font-black uppercase tracking-[0.12em] px-4 py-1 rounded-full whitespace-nowrap">
                    Most Popular
                  </div>
                )}

                <div className="mb-5">
                  <p className="font-display font-bold text-white text-xl tracking-wide">{plan.name}</p>
                  <p className="text-[#666] text-[12px] mt-1">Best for: {plan.bestFor}</p>
                  <div className="flex items-baseline gap-1 mt-4">
                    <span className="font-display font-black text-4xl text-white">{plan.price}</span>
                    <span className="text-[#555] text-sm">/ month</span>
                  </div>
                </div>

                <ul className="space-y-2.5 mb-8 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2.5 text-[13px]">
                      <Check className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                      <span className="text-[#B3B3B3]">{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/book"
                  className={`block text-center py-3.5 rounded-xl text-[13px] font-bold tracking-wide transition-all ${
                    plan.featured
                      ? 'btn-gold justify-center'
                      : 'border border-[#222] hover:border-[rgba(212,175,55,0.3)] text-[#B3B3B3] hover:text-[#D4AF37] transition-colors'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          {/* ── Ad Spend note ─────────────────────────────────── */}
          <div
            className="rounded-2xl p-6 border border-[#1A1A1A] bg-[#0A0A0A]"
          >
            <p className="text-[#D4AF37] text-[11px] font-bold uppercase tracking-[0.18em] mb-1">Ad Spend — Separate</p>
            <p className="text-white text-[15px] font-semibold mb-1">Recommended: $1,500–$3,000+ / month</p>
            <p className="text-[#666] text-[13px]">Paid directly to Meta. We manage it — you own the account.</p>
          </div>

          {/* ── CPL Benchmark ─────────────────────────────────── */}
          <div>
            <div className="mb-6">
              <p className="text-[#D4AF37] text-[11px] font-bold uppercase tracking-[0.2em] mb-2">The Only Metric That Matters First</p>
              <h2 className="font-display font-black text-3xl lg:text-4xl text-white">Cost Per Lead (CPL)</h2>
              <p className="text-[#666] text-[13px] mt-2">For med spas, here&apos;s what the numbers look like:</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Good',   range: '$10–$20',  color: '#059669', bg: 'rgba(5,150,105,0.07)',   border: 'rgba(5,150,105,0.2)'  },
                { label: 'Normal', range: '$15–$30',  color: '#D97706', bg: 'rgba(217,119,6,0.07)',   border: 'rgba(217,119,6,0.2)'  },
                { label: 'Bad',    range: '$35+',     color: '#DC2626', bg: 'rgba(220,38,38,0.07)',   border: 'rgba(220,38,38,0.2)'  },
              ].map(tier => (
                <div
                  key={tier.label}
                  className="rounded-xl p-5 text-center border"
                  style={{ background: tier.bg, borderColor: tier.border }}
                >
                  <p className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: tier.color }}>{tier.label}</p>
                  <p className="font-display font-black text-2xl text-white">{tier.range}</p>
                  <p className="text-[11px] mt-1" style={{ color: tier.color }}>per lead</p>
                </div>
              ))}
            </div>
            <p className="text-[#555] text-[12px] mt-4 text-center">If we stay under $30 CPL, we&apos;re winning.</p>
          </div>

          {/* ── Leads by Ad Spend Table ───────────────────────── */}
          <div>
            <div className="mb-6">
              <p className="text-[#D4AF37] text-[11px] font-bold uppercase tracking-[0.2em] mb-2">Projected Results</p>
              <h2 className="font-display font-black text-3xl lg:text-4xl text-white">Leads by Ad Spend</h2>
            </div>
            <div className="rounded-2xl overflow-hidden border border-[#1A1A1A]">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#1A1A1A] bg-[#0A0A0A]">
                    {['Ad Spend', 'Campaigns', 'At $15 CPL', 'At $25 CPL', 'Realistic Range'].map(h => (
                      <th key={h} className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-[0.15em] text-[#555]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {AD_SPEND_ROWS.map((row, i) => (
                    <tr
                      key={row.spend}
                      className="border-b border-[#111] last:border-0"
                      style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}
                    >
                      <td className="px-5 py-4 font-bold text-white text-[13px]">{row.spend}</td>
                      <td className="px-5 py-4 text-[#666] text-[13px]">{row.campaigns}</td>
                      <td className="px-5 py-4 text-[#059669] font-semibold text-[13px]">{row.at15}</td>
                      <td className="px-5 py-4 text-[#D97706] font-semibold text-[13px]">{row.at25}</td>
                      <td className="px-5 py-4 text-[#D4AF37] font-bold text-[13px]">{row.realistic}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Leads ≠ Money callout ─────────────────────────── */}
          <div
            className="rounded-2xl p-8 text-center border"
            style={{
              background:   'linear-gradient(135deg, rgba(212,175,55,0.06) 0%, transparent 100%)',
              borderColor:  'rgba(212,175,55,0.15)',
            }}
          >
            <p className="text-[#D4AF37] text-[11px] font-bold uppercase tracking-[0.2em] mb-4">What Most People Ignore</p>
            <div className="flex items-center justify-center gap-6 mb-6">
              <div>
                <p className="font-display font-black text-2xl text-[#555] line-through">Leads</p>
                <p className="text-[#444] text-[11px] mt-1">Not money</p>
              </div>
              <div className="text-[#333] text-2xl font-bold">≠</div>
              <div>
                <p className="font-display font-black text-2xl text-[#D4AF37]">Bookings</p>
                <p className="text-[#D4AF37] text-[11px] mt-1">That&apos;s the money</p>
              </div>
            </div>

            {/* Real scenario */}
            <div
              className="rounded-xl p-5 max-w-md mx-auto text-left"
              style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid #1A1A1A' }}
            >
              <p className="text-[#888] text-[11px] font-bold uppercase tracking-wider mb-3">Real Scenario — $2,000 Ad Spend</p>
              <div className="space-y-2">
                {[
                  { label: 'Leads generated',   value: '80–130' },
                  { label: 'Booking rate',       value: '25%'    },
                  { label: 'Booked appointments', value: '20–32', gold: true },
                ].map(row => (
                  <div key={row.label} className="flex items-center justify-between">
                    <span className="text-[#666] text-[13px]">{row.label}</span>
                    <span className={`font-bold text-[13px] ${row.gold ? 'text-[#D4AF37]' : 'text-white'}`}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Final CTA ─────────────────────────────────────── */}
          <div className="text-center">
            <p className="text-[#D4AF37] text-[11px] font-bold uppercase tracking-[0.2em] mb-4">Get Started</p>
            <h2 className="font-display font-black text-4xl lg:text-5xl text-white mb-4 leading-tight">
              Not Sure Which Plan?
            </h2>
            <p className="text-[#666] text-[14px] leading-relaxed mb-8 max-w-md mx-auto">
              Book a free 30-minute strategy call. We&apos;ll tell you exactly what to expect for your budget.
            </p>
            <Link href="/book" className="btn-gold inline-flex gap-2 py-4 px-9 text-[14px]">
              Book a Free Strategy Call <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-[#333] text-[11px] mt-4">Free 30-min call · No commitment · Limited spots</p>
          </div>

        </div>
      </div>

      <MarketingFooter />
    </div>
  )
}

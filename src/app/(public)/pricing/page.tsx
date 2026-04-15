// src/app/(public)/pricing/page.tsx

import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import { MarketingNav }    from '@/components/marketing/nav'
import { MarketingFooter } from '@/components/marketing/footer'

export const metadata = {
  title:       'Pricing — ATP Scales',
  description: 'Simple, transparent pricing. No lock-ins.',
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
              No lock-ins. We earn your trust every month.
            </p>
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

// src/app/(public)/pricing/page.tsx
// ATP Scales — Pricing Page

import Link from 'next/link'
import { ArrowRight, Check, X } from 'lucide-react'
import { MarketingNav } from '@/components/marketing/nav'
import { MarketingFooter } from '@/components/marketing/footer'

export const metadata = {
  title: 'Pricing — ATP Scales',
  description: 'Simple, transparent pricing. No lock-ins after 90 days if we haven\'t hit your targets.',
}

const PLANS = [
  {
    name:     'Starter',
    price:    '$1,500',
    desc:     'Perfect for businesses starting with paid ads',
    cta:      'Get Started',
    featured: false,
  },
  {
    name:     'Growth',
    price:    '$2,500',
    desc:     'For businesses scaling aggressively',
    cta:      'Book a Call',
    featured: true,
  },
  {
    name:     'Scale',
    price:    '$4,000+',
    desc:     'Full-service for high-growth companies',
    cta:      'Book a Call',
    featured: false,
  }, 
]

type FeatureValue = boolean | string

interface Feature {
  label:    string
  starter:  FeatureValue
  growth:   FeatureValue
  scale:    FeatureValue
  category?: string
}

const FEATURES: Feature[] = [
  // Core
  { label: 'Ads management',           starter: true,          growth: true,           scale: true          },
  { label: 'Client portal access',     starter: true,          growth: true,           scale: true          },
  { label: 'Weekly performance reports', starter: true,        growth: true,           scale: true          },
  { label: 'Basic creatives',          starter: true,          growth: true,           scale: true          },
  // Campaigns
  { label: 'Active campaigns',         starter: '1 campaign',  growth: 'Multiple',     scale: 'Unlimited'   },
  // Creative
  { label: 'Creative testing',         starter: false,         growth: true,           scale: true          },
  { label: 'Creative consultation',    starter: false,         growth: true,           scale: true          },
  // Strategy
  { label: 'Monthly strategy call',    starter: true,          growth: false,          scale: false         },
  { label: 'Bi-weekly strategy calls', starter: false,         growth: true,           scale: true          },
  // Advanced
  { label: 'Full funnel management',   starter: false,         growth: false,          scale: true          },
  { label: 'Aggressive testing',       starter: false,         growth: false,          scale: true          },
  { label: 'CRM integration',          starter: false,         growth: false,          scale: true          },
  { label: 'Priority support',         starter: false,         growth: false,          scale: true          },
]

function FeatureCell({ value }: { value: FeatureValue }) {
  if (typeof value === 'string') {
    return (
      <span className="text-[#D4AF37] font-semibold text-[13px]">{value}</span>
    )
  }
  if (value) {
    return <Check className="w-4 h-4 text-[#D4AF37] mx-auto" />
  }
  return <X className="w-4 h-4 text-[#2E2E2E] mx-auto" />
}

export default function PricingPage() {
  return (
    <div className="bg-[#050505] min-h-screen">
      <MarketingNav />

      <div className="pt-28 pb-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">

          {/* ─── Header ─────────────────────────────────────────── */}
          <div className="text-center mb-16">
            <p className="text-[#D4AF37] text-[11px] font-bold uppercase tracking-[0.2em] mb-4">Pricing</p>
            <h1 className="font-display font-black text-5xl lg:text-6xl text-white leading-tight mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-[#B3B3B3] text-base leading-relaxed max-w-xl mx-auto">
              No retainer lock-ins after 90 days if we haven&apos;t hit your targets.
              We earn your trust every month.
            </p>
          </div>

          {/* ─── Plan Cards ─────────────────────────────────────── */}
          <div className="grid md:grid-cols-3 gap-5 mb-16">
            {PLANS.map((plan) => (
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
                <p className="font-display font-bold text-white text-xl tracking-wide">{plan.name}</p>
                <p className="text-[#6B6B6B] text-[12px] mt-0.5 mb-5">{plan.desc}</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="font-display font-black text-4xl text-white">{plan.price}</span>
                  <span className="text-[#6B6B6B] text-sm">/ month</span>
                </div>
                <Link
                  href="/contact"
                  className={`block text-center py-3.5 rounded-xl text-[13px] font-bold tracking-wide transition-all mt-auto ${
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

          {/* ─── Feature Comparison Table ───────────────────────── */}
          <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl overflow-hidden">

            {/* Table header */}
            <div className="grid grid-cols-4 border-b border-[#1A1A1A]">
              <div className="p-5 col-span-1" />
              {PLANS.map((plan) => (
                <div
                  key={plan.name}
                  className={`p-5 text-center border-l border-[#1A1A1A] ${
                    plan.featured ? 'bg-[rgba(212,175,55,0.04)]' : ''
                  }`}
                >
                  <p className={`font-display font-bold text-[15px] tracking-wide ${plan.featured ? 'text-[#D4AF37]' : 'text-white'}`}>
                    {plan.name}
                  </p>
                  <p className="text-[#6B6B6B] text-[11px] mt-0.5">{plan.price}<span className="text-[#6B6B6B]">/mo</span></p>
                </div>
              ))}
            </div>

            {/* Feature rows */}
            {FEATURES.map((feature, i) => (
              <div
                key={feature.label}
                className={`grid grid-cols-4 border-b border-[#181818] last:border-0 ${
                  i % 2 === 0 ? '' : 'bg-[rgba(255,255,255,0.01)]'
                }`}
              >
                <div className="p-4 px-5 flex items-center">
                  <span className="text-[text-white] text-[13px]">{feature.label}</span>
                </div>

                {/* Starter */}
                <div className={`p-4 border-l border-[#181818] flex items-center justify-center`}>
                  <FeatureCell value={feature.starter} />
                </div>

                {/* Growth */}
                <div className="p-4 border-l border-[#181818] flex items-center justify-center bg-[rgba(212,175,55,0.02)]">
                  <FeatureCell value={feature.growth} />
                </div>

                {/* Scale */}
                <div className="p-4 border-l border-[#181818] flex items-center justify-center">
                  <FeatureCell value={feature.scale} />
                </div>
              </div>
            ))}

            {/* Bottom CTA row */}
            <div className="grid grid-cols-4 border-t border-[#1A1A1A] bg-[#0A0A0A]">
              <div className="p-5" />
              {PLANS.map((plan) => (
                <div
                  key={plan.name}
                  className={`p-5 border-l border-[#1A1A1A] ${plan.featured ? 'bg-[rgba(212,175,55,0.04)]' : ''}`}
                >
                  <Link
                    href="/contact"
                    className={`block text-center py-3 rounded-xl text-[12px] font-bold tracking-wide transition-all ${
                      plan.featured
                        ? 'btn-gold justify-center'
                        : 'border border-[#222] hover:border-[rgba(212,175,55,0.3)] text-[#6B6B6B] hover:text-[#D4AF37] transition-colors'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* ─── Fine Print ─────────────────────────────────────── */}
          <p className="text-center text-[#333] text-[12px] mt-8 tracking-wide">
            All plans include onboarding. Ad spend is billed separately and goes directly to the platforms.
          </p>

        </div>
      </div>

      {/* ─── Final CTA ──────────────────────────────────────────── */}
      <section className="py-20 border-t border-[#1A1A1A] relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 100%, rgba(212,175,55,0.06), transparent)' }}
        />
        <div className="relative max-w-2xl mx-auto px-6 text-center">
          <p className="text-[#D4AF37] text-[11px] font-bold uppercase tracking-[0.2em] mb-5">Get Started</p>
          <h2 className="font-display font-black text-4xl lg:text-5xl text-white mb-4 leading-tight">
            Not Sure Which Plan?
          </h2>
          <p className="text-[#6B6B6B] text-[14px] leading-relaxed mb-8">
            Book a free 30-minute strategy call and we&apos;ll recommend the right fit for your business and budget.
          </p>
          <Link
            href="/contact"
            className="btn-gold inline-flex gap-2 py-4 px-9 text-[14px]"
          >
            Book a Free Strategy Call <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-[#333] text-[11px] mt-4 tracking-wide">
            Free 30-min call · No commitment · Limited spots available
          </p>
        </div>
      </section>

      <MarketingFooter />
    </div>
  )
}

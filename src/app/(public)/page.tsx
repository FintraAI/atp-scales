// src/app/(public)/page.tsx
// ATP Scales — Marketing Homepage

import Link from 'next/link'
import { ArrowRight, BarChart2, TrendingUp, Shield, Clock, Target, Zap, CheckCircle } from 'lucide-react'
import { MarketingNav } from '@/components/marketing/nav'
import { MarketingFooter } from '@/components/marketing/footer'

export default function HomePage() {
  return (
    <div className="bg-[#060606] min-h-screen">
      <MarketingNav />

      {/* ─── HERO ──────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center pt-28 pb-20 overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-60" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 70% 50% at 50% -10%, rgba(201,168,76,0.09), transparent 70%), radial-gradient(ellipse 40% 60% at 90% 50%, rgba(201,168,76,0.04), transparent)',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="max-w-4xl">
            {/* Eyebrow tag */}
            <div className="inline-flex items-center gap-2.5 border border-[rgba(201,168,76,0.25)] bg-[rgba(201,168,76,0.05)] rounded-full px-4 py-1.5 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] animate-pulse" />
              <span className="text-[#C9A84C] text-[11px] font-bold tracking-[0.18em] uppercase">
                Performance Ad Agency
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display font-black text-5xl sm:text-6xl lg:text-[80px] text-white leading-[0.95] tracking-tight mb-6">
              We Don&apos;t Run Ads.
              <br />
              <span className="gold-text">We Engineer Growth.</span>
            </h1>

            <p className="text-[#666] text-lg leading-relaxed max-w-2xl mb-10">
              ATP Scales builds precision performance systems for ambitious brands.
              Every dollar tracked. Every decision data-driven. Every client result validated.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="btn-gold gap-2 py-4 px-8 text-[14px]"
              >
                Book a Strategy Call <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="btn-outline py-4 px-8 text-[14px]"
              >
                Client Login
              </Link>
            </div>

            {/* Social proof stats */}
            <div className="flex flex-wrap gap-10 mt-16 pt-12 border-t border-[#1A1A1A]">
              {[
                { value: '$24M+', label: 'Revenue Generated' },
                { value: '6.2x',  label: 'Average ROAS'      },
                { value: '180+',  label: 'Campaigns Managed' },
                { value: '98%',   label: 'Client Retention'  },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-display font-black text-3xl lg:text-4xl gold-text">{stat.value}</p>
                  <p className="text-[#444] text-[11px] uppercase tracking-[0.18em] mt-1.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── PLATFORMS BAR ─────────────────────────────────────── */}
      <section className="border-y border-[#1A1A1A] py-7 bg-[#080808]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-[#333] text-[10px] uppercase tracking-[0.25em] text-center mb-5">
            Platforms We Master
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
            {['Meta Ads', 'Google Ads', 'YouTube', 'TikTok Ads', 'LinkedIn Ads'].map((p) => (
              <span
                key={p}
                className="text-[#2E2E2E] hover:text-[#C9A84C] font-display font-bold text-[13px] tracking-[0.12em] transition-colors cursor-default"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SERVICES ──────────────────────────────────────────── */}
      <section id="services" className="py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-16">
            <p className="text-[#C9A84C] text-[11px] font-bold uppercase tracking-[0.2em] mb-4">What We Do</p>
            <h2 className="font-display font-black text-4xl lg:text-5xl text-white max-w-xl leading-tight">
              Full-Stack Ad Performance
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                icon: Target,
                title: 'Paid Social',
                desc: 'Meta, TikTok, LinkedIn campaigns built around your offer. We test relentlessly, scale what works, cut what doesn\'t.',
              },
              {
                icon: BarChart2,
                title: 'Paid Search',
                desc: 'Google & YouTube ads capturing high-intent buyers at the exact moment they\'re ready to convert.',
              },
              {
                icon: TrendingUp,
                title: 'Full-Funnel Strategy',
                desc: 'From cold audience to converted customer. We architect the entire acquisition system — not just the ads.',
              },
              {
                icon: Zap,
                title: 'Creative Production',
                desc: 'Scroll-stopping static and video ads built on data. Creative is your biggest lever. We treat it like one.',
              },
              {
                icon: Shield,
                title: 'Conversion Optimization',
                desc: 'Landing pages, offers, and funnels optimized to turn ad traffic into booked appointments and paying customers.',
              },
              {
                icon: Clock,
                title: 'Reporting & Intelligence',
                desc: 'Real-time client dashboards. Every client gets their own portal with live campaign data, updated daily.',
              },
            ].map((s) => (
              <div
                key={s.title}
                className="group bg-[#0E0E0E] hover:bg-[#111] border border-[#1A1A1A] hover:border-[rgba(201,168,76,0.18)] rounded-2xl p-6 transition-all duration-200 hover:shadow-gold-sm"
              >
                <div className="w-10 h-10 bg-[rgba(201,168,76,0.07)] border border-[rgba(201,168,76,0.15)] rounded-xl flex items-center justify-center mb-5">
                  <s.icon className="w-4.5 h-4.5 text-[#C9A84C]" />
                </div>
                <h3 className="font-display font-bold text-white text-lg mb-2 tracking-wide">{s.title}</h3>
                <p className="text-[#555] text-[13px] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ──────────────────────────────────────── */}
      <section className="py-28 border-t border-[#1A1A1A] bg-[#080808]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-16">
            <p className="text-[#C9A84C] text-[11px] font-bold uppercase tracking-[0.2em] mb-4">The Process</p>
            <h2 className="font-display font-black text-4xl lg:text-5xl text-white max-w-xl leading-tight">
              How ATP Scales Works
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6 lg:gap-10">
            {[
              { num: '01', title: 'Deep Onboarding',  desc: 'We dissect your offer, audience, competitors, and current metrics before touching ad spend.' },
              { num: '02', title: 'Build & Launch',   desc: 'Campaigns, creatives, and funnels engineered from the ground up. No templates. No guessing.' },
              { num: '03', title: 'Test & Optimize',  desc: 'Daily monitoring. Weekly strategy adjustments. We iterate until we find what scales.' },
              { num: '04', title: 'Scale & Report',   desc: 'Once the system works, we press the gas. Full transparency through your client portal.' },
            ].map((step, i) => (
              <div key={step.num} className="relative">
                {/* Step connector line */}
                {i < 3 && (
                  <div className="hidden md:block absolute top-[26px] left-[calc(100%+12px)] right-[-12px] h-px bg-gradient-to-r from-[#2A2A2A] to-transparent w-1/2" />
                )}
                <p className="font-display font-black text-[60px] leading-none text-[#161616] mb-3 select-none">{step.num}</p>
                <div className="w-8 h-0.5 bg-gradient-to-r from-[#C9A84C] to-transparent mb-4" />
                <h3 className="font-display font-bold text-white text-lg mb-2">{step.title}</h3>
                <p className="text-[#555] text-[13px] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── RESULTS ───────────────────────────────────────────── */}
      <section className="py-28 border-t border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-16">
            <p className="text-[#C9A84C] text-[11px] font-bold uppercase tracking-[0.2em] mb-4">Results</p>
            <h2 className="font-display font-black text-4xl lg:text-5xl text-white max-w-xl leading-tight">
              The Numbers Speak
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                tag:     'Meta Ads + Google',
                result:  '8.2x ROAS in 60 days',
                detail:  '$48k ad spend → $393k revenue. 127 booked inspections per month.',
                company: 'Home Services Client',
                metrics: [{ label: 'ROAS', value: '8.2x' }, { label: 'Booked/mo', value: '127' }],
              },
              {
                tag:     'Meta Ads',
                result:  'CPL down 72%',
                detail:  'From $180 CAC to $49. Scaled from 12 new patients/mo to 61/mo.',
                company: 'Healthcare Client',
                metrics: [{ label: 'Old CAC', value: '$180' }, { label: 'New CAC', value: '$49' }],
                featured: true,
              },
              {
                tag:     'Meta + YouTube',
                result:  '$0 → $180k/mo',
                detail:  '4.1x ROAS on cold traffic. VSL funnel scaled with UGC creative stack.',
                company: 'Online Coaching',
                metrics: [{ label: 'ROAS', value: '4.1x' }, { label: 'Revenue/mo', value: '$180k' }],
              },
            ].map((r) => (
              <div
                key={r.company}
                className={`rounded-2xl p-7 border ${
                  r.featured
                    ? 'bg-[#111111] border-[rgba(201,168,76,0.25)] shadow-gold'
                    : 'bg-[#0E0E0E] border-[#1A1A1A]'
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#C9A84C] bg-[rgba(201,168,76,0.08)] border border-[rgba(201,168,76,0.15)] px-2.5 py-1 rounded-md">
                  {r.tag}
                </span>
                <p className="font-display font-black text-2xl lg:text-3xl text-white mt-5 mb-2 leading-tight">{r.result}</p>
                <p className="text-[#555] text-[13px] leading-relaxed mb-5">{r.detail}</p>

                {/* Mini stats */}
                <div className="flex gap-5 pt-5 border-t border-[#1A1A1A]">
                  {r.metrics.map((m) => (
                    <div key={m.label}>
                      <p className="font-display font-bold text-xl text-[#C9A84C]">{m.value}</p>
                      <p className="text-[#444] text-[10px] uppercase tracking-wider mt-0.5">{m.label}</p>
                    </div>
                  ))}
                </div>
                <p className="text-[#333] text-[11px] mt-4">{r.company}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING ───────────────────────────────────────────── */}
      <section id="pricing" className="py-28 border-t border-[#1A1A1A] bg-[#080808]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-[#C9A84C] text-[11px] font-bold uppercase tracking-[0.2em] mb-4">Pricing</p>
            <h2 className="font-display font-black text-4xl lg:text-5xl text-white">
              Simple, Transparent Pricing
            </h2>
            <p className="text-[#555] mt-4 max-w-xl mx-auto text-[13px] leading-relaxed">
              No retainer lock-ins after 90 days if we haven&apos;t hit your targets.
              We earn your trust every month.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {[
              {
                name: 'Starter',
                price: '$1,997',
                desc: 'Perfect for businesses starting with paid ads',
                features: ['Up to 2 campaigns', 'Meta Ads management', 'Weekly performance reports', 'Monthly strategy call', 'Client portal access'],
                cta: 'Get Started',
                featured: false,
              },
              {
                name: 'Growth',
                price: '$3,997',
                desc: 'For businesses scaling aggressively',
                features: ['Up to 5 campaigns', 'Meta + Google Ads', 'Bi-weekly strategy calls', 'Landing page CRO', 'Weekly performance reports', 'Creative consultation'],
                cta: 'Book a Call',
                featured: true,
              },
              {
                name: 'Scale',
                price: '$7,997',
                desc: 'Full-service for high-growth companies',
                features: ['Unlimited campaigns', 'All platforms', 'Dedicated account manager', 'Weekly calls', 'Creative production included', 'Full funnel management', 'CRM integration'],
                cta: 'Apply Now',
                featured: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-7 border relative flex flex-col ${
                  plan.featured
                    ? 'bg-[#111111] border-[rgba(201,168,76,0.3)] shadow-gold'
                    : 'bg-[#0A0A0A] border-[#1A1A1A]'
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#9A7A35] via-[#C9A84C] to-[#E2C06A] text-black text-[10px] font-black uppercase tracking-[0.12em] px-4 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="mb-6">
                  <p className="font-display font-bold text-white text-xl tracking-wide">{plan.name}</p>
                  <p className="text-[#444] text-[12px] mt-0.5">{plan.desc}</p>
                  <div className="mt-5 flex items-baseline gap-1">
                    <span className="font-display font-black text-4xl text-white">{plan.price}</span>
                    <span className="text-[#444] text-sm">/ month</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-7 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-[13px] text-[#666]">
                      <CheckCircle className="w-3.5 h-3.5 text-[#C9A84C] shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/contact"
                  className={`block text-center py-3.5 rounded-xl text-[13px] font-bold tracking-wide transition-all ${
                    plan.featured
                      ? 'btn-gold justify-center'
                      : 'border border-[#222] hover:border-[rgba(201,168,76,0.3)] text-[#666] hover:text-[#C9A84C] transition-colors'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─────────────────────────────────────────── */}
      <section className="py-28 border-t border-[#1A1A1A] relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 100%, rgba(201,168,76,0.06), transparent)' }}
        />
        <div className="relative max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-[#C9A84C] text-[11px] font-bold uppercase tracking-[0.2em] mb-5">Get Started</p>
          <h2 className="font-display font-black text-5xl lg:text-7xl text-white mb-6 leading-[0.95]">
            Ready to Scale?
          </h2>
          <p className="text-[#555] text-[15px] leading-relaxed mb-10 max-w-lg mx-auto">
            We only work with brands we believe we can grow. Book a call and let&apos;s see if we&apos;re a fit.
          </p>
          <Link
            href="/contact"
            className="btn-gold inline-flex gap-2 py-5 px-10 text-[15px]"
          >
            Book Your Strategy Call <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-[#2A2A2A] text-[11px] mt-5 tracking-wide">
            Free 30-min call · No commitment · Limited spots available
          </p>
        </div>
      </section>

      <MarketingFooter />
    </div>
  )
}

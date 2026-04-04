// src/app/(public)/page.tsx
// ATP Scales — Marketing Homepage

import Link from 'next/link'
import { ArrowRight, BarChart2, TrendingUp, Shield, Clock, Target, Zap, CheckCircle } from 'lucide-react'
import { MarketingNav } from '@/components/marketing/nav'
import { MarketingFooter } from '@/components/marketing/footer'

export default function HomePage() {
  return (
    <div className="bg-[#050505] min-h-screen">
      <MarketingNav />

      {/* ─── HERO ──────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center pt-28 pb-20 overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-30" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 70% 50% at 50% -10%, rgba(212,175,55,0.09), transparent 70%), radial-gradient(ellipse 40% 60% at 90% 50%, rgba(212,175,55,0.04), transparent)',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="max-w-4xl">
            {/* Eyebrow tag */}
            <div className="inline-flex items-center gap-2.5 border border-[rgba(212,175,55,0.25)] bg-[rgba(212,175,55,0.05)] rounded-full px-4 py-1.5 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
              <span className="text-[#D4AF37] text-[11px] font-bold tracking-[0.18em] uppercase">
                Performance Ad Agency
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display font-black text-5xl sm:text-6xl lg:text-[80px] text-white leading-[0.95] tracking-tight mb-6">
              We Don&apos;t Run Ads.
              <br />
              <span className="gold-text">We Engineer Growth.</span>
            </h1>

            <p className="text-[#B3B3B3] text-lg leading-relaxed max-w-2xl mb-10">
              We build Meta and Google ad systems that turn cold traffic into 
              predictable leads — tracked, optimized, and scaled weekly. 
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="btn-gold gap-2 py-4 px-8 text-[14px]"
              >
                Get More Leads <ArrowRight className="w-4 h-4" />
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
                { value: '$14M+', label: 'AD Spend Managed' },
                { value: '$20',  label: 'Average CPL'      },
                { value: '180+',  label: 'Campaigns Launched' },
                { value: '98%',   label: 'Client Retention'  },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-display font-black text-3xl lg:text-4xl gold-text">{stat.value}</p>
                  <p className="text-[#6B6B6B] text-[11px] uppercase tracking-[0.18em] mt-1.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── PLATFORMS BAR ─────────────────────────────────────── */}
      <section className="border-y border-[#1A1A1A] py-7 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-[#333] text-[10px] uppercase tracking-[0.25em] text-center mb-5">
            Platforms We Master
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
            {['Meta Ads', 'Google Ads', 'YouTube', 'Instagram'].map((p) => (
              <span
                key={p}
                className="text-[#2E2E2E] hover:text-[#D4AF37] font-display font-bold text-[13px] tracking-[0.12em] transition-colors cursor-default"
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
            <p className="text-[#D4AF37] text-[11px] font-bold uppercase tracking-[0.2em] mb-4">What We Do</p>
            <h2 className="font-display font-black text-4xl lg:text-5xl text-white max-w-xl leading-tight">
              Full-Stack Ad Performance
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                icon: Target,
                title: 'Paid Social',
                desc: 'Meta and Google campaigns built around your offer. We test relentlessly, scale what works, cut what doesn\'t.',
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
                desc: 'Landing pages, offers, and funnels optimized to turn ad traffic into stronger leads.',
              },
              {
                icon: Clock,
                title: 'Reporting & Intelligence',
                desc: 'Real-time client dashboards. Every client gets their own portal with live campaign data, updated daily.',
              },
            ].map((s) => (
              <div
                key={s.title}
                className="group bg-[#0C0C0C] hover:bg-[#0F0F0F] border border-[#1A1A1A] hover:border-[rgba(212,175,55,0.18)] rounded-2xl p-6 transition-all duration-200 hover:shadow-gold-sm"
              >
                <div className="w-10 h-10 bg-[rgba(212,175,55,0.07)] border border-[rgba(212,175,55,0.15)] rounded-xl flex items-center justify-center mb-5">
                  <s.icon className="w-4.5 h-4.5 text-[#D4AF37]" />
                </div>
                <h3 className="font-display font-bold text-white text-lg mb-2 tracking-wide">{s.title}</h3>
                <p className="text-[#6B6B6B] text-[13px] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ──────────────────────────────────────── */}
      <section className="py-28 border-t border-[#1A1A1A] bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-16">
            <p className="text-[#D4AF37] text-[11px] font-bold uppercase tracking-[0.2em] mb-4">The Process</p>
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
                <p className="font-display font-black text-[60px] leading-none text-[#1A1A1A] mb-3 select-none">{step.num}</p>
                <div className="w-8 h-0.5 bg-gradient-to-r from-[#D4AF37] to-transparent mb-4" />
                <h3 className="font-display font-bold text-white text-lg mb-2">{step.title}</h3>
                <p className="text-[#6B6B6B] text-[13px] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── RESULTS ───────────────────────────────────────────── */}
      <section className="py-28 border-t border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-16">
            <p className="text-[#D4AF37] text-[11px] font-bold uppercase tracking-[0.2em] mb-4">Insights</p>
            <h2 className="font-display font-black text-4xl lg:text-5xl text-white max-w-xl leading-tight">
              Performance Insights
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                tag:     'Meta Ads + Google',
                result:  'Total Spend',
                detail:  '$5,690 total ad spend',
                metrics: [{ label: 'Meta', value: '$2,190' }, { label: 'Google', value: '$3,500' }],
              },
              {
                tag:     'Meta Ads',
                result:  'Leads Generated',
                detail:  '142 leads this month, up 44.9% this month compared to last month ',
                metrics: [{ label: 'Last Months Clicks', value: '98' }, { label: 'This Months Clicks', value: '142' }, {label: 'up from last month', value: '45%'}],
                featured: true,
              },
              {
                tag:     'Meta ads',
                result:  'Cost Per Lead → $20',
                detail:  '$2,840 spend generated 142 leads',
                metrics: [{ label: 'Spend', value: '$2,840' }, { label: 'leads', value: '142' }],
              },
            ].map((r) => (
              <div
                key={r.result}
                className={`rounded-2xl p-7 border text-center ${
                  r.featured
                    ? 'bg-[#0F0F0F] border-[rgba(212,175,55,0.25)] shadow-gold'
                    : 'bg-[#0C0C0C] border-[#1A1A1A]'
                }`}
              >
                <div className="flex justify-center">
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#D4AF37] bg-[rgba(212,175,55,0.08)] border border-[rgba(212,175,55,0.15)] px-2.5 py-1 rounded-md">
                    {r.tag}
                  </span>
                </div>
                <p className="font-display font-black text-2xl lg:text-3xl text-white mt-5 mb-2 leading-tight">{r.result}</p>
                <p className="text-[#6B6B6B] text-[13px] leading-relaxed mb-5">{r.detail}</p>

                {/* Mini stats */}
                <div className="flex justify-center gap-8 pt-5 border-t border-[#1A1A1A]">
                  {r.metrics.map((m) => (
                    <div key={m.label}>
                      <p className="font-display font-bold text-xl text-[#D4AF37]">{m.value}</p>
                      <p className="text-[#6B6B6B] text-[10px] uppercase tracking-wider mt-0.5">{m.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING ───────────────────────────────────────────── */}
      <section id="pricing" className="py-28 border-t border-[#1A1A1A] bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-[#D4AF37] text-[11px] font-bold uppercase tracking-[0.2em] mb-4">Pricing</p>
            <h2 className="font-display font-black text-4xl lg:text-5xl text-white">
              Simple, Transparent Pricing
            </h2>
            <p className="text-[#6B6B6B] mt-4 max-w-xl mx-auto text-[13px] leading-relaxed">
              No retainer lock-ins after 90 days if we haven&apos;t hit your targets.
              We earn your trust every month.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {[
              {
                name: 'Starter',
                price: '$1,500',
                desc: 'Perfect for businesses starting with paid ads',
                features: ['Up to 1 campaign', 'Basic creatives', 'Ads management', 'Weekly performance reports', 'Monthly strategy call', 'Client portal access'],
                cta: 'Get Started',
                featured: false,
              },
              {
                name: 'Growth',
                price: '$2,500',
                desc: 'For businesses scaling aggressively',
                features: ['Everything in Starter', 'Multiple campaigns', 'Creative testing', 'Bi-weekly strategy calls', 'Weekly performance reports', 'Creative consultation'],
                cta: 'Book a Call',
                featured: true,
              },
              {
                name: 'Scale',
                price: '$4,000+',
                desc: 'Full-service for high-growth companies',
                features: ['Everything in Growth', 'Unlimited campaigns', 'Full funnel', 'Aggresive testing', 'CRM integration', 'Priority Support'],
                cta: 'Book a Call',
                featured: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-7 border relative flex flex-col ${
                  plan.featured
                    ? 'bg-[#0F0F0F] border-[rgba(212,175,55,0.3)] shadow-gold'
                    : 'bg-[#0A0A0A] border-[#1A1A1A]'
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#8A6E2F] via-[#D4AF37] to-[#E6C65C] text-black text-[10px] font-black uppercase tracking-[0.12em] px-4 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="mb-6">
                  <p className="font-display font-bold text-white text-xl tracking-wide">{plan.name}</p>
                  <p className="text-[#6B6B6B] text-[12px] mt-0.5">{plan.desc}</p>
                  <div className="mt-5 flex items-baseline gap-1">
                    <span className="font-display font-black text-4xl text-white">{plan.price}</span>
                    <span className="text-[#6B6B6B] text-sm">/ month</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-7 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-[13px] text-[#B3B3B3]">
                      <CheckCircle className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/contact"
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
        </div>
      </section>

      {/* ─── FINAL CTA ─────────────────────────────────────────── */}
      <section className="py-28 border-t border-[#1A1A1A] relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 100%, rgba(212,175,55,0.06), transparent)' }}
        />
        <div className="relative max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-[#D4AF37] text-[11px] font-bold uppercase tracking-[0.2em] mb-5">Get Started</p>
          <h2 className="font-display font-black text-5xl lg:text-7xl text-white mb-6 leading-[0.95]">
            Ready to Scale?
          </h2>
          <p className="text-[text-white] text-[15px] leading-relaxed mb-10 max-w-lg mx-auto">
            We only work with brands we believe we can grow. Book a call and let&apos;s see if we&apos;re a fit.
          </p>
          <Link
            href="/contact"
            className="btn-gold inline-flex gap-2 py-5 px-10 text-[15px]"
          >
            Book Your Strategy Call <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-[text-white] text-[11px] mt-5 tracking-wide">
            Free 30-min call · No commitment · Limited spots available
          </p>
        </div>
      </section>

      <MarketingFooter />
    </div>
  )
}

// src/app/(public)/page.tsx

import Link from 'next/link'
import { ArrowRight, Target, BarChart2, TrendingUp, Zap, Shield, Clock, Check } from 'lucide-react'
import { MarketingNav }    from '@/components/marketing/nav'
import { MarketingFooter } from '@/components/marketing/footer'

export default function HomePage() {
  return (
    <div className="bg-[#050505] min-h-screen">
      <MarketingNav />

      {/* ─── HERO ──────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center pt-28 pb-20 overflow-hidden">
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
            <h1 className="font-display font-black text-5xl sm:text-6xl lg:text-[80px] text-white leading-[0.95] tracking-tight mb-6">
              We Don&apos;t Run Ads.
              <br />
              <span className="gold-text">We Engineer Growth.</span>
            </h1>

            <p className="text-[#B3B3B3] text-lg leading-relaxed max-w-2xl mb-10">
              We build Meta ad systems that consistently convert cold traffic into booked appointments
              that are fully tracked, optimized, and scaled week over week.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/book" className="btn-gold gap-2 py-4 px-8 text-[14px]">
                Book a Free Strategy Call <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#how-it-works" className="btn-outline py-4 px-8 text-[14px]">
                See How It Works
              </a>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-10 mt-16 pt-12 border-t border-[#1A1A1A]">
              {[
                { value: '$5M+', label: 'Ad Spend Managed'   },
                { value: '$18',   label: 'Average CPL'         },
                { value: '100+',  label: 'Campaigns Launched'  },
                { value: '98%',   label: 'Client Retention'    },
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

      {/* ─── PLATFORMS BAR ─────────────────────────────────────────── */}
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

      {/* ─── WHAT WE DO ────────────────────────────────────────────── */}
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
                title: 'Lead Generation System',
                desc:  'We build Meta ad funnels designed specifically to generate booked appointments, not just clicks.',
              },
              {
                icon: BarChart2,
                title: 'CPL Obsessed',
                desc:  'Cost per lead is the only number that matters first. We engineer campaigns to stay well under $30 CPL.',
              },
              {
                icon: TrendingUp,
                title: 'Scaling Strategy',
                desc:  'Once we find what works, we press the gas. We increase budgets on winners and cut what doesn\'t perform.',
              },
              {
                icon: Zap,
                title: 'Creative Production',
                desc:  'Scroll-stopping static and video ads built on data. We test 2–6 creatives at a time to find your best angle.',
              },
              {
                icon: Shield,
                title: 'Offer Testing',
                desc:  'We systematically test different angles and offers until we find what your audience responds to most.',
              },
              {
                icon: Clock,
                title: 'Weekly Reporting',
                desc:  'Bi-weekly or weekly reports. You always know your spend, CPL, leads, and booked appointments.',
              },
            ].map((s) => (
              <div
                key={s.title}
                className="group bg-[#0C0C0C] hover:bg-[#0F0F0F] border border-[#1A1A1A] hover:border-[rgba(212,175,55,0.18)] rounded-2xl p-6 transition-all duration-200"
              >
                <div className="w-10 h-10 bg-[rgba(212,175,55,0.07)] border border-[rgba(212,175,55,0.15)] rounded-xl flex items-center justify-center mb-5">
                  <s.icon className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <h3 className="font-display font-bold text-white text-lg mb-2 tracking-wide">{s.title}</h3>
                <p className="text-[#6B6B6B] text-[13px] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ──────────────────────────────────────────── */}
      <section id="how-it-works" className="py-28 border-t border-[#1A1A1A] bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-16">
            <p className="text-[#D4AF37] text-[11px] font-bold uppercase tracking-[0.2em] mb-4">The Process</p>
            <h2 className="font-display font-black text-4xl lg:text-5xl text-white max-w-xl leading-tight">
              How ATP Scales Works
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6 lg:gap-10">
            {[
              { num: '01', title: 'Strategy & Build', desc: 'We dissect your offer, audience, and competitors — then build campaigns and creatives from the ground up.' },
              { num: '02', title: 'Build & Launch',  desc: 'Campaigns and creatives engineered around your offer. We test 2–3 angles from day one.' },
              { num: '03', title: 'Optimize Daily',  desc: 'We monitor CPL daily. Weekly adjustments to creatives, targeting, and budget allocation.' },
              { num: '04', title: 'Scale Winners',   desc: 'Once CPL is under $30 and bookings are consistent, we increase budget and add new campaigns.' },
            ].map((step, i) => (
              <div key={step.num} className="relative">
                {i < 3 && (
                  <div className="hidden md:block absolute top-[26px] left-[calc(100%+12px)] h-px bg-gradient-to-r from-[#2A2A2A] to-transparent w-1/2" />
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

      {/* ─── RESULTS ───────────────────────────────────────────────── */}
      <section id="results" className="py-28 border-t border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-16">
            <p className="text-[#D4AF37] text-[11px] font-bold uppercase tracking-[0.2em] mb-4">Real Numbers</p>
            <h2 className="font-display font-black text-4xl lg:text-5xl text-white max-w-xl leading-tight">
              What to Expect
            </h2>
            <p className="text-[#666] text-[14px] mt-3 max-w-xl leading-relaxed">
              Based on our campaigns. Results vary by offer, market, and ad spend — but here&apos;s what the math looks like.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                tag:      'Meta Ads',
                headline: '$18 Average CPL',
                detail:   '$2,00 in ad spend generated 111 leads at $18 cost per lead.',
                metrics:  [{ label: 'Ad Spend', value: '$2,000' }, { label: 'Leads', value: '111' }, { label: 'CPL', value: '$18' }],
                featured: false,
              },
              {
                tag:      'Lead Volume',
                headline: '142 Leads in a Month',
                detail:   'Up 45% from the prior month. Same budget, better creative and targeting.',
                metrics:  [{ label: 'Prior Month', value: '98' }, { label: 'This Month', value: '142' }, { label: 'Growth', value: '+45%' }],
                featured: true,
              },
              {
                tag:      'Bookings',
                headline: '20–32 Appointments',
                detail:   'At a 25% booking rate on 80–130 leads from $2,000 ad spend.',
                metrics:  [{ label: 'Leads', value: '80–130' }, { label: 'Booking Rate', value: '25%' }, { label: 'Booked', value: '20–32' }],
                featured: false,
              },
            ].map((r) => (
              <div
                key={r.headline}
                className={`rounded-2xl p-7 border ${
                  r.featured
                    ? 'bg-[#0F0F0F] border-[rgba(212,175,55,0.25)] shadow-gold'
                    : 'bg-[#0C0C0C] border-[#1A1A1A]'
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#D4AF37] bg-[rgba(212,175,55,0.08)] border border-[rgba(212,175,55,0.15)] px-2.5 py-1 rounded-md">
                  {r.tag}
                </span>
                <p className="font-display font-black text-2xl lg:text-3xl text-white mt-5 mb-2 leading-tight">{r.headline}</p>
                <p className="text-[#6B6B6B] text-[13px] leading-relaxed mb-5">{r.detail}</p>
                <div className="flex gap-6 pt-5 border-t border-[#1A1A1A]">
                  {r.metrics.map((m) => (
                    <div key={m.label}>
                      <p className="font-display font-bold text-xl text-[#D4AF37]">{m.value}</p>
                      <p className="text-[#555] text-[10px] uppercase tracking-wider mt-0.5">{m.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING PREVIEW ───────────────────────────────────────── */}
      <section id="pricing" className="py-28 border-t border-[#1A1A1A] bg-[#0A0A0A]">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-[#D4AF37] text-[11px] font-bold uppercase tracking-[0.2em] mb-4">Pricing</p>
            <h2 className="font-display font-black text-4xl lg:text-5xl text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-[#666] mt-3 max-w-lg mx-auto text-[14px] leading-relaxed">
              Simple monthly pricing. Ad spend is separate and paid directly to Meta.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {[
              {
                name:     'Essential',
                price:    '$1,500',
                desc:     'Getting started, testing, steady lead flow',
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
                desc:     'Scaling revenue and maximizing bookings',
                featured: true,
                cta:      'Book a Call',
                features: [
                  'Everything in Essential',
                  'More creatives (4–6 ads running/testing)',
                  'Faster optimization (multiple adjustments/week)',
                  'Offer testing (finding better-performing angles)',
                  'Scaling strategy (increasing budget on winners)',
                  'Weekly reports + monthly strategy call',
                ],
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
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#8A6E2F] via-[#D4AF37] to-[#E6C65C] text-black text-[10px] font-black uppercase tracking-[0.12em] px-4 py-1 rounded-full whitespace-nowrap">
                    Most Popular
                  </div>
                )}
                <div className="mb-5">
                  <p className="font-display font-bold text-white text-xl tracking-wide">{plan.name}</p>
                  <p className="text-[#555] text-[12px] mt-0.5">Best for: {plan.desc}</p>
                  <div className="flex items-baseline gap-1 mt-4">
                    <span className="font-display font-black text-4xl text-white">{plan.price}</span>
                    <span className="text-[#555] text-sm">/ month</span>
                  </div>
                </div>
                <ul className="space-y-2.5 mb-7 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[13px] text-[#B3B3B3]">
                      <Check className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/book"
                  className={`block text-center py-3.5 rounded-xl text-[13px] font-bold tracking-wide transition-all ${
                    plan.featured
                      ? 'btn-gold justify-center'
                      : 'border border-[#222] hover:border-[rgba(212,175,55,0.3)] text-[#B3B3B3] hover:text-[#D4AF37]'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          <p className="text-center text-[#333] text-[12px]">
Ad spend is separate and billed directly to Meta
          </p>
        </div>
      </section>

      {/* ─── FINAL CTA ─────────────────────────────────────────────── */}
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
          <p className="text-[#888] text-[15px] leading-relaxed mb-10 max-w-lg mx-auto">
            We only work with brands we know we can grow. Book a call — we&apos;ll audit your situation and tell you honestly if we&apos;re a fit.
          </p>
          <Link href="/book" className="btn-gold inline-flex gap-2 py-5 px-10 text-[15px]">
            Book Your Free Strategy Call <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-[#333] text-[11px] mt-5 tracking-wide">
            Free 30-min call · No commitment · Limited spots available
          </p>
        </div>
      </section>

      <MarketingFooter />
    </div>
  )
}

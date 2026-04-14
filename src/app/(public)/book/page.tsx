// src/app/(public)/book/page.tsx

import type { Metadata } from 'next'
import { MarketingNav }    from '@/components/marketing/nav'
import { MarketingFooter } from '@/components/marketing/footer'
import { CalendlyWidget }  from '@/components/booking/calendly-widget'
import { Clock, TrendingUp, Users, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title:       'Book a Strategy Call',
  description: 'Schedule a free 30-minute strategy call with the ATP Scales team.',
}

const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL || 'https://calendly.com/atpscales/strategy-call'

const PERKS = [
  { icon: Clock,       title: '30 Minutes',        desc: 'No fluff, straight to what matters.' },
  { icon: TrendingUp,  title: 'Free Ad Audit',      desc: 'We identify where money is being lost.' },
  { icon: Users,       title: 'Custom Growth Plan', desc: 'A clear roadmap you keep either way.' },
  { icon: CheckCircle, title: 'Zero Pressure',      desc: 'Honest fit assessment — no hard sell.' },
]

export default function BookPage() {
  return (
    <div className="bg-[#050505] min-h-screen">
      <MarketingNav />

      <section className="pt-32 pb-24 relative overflow-hidden">
        {/* Background glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(212,175,55,0.07), transparent 65%)',
          }}
        />

        <div className="relative max-w-4xl mx-auto px-6 lg:px-8">

          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 border border-[rgba(212,175,55,0.25)] bg-[rgba(212,175,55,0.05)] rounded-full px-4 py-1.5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
              <span className="text-[#D4AF37] text-[11px] font-bold tracking-[0.18em] uppercase">
                Free Strategy Call
              </span>
            </div>
            <h1 className="font-display font-black text-5xl lg:text-6xl text-white leading-tight mb-4">
              Let&apos;s See If We&apos;re<br />
              <span className="gold-text">A Good Fit</span>
            </h1>
            <p className="text-[#888] text-[15px] max-w-lg mx-auto leading-relaxed">
              Book a free 30-minute call. We&apos;ll audit your ads and show you exactly
              where your biggest growth opportunities are.
            </p>
          </div>

          {/* Perks row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {PERKS.map(item => (
              <div
                key={item.title}
                className="bg-[#0C0C0C] border border-[#1A1A1A] rounded-xl p-4 flex flex-col gap-2"
              >
                <div className="w-7 h-7 rounded-lg bg-[rgba(212,175,55,0.07)] border border-[rgba(212,175,55,0.12)] flex items-center justify-center shrink-0">
                  <item.icon className="w-3.5 h-3.5 text-[#D4AF37]" />
                </div>
                <p className="text-white text-[12px] font-semibold leading-snug">{item.title}</p>
                <p className="text-[#555] text-[11px] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Calendly widget */}
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid #1A1A1A' }}>
            <CalendlyWidget url={CALENDLY_URL} />
          </div>

          {/* Stats strip */}
          <div className="mt-8 grid grid-cols-4 gap-4 border border-[#1A1A1A] rounded-2xl bg-[#0A0A0A] px-6 py-5">
            {[
              { value: '$14M+', label: 'Ad Spend Managed'   },
              { value: '$20',   label: 'Avg. Cost Per Lead'  },
              { value: '180+',  label: 'Campaigns Launched'  },
              { value: '98%',   label: 'Client Retention'    },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <p className="font-display font-black text-2xl gold-text">{stat.value}</p>
                <p className="text-[#444] text-[10px] uppercase tracking-wider mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      <MarketingFooter />
    </div>
  )
}

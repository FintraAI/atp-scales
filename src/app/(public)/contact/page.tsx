// src/app/(public)/contact/page.tsx

import { MarketingNav } from '@/components/marketing/nav'
import { MarketingFooter } from '@/components/marketing/footer'
import { ArrowRight, Phone, Mail, MapPin, Clock } from 'lucide-react'

export const metadata = {
  title: 'Book a Strategy Call',
  description: 'Ready to scale? Book a free 30-minute strategy call with the ATP Scales team.',
}

export default function ContactPage() {
  return (
    <div className="bg-[#050505] min-h-screen">
      <MarketingNav />

      <div className="pt-28 pb-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">

          {/* Header */}
          <div className="mb-14 max-w-2xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#D4AF37] mb-4">
              Book a Call
            </p>
            <h1 className="font-display font-black text-5xl lg:text-6xl text-white leading-tight mb-4">
              Let&apos;s See If We&apos;re a Fit
            </h1>
            <p className="text-[#B3B3B3] text-base leading-relaxed">
              We only take on clients we know we can grow. A 30-minute call lets us understand
              your business and tell you honestly whether paid ads make sense for you right now.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-10">

            {/* Left: info */}
            <div className="md:col-span-2 space-y-6">
              {[
                { icon: Clock,  label: 'Duration',  value: '30 minutes' },
                { icon: Phone,  label: 'Format',    value: 'Video or phone call' },
                { icon: Mail,   label: 'Response',  value: 'Within 24 hours' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-[rgba(212,175,55,0.08)] border border-[rgba(212,175,55,0.15)] flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wider font-bold text-[#444] mb-0.5">{label}</p>
                    <p className="text-[#B3B3B3] text-sm">{value}</p>
                  </div>
                </div>
              ))}

              {/* What to expect */}
              <div className="mt-8 p-5 bg-[#0F0F0F] border border-[#222222] rounded-2xl">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#444] mb-4">On the call we cover</p>
                <ul className="space-y-2.5">
                  {[
                    'Your current ad spend and results',
                    'Your offer and target market',
                    'What\'s working, what\'s not',
                    'A specific growth opportunity we see',
                    'Whether ATP Scales is the right fit',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-[13px] text-[#777]">
                      <span className="text-[#D4AF37] text-[10px] mt-1 shrink-0">◆</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right: form */}
            <div className="md:col-span-3">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>

      <MarketingFooter />
    </div>
  )
}

// Client-side form component
function ContactForm() {
  return (
    <div className="bg-[#0F0F0F] border border-[#222222] rounded-2xl p-7">
      <form className="space-y-4" action="/api/contact" method="POST">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[text-white] mb-1.5">
              First Name
            </label>
            <input
              name="firstName"
              required
              placeholder="Alex"
              className="atp-input"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[text-white] mb-1.5">
              Last Name
            </label>
            <input
              name="lastName"
              required
              placeholder="Thompson"
              className="atp-input"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[text-white] mb-1.5">
            Business Email
          </label>
          <input
            name="email"
            type="email"
            required
            placeholder="you@company.com"
            className="atp-input"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[text-white] mb-1.5">
            Company / Brand Name
          </label>
          <input
            name="company"
            required
            placeholder="Velocity Roofing"
            className="atp-input"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[text-white] mb-1.5">
            Monthly Ad Budget (approximate)
          </label>
          <select name="budget" className="atp-input" style={{ appearance: 'none' }}>
            <option value="">Select a range...</option>
            <option value="1k-3k">$1,000 – $3,000/mo</option>
            <option value="3k-10k">$3,000 – $10,000/mo</option>
            <option value="10k-25k">$10,000 – $25,000/mo</option>
            <option value="25k-plus">$25,000+/mo</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[text-white] mb-1.5">
            What are you trying to achieve? (optional)
          </label>
          <textarea
            name="message"
            rows={3}
            placeholder="Tell us about your business, current situation, and main goal..."
            className="atp-input resize-none"
          />
        </div>

        <button
          type="submit"
          className="btn-gold w-full justify-center py-3.5 text-[14px]"
        >
          Book My Strategy Call <ArrowRight className="w-4 h-4" />
        </button>

        <p className="text-center text-[#333] text-xs">
          No commitment. We&apos;ll reach out within 24 hours to schedule.
        </p>
      </form>
    </div>
  )
}

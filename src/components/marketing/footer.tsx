// src/components/marketing/footer.tsx

import Link from 'next/link'
import { AtpLogo } from '@/components/brand/logo'
import { Mail } from 'lucide-react'

const FOOTER_COLS = [
  {
    title: 'Services',
    links: [
      { label: 'Paid Social (Meta)',       href: '/#services' },
      { label: 'Paid Search (Google)',     href: '/#services' },
      { label: 'Full-Funnel Strategy',     href: '/#services' },
      { label: 'Creative Production',      href: '/#services' },
      { label: 'Conversion Optimization',  href: '/#services' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Results & Cases', href: '/#results'  },
      { label: 'Pricing',         href: '/pricing'   },
      { label: 'Book a Call',     href: '/book'      },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms of Service',          href: '/terms'   },
      { label: 'Privacy Policy',            href: '/privacy' },
      { label: 'Data Processing Agreement', href: '/terms'   },
      { label: 'Payment Authorization',     href: '/terms'   },
    ],
  },
]

export function MarketingFooter() {
  return (
    <footer className="bg-[#050505] border-t border-[#181818]">

      {/* CTA strip */}
      <div className="border-b border-[#0F0F0F] bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-display font-black text-2xl text-white leading-tight">
              Ready to scale your brand?
            </p>
            <p className="text-[#6B6B6B] text-sm mt-1">
              Free 30-min strategy call. No commitment. Limited spots.
            </p>
          </div>
          <Link href="/book" className="btn-gold shrink-0 py-3.5 px-8 text-[14px]">
            Book a Strategy Call
          </Link>
        </div>
      </div>

      {/* Link grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">

          {/* Brand column */}
          <div className="col-span-2">
            <AtpLogo size="sm" className="mb-5" />
            <p className="text-[#6B6B6B] text-[13px] leading-relaxed max-w-[240px] mb-6">
              Precision-engineered ad systems for ambitious brands. Every dollar tracked.
              Every decision data-driven.
            </p>
            <a
              href="mailto:info@atpscales.com"
              className="flex items-center gap-2.5 text-[12px] text-[#6B6B6B] hover:text-[#D4AF37] transition-colors"
            >
              <Mail className="w-3.5 h-3.5 shrink-0" />
              info@atpscales.com
            </a>
            <div className="flex items-center gap-3 mt-6">
              <a
                href="https://www.instagram.com/atpscales/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-lg bg-[#0F0F0F] border border-[#222222] flex items-center justify-center text-[#333] hover:text-[#D4AF37] hover:border-[rgba(212,175,55,0.2)] transition-all"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M6.5 20.5h11a3 3 0 003-3v-11a3 3 0 00-3-3h-11a3 3 0 00-3 3v11a3 3 0 003 3z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_COLS.map((col) => (
            <div key={col.title} className="col-span-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37] mb-5">
                {col.title}
              </p>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-[#6B6B6B] hover:text-[#D4AF37] text-[13px] transition-colors leading-snug block"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#0F0F0F] bg-[#040404]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[#2A2A2A] text-[11px]">
            © {new Date().getFullYear()} ATP Scales LLC. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/privacy"    className="text-[#2A2A2A] hover:text-[#D4AF37] text-[11px] transition-colors">Privacy</Link>
            <span className="text-[#1E1E1E]">·</span>
            <Link href="/terms"      className="text-[#2A2A2A] hover:text-[#D4AF37] text-[11px] transition-colors">Terms</Link>
            <span className="text-[#1E1E1E]">·</span>
            <Link href="/terms"      className="text-[#2A2A2A] hover:text-[#D4AF37] text-[11px] transition-colors">DPA</Link>
            <span className="text-[#1E1E1E]">·</span>
            <a href="mailto:info@atpscales.com" className="text-[#2A2A2A] hover:text-[#D4AF37] text-[11px] transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

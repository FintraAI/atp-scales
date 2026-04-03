'use client'
// src/components/marketing/nav.tsx

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { AtpHorizontal } from '@/components/brand/logo'

const NAV_LINKS = [
  { href: '/#services', label: 'Services' },
  { href: '/pricing',   label: 'Pricing'  },
  { href: '/contact',   label: 'Contact'  },
]

export function MarketingNav() {
  const [scrolled,    setScrolled]    = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-[#060606]/95 backdrop-blur-md border-b border-[#1C1C1C] shadow-[0_1px_0_0_rgba(201,168,76,0.06)]'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-[68px]">

          {/* ── Logo ── */}
          <Link href="/" className="shrink-0 opacity-90 hover:opacity-100 transition-opacity">
            <AtpHorizontal height={32} />
          </Link>

          {/* ── Desktop links ── */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-[#666] hover:text-[#D8D8D8] text-[13px] font-medium tracking-wide transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* ── Desktop CTAs ── */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-[#555] hover:text-[#D8D8D8] text-[13px] font-medium transition-colors"
            >
              Client Login
            </Link>
            <Link
              href="/contact"
              className="btn-gold py-2 px-5 text-[13px]"
            >
              Book a Call
            </Link>
          </div>

          {/* ── Mobile toggle ── */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-[#666] hover:text-[#D8D8D8] transition-colors p-1.5 rounded-lg"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* ── Mobile menu ── */}
        {mobileOpen && (
          <div className="md:hidden border-t border-[#1C1C1C] py-5 space-y-1 bg-[#060606]/98 backdrop-blur-md">
            {[...NAV_LINKS, { href: '/login', label: 'Client Login' }].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block px-2 py-3 text-[#666] hover:text-[#D8D8D8] text-sm font-medium transition-colors rounded-lg hover:bg-white/[0.02]"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-3">
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="btn-gold w-full justify-center py-3 text-[13px]"
              >
                Book a Strategy Call
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

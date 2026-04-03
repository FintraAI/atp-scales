// src/components/marketing/footer.tsx

import Link from 'next/link'
import { AtpLogo } from '@/components/brand/logo'

export function MarketingFooter() {
  return (
    <footer className="border-t border-[#1a1a1a] py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <AtpLogo size="sm" className="mb-5" />
            <p className="text-[#555] text-sm leading-relaxed max-w-[220px]">
              Precision-engineered ad systems for ambitious brands.
            </p>
          </div>

          {/* Links */}
          {[
            {
              title: 'Company',
              links: [
                { label: 'Services',  href: '/#services' },
                { label: 'Pricing',   href: '/pricing'   },
                { label: 'Contact',   href: '/contact'   },
              ],
            },
            {
              title: 'Platform',
              links: [
                { label: 'Client Login',   href: '/login'             },
                { label: 'Dashboard Demo', href: '/login'             },
                { label: 'Integrations',   href: '/#integrations'     },
              ],
            },
            {
              title: 'Legal',
              links: [
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms of Use',   href: '/terms'   },
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#444] mb-4">
                {col.title}
              </p>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-[#555] hover:text-[#C9A84C] text-sm transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-[#1a1a1a] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#333] text-xs">
            © {new Date().getFullYear()} ATP Scales. All rights reserved.
          </p>
          <p className="text-[#2a2a2a] text-xs">
            Built for performance. Engineered to scale.
          </p>
        </div>
      </div>
    </footer>
  )
}

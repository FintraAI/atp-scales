// src/app/(public)/privacy/page.tsx

import { MarketingNav } from '@/components/marketing/nav'
import { MarketingFooter } from '@/components/marketing/footer'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy',
  description: 'How ATP Scales LLC collects, uses, and protects your information.',
}

const SECTIONS = [
  { id: 's1',  title: 'Information We Collect'              },
  { id: 's2',  title: 'How We Use Your Information'         },
  { id: 's3',  title: 'Cookies & Tracking'                  },
  { id: 's4',  title: 'Third-Party Services'                },
  { id: 's5',  title: 'Data Protection'                     },
  { id: 's6',  title: 'Data Sharing'                        },
  { id: 's7',  title: 'Your Rights (CA & U.S.)'             },
  { id: 's8',  title: 'Data Retention'                      },
  { id: 's9',  title: 'Client Responsibility'               },
  { id: 's10', title: "Children's Privacy"                  },
  { id: 's11', title: 'Updates to This Policy'              },
  { id: 's12', title: 'Contact Us'                          },
]

export default function PrivacyPage() {
  return (
    <div className="bg-[#050505] min-h-screen">
      <MarketingNav />

      {/* ── Header ─────────────────────────────────────────── */}
      <section className="pt-32 pb-16 border-b border-[#1A1A1A] relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(212,175,55,0.06), transparent 70%)' }}
        />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-[#D4AF37] text-[11px] font-bold uppercase tracking-[0.22em] mb-4">Legal</p>
          <h1 className="font-display font-black text-5xl lg:text-6xl text-white leading-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-[#6B6B6B] text-base max-w-xl leading-relaxed">
            How ATP Scales LLC collects, uses, and protects your information.
          </p>
          <p className="text-[#333] text-sm mt-3">Last updated: April 3, 2026</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* ── Sticky TOC sidebar ───────────────────────────── */}
          <aside className="lg:w-[240px] shrink-0">
            <div className="lg:sticky lg:top-28 space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#333] mb-4 px-3">
                Sections
              </p>
              {SECTIONS.map(({ id, title }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className="block px-3 py-2 rounded-lg text-[13px] text-[#6B6B6B] hover:text-[#D4AF37] hover:bg-[rgba(212,175,55,0.04)] transition-all truncate"
                >
                  {title}
                </a>
              ))}

              <div className="mt-6 pt-6 border-t border-[#1A1A1A]">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#333] mb-3 px-3">
                  Related
                </p>
                <Link
                  href="/terms"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] text-[#6B6B6B] hover:text-[#D4AF37] hover:bg-[rgba(212,175,55,0.04)] transition-all"
                >
                  Terms of Service <ArrowRight className="w-3 h-3 ml-auto" />
                </Link>
              </div>
            </div>
          </aside>

          {/* ── Main content ─────────────────────────────────── */}
          <main className="flex-1 min-w-0">
            <div className="bg-[#0C0C0C] border border-[#1A1A1A] rounded-2xl overflow-hidden privacy-body">

              {/* Intro */}
              <div className="px-8 py-8 border-b border-[#1A1A1A]">
                <p className="text-[14px] text-[#777] leading-relaxed">
                  ATP Scales LLC ("we," "us," or "our") respects your privacy. This Privacy Policy explains
                  how we collect, use, and protect your information when you use our website and
                  services. By using our website or services, you agree to this Privacy Policy.
                </p>
              </div>

              {/* Sections */}
              <div className="divide-y divide-[#181818]">

                <PrivacySection id="s1" num="1" title="Information We Collect">
                  <p>We may collect the following types of information:</p>
                  <SubHead>Personal Information</SubHead>
                  <ul>
                    <li>Name</li>
                    <li>Email address</li>
                    <li>Phone number</li>
                    <li>Business name and details</li>
                  </ul>
                  <SubHead>Business &amp; Account Data</SubHead>
                  <ul>
                    <li>Website data</li>
                    <li>Advertising account data (e.g., Meta, Google Ads)</li>
                    <li>Campaign performance metrics</li>
                  </ul>
                  <SubHead>Usage Data</SubHead>
                  <ul>
                    <li>IP address, browser type and device</li>
                    <li>Pages visited and time spent</li>
                    <li>Cookies and tracking data</li>
                  </ul>
                </PrivacySection>

                <PrivacySection id="s2" num="2" title="How We Use Your Information">
                  <p>We use collected information to:</p>
                  <ul>
                    <li>Provide and manage our services</li>
                    <li>Run and optimize advertising campaigns</li>
                    <li>Communicate with you (updates, support, onboarding)</li>
                    <li>Improve website performance and user experience</li>
                    <li>Analyze data and performance metrics</li>
                  </ul>
                </PrivacySection>

                <PrivacySection id="s3" num="3" title="Cookies & Tracking Technologies">
                  <p>We use cookies and similar technologies to:</p>
                  <ul>
                    <li>Track website activity</li>
                    <li>Improve user experience</li>
                    <li>Measure advertising performance</li>
                  </ul>
                  <p>
                    You can disable cookies through your browser settings, but some features may not
                    function properly.
                  </p>
                </PrivacySection>

                <PrivacySection id="s4" num="4" title="Third-Party Services">
                  <p>We use third-party platforms, including:</p>
                  <ul>
                    <li>Meta Platforms (Facebook &amp; Instagram advertising)</li>
                    <li>Google Analytics</li>
                    <li>CRM and tracking tools</li>
                  </ul>
                  <p>
                    These platforms may collect, store, and process your data according to their own
                    privacy policies. We do not control how third parties handle your data.
                  </p>
                </PrivacySection>

                <PrivacySection id="s5" num="5" title="Data Protection">
                  <p>
                    We take reasonable administrative, technical, and physical measures to protect your
                    information. However, no system is 100% secure, and we cannot guarantee absolute
                    security of your data.
                  </p>
                </PrivacySection>

                <PrivacySection id="s6" num="6" title="Data Sharing">
                  <p>We do not sell your personal information. We may share data with:</p>
                  <ul>
                    <li>Service providers and platforms necessary to deliver our services</li>
                    <li>Advertising platforms for campaign execution</li>
                    <li>Legal authorities if required by law</li>
                  </ul>
                </PrivacySection>

                <PrivacySection id="s7" num="7" title="Your Rights (California & U.S. Users)">
                  <p>
                    If you are a California resident, you may have rights under the California Consumer
                    Privacy Act (CCPA), including:
                  </p>
                  <ul>
                    <li>The right to request access to your data</li>
                    <li>The right to request deletion of your data</li>
                    <li>The right to know how your data is used</li>
                  </ul>
                  <p>
                    To make a request, contact us at{' '}
                    <a href="mailto:info@atpscales.com">info@atpscales.com</a>
                  </p>
                </PrivacySection>

                <PrivacySection id="s8" num="8" title="Data Retention">
                  <p>We retain your information only as long as necessary to:</p>
                  <ul>
                    <li>Provide services</li>
                    <li>Comply with legal obligations</li>
                    <li>Resolve disputes</li>
                  </ul>
                  <p>We may delete or anonymize data when no longer needed.</p>
                </PrivacySection>

                <PrivacySection id="s9" num="9" title="Client Responsibility">
                  <p>
                    Clients are responsible for ensuring their own compliance with applicable data
                    protection laws when collecting and using customer data, including leads generated
                    through advertising campaigns. ATP Scales LLC is not responsible for how clients use or
                    manage collected data.
                  </p>
                </PrivacySection>

                <PrivacySection id="s10" num="10" title="Children's Privacy">
                  <p>
                    Our services are not intended for individuals under 18. We do not knowingly collect
                    personal information from minors.
                  </p>
                </PrivacySection>

                <PrivacySection id="s11" num="11" title="Updates to This Policy">
                  <p>
                    We may update this Privacy Policy at any time. Updates will be posted on this page
                    with the revised effective date. Continued use of our services after updates
                    constitutes acceptance of the revised policy.
                  </p>
                </PrivacySection>

                <PrivacySection id="s12" num="12" title="Contact Us">
                  <p>
                    If you have any questions about this Privacy Policy or our data practices, contact:
                  </p>
                  <div className="mt-4 p-4 bg-[rgba(212,175,55,0.04)] border border-[rgba(212,175,55,0.1)] rounded-xl inline-block">
                    <p className="text-[12px] text-[#6B6B6B] uppercase tracking-wider mb-1">Email</p>
                    <a href="mailto:info@atpscales.com" className="text-[#D4AF37] font-medium text-[14px]">
                      info@atpscales.com
                    </a>
                  </div>
                </PrivacySection>
              </div>
            </div>
          </main>
        </div>
      </div>

      <MarketingFooter />
    </div>
  )
}

function PrivacySection({
  id, num, title, children,
}: {
  id: string; num: string; title: string; children: React.ReactNode
}) {
  return (
    <section id={id} className="px-8 py-8 scroll-mt-28 space-y-4">
      <h2 className="flex items-baseline gap-3 font-display font-black text-xl text-white tracking-wide">
        <span className="text-[#2A2A2A] font-display text-[14px] font-normal">{num}.</span>
        {title}
      </h2>
      <div className="space-y-3 pl-5 border-l border-[#222222]">
        {children}
      </div>
    </section>
  )
}

function SubHead({ children }: { children: React.ReactNode }) {
  return (
    <p className="!text-[12px] !text-[#6B6B6B] font-bold uppercase tracking-[0.12em] mt-4 mb-1">
      {children}
    </p>
  )
}

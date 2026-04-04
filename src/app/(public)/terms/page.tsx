// src/app/(public)/terms/page.tsx

import { MarketingNav } from '@/components/marketing/nav'
import { MarketingFooter } from '@/components/marketing/footer'
import { Shield, FileText, CreditCard, Camera, Users, Lock, UserMinus, BarChart2 } from 'lucide-react'

export const metadata = {
  title: 'Terms of Service & Legal',
  description: 'ATP Scales terms of service, data processing agreement, and all client agreements.',
}

const SECTIONS = [
  { id: 'tos',         label: 'Terms of Service',        icon: FileText  },
  { id: 'privacy',     label: 'Privacy Policy',           icon: Shield    },
  { id: 'dpa',         label: 'Data Processing',          icon: Lock      },
  { id: 'media',       label: 'Media Release',            icon: Camera    },
  { id: 'payment',     label: 'Payment Authorization',    icon: CreditCard},
  { id: 'adaccount',   label: 'Ad Account Responsibility',icon: BarChart2 },
  { id: 'contractor',  label: 'Contractor Agreement',     icon: Users     },
  { id: 'nda',         label: 'Non-Disclosure',           icon: Lock      },
  { id: 'offboarding', label: 'Offboarding Process',      icon: UserMinus },
]

export default function TermsPage() {
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
            Terms &amp; Agreements
          </h1>
          <p className="text-[#6B6B6B] text-base max-w-xl leading-relaxed">
            All legal agreements governing our services, data handling, and client relationships.
            Last updated April 3, 2026.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* ── Sticky TOC sidebar ───────────────────────────── */}
          <aside className="lg:w-[240px] shrink-0">
            <div className="lg:sticky lg:top-28 space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#333] mb-4 px-3">
                Documents
              </p>
              {SECTIONS.map(({ id, label, icon: Icon }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] text-[#6B6B6B] hover:text-[#D4AF37] hover:bg-[rgba(212,175,55,0.04)] transition-all"
                >
                  <Icon className="w-3.5 h-3.5 shrink-0 text-[#333] group-hover:text-[#D4AF37] transition-colors" />
                  {label}
                </a>
              ))}
            </div>
          </aside>

          {/* ── Main content ─────────────────────────────────── */}
          <main className="flex-1 min-w-0 space-y-16">

            {/* ══ TERMS OF SERVICE ══════════════════════════ */}
            <LegalDoc id="tos" title="Terms of Service" badge="Last updated: April 3, 2026">
              <p className="lead">
                Welcome to ATP Scales. By accessing or using our services, website, or client portal,
                you agree to the following Terms of Service.
              </p>

              <Section num="1" title="Services">
                <p>ATP Scales provides digital marketing services including but not limited to:</p>
                <ul>
                  <li>Paid advertising (Meta platforms)</li>
                  <li>Campaign management and optimization</li>
                  <li>Lead generation systems</li>
                  <li>Performance reporting</li>
                </ul>
                <p>We do not guarantee specific outcomes such as revenue, number of leads, or ROI.</p>
              </Section>

              <Section num="2" title="Eligibility">
                <p>By using our services, you confirm:</p>
                <ul>
                  <li>You are at least 18 years old</li>
                  <li>You have authority to act on behalf of your business</li>
                </ul>
              </Section>

              <Section num="3" title="Account Usage">
                <p>You agree:</p>
                <ul>
                  <li>To provide accurate information</li>
                  <li>To maintain confidentiality of login credentials</li>
                  <li>Not to misuse the platform or attempt unauthorized access</li>
                </ul>
              </Section>

              <Section num="4" title="Payments">
                <ul>
                  <li>All services are billed as agreed in client contracts</li>
                  <li>Fees are non-refundable unless otherwise stated</li>
                  <li>Late payments may result in service suspension</li>
                </ul>
              </Section>

              <Section num="5" title="Intellectual Property">
                <p>
                  All materials created by ATP Scales remain our property until full payment is received.
                </p>
              </Section>

              <Section num="6" title="Limitation of Liability">
                <p>ATP Scales is not liable for:</p>
                <ul>
                  <li>Loss of revenue or profits</li>
                  <li>Platform outages</li>
                  <li>Ad account suspensions or restrictions</li>
                </ul>
              </Section>

              <Section num="7" title="Termination">
                <p>
                  You acknowledge and agree that ATP Scales, in its sole discretion, may terminate your
                  website access if your conduct is found to be unlawful, inconsistent with, or in
                  violation of the letter or spirit of these Terms. ATP Scales shall not be liable to
                  you or any third party for termination of website access. Should you object to any
                  terms and conditions of these Terms, or to any subsequent modifications thereto, your
                  only recourse is to immediately discontinue use of the website.
                </p>
              </Section>

              <Section num="8" title="Changes to Terms">
                <p>
                  We may update these terms at any time. Continued use of our services constitutes
                  acceptance of the updated terms.
                </p>
              </Section>

              <Section num="9" title="Contact">
                <p>
                  Questions about these Terms? Contact us at{' '}
                  <a href="mailto:info@atpscales.com" className="text-[#D4AF37] hover:underline">
                    info@atpscales.com
                  </a>
                </p>
              </Section>
            </LegalDoc>

            {/* ══ PRIVACY POLICY ════════════════════════════ */}
            <LegalDoc id="privacy" title="Privacy Policy" badge="Last updated: April 3, 2026">
              <p className="lead">
                ATP Scales respects your privacy. This Privacy Policy explains how we collect, use,
                and protect your information when you use our website and services. By using our
                website or services, you agree to this Privacy Policy.
              </p>

              <Section num="1" title="Information We Collect">
                <p><strong>Personal Information:</strong></p>
                <ul>
                  <li>Name, email address, phone number</li>
                  <li>Business name and details</li>
                </ul>
                <p className="mt-3"><strong>Business &amp; Account Data:</strong></p>
                <ul>
                  <li>Website data</li>
                  <li>Advertising account data (e.g., Meta, Google Ads)</li>
                  <li>Campaign performance metrics</li>
                </ul>
                <p className="mt-3"><strong>Usage Data:</strong></p>
                <ul>
                  <li>IP address, browser type and device</li>
                  <li>Pages visited and time spent</li>
                  <li>Cookies and tracking data</li>
                </ul>
              </Section>

              <Section num="2" title="How We Use Your Information">
                <p>We use collected information to:</p>
                <ul>
                  <li>Provide and manage our services</li>
                  <li>Run and optimize advertising campaigns</li>
                  <li>Communicate with you (updates, support, onboarding)</li>
                  <li>Improve website performance and user experience</li>
                  <li>Analyze data and performance metrics</li>
                </ul>
              </Section>

              <Section num="3" title="Cookies & Tracking Technologies">
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
              </Section>

              <Section num="4" title="Third-Party Services">
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
              </Section>

              <Section num="5" title="Data Protection">
                <p>
                  We take reasonable administrative, technical, and physical measures to protect your
                  information. However, no system is 100% secure, and we cannot guarantee absolute
                  security of your data.
                </p>
              </Section>

              <Section num="6" title="Data Sharing">
                <p>We do not sell your personal information. We may share data with:</p>
                <ul>
                  <li>Service providers and software platforms necessary to deliver our services</li>
                  <li>Advertising platforms for campaign execution</li>
                  <li>Legal authorities if required by law</li>
                </ul>
              </Section>

              <Section num="7" title="Your Rights (California & U.S. Users)">
                <p>
                  If you are a California resident, you may have rights under the California Consumer
                  Privacy Act, including:
                </p>
                <ul>
                  <li>The right to request access to your data</li>
                  <li>The right to request deletion of your data</li>
                  <li>The right to know how your data is used</li>
                </ul>
                <p>
                  To make a request, contact us at{' '}
                  <a href="mailto:info@atpscales.com" className="text-[#D4AF37] hover:underline">
                    info@atpscales.com
                  </a>
                </p>
              </Section>

              <Section num="8" title="Data Retention">
                <p>We retain your information only as long as necessary to:</p>
                <ul>
                  <li>Provide services</li>
                  <li>Comply with legal obligations</li>
                  <li>Resolve disputes</li>
                </ul>
                <p>We may delete or anonymize data when no longer needed.</p>
              </Section>

              <Section num="9" title="Client Responsibility">
                <p>
                  Clients are responsible for ensuring their own compliance with applicable data
                  protection laws when collecting and using customer data (including leads generated
                  through advertising campaigns). ATP Scales is not responsible for how clients use
                  or manage collected data.
                </p>
              </Section>

              <Section num="10" title="Children's Privacy">
                <p>
                  Our services are not intended for individuals under 18. We do not knowingly collect
                  personal information from minors.
                </p>
              </Section>

              <Section num="11" title="Updates to This Policy">
                <p>
                  We may update this Privacy Policy at any time. Updates will be posted on this page
                  with the revised date. Continued use of our services constitutes acceptance of the
                  updated policy.
                </p>
              </Section>

              <Section num="12" title="Contact Us">
                <p>
                  Questions about this Privacy Policy? Contact:{' '}
                  <a href="mailto:info@atpscales.com" className="text-[#D4AF37] hover:underline">
                    info@atpscales.com
                  </a>
                </p>
              </Section>
            </LegalDoc>

            {/* ══ DATA PROCESSING AGREEMENT ═════════════════ */}
            <LegalDoc id="dpa" title="Data Processing Agreement" badge="Between ATP Scales and Client">
              <p className="lead">
                This agreement governs how ATP Scales processes data on behalf of the Client.
              </p>

              <Section num="1" title="Scope">
                <p>ATP Scales processes personal data solely to provide marketing services.</p>
              </Section>

              <Section num="2" title="Types of Data Processed">
                <ul>
                  <li>Names</li>
                  <li>Contact information</li>
                  <li>Lead data</li>
                </ul>
              </Section>

              <Section num="3" title="Responsibilities">
                <p><strong>Client:</strong></p>
                <ul>
                  <li>Owns all collected data</li>
                  <li>Ensures legal compliance</li>
                </ul>
                <p className="mt-3"><strong>ATP Scales:</strong></p>
                <ul>
                  <li>Processes data only as instructed</li>
                  <li>Does not sell or misuse data</li>
                </ul>
              </Section>

              <Section num="4" title="Security">
                <p>
                  We implement reasonable safeguards but cannot guarantee absolute security.
                </p>
              </Section>

              <Section num="5" title="Subprocessors">
                <p>We may use the following subprocessors:</p>
                <ul>
                  <li>Meta Platforms</li>
                  <li>Google</li>
                  <li>CRM tools</li>
                </ul>
              </Section>

              <Section num="6" title="Data Breach Notification">
                <p>
                  We will notify clients of any known breach within a reasonable timeframe.
                </p>
              </Section>

              <Section num="7" title="Termination">
                <p>Upon termination, data access will be revoked.</p>
              </Section>

              <Section num="8" title="Governing Law">
                <p>This agreement is governed by applicable state and federal law.</p>
              </Section>
            </LegalDoc>

            {/* ══ MEDIA RELEASE ═════════════════════════════ */}
            <LegalDoc id="media" title="Media Release & Content Consent" badge="Agreement">
              <p className="lead">
                Client grants ATP Scales permission to use submitted creative content for marketing
                purposes during and after active engagement.
              </p>

              <Section num="1" title="Content Covered">
                <ul>
                  <li>Images and photography</li>
                  <li>Videos and reels</li>
                  <li>Testimonials and reviews</li>
                  <li>Before/after content</li>
                </ul>
              </Section>

              <Section num="2" title="Permitted Usage">
                <ul>
                  <li>Paid advertising campaigns</li>
                  <li>Social media content</li>
                  <li>Marketing materials and case studies</li>
                </ul>
              </Section>

              <Section num="3" title="Terms">
                <ul>
                  <li>Content may be edited for marketing purposes</li>
                  <li>Usage continues during active engagement</li>
                  <li>Client may revoke usage rights upon termination with written notice</li>
                </ul>
              </Section>

              <Section num="4" title="Client Responsibility">
                <p>
                  Client confirms they hold legal rights to all submitted content and that its use
                  does not infringe upon any third-party rights.
                </p>
              </Section>

              <SignatureBlock fields={['Client Name', 'Signature', 'Date']} />
            </LegalDoc>

            {/* ══ PAYMENT AUTHORIZATION ═════════════════════ */}
            <LegalDoc id="payment" title="Payment Authorization Agreement" badge="Agreement">
              <p className="lead">
                Client authorizes ATP Scales to charge agreed fees per the terms below.
              </p>

              <Section num="1" title="Billing Terms">
                <ul>
                  <li>Monthly recurring billing</li>
                  <li>Payment due in advance</li>
                  <li>Late payments may result in service pause</li>
                </ul>
              </Section>

              <Section num="2" title="Failed Payments">
                <ul>
                  <li>3-day grace period from due date</li>
                  <li>Services may be suspended after grace period</li>
                </ul>
              </Section>

              <Section num="3" title="Chargeback Policy">
                <p>
                  Client agrees not to initiate chargebacks or payment disputes without first
                  contacting ATP Scales directly and allowing a reasonable resolution period.
                </p>
              </Section>

              <SignatureBlock fields={['Client Name', 'Signature', 'Date']} />
            </LegalDoc>

            {/* ══ AD ACCOUNT RESPONSIBILITY ═════════════════ */}
            <LegalDoc id="adaccount" title="Ad Account Responsibility Agreement" badge="Agreement">
              <p className="lead">
                This agreement clarifies ownership, responsibilities, and liability related to
                advertising accounts managed by ATP Scales on behalf of the Client.
              </p>

              <Section num="1" title="Ownership">
                <p>Client owns:</p>
                <ul>
                  <li>Advertising account(s)</li>
                  <li>Pages and business assets</li>
                  <li>All collected data</li>
                </ul>
              </Section>

              <Section num="2" title="Client Responsibility">
                <p>Client is responsible for:</p>
                <ul>
                  <li>Total ad spend incurred</li>
                  <li>Account policy compliance</li>
                </ul>
              </Section>

              <Section num="3" title="ATP Scales Is NOT Liable For">
                <ul>
                  <li>Account bans or restrictions</li>
                  <li>Platform policy violations</li>
                  <li>Performance outcomes</li>
                </ul>
              </Section>

              <Section num="4" title="Access Requirements">
                <p>
                  Client must grant ATP Scales the necessary permissions and access to manage
                  campaigns effectively.
                </p>
              </Section>

              <SignatureBlock fields={['Client Name', 'Signature', 'Date']} />
            </LegalDoc>

            {/* ══ INDEPENDENT CONTRACTOR ════════════════════ */}
            <LegalDoc id="contractor" title="Independent Contractor Agreement" badge="Internal Agreement">
              <p className="lead">
                This agreement governs the relationship between ATP Scales and independent contractors
                engaged to provide services.
              </p>

              <Section num="1" title="Scope of Services">
                <p>
                  Contractor provides services as defined per individual agreement. The relationship
                  is that of independent contractor — not employee, partner, or agent.
                </p>
              </Section>

              <Section num="2" title="Payment">
                <p>
                  Compensation is defined per individual agreement and paid according to agreed milestones
                  or schedules.
                </p>
              </Section>

              <Section num="3" title="Work Ownership">
                <p>
                  All work product, deliverables, and intellectual property created in the course of
                  this engagement become the property of ATP Scales upon full payment.
                </p>
              </Section>

              <Section num="4" title="Confidentiality">
                <p>
                  Contractor may not share, disclose, or distribute any client information, campaign
                  data, strategies, or proprietary business information.
                </p>
              </Section>

              <Section num="5" title="Non-Solicitation">
                <p>
                  Contractor may not independently solicit, contact, or engage ATP Scales clients
                  for competing services during or after the term of this agreement.
                </p>
              </Section>

              <SignatureBlock fields={['Contractor Name', 'Signature', 'Date']} />
            </LegalDoc>

            {/* ══ NDA ═══════════════════════════════════════ */}
            <LegalDoc id="nda" title="Non-Disclosure Agreement" badge="Mutual Agreement">
              <p className="lead">
                Both parties agree not to disclose confidential information obtained through
                their business relationship.
              </p>

              <Section num="1" title="Confidential Information Includes">
                <ul>
                  <li>Marketing strategies and campaign data</li>
                  <li>Client data and lead information</li>
                  <li>Business processes and systems</li>
                  <li>Financial information and pricing</li>
                </ul>
              </Section>

              <Section num="2" title="Obligations">
                <p>Each party agrees to:</p>
                <ul>
                  <li>Hold all confidential information in strict confidence</li>
                  <li>Not disclose to any third party without prior written consent</li>
                  <li>Use confidential information only for the purpose of the business relationship</li>
                </ul>
              </Section>

              <Section num="3" title="Term">
                <p>
                  This agreement remains in effect for 2–5 years following the termination of the
                  business relationship, as defined in the individual agreement.
                </p>
              </Section>

              <Section num="4" title="Exceptions">
                <p>Confidentiality obligations do not apply to information that is:</p>
                <ul>
                  <li>Publicly known through no fault of either party</li>
                  <li>Required to be disclosed by law or court order</li>
                </ul>
              </Section>

              <SignatureBlock fields={['Party A Name', 'Party B Name', 'Signature A', 'Signature B', 'Date']} />
            </LegalDoc>

            {/* ══ OFFBOARDING ═══════════════════════════════ */}
            <LegalDoc id="offboarding" title="Client Offboarding Process" badge="Process">
              <p className="lead">
                Upon cancellation or termination of services, the following process applies.
              </p>

              <Section num="1" title="Upon Cancellation">
                <ul>
                  <li>All active campaigns paused within 48 hours</li>
                  <li>Client retains full access to ad accounts and pages</li>
                  <li>Final performance report delivered within 5 business days</li>
                </ul>
              </Section>

              <Section num="2" title="Data Handling">
                <p>
                  Client retains full ownership of all collected data, campaign history, and
                  creative assets. ATP Scales access is revoked upon completion of offboarding.
                </p>
              </Section>

              <Section num="3" title="Outstanding Payments">
                <p>
                  All outstanding balances must be settled prior to formal account termination.
                  Unpaid invoices may delay the offboarding process.
                </p>
              </Section>

              <Section num="4" title="Reactivation">
                <p>
                  Reactivation of services is available upon request and is subject to current
                  availability and pricing.
                </p>
              </Section>
            </LegalDoc>

          </main>
        </div>
      </div>

      <MarketingFooter />
    </div>
  )
}

// ── Reusable layout components ──────────────────────────────

function LegalDoc({
  id, title, badge, children,
}: {
  id: string; title: string; badge: string; children: React.ReactNode
}) {
  return (
    <article
      id={id}
      className="scroll-mt-28 bg-[#0C0C0C] border border-[#1A1A1A] rounded-2xl overflow-hidden"
    >
      {/* Doc header */}
      <div className="px-8 py-7 border-b border-[#1A1A1A] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="font-display font-black text-2xl text-white tracking-wide">{title}</h2>
        <span className="inline-flex shrink-0 text-[10px] font-bold uppercase tracking-[0.15em] text-[#D4AF37] bg-[rgba(212,175,55,0.07)] border border-[rgba(212,175,55,0.15)] px-3 py-1.5 rounded-lg">
          {badge}
        </span>
      </div>

      {/* Doc body */}
      <div className="px-8 py-8 space-y-8 legal-body">
        {children}
      </div>

    </article>
  )
}

function Section({
  num, title, children,
}: {
  num: string; title: string; children: React.ReactNode
}) {
  return (
    <div className="space-y-3">
      <h3 className="flex items-baseline gap-3 font-display font-bold text-white text-[16px] tracking-wide">
        <span className="text-[#2A2A2A] font-display text-[13px]">{num}.</span>
        {title}
      </h3>
      <div className="space-y-3 pl-5 border-l border-[#1E1E1E]">
        {children}
      </div>
    </div>
  )
}

function SignatureBlock({ fields }: { fields: string[] }) {
  return (
    <div className="mt-6 pt-6 border-t border-[#1E1E1E]">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#333] mb-5">
        Signature Required
      </p>
      <div className="grid sm:grid-cols-3 gap-4">
        {fields.map((f) => (
          <div key={f}>
            <p className="text-[11px] text-[#6B6B6B] mb-2">{f}</p>
            <div className="h-10 border-b border-dashed border-[#2A2A2A]" />
          </div>
        ))}
      </div>
    </div>
  )
}

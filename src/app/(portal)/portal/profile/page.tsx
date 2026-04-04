// src/app/(portal)/portal/profile/page.tsx

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { formatCurrency, formatDate } from '@/lib/utils'
import { User, Building2, CreditCard, Phone, Globe, Mail, Palette } from 'lucide-react'
import { ThemeToggle } from '@/components/portal/theme-toggle'

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')

  let profile = null
  if (session.user.clientProfileId) {
    profile = await prisma.clientProfile.findUnique({
      where: { id: session.user.clientProfileId },
      include: {
        plan: true,
        accountManager: { select: { name: true, email: true } },
        user: { select: { email: true, name: true, createdAt: true } },
      },
    })
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-wide" style={{ color: 'var(--text-primary)' }}>Account</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Your account details and plan information</p>
      </div>

      {/* User info */}
      <div
        className="rounded-2xl p-6 space-y-4"
        style={{ background: 'var(--card-elevated)', border: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{
              background: 'rgba(212,175,55,0.10)',
              border: '1px solid rgba(212,175,55,0.20)',
            }}
          >
            <span className="font-display font-bold text-xl text-[#D4AF37]">
              {session.user.name?.[0]?.toUpperCase() || 'U'}
            </span>
          </div>
          <div>
            <p className="font-display font-bold text-lg" style={{ color: 'var(--text-primary)' }}>{session.user.name}</p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{session.user.email}</p>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div
        className="rounded-2xl p-6"
        style={{ background: 'var(--card-elevated)', border: '1px solid var(--border)' }}
      >
        <h2 className="font-display font-semibold text-sm mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <Palette className="w-4 h-4 text-[#D4AF37]" /> Appearance
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[13px] font-medium" style={{ color: 'var(--text-primary)' }}>Theme</p>
            <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-muted)' }}>Choose between dark and light mode</p>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {profile && (
        <>
          {/* Company info */}
          <div
            className="rounded-2xl p-6"
            style={{ background: 'var(--card-elevated)', border: '1px solid var(--border)' }}
          >
            <h2 className="font-display font-semibold text-sm mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Building2 className="w-4 h-4 text-[#D4AF37]" /> Company
            </h2>
            <div className="space-y-3">
              <InfoRow icon={Building2} label="Company" value={profile.companyName} />
              <InfoRow icon={Globe} label="Industry" value={profile.industry || '—'} />
              <InfoRow icon={Globe} label="Website" value={profile.website || '—'} href={profile.website || undefined} />
              <InfoRow icon={Phone} label="Phone" value={profile.phone || '—'} />
              <InfoRow icon={Mail} label="Email" value={profile.user.email} />
              <InfoRow icon={User} label="Client Since" value={formatDate(profile.user.createdAt)} />
            </div>
          </div>

          {/* Plan */}
          <div
            className="rounded-2xl p-6"
            style={{ background: 'var(--card-elevated)', border: '1px solid var(--border)' }}
          >
            <h2 className="font-display font-semibold text-sm mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <CreditCard className="w-4 h-4 text-[#D4AF37]" /> Current Plan
            </h2>
            {profile.plan ? (
              <div className="space-y-3">
                <div
                  className="flex items-center justify-between p-4 rounded-xl"
                  style={{
                    background: 'rgba(212,175,55,0.05)',
                    border: '1px solid rgba(212,175,55,0.12)',
                  }}
                >
                  <div>
                    <p className="font-display font-bold" style={{ color: 'var(--text-primary)' }}>{profile.plan.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{profile.plan.description}</p>
                  </div>
                  {profile.plan.priceMonthly && (
                    <div className="text-right">
                      <p className="font-display font-bold text-lg text-[#D4AF37]">
                        {formatCurrency(Number(profile.plan.priceMonthly))}
                      </p>
                      <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>/ month</p>
                    </div>
                  )}
                </div>
                {Array.isArray(profile.plan.features) && (
                  <ul className="space-y-1.5 mt-3">
                    {(profile.plan.features as string[]).map((feat) => (
                      <li key={feat} className="flex items-center gap-2 text-[13px]" style={{ color: 'var(--text-secondary)' }}>
                        <span className="text-[#D4AF37] text-[10px]">✓</span>
                        {feat}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No plan assigned. Contact your account manager.</p>
            )}
          </div>

          {/* Account manager */}
          {profile.accountManager && (
            <div
              className="rounded-2xl p-6"
              style={{ background: 'var(--card-elevated)', border: '1px solid var(--border)' }}
            >
              <h2 className="font-display font-semibold text-sm mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <User className="w-4 h-4 text-[#D4AF37]" /> Your Account Manager
              </h2>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: 'var(--border)', color: 'var(--text-secondary)' }}
                >
                  <span className="text-sm font-bold">
                    {profile.accountManager.name?.[0]?.toUpperCase() || 'A'}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-[13px]" style={{ color: 'var(--text-primary)' }}>{profile.accountManager.name}</p>
                  <a
                    href={`mailto:${profile.accountManager.email}`}
                    className="text-[12px] text-[#D4AF37] hover:underline"
                  >
                    {profile.accountManager.email}
                  </a>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function InfoRow({ icon: Icon, label, value, href }: {
  icon: React.ElementType; label: string; value: string; href?: string
}) {
  return (
    <div className="flex items-center justify-between py-1">
      <div className="flex items-center gap-2">
        <Icon className="w-3.5 h-3.5" style={{ color: 'var(--text-faint)' }} />
        <span className="text-[12px]" style={{ color: 'var(--text-muted)' }}>{label}</span>
      </div>
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-[13px] text-[#D4AF37] hover:underline">
          {value}
        </a>
      ) : (
        <span className="text-[13px] font-medium" style={{ color: 'var(--text-secondary)' }}>{value}</span>
      )}
    </div>
  )
}

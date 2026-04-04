'use client'
// src/components/layout/portal-sidebar.tsx

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { AtpHorizontal } from '@/components/brand/logo'
import type { Role } from '@prisma/client'
import {
  LayoutDashboard, TrendingUp, FolderOpen,
  MessageSquare, User, Users, UserPlus, ShieldCheck, RefreshCw,
  LogOut, Image, BarChart2,
} from 'lucide-react'
import { signOut } from 'next-auth/react'

interface SidebarProps {
  user: { id: string; name?: string | null; email?: string | null; role: Role }
  unreadCount: number
}

type NavItem = { href: string; label: string; icon: React.ElementType; badge?: boolean }

const clientNav: NavItem[] = [
  { href: '/portal/dashboard', label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/portal/campaigns', label: 'Campaigns',  icon: TrendingUp },
  { href: '/portal/creatives', label: 'Creatives',  icon: Image },
  { href: '/portal/updates',   label: 'Updates',    icon: MessageSquare,  badge: true },
  { href: '/portal/reports',   label: 'Analytics',  icon: BarChart2 },
  { href: '/portal/files',     label: 'Files',      icon: FolderOpen },
  { href: '/portal/profile',   label: 'Account',    icon: User },
]

const adminNav: NavItem[] = [
  { href: '/portal/dashboard',          label: 'Overview',     icon: LayoutDashboard },
  { href: '/portal/admin/clients',      label: 'Clients',      icon: Users },
  { href: '/portal/admin/users',        label: 'Team',         icon: UserPlus },
  { href: '/portal/campaigns',          label: 'Campaigns',    icon: TrendingUp },
  { href: '/portal/creatives',          label: 'Creatives',    icon: Image },
  { href: '/portal/updates',            label: 'Updates',      icon: MessageSquare },
  { href: '/portal/files',              label: 'Files',        icon: FolderOpen },
  { href: '/portal/admin/integrations', label: 'Integrations', icon: RefreshCw },
]

export function PortalSidebar({ user, unreadCount }: SidebarProps) {
  const pathname  = usePathname()
  const isAdmin   = user.role === 'SUPER_ADMIN' || user.role === 'TEAM_MEMBER'
  const navItems  = isAdmin ? adminNav : clientNav

  return (
    <aside
      className="hidden lg:flex w-[220px] flex-col h-full shrink-0"
      style={{
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-subtle)',
      }}
    >

      {/* ── Logo area ── */}
      <div
        className="h-[62px] flex items-center px-5"
        style={{ borderBottom: '1px solid var(--border-subtle)' }}
      >
        <Link href="/portal/dashboard" className="opacity-90 hover:opacity-100 transition-opacity">
          <AtpHorizontal height={28} />
        </Link>
      </div>

      {/* ── Role badge ── */}
      <div className="px-4 pt-4 pb-2">
        <div className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-[0.14em] border',
          isAdmin
            ? 'bg-[rgba(212,175,55,0.06)] text-[#8A6E2F] border-[rgba(212,175,55,0.14)]'
            : 'bg-[rgba(128,128,128,0.04)] border-[var(--border-subtle)]'
        )}
          style={isAdmin ? {} : { color: 'var(--text-xfaint)' }}
        >
          {isAdmin && <ShieldCheck className="w-2.5 h-2.5" />}
          {user.role === 'SUPER_ADMIN' ? 'Super Admin'
            : user.role === 'TEAM_MEMBER' ? 'Team Member'
            : 'Client Portal'}
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto pb-4 pt-1">
        {navItems.map((item) => {
          const Icon     = item.icon
          const isActive = pathname === item.href ||
            (item.href !== '/portal/dashboard' && pathname.startsWith(item.href))

          return (
            <Link key={item.href} href={item.href} className={cn('sidebar-nav-item', isActive && 'active')}>
              <Icon className="w-[14px] h-[14px] shrink-0" />
              <span className="flex-1 truncate">{item.label}</span>
              {item.badge && unreadCount > 0 && (
                <span className="w-[18px] h-[18px] rounded-full bg-[#D4AF37] text-black text-[9px] font-black flex items-center justify-center shrink-0">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* ── Divider ── */}
      <div
        className="mx-5 h-px"
        style={{ background: 'var(--border-subtle)' }}
      />

      {/* ── User footer ── */}
      <div className="p-3">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg group">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
            style={{
              background: 'rgba(212,175,55,0.08)',
              border: '1px solid rgba(212,175,55,0.15)',
            }}
          >
            <span className="text-[10px] font-bold text-[#D4AF37]">
              {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || '?'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold truncate leading-tight" style={{ color: 'var(--text-primary)' }}>
              {user.name || 'User'}
            </p>
            <p className="text-[10px] truncate" style={{ color: 'var(--text-xfaint)' }}>{user.email}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="transition-colors p-1 rounded hover:text-red-400"
            style={{ color: 'var(--text-xfaint)' }}
            title="Sign out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  )
}

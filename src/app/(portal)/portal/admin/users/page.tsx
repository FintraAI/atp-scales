// src/app/(portal)/admin/users/page.tsx

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { formatDate, formatRelativeTime } from '@/lib/utils'
import { Plus, CheckCircle, XCircle } from 'lucide-react'

const ROLE_CONFIG = {
  SUPER_ADMIN:  { label: 'Super Admin',  color: 'badge-gold'   },
  TEAM_MEMBER:  { label: 'Team Member',  color: 'badge-silver' },
  CLIENT:       { label: 'Client',       color: 'badge-silver' },
}

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')
  if (session.user.role !== 'SUPER_ADMIN') redirect('/portal/dashboard')

  const users = await prisma.user.findMany({
    include: {
      clientProfile: { select: { companyName: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#EBEBEB] tracking-wide">Team & Users</h1>
          <p className="text-[#555] text-sm mt-1">{users.length} total users across all roles</p>
        </div>
        <button className="btn-gold text-sm gap-2">
          <Plus className="w-4 h-4" /> Invite User
        </button>
      </div>

      {/* Role summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { role: 'SUPER_ADMIN',  label: 'Admins',      count: users.filter(u => u.role === 'SUPER_ADMIN').length  },
          { role: 'TEAM_MEMBER',  label: 'Team Members', count: users.filter(u => u.role === 'TEAM_MEMBER').length },
          { role: 'CLIENT',       label: 'Clients',      count: users.filter(u => u.role === 'CLIENT').length      },
        ].map(r => (
          <div key={r.role} className="atp-card p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#444] mb-1.5">{r.label}</p>
            <p className="font-display font-bold text-2xl gold-text">{r.count}</p>
          </div>
        ))}
      </div>

      {/* User table */}
      <div className="atp-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full data-table">
            <thead>
              <tr>
                <th className="text-left">User</th>
                <th className="text-left">Role</th>
                <th className="text-left">Client Account</th>
                <th className="text-left">Last Login</th>
                <th className="text-left">Joined</th>
                <th className="text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const roleCfg = ROLE_CONFIG[user.role]
                return (
                  <tr key={user.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[rgba(201,168,76,0.08)] border border-[rgba(201,168,76,0.12)] flex items-center justify-center shrink-0">
                          <span className="text-[11px] font-bold text-[#C9A84C]">
                            {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-[#EBEBEB] text-[13px]">{user.name || '—'}</p>
                          <p className="text-[11px] text-[#555]">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td><span className={roleCfg.color}>{roleCfg.label}</span></td>
                    <td className="text-[#888] text-[12px]">
                      {user.clientProfile?.companyName || '—'}
                    </td>
                    <td className="text-[#555] text-[12px]">
                      {user.lastLoginAt ? formatRelativeTime(user.lastLoginAt) : 'Never'}
                    </td>
                    <td className="text-[#555] text-[12px]">{formatDate(user.createdAt)}</td>
                    <td>
                      {user.isActive
                        ? <span className="flex items-center gap-1.5 text-emerald-400 text-[12px] font-semibold"><CheckCircle className="w-3.5 h-3.5" /> Active</span>
                        : <span className="flex items-center gap-1.5 text-[#444] text-[12px] font-semibold"><XCircle className="w-3.5 h-3.5" /> Inactive</span>
                      }
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

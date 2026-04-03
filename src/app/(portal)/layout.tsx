// src/app/(portal)/layout.tsx

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { PortalSidebar } from '@/components/layout/portal-sidebar'
import { PortalTopbar } from '@/components/layout/portal-topbar'
import { prisma } from '@/lib/prisma'

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/login')
  }

  // Fetch unread update count for notification badge
  let unreadCount = 0
  if (session.user.role === 'CLIENT' && session.user.clientProfileId) {
    unreadCount = await prisma.clientUpdate.count({
      where: { clientProfileId: session.user.clientProfileId, isRead: false },
    })
  }

  return (
    <div className="flex h-screen bg-[var(--bg-secondary)] overflow-hidden">
      {/* Sidebar */}
      <PortalSidebar user={session.user} unreadCount={unreadCount} />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <PortalTopbar user={session.user} />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 lg:p-8 max-w-[1600px] mx-auto w-full animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

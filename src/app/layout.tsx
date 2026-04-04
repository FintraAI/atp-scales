// src/app/layout.tsx
import type { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { SessionProvider } from '@/components/providers/session-provider'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { SITE_URL } from '@/lib/site'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: { default: 'ATP Scales — Performance Ad Agency', template: '%s | ATP Scales' },
  description: 'Elite performance advertising. We scale brands with precision-engineered ad campaigns.',
  keywords: ['ad agency', 'performance marketing', 'Meta ads', 'Google ads', 'ROAS', 'paid media'],
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: 'website',
    siteName: 'ATP Scales',
    images: [{ url: '/og-image.jpg' }],
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Inline script: apply saved theme before first paint to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('atp-theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <SessionProvider session={session}>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}

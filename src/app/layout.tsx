// src/app/layout.tsx
import type { Metadata } from 'next'
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}

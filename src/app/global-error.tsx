'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html>
      <body style={{ background: '#080808', display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#555', fontSize: '14px', marginBottom: '16px' }}>Something went wrong.</p>
          <button
            onClick={reset}
            style={{ padding: '8px 16px', fontSize: '14px', fontWeight: 500, color: '#000', background: '#c8ff00', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}

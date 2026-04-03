'use client'

import { useEffect } from 'react'

export default function Error({
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
    <div className="flex min-h-screen items-center justify-center bg-[#080808]">
      <div className="text-center">
        <p className="text-[#555] text-sm mb-4">Something went wrong.</p>
        <button
          onClick={reset}
          className="px-4 py-2 text-sm font-medium text-black bg-[#c8ff00] rounded-lg hover:bg-[#b8ef00] transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  )
}

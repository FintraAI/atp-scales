'use client'
// src/app/(auth)/login/page.tsx — ATP Scales gold/silver brand

import { useState, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { AtpLogo } from '@/components/brand/logo'
import { ArrowRight, Eye, EyeOff } from 'lucide-react'

function LoginForm() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl  = searchParams.get('callbackUrl') || '/portal/dashboard'

  const [email,     setEmail]     = useState('')
  const [password,  setPassword]  = useState('')
  const [showPass,  setShowPass]  = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error,     setError]     = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const res = await signIn('credentials', {
      email: email.toLowerCase().trim(),
      password,
      redirect: false,
      callbackUrl,
    })

    if (res?.error) {
      setError('Invalid email or password. Please try again.')
      setIsLoading(false)
      return
    }

    router.push(callbackUrl)
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40' width='40' height='40' fill='none' stroke='rgb(255 255 255 / 0.025)'%3e%3cpath d='M0 .5H39.5V40'/%3e%3c/svg%3e\")" }}
      />
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center top, rgba(212,175,55,0.06), transparent)' }}
      />

      <div className="relative w-full max-w-[400px] animate-fade-in">
        <div className="text-center mb-10">
          <Link href="/">
            <AtpLogo size="lg" className="mx-auto" />
          </Link>
          <p className="text-[#6B6B6B] text-sm mt-5 tracking-wide">Client Portal Access</p>
        </div>

        <div className="bg-[#0F0F0F] border border-[#222222] rounded-2xl p-7">
          {error && (
            <div className="mb-5 bg-red-500/5 border border-red-500/15 rounded-xl px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-[#6B6B6B] mb-2">
                Email Address
              </label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com" required autoComplete="email"
                className="atp-input"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-[#6B6B6B] mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••" required autoComplete="current-password"
                  className="atp-input pr-10"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-[#B3B3B3] transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isLoading || !email || !password} className="btn-gold w-full justify-center py-3 mt-2">
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                <>Sign In <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

<<<<<<< HEAD
          <div className="mt-6 pt-5 border-t border-[#222222]">
            <p className="text-[#333] text-[10px] text-center uppercase tracking-[0.15em] mb-3">Demo Credentials</p>
            <div className="space-y-2">
              {[
                { label: 'Super Admin',       email: 'admin@atpscales.com' },
                { label: 'Client — Velocity', email: 'mike@velocityroofing.com' },
                { label: 'Client — Dental',   email: 'sarah@elitedentalstudio.com' },
              ].map((cred) => (
                <button key={cred.email} type="button"
                  onClick={() => { setEmail(cred.email); setPassword('ATPScales2024!') }}
                  className="w-full flex items-center justify-between px-3 py-2.5 bg-[#0C0C0C] hover:bg-[rgba(212,175,55,0.04)] border border-[#222222] hover:border-[rgba(212,175,55,0.15)] rounded-xl transition-all group">
                  <span className="text-[12px] text-[#6B6B6B] group-hover:text-[#B3B3B3]">{cred.label}</span>
                  <span className="text-[11px] text-[#333] group-hover:text-[#D4AF37] font-mono">{cred.email}</span>
                </button>
              ))}
              <p className="text-center text-[#2A2A2A] text-[10px] mt-1.5 font-mono">Password: ATPScales2024!</p>
            </div>
          </div>
=======
>>>>>>> dashboard-refactor
        </div>

        <p className="text-center text-[#2A2A2A] text-xs mt-5">
          Not a client?{' '}
          <Link href="/contact" className="text-[#D4AF37] hover:text-[#E6C65C] transition-colors">
            Book a strategy call →
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>
}

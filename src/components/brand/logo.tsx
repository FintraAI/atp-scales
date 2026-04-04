// src/components/brand/logo.tsx
// Faithfully recreates the ATP Scales brand mark:
// Silver/white "ATP" letterforms, gold arrow-star motif through the A, gold "SCALES" subtitle

import { cn } from '@/lib/utils'

interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'full' | 'mark' | 'horizontal'
  className?: string
}

const SIZES = {
  xs: { width: 80,  height: 32,  markSize: 20 },
  sm: { width: 110, height: 44,  markSize: 28 },
  md: { width: 150, height: 60,  markSize: 38 },
  lg: { width: 200, height: 80,  markSize: 50 },
  xl: { width: 280, height: 112, markSize: 70 },
}

// The full-lockup SVG: ATP in silver-gradient, arrow-star in gold, SCALES in gold
export function AtpLogo({ size = 'md', variant = 'full', className }: LogoProps) {
  const s = SIZES[size]

  if (variant === 'mark') {
    return <AtpMark size={s.markSize} className={className} />
  }

  if (variant === 'horizontal') {
    return <AtpHorizontal height={s.markSize} className={className} />
  }

  return (
    <svg
      width={s.width}
      height={s.height}
      viewBox="0 0 200 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="ATP Scales"
    >
      <defs>
        {/* Silver gradient for ATP letters */}
        <linearGradient id="silverGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#F2F2F2" />
          <stop offset="45%"  stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#B8B8B8" />
        </linearGradient>
        {/* Gold gradient for SCALES + arrow */}
        <linearGradient id="goldGradLogo" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="#8A6E2F" />
          <stop offset="40%"  stopColor="#E6C65C" />
          <stop offset="70%"  stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#E8CC78" />
        </linearGradient>
        {/* Gold arrow gradient */}
        <linearGradient id="arrowGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#E6C65C" />
        </linearGradient>
      </defs>

      {/* ── ATP letterforms (silver) ── */}
      {/* A */}
      <path
        d="M8 48 L22 8 L36 48 M12 36 L32 36"
        stroke="url(#silverGrad)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* T */}
      <path
        d="M44 8 L72 8 M58 8 L58 48"
        stroke="url(#silverGrad)"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      {/* P */}
      <path
        d="M80 48 L80 8 L98 8 Q110 8 110 20 Q110 32 98 32 L80 32"
        stroke="url(#silverGrad)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* ── Gold arrow-star through the A ── */}
      {/* Star/arrow element: diagonal slash + arrowhead pointing upper-right */}
      <line x1="12" y1="44" x2="34" y2="10" stroke="url(#arrowGrad)" strokeWidth="2.5" strokeLinecap="round" />
      {/* Arrowhead */}
      <polygon
        points="34,10 24,14 30,20"
        fill="url(#arrowGrad)"
        opacity="0.95"
      />
      {/* Star sparkle at base */}
      <circle cx="14" cy="43" r="2" fill="url(#arrowGrad)" opacity="0.8" />

      {/* ── SCALES subtitle (gold) ── */}
      <text
        x="8"
        y="68"
        fontFamily="'Bebas Neue', sans-serif"
        fontSize="16"
        letterSpacing="6"
        fill="url(#goldGradLogo)"
      >
        SCALES
      </text>
    </svg>
  )
}

// Compact mark for sidebar / favicon area
export function AtpMark({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="ATP Scales mark"
    >
      <defs>
        <linearGradient id="markSilver" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#C0C0C0" />
        </linearGradient>
        <linearGradient id="markGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#E6C65C" />
        </linearGradient>
      </defs>
      {/* Background square */}
      <rect width="40" height="40" rx="8" fill="#0F0F0F" />
      {/* A letterform */}
      <path d="M6 32 L14 8 L22 32 M8.5 23 L19.5 23" stroke="url(#markSilver)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Gold arrow */}
      <line x1="7" y1="31" x2="21" y2="9" stroke="url(#markGold)" strokeWidth="2" strokeLinecap="round" />
      <polygon points="21,9 14,13 18,18" fill="url(#markGold)" />
      {/* T abbreviated - right side tick */}
      <path d="M26 8 L36 8 M31 8 L31 32" stroke="url(#markSilver)" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  )
}

// Horizontal variant: mark + wordmark side by side
export function AtpHorizontal({ height = 36, className }: { height?: number; className?: string }) {
  const scale = height / 36
  const w = Math.round(220 * scale)
  const h = height

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 220 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="ATP Scales"
    >
      <defs>
        <linearGradient id="hSilver" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#C0C0C0" />
        </linearGradient>
        <linearGradient id="hGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="#8A6E2F" />
          <stop offset="50%"  stopColor="#E6C65C" />
          <stop offset="100%" stopColor="#D4AF37" />
        </linearGradient>
      </defs>

      {/* Mark background */}
      <rect width="36" height="36" rx="7" fill="#0F0F0F" />

      {/* A */}
      <path d="M4 28 L11.5 6 L19 28 M6 20 L17 20" stroke="url(#hSilver)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* T */}
      <path d="M23 6 L32 6 M27.5 6 L27.5 28" stroke="url(#hSilver)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Gold arrow */}
      <line x1="5" y1="27" x2="18" y2="7" stroke="url(#hGold)" strokeWidth="1.8" strokeLinecap="round" />
      <polygon points="18,7 12,11 16,15" fill="url(#hGold)" />

      {/* Wordmark: ATP */}
      <text x="45" y="22" fontFamily="'Bebas Neue', sans-serif" fontSize="20" letterSpacing="2" fill="url(#hSilver)">ATP</text>
      {/* Wordmark: SCALES */}
      <text x="95" y="28" fontFamily="'Bebas Neue', sans-serif" fontSize="11" letterSpacing="4" fill="url(#hGold)">SCALES</text>
    </svg>
  )
}

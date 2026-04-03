// src/lib/utils.ts

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// ─── Tailwind ──────────────────────────────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─── Formatting ───────────────────────────────────────────────────────────────
export function formatCurrency(value: number, compact = false): string {
  if (compact && value >= 1000) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value)
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatNumber(value: number, compact = false): string {
  if (compact && value >= 1000) {
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value)
  }
  return new Intl.NumberFormat('en-US').format(value)
}

export function formatPercent(value: number, decimals = 1): string {
  return `${(value * 100).toFixed(decimals)}%`
}

export function formatRoas(value: number): string {
  return `${value.toFixed(2)}x`
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatRelativeTime(date: Date | string): string {
  const d = new Date(date)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffHours = diffMs / (1000 * 60 * 60)
  const diffDays = diffHours / 24

  if (diffHours < 1) return 'Just now'
  if (diffHours < 24) return `${Math.floor(diffHours)}h ago`
  if (diffDays < 7) return `${Math.floor(diffDays)}d ago`
  return formatDate(date)
}

// ─── Performance Status ───────────────────────────────────────────────────────

export const PERFORMANCE_CONFIG = {
  IMPROVING: { label: 'Improving', color: 'text-emerald-400', bg: 'bg-emerald-400/10', dot: 'bg-emerald-400' },
  STABLE: { label: 'Stable', color: 'text-blue-400', bg: 'bg-blue-400/10', dot: 'bg-blue-400' },
  NEEDS_ATTENTION: { label: 'Needs Attention', color: 'text-amber-400', bg: 'bg-amber-400/10', dot: 'bg-amber-400' },
  CRITICAL: { label: 'Critical', color: 'text-red-400', bg: 'bg-red-400/10', dot: 'bg-red-400' },
} as const

export const CLIENT_STATUS_CONFIG = {
  ACTIVE: { label: 'Active', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  PAUSED: { label: 'Paused', color: 'text-amber-400', bg: 'bg-amber-400/10' },
  CHURNED: { label: 'Churned', color: 'text-red-400', bg: 'bg-red-400/10' },
  ONBOARDING: { label: 'Onboarding', color: 'text-purple-400', bg: 'bg-purple-400/10' },
  PROSPECT: { label: 'Prospect', color: 'text-gray-400', bg: 'bg-gray-400/10' },
} as const

export const PLATFORM_CONFIG = {
  META: { label: 'Meta', color: 'text-blue-400' },
  GOOGLE: { label: 'Google', color: 'text-emerald-400' },
  TIKTOK: { label: 'TikTok', color: 'text-pink-400' },
  LINKEDIN: { label: 'LinkedIn', color: 'text-blue-300' },
  YOUTUBE: { label: 'YouTube', color: 'text-red-400' },
  OTHER: { label: 'Other', color: 'text-gray-400' },
} as const

// ─── Percentage change helper ──────────────────────────────────────────────────
export function calcChange(current: number, previous: number): number {
  if (previous === 0) return 0
  return ((current - previous) / previous) * 100
}

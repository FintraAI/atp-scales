// src/types/index.ts
// ATP Scales — Shared TypeScript types

import type { Role, ClientStatus, PerformanceStatus, Platform, CampaignStatus, UpdateCategory, FileType } from '@prisma/client'

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface SessionUser {
  id: string
  email: string
  name?: string | null
  image?: string | null
  role: Role
  clientProfileId?: string | null
}

// ─── Dashboard KPIs ───────────────────────────────────────────────────────────

export interface KPIData {
  adSpend: number
  revenue: number
  roas: number
  leads: number
  costPerLead: number
  appointments: number
  costPerAppointment: number
  conversionRate: number
  // Period comparison (% change)
  adSpendChange?: number
  revenueChange?: number
  roasChange?: number
  leadsChange?: number
}

export interface ChartDataPoint {
  date: string
  adSpend?: number
  revenue?: number
  roas?: number
  leads?: number
  appointments?: number
  clicks?: number
  impressions?: number
<<<<<<< HEAD
=======
  cpl?: number
  ctr?: number
>>>>>>> dashboard-refactor
}

// ─── Client ───────────────────────────────────────────────────────────────────

export interface ClientSummary {
  id: string
  companyName: string
  industry?: string | null
  status: ClientStatus
  performanceStatus: PerformanceStatus
  monthlyBudget?: number | null
  planName?: string | null
  accountManagerName?: string | null
  logoUrl?: string | null
  unreadUpdates: number
}

export interface ClientProfile {
  id: string
  userId: string
  companyName: string
  industry?: string | null
  website?: string | null
  logoUrl?: string | null
  phone?: string | null
  address?: string | null
  status: ClientStatus
  performanceStatus: PerformanceStatus
  monthlyBudget?: number | null
  plan?: { name: string; priceMonthly?: number | null } | null
  accountManager?: { name?: string | null; email: string } | null
  user: { email: string; name?: string | null }
}

// ─── Campaign ─────────────────────────────────────────────────────────────────

export interface CampaignRow {
  id: string
  name: string
  platform: Platform
  status: CampaignStatus
  objective?: string | null
  // Aggregated stats (last 30 days)
  spend: number
  impressions: number
  clicks: number
  ctr: number
  cpc: number
  leads: number
  cpl: number
  purchases: number
  roas: number
}

// ─── Updates ──────────────────────────────────────────────────────────────────

export interface ClientUpdateItem {
  id: string
  title: string
  content: string
  category: UpdateCategory
  isRead: boolean
  isPinned: boolean
  publishedAt?: Date | null
  createdAt: Date
  author: { name?: string | null; email: string }
}

// ─── Files ────────────────────────────────────────────────────────────────────

export interface ClientFileItem {
  id: string
  name: string
  description?: string | null
  fileType: FileType
  size?: number | null
  url: string
  createdAt: Date
  uploadedBy: { name?: string | null }
}

// ─── Onboarding ───────────────────────────────────────────────────────────────

export interface OnboardingData {
  id: string
  offerName?: string | null
  offerDescription?: string | null
  offerPrice?: string | null
  offerUSP?: string | null
  targetAudience?: string | null
  targetAgeRange?: string | null
  targetLocations: string[]
  targetInterests: string[]
  metaAccessGranted: boolean
  googleAccessGranted: boolean
  websiteAccessGranted: boolean
  crmAccessGranted: boolean
  accessNotes?: string | null
  brandGuidelinesUrl?: string | null
  creativeAssetsUrl?: string | null
  callNotes?: string | null
  callDate?: Date | null
  isComplete: boolean
  completedAt?: Date | null
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export interface AdminUserRow {
  id: string
  email: string
  name?: string | null
  role: Role
  isActive: boolean
  lastLoginAt?: Date | null
  createdAt: Date
  clientProfile?: { companyName: string } | null
}

<<<<<<< HEAD
=======
// ─── Breakdown / Audience Types ───────────────────────────────────────────────

export interface AudienceAgeRow {
  ageRange: string   // '18-24', '25-34', '35-44', '45-54', '55-64', '65+'
  impressions: number
  clicks: number
  spend: number
  leads: number
  ctr: number
  cpl: number
  share: number      // % of total spend
}

export interface AudienceGenderRow {
  gender: 'male' | 'female' | 'unknown'
  label: string      // 'Male', 'Female', 'Unknown'
  impressions: number
  clicks: number
  spend: number
  leads: number
  ctr: number
  cpl: number
  share: number
}

export interface GeoCountryRow {
  country: string
  countryCode: string
  spend: number
  leads: number
  impressions: number
  cpl: number
  ctr: number
  share: number      // % of total spend
}

export interface AudienceBreakdown {
  age: AudienceAgeRow[]
  gender: AudienceGenderRow[]
  countries: GeoCountryRow[]
}

// ─── Hourly Performance ───────────────────────────────────────────────────────

export interface HourlyPerformanceRow {
  hour: number       // 0–23
  label: string      // '12am', '1am', '2pm', etc.
  leads: number
  spend: number
  clicks: number
  impressions: number
  cpl: number
}

// ─── Creative Asset Insights ──────────────────────────────────────────────────

export interface CreativeAssetRow {
  id: string
  assetType: 'title' | 'body' | 'cta' | 'image' | 'video'
  assetValue: string
  impressions: number
  clicks: number
  leads: number
  spend: number
  ctr: number
  cpl: number
}

// ─── Conversion / Action Insights ─────────────────────────────────────────────

export interface ConversionActionRow {
  actionType: string
  actionLabel: string
  count: number
  value: number      // revenue value where applicable
  share: number      // % of total conversion volume
  isModeled: boolean
}

// ─── Admin Client Comparison ──────────────────────────────────────────────────

export interface ClientComparisonRow {
  clientId: string
  companyName: string
  spend: number
  leads: number
  cpl: number
  ctr: number
  roas: number
  campaigns: number
}

>>>>>>> dashboard-refactor
// ─── Utilities ────────────────────────────────────────────────────────────────

export type DateRange = {
  from: Date
  to: Date
}

export type ApiResponse<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string }

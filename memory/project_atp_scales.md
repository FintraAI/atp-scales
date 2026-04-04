---
name: ATP Scales project overview
description: Stack, schema, architecture, design conventions, and what's been built
type: project
---

## Stack
- Next.js 14 (App Router) + TypeScript + Tailwind CSS
- Prisma ORM (PostgreSQL via Supabase)
- NextAuth v4 (JWT, CredentialsProvider, bcrypt)
- Recharts for all charting
- Radix UI primitives + shadcn/ui components
- Vercel deployment (postinstall: prisma generate)

## Auth
- Roles: SUPER_ADMIN, TEAM_MEMBER, CLIENT
- JWT session with id, role, clientProfileId on token
- Admin guards: requireAdmin(), requireAdminOrTeam() in src/lib/auth-guards.ts

## Design conventions
- Background: #0A0A0A / #0F0F0F / #181818
- Text: #FFFFFF primary, #D8D8D8 secondary, #B3B3B3 muted, #6B6B6B dim
- Gold accent: #D4AF37 (gold-text, atp-card-gold CSS classes)
- Card classes: `kpi-card`, `atp-card`, `atp-card-gold`
- Button classes: `btn-outline`
- Font: font-display for headings

## Provider architecture
- AdsDataProvider interface in src/lib/providers/types.ts
- LocalAdsProvider (Prisma) — default when no integration
- MetaAdsProvider — scaffold ready, falls back to Local
- Provider selected by getProvider() in src/lib/providers/index.ts

## Dashboard data flow
- getClientDashboardData(clientProfileId) → src/lib/services/dashboard.service.ts
- getAdminDashboardData() → same file
- Both now include breakdown data from getClientBreakdownData() / getAdminBreakdownData()
- Breakdown data in src/lib/services/breakdown.service.ts (mock fallback)

## Breakdown data layer (built 2026-04-04)
- Mock data: src/lib/mock/meta-breakdown-data.ts
  - Deterministic per clientId (seed function)
  - Age, gender, country, hourly, creative assets, conversion actions
- Breakdown mapper: src/lib/providers/meta/breakdown-mapper.ts
  - mapMetaAgeBreakdowns, mapMetaGenderBreakdowns, mapMetaCountryBreakdowns
  - mapMetaHourlyBreakdowns, mapMetaAssetBreakdowns, mapMetaActionBreakdowns
- Breakdown service: src/lib/services/breakdown.service.ts
  - getClientBreakdownData(clientProfileId), getAdminBreakdownData(clientIds)
  - Ready to swap mock → live Meta API calls

## Dashboard components
### Client dashboard (portal/dashboard/page.tsx):
- KPICards (8 metrics with trend arrows)
- PerformanceCharts (Spend/Revenue, ROAS, Leads, CPL — 4 tabs)
- InsightsFeed (AI-style alerts from computeInsights)
- AudienceBreakdown (age/gender/country tabs)
- HourlyPerformance (bar chart by hour with peak callout)
- CreativeInsights (simplified — top 3 per asset type)
- ConversionInsights (simplified — top 5 actions)
- CampaignTable
- RecentUpdates

### Admin dashboard (components/dashboard/admin-overview.tsx):
- Executive Summary: 8 KPI cards (active clients, spend, revenue, ROAS, leads, CPL, CTR, CPC)
- Performance Trends: PerformanceCharts with aggregated cross-client data
- Client Comparison: ranked bar chart by spend/leads/CPL (ClientComparison component)
- Audience & Delivery: AudienceBreakdown + HourlyPerformance side by side
- Conversion Insights: full ConversionInsights
- All Clients: scrollable list with status/performance badges

## Schema additions (2026-04-04)
- MetaBreakdownRow model added to prisma/schema.prisma
  - Fields: clientProfileId, date, breakdown, dimension, impressions, clicks, spend, leads, revenue, isModeled
  - @@unique([clientProfileId, date, breakdown, dimension])
  - Run `prisma db push` to apply

## Key env vars
- DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL
- NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
- META_APP_ID, META_APP_SECRET, CRON_SECRET_KEY

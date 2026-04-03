# ATP Scales — Client Portal & Performance Dashboard

A production-grade SaaS client portal for ATP Scales ad agency. Clients log in to see their live ad performance data, campaign stats, updates from the team, and files. Admins manage all clients, enter metrics, post updates, and connect integrations.

---

## Stack

| Layer      | Technology                          |
| ---------- | ----------------------------------- |
| Framework  | Next.js 14 (App Router)             |
| Language   | TypeScript (strict)                 |
| Styling    | Tailwind CSS + custom design system |
| Database   | PostgreSQL                          |
| ORM        | Prisma                              |
| Auth       | NextAuth.js (credentials)           |
| Charts     | Recharts                            |
| Meta Ads   | Meta Marketing API v19.0            |
| Deployment | Vercel                              |

---

## Quick Start (Local)

### 1. Clone & install

```bash
git clone https://github.com/your-org/atp-scales.git
cd atp-scales
npm install
```

### 2. Set up environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```
DATABASE_URL="postgresql://postgres:password@localhost:5432/atp_scales"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"
META_APP_ID="your_meta_app_id"
META_APP_SECRET="your_meta_app_secret"
```

### 3. Set up database

```bash
# Create the database (if using local Postgres)
createdb atp_scales

# Push schema to database
npm run db:push

# Seed with sample data
npm run db:seed
```

### 4. Run dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Demo login credentials (password: `ATPScales2024!`)

| Role                      | Email                       |
| ------------------------- | --------------------------- |
| Super Admin               | admin@atpscales.com         |
| Team Member               | team@atpscales.com          |
| Client (Velocity Roofing) | mike@velocityroofing.com    |
| Client (Elite Dental)     | sarah@elitedentalstudio.com |
| Client (Apex Fit Pro)     | james@apexfitpro.com        |

---

## Project Structure

```
atp-scales/
├── prisma/
│   ├── schema.prisma          # Full data model
│   └── seed.ts                # Sample data seed
│
├── src/
│   ├── app/
│   │   ├── (public)/          # Marketing website
│   │   │   ├── page.tsx       # Homepage
│   │   │   └── contact/       # Contact / book a call
│   │   │
│   │   ├── (auth)/
│   │   │   └── login/         # Login page
│   │   │
│   │   ├── (portal)/          # Protected dashboard
│   │   │   ├── layout.tsx     # Sidebar + topbar layout
│   │   │   ├── dashboard/     # Main KPI dashboard
│   │   │   ├── campaigns/     # Campaign performance table
│   │   │   ├── updates/       # Client updates feed
│   │   │   ├── files/         # File downloads
│   │   │   ├── reports/       # Reports section
│   │   │   ├── profile/       # Account/profile page
│   │   │   └── admin/
│   │   │       ├── clients/   # Client management
│   │   │       ├── users/     # User/team management
│   │   │       └── integrations/ # Meta/Google/Stripe/Calendly
│   │   │
│   │   └── api/
│   │       ├── auth/          # NextAuth handler
│   │       ├── admin/
│   │       │   ├── updates/   # POST client update
│   │       │   └── metrics/   # POST manual metrics
│   │       ├── updates/[id]/read/  # Mark update read
│   │       └── integrations/
│   │           └── meta/
│   │               ├── callback/  # OAuth callback
│   │               └── sync/      # Trigger data sync
│   │
│   ├── components/
│   │   ├── brand/
│   │   │   └── logo.tsx       # ATP Scales logo SVG (full/mark/horizontal)
│   │   ├── layout/
│   │   │   ├── portal-sidebar.tsx
│   │   │   └── portal-topbar.tsx
│   │   ├── dashboard/
│   │   │   ├── kpi-cards.tsx
│   │   │   ├── performance-charts.tsx
│   │   │   ├── campaign-table.tsx
│   │   │   ├── recent-updates.tsx
│   │   │   ├── admin-overview.tsx
│   │   │   └── mark-read-button.tsx
│   │   ├── admin/
│   │   │   ├── post-update-form.tsx
│   │   │   ├── edit-metrics-form.tsx
│   │   │   └── sync-button.tsx
│   │   ├── marketing/
│   │   │   ├── nav.tsx
│   │   │   └── footer.tsx
│   │   └── providers/
│   │       └── session-provider.tsx
│   │
│   ├── lib/
│   │   ├── auth.ts            # NextAuth config
│   │   ├── prisma.ts          # Prisma singleton
│   │   ├── utils.ts           # Formatting + auth helpers
│   │   └── integrations/
│   │       └── meta/
│   │           ├── client.ts  # Meta API client (OAuth, insights, campaigns)
│   │           └── sync.ts    # Sync orchestrator (per-client + all clients)
│   │
│   ├── types/
│   │   ├── index.ts           # App-wide TypeScript types
│   │   └── next-auth.d.ts     # NextAuth session augmentation
│   │
│   └── styles/
│       └── globals.css        # Design system (gold/silver tokens, components)
```

---

## Database Schema

### Core tables

| Table               | Purpose                                                   |
| ------------------- | --------------------------------------------------------- |
| `User`              | All users (admins, team, clients) with role               |
| `ClientProfile`     | Client business details, status, performance status       |
| `Onboarding`        | Offer details, target audience, access status, call notes |
| `Plan`              | Agency pricing plans (Starter/Growth/Scale)               |
| `MetricSnapshot`    | Daily aggregated KPIs per client (from any source)        |
| `Campaign`          | Campaign metadata synced from ad platforms                |
| `CampaignStat`      | Daily campaign-level stats                                |
| `ClientUpdate`      | Updates/notes posted by ATP Scales team                   |
| `ClientFile`        | Files uploaded for client access                          |
| `ClientIntegration` | OAuth tokens + status per provider per client             |

### Integration-specific tables (future-ready)

| Table            | Purpose                                             |
| ---------------- | --------------------------------------------------- |
| `AdPlatformData` | Raw Meta/Google API payloads + normalized fields    |
| `StripeData`     | Raw Stripe events + normalized revenue data         |
| `CalendlyData`   | Raw Calendly webhooks + normalized appointment data |
| `AuditLog`       | All admin actions logged                            |

### Key design decisions

**MetricSnapshot is provider-agnostic.** Whether data comes from Meta Ads, Google Ads, Stripe, manual entry, or Calendly — it all normalizes into the same `MetricSnapshot` table. The dashboard UI never needs to change when you add a new integration.

**ClientIntegration stores OAuth tokens per provider per client.** Each client can have their own Meta account, Stripe account, etc. The `externalAccountId` maps to the provider's ID (Meta Ad Account ID, Stripe Customer ID, etc.).

**Raw payloads are preserved.** `AdPlatformData`, `StripeData`, `CalendlyData` store the full API response as JSON alongside normalized fields. This means you can reprocess/reattribute historical data without re-fetching from the API.

---

## Authentication & Roles

NextAuth with JWT strategy. Roles are encoded in the JWT token.

### Role capabilities

| Feature                    | Super Admin | Team Member | Client |
| -------------------------- | ----------- | ----------- | ------ |
| View own dashboard         | ✓           | ✓           | ✓      |
| View all clients           | ✓           | ✓           | —      |
| Post client updates        | ✓           | ✓           | —      |
| Enter metrics              | ✓           | ✓           | —      |
| Manage users               | ✓           | —           | —      |
| Connect integrations       | ✓           | ✓           | —      |
| Platform settings          | ✓           | —           | —      |
| Access other client's data | —           | —           | —      |

**Security model:** Client users can only ever see data where `clientProfileId` matches their own profile. All server-side queries enforce this at the database level — never trusting client-side params.

---

## Meta Ads Integration

### How it works

1. **OAuth connect** — Admin visits `/portal/integrations/meta/connect` → redirected to Meta for authorization
2. **Token exchange** — `/api/integrations/meta/callback` exchanges code for long-lived 60-day token
3. **Token stored** — Saved in `ClientIntegration` table per client per account
4. **Sync trigger** — Admin clicks "Sync Meta" or cron job calls `POST /api/integrations/meta/sync`
5. **Data flow** — `syncClientMetaData()` fetches campaign insights → writes to `MetricSnapshot` + `CampaignStat` + `AdPlatformData`
6. **Dashboard reads** — All dashboard queries read from `MetricSnapshot` (provider-agnostic)

### Meta permissions required

- `ads_read` — Read campaign/adset/ad data
- `ads_management` — Read insights and account info
- `business_management` — Access Business Manager
- `leads_retrieval` — Read lead gen form submissions

### Adding Google Ads / Stripe / Calendly

The schema is already ready. To add Google Ads:

1. Create `src/lib/integrations/google/client.ts` — implement the Google Ads API client
2. Create `src/lib/integrations/google/sync.ts` — normalize data into `MetricSnapshot`
3. Add `GOOGLE_ADS` to `ClientIntegration` records
4. Add connect button in `/portal/admin/integrations`

The dashboard, charts, and KPI cards need **zero changes** — they read from `MetricSnapshot` regardless of source.

---

## Deployment (Vercel)

### 1. Database

Recommended: [Neon](https://neon.tech) (serverless Postgres, free tier available)

```bash
# After creating Neon database, get the connection string
# Add to Vercel environment variables as DATABASE_URL
```

### 2. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Or push to GitHub and connect repo in Vercel dashboard
```

### 3. Environment variables in Vercel

Add these in the Vercel dashboard under Project → Settings → Environment Variables:

```
DATABASE_URL          = your_neon_connection_string
NEXTAUTH_SECRET       = your_32_char_secret
NEXTAUTH_URL          = https://your-domain.vercel.app
META_APP_ID           = your_meta_app_id
META_APP_SECRET       = your_meta_app_secret
CRON_SECRET_KEY       = your_cron_key
```

### 4. Run migrations on Vercel

After first deploy, run:

```bash
vercel env pull .env.local
npm run db:push
npm run db:seed
```

### 5. Cron job for daily Meta sync (Vercel Cron)

Add to `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/integrations/meta/sync",
      "schedule": "0 6 * * *"
    }
  ]
}
```

This will sync all connected Meta accounts daily at 6am UTC.

---

## Adding a New Client (Admin Workflow)

1. Go to **Clients → Add Client**
2. Create a user account with role `CLIENT`
3. Fill in company details, assign a plan and account manager
4. Complete the onboarding form (offer, audience, access status, call notes)
5. Go to **Integrations** → Connect their Meta Ads account (OAuth)
6. Click **Sync Meta** to pull their first data set
7. Post a welcome update via the client detail page
8. The client can now log in and see their live dashboard

---

## Scalability Notes

- **Multiple clients** each have isolated data. All queries filter by `clientProfileId`. A client can never see another client's data.
- **Multiple ad accounts** per client are supported. The `externalData` JSON field on `ClientIntegration` stores all available ad accounts from Meta after OAuth.
- **High data volume** is handled by indexed queries on `(clientProfileId, date)`. For 100+ clients each with 90 days of daily data, Postgres handles this without issue.
- **White-label ready** — the branding is entirely CSS-variable driven. To white-label for a client, override the CSS variables with their colors.

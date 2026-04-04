// prisma/seed.ts
// ATP Scales - Database seed with realistic sample data

import { PrismaClient, Role, ClientStatus, PerformanceStatus, Platform, CampaignStatus, UpdateCategory, FileType, IntegrationProvider } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding ATP Scales database...')

  // ─── Plans ───────────────────────────────────────
  const starterPlan = await prisma.plan.upsert({
    where: { name: 'Starter' },
    update: {},
    create: {
      name: 'Starter',
      description: 'Perfect for businesses starting with paid ads',
      priceMonthly: 1997,
      features: ['Up to 2 ad campaigns', 'Weekly reports', 'Meta Ads management', 'Monthly strategy call'],
      maxCampaigns: 2,
    },
  })

  const growthPlan = await prisma.plan.upsert({
    where: { name: 'Growth' },
    update: {},
    create: {
      name: 'Growth',
      description: 'For businesses scaling aggressively',
      priceMonthly: 3997,
      features: ['Up to 5 ad campaigns', 'Meta + Google Ads', 'Bi-weekly strategy calls', 'Landing page CRO', 'Weekly performance reports'],
      maxCampaigns: 5,
    },
  })

  const scalePlan = await prisma.plan.upsert({
    where: { name: 'Scale' },
    update: {},
    create: {
      name: 'Scale',
      description: 'Full-service for high-growth companies',
      priceMonthly: 7997,
      features: ['Unlimited campaigns', 'Meta + Google + YouTube', 'Dedicated account manager', 'Weekly calls', 'Full funnel management', 'Creative production', 'CRM integration'],
      maxCampaigns: null,
    },
  })

  // ─── Users ───────────────────────────────────────
  const hashedPassword = await bcrypt.hash('ATPScales2024!', 12)

  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@atpscales.com' },
    update: {},
    create: {
      email: 'admin@atpscales.com',
      name: 'Alex Thompson',
      password: hashedPassword,
      role: Role.SUPER_ADMIN,
      isActive: true,
    },
  })

  const teamMember = await prisma.user.upsert({
    where: { email: 'team@atpscales.com' },
    update: {},
    create: {
      email: 'team@atpscales.com',
      name: 'Jordan Rivera',
      password: hashedPassword,
      role: Role.TEAM_MEMBER,
      isActive: true,
    },
  })

  // ─── Client Users & Profiles ───────────────────
  // Client 1: High performer
  const client1User = await prisma.user.upsert({
    where: { email: 'mike@velocityroofing.com' },
    update: {},
    create: {
      email: 'mike@velocityroofing.com',
      name: 'Mike Harrington',
      password: hashedPassword,
      role: Role.CLIENT,
      isActive: true,
    },
  })

  const client1Profile = await prisma.clientProfile.upsert({
    where: { userId: client1User.id },
    update: {},
    create: {
      userId: client1User.id,
      companyName: 'Velocity Roofing',
      industry: 'Home Services',
      website: 'https://velocityroofing.com',
      phone: '(555) 234-5678',
      status: ClientStatus.ACTIVE,
      performanceStatus: PerformanceStatus.IMPROVING,
      monthlyBudget: 8000,
      planId: scalePlan.id,
      accountManagerId: teamMember.id,
    },
  })

  await prisma.onboarding.upsert({
    where: { clientProfileId: client1Profile.id },
    update: {},
    create: {
      clientProfileId: client1Profile.id,
      offerName: 'Free Roof Inspection + Storm Damage Assessment',
      offerDescription: 'We offer homeowners a free, no-obligation roof inspection to identify storm damage and help them file insurance claims. Our certified inspectors provide same-day assessments.',
      offerPrice: 'Free inspection, projects range $8,000-$25,000',
      offerUSP: 'Only roofer in region offering AI-powered damage detection + insurance claim handling',
      targetAudience: 'Homeowners aged 35-65 in suburban areas with homes 10+ years old, recently experienced storms',
      targetAgeRange: '35-65',
      targetLocations: ['Dallas, TX', 'Fort Worth, TX', 'Arlington, TX', 'Plano, TX'],
      targetInterests: ['Home improvement', 'Homeowners insurance', 'Property maintenance'],
      metaAccessGranted: true,
      googleAccessGranted: true,
      websiteAccessGranted: true,
      crmAccessGranted: false,
      callNotes: 'Mike is highly motivated, wants to scale from $100k to $300k/mo revenue. Has a sales team of 5. Main KPI is booked inspections. Currently getting inspections at $45 each organically. Wants to hit 100 inspections/mo via paid ads. Has a strong close rate of ~65%.',
      callDate: new Date('2024-01-10'),
      isComplete: true,
      completedAt: new Date('2024-01-12'),
    },
  })

  // Client 2: Stable performer
  const client2User = await prisma.user.upsert({
    where: { email: 'sarah@elitedentalstudio.com' },
    update: {},
    create: {
      email: 'sarah@elitedentalstudio.com',
      name: 'Dr. Sarah Chen',
      password: hashedPassword,
      role: Role.CLIENT,
      isActive: true,
    },
  })

  const client2Profile = await prisma.clientProfile.upsert({
    where: { userId: client2User.id },
    update: {},
    create: {
      userId: client2User.id,
      companyName: 'Elite Dental Studio',
      industry: 'Healthcare / Dental',
      website: 'https://elitedentalstudio.com',
      phone: '(555) 345-6789',
      status: ClientStatus.ACTIVE,
      performanceStatus: PerformanceStatus.STABLE,
      monthlyBudget: 5000,
      planId: growthPlan.id,
      accountManagerId: superAdmin.id,
    },
  })

  await prisma.onboarding.upsert({
    where: { clientProfileId: client2Profile.id },
    update: {},
    create: {
      clientProfileId: client2Profile.id,
      offerName: 'New Patient Special - Exam + X-Rays + Cleaning',
      offerDescription: '$99 new patient special for comprehensive dental exam, digital X-rays, and professional cleaning. Normally $350+.',
      offerPrice: '$99 new patient special',
      offerUSP: 'Luxury dental experience at accessible prices. Same-day appointments available.',
      targetAudience: 'Adults 25-55 who have dental anxiety or havent been to dentist in 2+ years, within 10 miles of clinic',
      targetAgeRange: '25-55',
      targetLocations: ['Austin, TX', 'Round Rock, TX', 'Cedar Park, TX'],
      targetInterests: ['Dental health', 'Cosmetic dentistry', 'Health and wellness'],
      metaAccessGranted: true,
      googleAccessGranted: false,
      websiteAccessGranted: true,
      crmAccessGranted: true,
      callNotes: 'Dr. Chen is very data-driven. Main goal is new patient acquisitions. Current CAC is $180 via word of mouth. Wants to bring paid CAC below $120. Has Kareo CRM. Very concerned about HIPAA compliance in ad targeting.',
      callDate: new Date('2024-02-05'),
      isComplete: true,
      completedAt: new Date('2024-02-07'),
    },
  })

  // Client 3: Needs attention
  const client3User = await prisma.user.upsert({
    where: { email: 'james@apexfitpro.com' },
    update: {},
    create: {
      email: 'james@apexfitpro.com',
      name: 'James Okafor',
      password: hashedPassword,
      role: Role.CLIENT,
      isActive: true,
    },
  })

  const client3Profile = await prisma.clientProfile.upsert({
    where: { userId: client3User.id },
    update: {},
    create: {
      userId: client3User.id,
      companyName: 'Apex Fit Pro',
      industry: 'Fitness / Coaching',
      website: 'https://apexfitpro.com',
      phone: '(555) 456-7890',
      status: ClientStatus.ACTIVE,
      performanceStatus: PerformanceStatus.NEEDS_ATTENTION,
      monthlyBudget: 3000,
      planId: starterPlan.id,
      accountManagerId: teamMember.id,
    },
  })

  await prisma.onboarding.upsert({
    where: { clientProfileId: client3Profile.id },
    update: {},
    create: {
      clientProfileId: client3Profile.id,
      offerName: '12-Week Body Transformation Program',
      offerDescription: 'Online fitness coaching program with personalized workout plans, nutrition guidance, and weekly check-ins.',
      offerPrice: '$997 for 12 weeks',
      offerUSP: 'Guaranteed results or money back. 1-on-1 coaching with James directly.',
      targetAudience: 'Men 28-45 who want to lose 20-40 lbs without giving up their social life',
      targetAgeRange: '28-45',
      targetLocations: ['United States', 'Canada'],
      targetInterests: ['Fitness', 'Weight loss', 'Nutrition', 'Body transformation'],
      metaAccessGranted: true,
      googleAccessGranted: false,
      websiteAccessGranted: false,
      crmAccessGranted: false,
      callNotes: 'James is a solo operator. Offer converts well via Instagram organically (DM funnel). Struggling to replicate via paid. VSL on landing page needs work. Considering rewriting the offer. Budget is tight at $3k/mo. Needs CPL under $15 to be profitable.',
      callDate: new Date('2024-03-01'),
      isComplete: false,
    },
  })

  // ─── Metric Snapshots (last 8 weeks) ─────────────
  const now = new Date()
  const clients = [
    { profile: client1Profile, baseSpend: 8000, baseLeads: 85, baseRevenue: 52000, baseRoas: 6.5 },
    { profile: client2Profile, baseSpend: 4500, baseLeads: 42, baseRevenue: 18900, baseRoas: 4.2 },
    { profile: client3Profile, baseSpend: 2800, baseLeads: 28, baseRevenue: 7840, baseRoas: 2.8 },
  ]

  for (const client of clients) {
    for (let weekOffset = 7; weekOffset >= 0; weekOffset--) {
      const date = new Date(now)
      date.setDate(date.getDate() - weekOffset * 7)
      date.setHours(0, 0, 0, 0)
      
      const variance = 0.85 + Math.random() * 0.3
      const leads = Math.round(client.baseLeads * variance)
      const spend = Number((client.baseSpend * variance).toFixed(2))
      const revenue = Number((client.baseRevenue * variance).toFixed(2))
      const appointments = Math.round(leads * 0.45)
      
      await prisma.metricSnapshot.upsert({
        where: { clientProfileId_date: { clientProfileId: client.profile.id, date } },
        update: {},
        create: {
          clientProfileId: client.profile.id,
          date,
          periodStart: date,
          periodEnd: date,
          adSpend: spend,
          revenue,
          roas: Number((revenue / spend).toFixed(4)),
          leads,
          costPerLead: Number((spend / leads).toFixed(2)),
          appointments,
          costPerAppointment: Number((spend / appointments).toFixed(2)),
          conversionRate: Number((leads / Math.round(leads * (18 + Math.random() * 10))).toFixed(4)),
          impressions: leads * Math.round(180 + Math.random() * 80),
          clicks: leads * Math.round(8 + Math.random() * 6),
          ctr: Number((0.025 + Math.random() * 0.015).toFixed(4)),
          cpc: Number((spend / (leads * Math.round(8 + Math.random() * 6))).toFixed(2)),
          purchases: Math.round(leads * 0.2),
          source: IntegrationProvider.MANUAL,
        },
      })
    }
  }

  // ─── Campaigns ────────────────────────────────────
  const campaigns = [
    // Velocity Roofing
    { clientProfileId: client1Profile.id, name: 'Storm Damage - Dallas Homeowners', platform: Platform.META, status: CampaignStatus.ACTIVE, objective: 'Lead Generation', dailyBudget: 150 },
    { clientProfileId: client1Profile.id, name: 'Free Inspection - Retargeting', platform: Platform.META, status: CampaignStatus.ACTIVE, objective: 'Conversions', dailyBudget: 80 },
    { clientProfileId: client1Profile.id, name: 'Roof Repair - Google Search', platform: Platform.GOOGLE, status: CampaignStatus.ACTIVE, objective: 'Lead Generation', dailyBudget: 120 },
    // Elite Dental
    { clientProfileId: client2Profile.id, name: '$99 New Patient - Austin', platform: Platform.META, status: CampaignStatus.ACTIVE, objective: 'Lead Generation', dailyBudget: 100 },
    { clientProfileId: client2Profile.id, name: 'Teeth Whitening - Lookalike', platform: Platform.META, status: CampaignStatus.PAUSED, objective: 'Conversions', dailyBudget: 50 },
    // Apex Fit Pro
    { clientProfileId: client3Profile.id, name: 'Body Transformation - VSL', platform: Platform.META, status: CampaignStatus.ACTIVE, objective: 'Conversions', dailyBudget: 75 },
    { clientProfileId: client3Profile.id, name: 'Fitness Retargeting', platform: Platform.META, status: CampaignStatus.ACTIVE, objective: 'Conversions', dailyBudget: 25 },
  ]

  const createdCampaigns = []
  for (const campaign of campaigns) {
    const c = await prisma.campaign.create({
      data: { ...campaign, startDate: new Date('2024-01-01'), totalBudget: (campaign.dailyBudget || 0) * 90 },
    })
    createdCampaigns.push(c)
  }

  // Campaign stats for last 4 weeks
  for (const campaign of createdCampaigns) {
    for (let d = 27; d >= 0; d--) {
      const date = new Date(now)
      date.setDate(date.getDate() - d)
      date.setHours(0, 0, 0, 0)
      
      const dailyBudget = campaign.dailyBudget?.toNumber() || 100
      const spend = Number((dailyBudget * (0.8 + Math.random() * 0.4)).toFixed(2))
      const impressions = Math.round(spend * (80 + Math.random() * 60))
      const clicks = Math.round(impressions * (0.02 + Math.random() * 0.02))
      const leads = Math.round(clicks * (0.05 + Math.random() * 0.08))
      const purchases = Math.round(leads * (0.15 + Math.random() * 0.1))
      const revenue = Number((purchases * (150 + Math.random() * 200)).toFixed(2))

      await prisma.campaignStat.create({
        data: {
          campaignId: campaign.id,
          date,
          spend,
          impressions,
          clicks,
          ctr: Number((clicks / impressions).toFixed(4)),
          cpc: Number((spend / Math.max(clicks, 1)).toFixed(2)),
          leads,
          cpl: Number((spend / Math.max(leads, 1)).toFixed(2)),
          purchases,
          revenue,
          roas: Number((revenue / Math.max(spend, 1)).toFixed(4)),
          source: IntegrationProvider.MANUAL,
        },
      })
    }
  }

  // ─── Client Updates ───────────────────────────────
  await prisma.clientUpdate.createMany({
    data: [
      {
        clientProfileId: client1Profile.id,
        authorId: teamMember.id,
        title: 'Week 8 Performance Recap — Best Week Yet 🔥',
        content: `**What we changed this week:**\n- Launched new "Storm Season" creative angle targeting recent hail storms in North Dallas\n- Tightened targeting to homeowners 40-65 (removed 35-39, CTR dropped)\n- Increased retargeting budget by 20% — this audience is converting at 3x the cold traffic\n\n**What is working:**\n- The "Free Inspection + Insurance Help" messaging is resonating strongly. CPL dropped from $48 to $31 this week.\n- Video ad showing before/after roof damage is our #1 performer (ROAS 8.2)\n- Google Search brand + local intent terms delivering appointments at $67 CPAppt\n\n**What needs improvement:**\n- Landing page mobile speed is 2.8s — need to compress hero image\n- "Get Quote" CTA button isn't visible enough on mobile\n\n**Next steps:**\n1. New UGC video creative from Mike's team arriving Monday\n2. A/B test new landing page headline\n3. Expand to Fort Worth with separate campaign`,
        category: UpdateCategory.WEEKLY_RECAP,
        isRead: false,
        isPinned: true,
        publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        clientProfileId: client1Profile.id,
        authorId: superAdmin.id,
        title: 'Strategy Update: Scaling to $12k/mo Ad Spend',
        content: `Based on current ROAS of 6.5x, we're recommending a budget increase to $12,000/month.\n\nHere's the scaling roadmap:\n- Week 1-2: Test Fort Worth market ($1,500/mo)\n- Week 3-4: If CPL stays under $40, scale Dallas to $7,000/mo\n- Month 2: Launch YouTube pre-roll for awareness\n\nThis is a conservative scale plan. At current conversion rates, $12k spend should yield ~$78k revenue.`,
        category: UpdateCategory.STRATEGY_CHANGE,
        isRead: true,
        isPinned: false,
        publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        clientProfileId: client2Profile.id,
        authorId: superAdmin.id,
        title: 'Week 6 Recap — Steady Growth, New Creative Testing',
        content: `**What we changed:**\n- Launched 3 new image creatives featuring the clinic interior\n- Added "same-day appointment" to all ad copy\n- Excluded existing patient list from cold campaigns\n\n**What is working:**\n- Before/after smile transformation images have 4.8% CTR (benchmark is 2.1%)\n- The $99 offer is strong — CPL holding at $22\n\n**What needs improvement:**\n- Conversion rate from lead form to booked appointment dropped slightly (42% → 38%). May be a front desk follow-up issue worth looking into.\n\n**Next steps:**\n- Test Google Ads for "emergency dentist" and "dentist near me" searches\n- Create retargeting audience from website visitors`,
        category: UpdateCategory.WEEKLY_RECAP,
        isRead: false,
        isPinned: false,
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        clientProfileId: client3Profile.id,
        authorId: teamMember.id,
        title: '⚠️ Performance Alert — Action Required',
        content: `**Current Status: Needs Attention**\n\nThis week's numbers are below target:\n- CPL: $41 (target: $15)\n- ROAS: 1.8x (target: 3.5x)\n\n**Root cause analysis:**\n1. The VSL landing page has a 78% bounce rate on mobile — this is the primary issue\n2. Ad creative is fatigued (same images running for 6 weeks)\n3. Offer headline "12-Week Transformation" may be too vague\n\n**Immediate actions required from your side:**\n- We need a new VSL or updated landing page within 7 days\n- Can you send 5-10 transformation photos or video testimonials?\n\n**What ATP Scales is doing:**\n- Reducing spend to $1,500/mo until landing page is fixed (protecting your budget)\n- Testing new ad angle: "Lose Your First 10 lbs in 21 Days"\n- Drafting new offer positioning`,
        category: UpdateCategory.PERFORMANCE_ALERT,
        isRead: false,
        isPinned: true,
        publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      },
    ],
  })

  // ─── Files ────────────────────────────────────────
  await prisma.clientFile.createMany({
    data: [
      {
        clientProfileId: client1Profile.id,
        uploadedById: superAdmin.id,
        name: 'Velocity Roofing - May 2024 Performance Report.pdf',
        description: 'Full monthly performance report with campaign breakdown and recommendations',
        fileType: FileType.PDF,
        mimeType: 'application/pdf',
        size: 2840000,
        url: 'https://storage.atpscales.com/files/velocity-may-2024-report.pdf',
      },
      {
        clientProfileId: client1Profile.id,
        uploadedById: teamMember.id,
        name: 'Storm Damage Ad Creative - June Bundle.zip',
        description: 'New creative assets for June campaigns including video and static images',
        fileType: FileType.OTHER,
        mimeType: 'application/zip',
        size: 48500000,
        url: 'https://storage.atpscales.com/files/velocity-june-creatives.zip',
      },
      {
        clientProfileId: client2Profile.id,
        uploadedById: superAdmin.id,
        name: 'Elite Dental - Q1 2024 Strategy Deck.pdf',
        description: 'Quarterly strategy presentation with growth roadmap',
        fileType: FileType.PDF,
        mimeType: 'application/pdf',
        size: 5200000,
        url: 'https://storage.atpscales.com/files/dental-q1-strategy.pdf',
      },
      {
        clientProfileId: client3Profile.id,
        uploadedById: teamMember.id,
        name: 'Apex Fit - Landing Page Audit.pdf',
        description: 'Detailed CRO audit with 15 specific recommendations to improve conversion rate',
        fileType: FileType.PDF,
        mimeType: 'application/pdf',
        size: 1900000,
        url: 'https://storage.atpscales.com/files/apex-lp-audit.pdf',
      },
    ],
  })

  console.log('✅ Seeding complete!')
  console.log('\n🔑 Login credentials (all use password: ATPScales2024!):')
  console.log('   Super Admin: admin@atpscales.com')
  console.log('   Team Member: team@atpscales.com')
  console.log('   Client 1 (Velocity Roofing): mike@velocityroofing.com')
  console.log('   Client 2 (Elite Dental): sarah@elitedentalstudio.com')
  console.log('   Client 3 (Apex Fit Pro): james@apexfitpro.com')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })

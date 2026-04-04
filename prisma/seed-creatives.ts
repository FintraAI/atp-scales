// prisma/seed-creatives.ts
// Run with: npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed-creatives.ts
// Safe to run on top of existing data — uses upsert with @@unique([campaignId, name])

import { PrismaClient, CreativeType, CreativeStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🎨 Seeding creatives...')

  // ─── Velocity Roofing ───────────────────────────────────────────────────────
  const vrCampaigns = await prisma.campaign.findMany({
    where: {
      clientProfile: { companyName: 'Velocity Roofing' },
    },
    select: { id: true, name: true },
  })

  const vrStorm     = vrCampaigns.find(c => c.name.includes('Storm Damage'))
  const vrRetarget  = vrCampaigns.find(c => c.name.includes('Retargeting'))
  const vrGoogle    = vrCampaigns.find(c => c.name.includes('Google'))

  if (vrStorm) {
    const creatives = [
      {
        name:        'Storm Damage - Before/After Video',
        headline:    'We Fixed 400+ Storm-Damaged Roofs This Year',
        description: 'Show a dramatic before/after split-screen video of storm damage repair. Text: "Is your roof hiding damage? Get a FREE inspection today."',
        type:        CreativeType.VIDEO,
        status:      CreativeStatus.ACTIVE,
        impressions: 184200,
        clicks:      8840,
        spend:       3200.00,
        leads:       312,
        ctr:         0.0480,
        cpc:         0.36,
        cpl:         10.26,
      },
      {
        name:        'Storm Damage - Insurance Claim Hook',
        headline:    'Your Insurance May Cover 100% of Repairs',
        description: 'Static image of a homeowner shaking hands with an inspector. "Most homeowners don\'t know their insurance covers storm damage. We handle the claim for you."',
        type:        CreativeType.IMAGE,
        status:      CreativeStatus.ACTIVE,
        impressions: 156800,
        clicks:      6270,
        spend:       2280.00,
        leads:       198,
        ctr:         0.0400,
        cpc:         0.36,
        cpl:         11.52,
      },
      {
        name:        'Storm Damage - Carousel: 5 Signs',
        headline:    '5 Signs Your Roof Has Hidden Storm Damage',
        description: 'Carousel showing 5 visual signs of damage — cracked shingles, granule loss, flashing damage, sagging, and water stains.',
        type:        CreativeType.CAROUSEL,
        status:      CreativeStatus.ACTIVE,
        impressions:  98400,
        clicks:       2360,
        spend:        860.00,
        leads:         72,
        ctr:          0.0240,
        cpc:          0.36,
        cpl:          11.94,
      },
      {
        name:        'Storm Damage - Testimonial Image',
        headline:    '"They handled everything with our insurance. Amazing!"',
        description: 'Photo of happy homeowner in front of new roof with a 5-star quote overlay. Builds social proof.',
        type:        CreativeType.IMAGE,
        status:      CreativeStatus.PAUSED,
        impressions:  72100,
        clicks:       1010,
        spend:        370.00,
        leads:         28,
        ctr:          0.0140,
        cpc:          0.37,
        cpl:          13.21,
      },
    ]
    for (const c of creatives) {
      await prisma.creative.upsert({
        where: { campaignId_name: { campaignId: vrStorm.id, name: c.name } },
        update: {},
        create: { campaignId: vrStorm.id, ...c },
      })
    }
  }

  if (vrRetarget) {
    const creatives = [
      {
        name:        'Retargeting - Urgency: Limited Slots',
        headline:    'Only 6 Free Inspection Slots Left This Week',
        description: 'Urgency-driven retargeting to website visitors. Countdown visual with "Book Now" CTA.',
        type:        CreativeType.IMAGE,
        status:      CreativeStatus.ACTIVE,
        impressions:  48200,
        clicks:       3020,
        spend:        960.00,
        leads:       182,
        ctr:          0.0626,
        cpc:          0.32,
        cpl:          5.27,
      },
      {
        name:        'Retargeting - Direct Offer',
        headline:    'You Visited Us. Ready for Your Free Roof Check?',
        description: 'Simple, clean retargeting image. Large "Schedule Free Inspection" button. For warm audiences who\'ve visited the site.',
        type:        CreativeType.IMAGE,
        status:      CreativeStatus.ACTIVE,
        impressions:  36900,
        clicks:       2100,
        spend:        680.00,
        leads:       126,
        ctr:          0.0569,
        cpc:          0.32,
        cpl:          5.40,
      },
    ]
    for (const c of creatives) {
      await prisma.creative.upsert({
        where: { campaignId_name: { campaignId: vrRetarget.id, name: c.name } },
        update: {},
        create: { campaignId: vrRetarget.id, ...c },
      })
    }
  }

  if (vrGoogle) {
    const creatives = [
      {
        name:        'Google RSA - Emergency Repair',
        headline:    'Emergency Roof Repair — Same Day Service',
        description: 'Responsive search ad targeting "roof repair near me" and "emergency roofer Dallas". High-intent keywords.',
        type:        CreativeType.IMAGE,
        status:      CreativeStatus.ACTIVE,
        impressions:  22400,
        clicks:       1680,
        spend:        1840.00,
        leads:        98,
        ctr:          0.0750,
        cpc:          1.10,
        cpl:          18.78,
      },
      {
        name:        'Google RSA - Free Inspection',
        headline:    'Free Roof Inspection + Insurance Help',
        description: 'Targets "free roof inspection Dallas" and "hail damage roof". Focuses on the insurance angle.',
        type:        CreativeType.IMAGE,
        status:      CreativeStatus.ACTIVE,
        impressions:  18600,
        clicks:       1110,
        spend:        1220.00,
        leads:        72,
        ctr:          0.0597,
        cpc:          1.10,
        cpl:          16.94,
      },
    ]
    for (const c of creatives) {
      await prisma.creative.upsert({
        where: { campaignId_name: { campaignId: vrGoogle.id, name: c.name } },
        update: {},
        create: { campaignId: vrGoogle.id, ...c },
      })
    }
  }

  // ─── Elite Dental ───────────────────────────────────────────────────────────
  const dentalCampaigns = await prisma.campaign.findMany({
    where: {
      clientProfile: { companyName: 'Elite Dental Studio' },
    },
    select: { id: true, name: true },
  })

  const dentalMain    = dentalCampaigns.find(c => c.name.includes('New Patient'))
  const dentalWhiten  = dentalCampaigns.find(c => c.name.includes('Whitening'))

  if (dentalMain) {
    const creatives = [
      {
        name:        'New Patient - Smile Transformation',
        headline:    'Real Results: See Before & After Smiles',
        description: 'Before/after split image showing a patient\'s smile transformation. Strong social proof for the $99 offer.',
        type:        CreativeType.IMAGE,
        status:      CreativeStatus.ACTIVE,
        impressions:  94600,
        clicks:       4550,
        spend:        1820.00,
        leads:       186,
        ctr:          0.0481,
        cpc:          0.40,
        cpl:          9.78,
      },
      {
        name:        'New Patient - $99 Special Offer',
        headline:    '$99 New Patient Special — Exam, X-Rays & Cleaning',
        description: 'Bold price callout with clinic interior photo. "Save $250+ on your first visit. Same-day appointments available."',
        type:        CreativeType.IMAGE,
        status:      CreativeStatus.ACTIVE,
        impressions:  82300,
        clicks:       3460,
        spend:        1385.00,
        leads:       144,
        ctr:          0.0421,
        cpc:          0.40,
        cpl:          9.62,
      },
      {
        name:        'New Patient - Doctor Introduction Video',
        headline:    'Meet Dr. Chen — Austin\'s Most Trusted Dentist',
        description: 'Short 30-second video of Dr. Chen introducing herself and the clinic. Warm and professional tone. Builds trust.',
        type:        CreativeType.VIDEO,
        status:      CreativeStatus.ACTIVE,
        impressions:  68400,
        clicks:       2190,
        spend:        876.00,
        leads:        88,
        ctr:          0.0320,
        cpc:          0.40,
        cpl:          9.95,
      },
      {
        name:        'New Patient - Anxiety-Free Headline',
        headline:    'Nervous About the Dentist? We Get It.',
        description: 'Empathetic copy targeting dental anxiety. "Our patients say it\'s the most comfortable dental visit they\'ve ever had." With patient photo.',
        type:        CreativeType.IMAGE,
        status:      CreativeStatus.PAUSED,
        impressions:  44100,
        clicks:       1060,
        spend:        425.00,
        leads:         38,
        ctr:          0.0240,
        cpc:          0.40,
        cpl:          11.18,
      },
    ]
    for (const c of creatives) {
      await prisma.creative.upsert({
        where: { campaignId_name: { campaignId: dentalMain.id, name: c.name } },
        update: {},
        create: { campaignId: dentalMain.id, ...c },
      })
    }
  }

  if (dentalWhiten) {
    const creatives = [
      {
        name:        'Whitening - Results Carousel',
        headline:    'Get a Whiter Smile in One Visit',
        description: 'Carousel of 4 whitening results photos. Targets people who\'ve engaged with the main page but didn\'t convert.',
        type:        CreativeType.CAROUSEL,
        status:      CreativeStatus.PAUSED,
        impressions:  28600,
        clicks:        572,
        spend:        228.00,
        leads:         18,
        ctr:          0.0200,
        cpc:          0.40,
        cpl:          12.67,
      },
    ]
    for (const c of creatives) {
      await prisma.creative.upsert({
        where: { campaignId_name: { campaignId: dentalWhiten.id, name: c.name } },
        update: {},
        create: { campaignId: dentalWhiten.id, ...c },
      })
    }
  }

  // ─── Apex Fit Pro ───────────────────────────────────────────────────────────
  const apexCampaigns = await prisma.campaign.findMany({
    where: {
      clientProfile: { companyName: 'Apex Fit Pro' },
    },
    select: { id: true, name: true },
  })

  const apexVsl      = apexCampaigns.find(c => c.name.includes('VSL'))
  const apexRetarget = apexCampaigns.find(c => c.name.includes('Retargeting'))

  if (apexVsl) {
    const creatives = [
      {
        name:        'VSL - Transformation Hook',
        headline:    'How I Lost 32 lbs in 12 Weeks (Without Giving Up Beer)',
        description: 'VSL thumbnail with before/after photo of a client. The hook targets the "I want results without sacrifice" mindset.',
        type:        CreativeType.VIDEO,
        status:      CreativeStatus.ACTIVE,
        impressions:  68400,
        clicks:       1710,
        spend:        1540.00,
        leads:         52,
        ctr:          0.0250,
        cpc:          0.90,
        cpl:          29.62,
      },
      {
        name:        'VSL - Pain Point Image',
        headline:    'Tired of Starting Over Every Monday?',
        description: 'Dark, moody image of a man looking in a mirror. Targets the emotional pain point of repeated failed attempts.',
        type:        CreativeType.IMAGE,
        status:      CreativeStatus.ACTIVE,
        impressions:  52100,
        clicks:        990,
        spend:        892.00,
        leads:         26,
        ctr:          0.0190,
        cpc:          0.90,
        cpl:          34.31,
      },
    ]
    for (const c of creatives) {
      await prisma.creative.upsert({
        where: { campaignId_name: { campaignId: apexVsl.id, name: c.name } },
        update: {},
        create: { campaignId: apexVsl.id, ...c },
      })
    }
  }

  if (apexRetarget) {
    const creatives = [
      {
        name:        'Retargeting - Scarcity Offer',
        headline:    'Only 3 Spots Left for July Cohort',
        description: 'Retargeting ad to warm audiences who watched the VSL but didn\'t buy. Scarcity + direct link to checkout.',
        type:        CreativeType.IMAGE,
        status:      CreativeStatus.ACTIVE,
        impressions:  18400,
        clicks:        736,
        spend:        184.00,
        leads:         22,
        ctr:          0.0400,
        cpc:          0.25,
        cpl:          8.36,
      },
    ]
    for (const c of creatives) {
      await prisma.creative.upsert({
        where: { campaignId_name: { campaignId: apexRetarget.id, name: c.name } },
        update: {},
        create: { campaignId: apexRetarget.id, ...c },
      })
    }
  }

  console.log('✅ Creatives seeded successfully!')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })

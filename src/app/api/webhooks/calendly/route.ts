// src/app/api/webhooks/calendly/route.ts
// Receives Calendly booking events and sends an email notification.
//
// Setup in Calendly → Integrations → Webhooks:
//   URL:    https://yourdomain.com/api/webhooks/calendly
//   Events: invitee.created  (optionally: invitee.canceled)

import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
    year: 'numeric', hour: 'numeric', minute: '2-digit',
    timeZoneName: 'short',
  })
}

export async function POST(req: NextRequest) {
  const payload = await req.json()
  const event   = payload?.event

  // Only handle new bookings
  if (event !== 'invitee.created') {
    return NextResponse.json({ received: true })
  }

  const invitee  = payload?.payload?.invitee   ?? {}
  const booking  = payload?.payload?.event      ?? {}
  const questions = payload?.payload?.questions_and_answers ?? []

  const name      = invitee.name          || 'Unknown'
  const email     = invitee.email         || 'No email provided'
  const eventName = booking.name          || 'Strategy Call'
  const startTime = booking.start_time    ? formatDate(booking.start_time) : 'TBD'
  const timezone  = invitee.timezone      || ''
  const cancelUrl = invitee.cancel_url    || ''
  const reschedUrl = invitee.reschedule_url || ''

  // Format any custom Q&A from the booking form
  const qaRows = questions
    .filter((q: any) => q.answer)
    .map((q: any) => `
      <tr>
        <td style="padding:6px 0;color:#888;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;vertical-align:top;white-space:nowrap;padding-right:16px;">${q.question}</td>
        <td style="padding:6px 0;color:#E8E8E8;font-size:13px;">${q.answer}</td>
      </tr>
    `).join('')

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
    <body style="margin:0;padding:0;background:#050505;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#050505;padding:40px 16px;">
        <tr><td align="center">
          <table width="100%" style="max-width:560px;" cellpadding="0" cellspacing="0">

            <!-- Header -->
            <tr><td style="padding-bottom:24px;text-align:center;">
              <p style="margin:0;color:#D4AF37;font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;">ATP Scales</p>
              <h1 style="margin:8px 0 0;color:#FFFFFF;font-size:26px;font-weight:800;letter-spacing:-0.02em;">New Booking 🎉</h1>
            </td></tr>

            <!-- Card -->
            <tr><td style="background:#0F0F0F;border:1px solid #222;border-radius:16px;padding:28px;">

              <!-- Event type -->
              <div style="display:inline-block;background:rgba(212,175,55,0.08);border:1px solid rgba(212,175,55,0.2);border-radius:6px;padding:4px 10px;margin-bottom:20px;">
                <span style="color:#D4AF37;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;">${eventName}</span>
              </div>

              <!-- Invitee name -->
              <h2 style="margin:0 0 4px;color:#FFFFFF;font-size:22px;font-weight:700;">${name}</h2>
              <p style="margin:0 0 20px;color:#888;font-size:13px;">${email}</p>

              <!-- Divider -->
              <div style="height:1px;background:#1E1E1E;margin-bottom:20px;"></div>

              <!-- Time -->
              <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:20px;">
                <tr>
                  <td style="color:#888;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;padding-bottom:4px;">📅 Date &amp; Time</td>
                </tr>
                <tr>
                  <td style="color:#E8E8E8;font-size:14px;font-weight:500;">${startTime}</td>
                </tr>
                ${timezone ? `<tr><td style="color:#666;font-size:12px;padding-top:2px;">${timezone}</td></tr>` : ''}
              </table>

              <!-- Q&A if present -->
              ${qaRows ? `
                <div style="height:1px;background:#1E1E1E;margin-bottom:20px;"></div>
                <p style="margin:0 0 10px;color:#888;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">Form Responses</p>
                <table cellpadding="0" cellspacing="0" width="100%">${qaRows}</table>
              ` : ''}

              <!-- Divider -->
              <div style="height:1px;background:#1E1E1E;margin:20px 0;"></div>

              <!-- Action links -->
              <table cellpadding="0" cellspacing="0">
                <tr>
                  ${cancelUrl ? `<td style="padding-right:12px;"><a href="${cancelUrl}" style="color:#888;font-size:12px;text-decoration:none;">Cancel booking</a></td>` : ''}
                  ${reschedUrl ? `<td><a href="${reschedUrl}" style="color:#D4AF37;font-size:12px;text-decoration:none;">Reschedule</a></td>` : ''}
                </tr>
              </table>

            </td></tr>

            <!-- Footer -->
            <tr><td style="padding-top:20px;text-align:center;">
              <p style="margin:0;color:#333;font-size:11px;">ATP Scales · Automated booking notification</p>
            </td></tr>

          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from:    process.env.RESEND_FROM_EMAIL || 'bookings@atpscales.com',
      to:      [process.env.NOTIFICATION_EMAIL || 'team@atpscales.com'],
      subject: `📅 New booking: ${name} — ${eventName}`,
      html,
    })
  } catch (err) {
    console.error('Email send failed:', err)
    // Still return 200 so Calendly doesn't retry
  }

  return NextResponse.json({ received: true })
}

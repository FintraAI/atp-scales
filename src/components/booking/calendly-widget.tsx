'use client'
// src/components/booking/calendly-widget.tsx
// Uses a direct iframe embed — renders immediately on client-side navigation
// without depending on Calendly's async JS widget loader.

export function CalendlyWidget({ url }: { url: string }) {
  // Ensure hide_event_type_details=1&hide_gdpr_banner=1 for cleaner embed
  const embedUrl = url.includes('?')
    ? `${url}&hide_gdpr_banner=1`
    : `${url}?hide_gdpr_banner=1`

  return (
    <iframe
      src={embedUrl}
      width="100%"
      height="600"
      frameBorder="0"
      title="Schedule a strategy call"
      style={{ display: 'block', border: 'none', borderRadius: 16 }}
    />
  )
}

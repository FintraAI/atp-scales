'use client'

export function GoogleCalendarWidget({ url }: { url: string }) {
  return (
    <div style={{ background: '#ffffff', borderRadius: 16, overflow: 'hidden' }}>
      <iframe
        src={url}
        width="100%"
        height="650"
        frameBorder="0"
        title="Schedule a strategy call"
        style={{ display: 'block', border: 'none' }}
      />
    </div>
  )
}

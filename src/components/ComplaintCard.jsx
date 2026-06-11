import StageTracker from './StageTracker'

export default function ComplaintCard({ complaint }) {
  const { issueType = [], severity, status, description, location, createdAt, escalated } = complaint

  const severityStyle = {
    "very high": { bg: '#fef2f2', color: '#991b1b' },
    "high": { bg: '#fee2e2', color: '#991b1b' },
    "medium": { bg: '#fef9c3', color: '#854d0e' },
    "low": { bg: '#dcfce7', color: '#166534' }
  }[severity] || { bg: '#f3f4f6', color: '#374151' }

  const timeAgo = (ts) => {
    if (!ts) return ''
    const date = ts.toDate ? ts.toDate() : new Date(ts)
    const diff = Math.floor((Date.now() - date) / 60000)
    if (diff < 60) return `${diff}m ago`
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`
    return `${Math.floor(diff / 1440)}d ago`
  }

  return (
    <div style={{
      background: '#fff',
      border: `1px solid ${escalated ? '#fca5a5' : '#eee'}`,
      borderLeft: `4px solid ${escalated ? '#ef4444' : severity === 'high' ? '#f97316' : '#d1d5db'}`,
      borderRadius: '0 12px 12px 0',
      padding: '14px 14px 14px 12px',
      marginBottom: 10
    }}>
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {issueType.map(t => (
            <span key={t} style={{
              fontSize: 11, padding: '2px 8px', borderRadius: 999,
              background: '#f3f4f6', color: '#374151',
              fontWeight: 500, textTransform: 'capitalize'
            }}>{t}</span>
          ))}
          {escalated && (
            <span style={{
              fontSize: 11, padding: '2px 8px', borderRadius: 999,
              background: '#fee2e2', color: '#991b1b', fontWeight: 500
            }}>⚠ Overdue</span>
          )}
        </div>
        <span style={{
          fontSize: 11, padding: '3px 8px', borderRadius: 999,
          background: severityStyle.bg, color: severityStyle.color,
          fontWeight: 500, flexShrink: 0, marginLeft: 6
        }}>
          {severity}
        </span>
      </div>

      {/* Description */}
      {description && (
        <p style={{ fontSize: 13, color: '#555', marginBottom: 6, lineHeight: 1.5 }}>
          {description}
        </p>
      )}

      {/* Location + time */}
      <div style={{ fontSize: 11, color: '#888', display: 'flex', justifyContent: 'space-between' }}>
        <span>📍 {location?.address || 'Location not set'}</span>
        <span>{timeAgo(createdAt)}</span>
      </div>

      {/* Stage tracker */}
      <StageTracker status={status} />
    </div>
  )
}

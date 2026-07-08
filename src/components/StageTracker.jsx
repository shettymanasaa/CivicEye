const STAGES = ['reported', 'assigned', 'in_progress', 'resolved']
const LABELS = {
  reported: 'Reported',
  assigned: 'Assigned',
  in_progress: 'In Progress',
  inspection_required: "Inspection Required",
  
}

export default function StageTracker({ status }) {
  const currentIndex = STAGES.indexOf(status)

  return (
    <div style={{ padding: '12px 0 4px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', position: 'relative' }}>
        <div style={{
          position: 'absolute', top: 14, left: 14, right: 14,
          height: 2, background: '#e5e7eb', zIndex: 0
        }} />
        <div style={{
          position: 'absolute', top: 14, left: 14,
          height: 2, background: '#2563eb', zIndex: 1,
          width: currentIndex === 0 ? '0%' : `${(currentIndex / (STAGES.length - 1)) * 86}%`,
          transition: 'width 0.4s ease'
        }} />
        {STAGES.map((stage, i) => {
          const done = i <= currentIndex
          const active = i === currentIndex
          return (
            <div key={stage} style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', position: 'relative', zIndex: 2
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: done ? '#2563eb' : '#fff',
                border: `2px solid ${done ? '#2563eb' : '#d1d5db'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, color: done ? '#fff' : '#9ca3af',
                fontWeight: 500,
                boxShadow: active ? '0 0 0 4px #dbeafe' : 'none',
              }}>
                {done && i < currentIndex ? '✓' : i + 1}
              </div>
              <div style={{
                marginTop: 6, fontSize: 10,
                color: done ? '#2563eb' : '#9ca3af',
                fontWeight: done ? 500 : 400,
                textAlign: 'center', lineHeight: 1.3
              }}>
                {LABELS[stage]}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

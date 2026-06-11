import { useEffect, useState } from 'react'
import { db } from '../firebase'
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import Navbar from '../components/Navbar'

export default function CompletedIssues() {
  const [resolved, setResolved] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchResolved() {
      try {
        const q = query(
          collection(db, 'complaints'),
          where('status', '==', 'resolved'),
          orderBy('resolvedAt', 'desc')
        )
        const snap = await getDocs(q)
        console.log("Resolved docs:", snap.docs.length)
console.log(snap.docs.map(d => d.data()))
        setResolved(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      } catch (e) { console.log(e) }
      setLoading(false)
    }
    fetchResolved()
  }, [])

  function getTimeToResolve(c) {
    if (!c.resolvedAt || !c.createdAt) return 'N/A'
    const resolved = c.resolvedAt.toDate ? c.resolvedAt.toDate() : new Date(c.resolvedAt)
    const created = c.createdAt.toDate ? c.createdAt.toDate() : new Date(c.createdAt)
    const diff = resolved - created
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    if (hours === 0) return `${mins} min`
    return `${hours}h ${mins}min`
  }

  function getDate(ts) {
    if (!ts) return ''
    const d = ts.toDate ? ts.toDate() : new Date(ts)
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const avgTime = () => {
    const withTime = resolved.filter(c => c.resolvedAt && c.createdAt)
    if (!withTime.length) return 'N/A'
    const avg = withTime.reduce((sum, c) => {
      const r = c.resolvedAt.toDate ? c.resolvedAt.toDate() : new Date(c.resolvedAt)
      const cr = c.createdAt.toDate ? c.createdAt.toDate() : new Date(c.createdAt)
      return sum + (r - cr)
    }, 0) / withTime.length
    const h = Math.floor(avg / (1000 * 60 * 60))
    const m = Math.floor((avg % (1000 * 60 * 60)) / (1000 * 60))
    return `${h}h ${m}min`
  }

  return (
    <div>
      <Navbar title="Completed Issues" showBack role="authority" />
      <div className="page">
        <div style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 4 }}>Resolved complaints</h2>
          <p style={{ fontSize: 13, color: '#888' }}>{resolved.length} issues resolved</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-num" style={{ color: '#16a34a' }}>{resolved.length}</div>
            <div className="stat-label">Total resolved</div>
          </div>
          <div className="stat-card">
            <div className="stat-num" style={{ color: '#2563eb', fontSize: 16 }}>{avgTime()}</div>
            <div className="stat-label">Avg resolution time</div>
          </div>
        </div>

        {loading && <div className="loading">Loading resolved complaints...</div>}

        {!loading && resolved.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#888' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
            <p style={{ fontSize: 14 }}>No resolved complaints yet</p>
          </div>
        )}

        {resolved.map(c => (
          <div key={c.id} style={{
            background: '#f0fdf4', border: '1px solid #bbf7d0',
            borderLeft: '4px solid #16a34a', borderRadius: '0 12px 12px 0',
            padding: '14px 14px 14px 12px', marginBottom: 10
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                {(c.issueType || []).map(t => (
                  <span key={t} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 999, background: '#dcfce7', color: '#166534', fontWeight: 500, textTransform: 'capitalize' }}>{t}</span>
                ))}
              </div>
              <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 999, background: '#dcfce7', color: '#166534', fontWeight: 500 }}>✅ Resolved</span>
            </div>

            <a
  href={`https://www.google.com/maps?q=${c.location?.lat},${c.location?.lng}`}
  target="_blank"
  rel="noreferrer"
  style={{
    color: '#2563eb',
    textDecoration: 'underline'
  }}
>
  📍 {c.location?.address}
</a>

            {c.description && (
              <p style={{ fontSize: 13, color: '#374151', marginBottom: 8 }}>{c.description}</p>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
              <span style={{ color: '#16a34a', fontWeight: 500 }}>⏱ Resolved in: {getTimeToResolve(c)}</span>
              <span style={{ color: '#888' }}>{getDate(c.resolvedAt)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

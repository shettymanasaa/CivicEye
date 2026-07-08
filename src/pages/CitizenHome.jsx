import { useEffect, useState } from 'react'
import { db, auth } from '../firebase'
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import ComplaintCard from '../components/ComplaintCard'

export default function CitizenHome() {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    console.log("UID:", auth.currentUser?.uid)
    const q = query(
  collection(db, 'complaints'),
  orderBy('createdAt', 'desc')
)
    const unsub = onSnapshot(q, snap => {
  console.log("Docs found:", snap.docs.length)
  console.log("Data:", snap.docs.map(d => d.data()))
  const uid = auth.currentUser.uid

const myComplaints = snap.docs
  .map(d => ({
    id: d.id,
    ...d.data()
  }))
  .filter(c =>
    c.citizenId === uid ||
    (c.supporters || []).includes(uid)
  )

setComplaints(myComplaints)

  

  setLoading(false)
})
    return unsub
  }, [])

  const resolved = complaints.filter(c => c.status === 'resolved').length
  const open = complaints.filter(c => c.status !== 'resolved').length

  return (
    <div>
      <Navbar title="CivicEye" role="citizen" />
      <div className="page">
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 4 }}>My Complaints</h2>
          <p style={{ fontSize: 13, color: '#888' }}>Track all your reported issues here</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-num" style={{ color: '#2563eb' }}>{open}</div>
            <div className="stat-label">Open</div>
          </div>
          <div className="stat-card">
            <div className="stat-num" style={{ color: '#16a34a' }}>{resolved}</div>
            <div className="stat-label">Resolved</div>
          </div>
        </div>

        <button onClick={() => navigate('/report')} style={{
          width: '100%', padding: '14px', borderRadius: 12,
          background: '#2563eb', color: '#fff', border: 'none',
          fontSize: 15, fontWeight: 500, cursor: 'pointer',
          marginBottom: 20, display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: 8
        }}>
          📸 Report a new issue
        </button>

        {loading && <div className="loading">Loading your complaints...</div>}

        {!loading && complaints.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#888' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🏙️</div>
            <p style={{ fontSize: 14, marginBottom: 6 }}>No complaints yet</p>
            <p style={{ fontSize: 13 }}>Tap the button above to report your first issue</p>
          </div>
        )}

        {complaints.map(c => <ComplaintCard key={c.id} complaint={c} />)}
      </div>
    </div>
  )
}

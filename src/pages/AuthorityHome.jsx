import { useEffect, useState } from 'react'
import { db } from '../firebase'
import { collection, query, where, orderBy, onSnapshot, updateDoc, doc, Timestamp, getDocs } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function AuthorityHome() {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null)
  const[proofPhoto,setProofPhoto]=useState(null)
  const navigate = useNavigate()

  async function checkEscalations(allComplaints) {
    const now = new Date()
    for (const c of allComplaints) {
      if (c.escalated) continue
      if (!c.createdAt) continue
      const created = c.createdAt.toDate ? c.createdAt.toDate() : new Date(c.createdAt)
      const hoursOld = (now - created) / (1000 * 60 * 60)
      if (hoursOld > 24) {
        try {
          await updateDoc(doc(db, 'complaints', c.id), { escalated: true, escalatedAt: Timestamp.now() })
        } catch (e) { console.log(e) }
      }
    }
  }

  useEffect(() => {
    const q = query(
      collection(db, 'complaints'),
      where('status', 'in', [
  'reported',
  'reopened',
  'assigned',
  'in_progress',
  'awaiting_verification',
  'inspection_required'
]),
    )
    const unsub = onSnapshot(q, snap => {
      console.log("Authority docs:", snap.docs.length)
  console.log(snap.docs.map(d => d.data()))
      const all = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      checkEscalations(all)
      

const order = {
  reopened: 0,
  reported: 1,
  in_progress: 2,
  awaiting_verification: 3,
  resolved: 4
}

const sorted = all.sort((a,b) => {

  if (a.escalated && !b.escalated) return -1
  if (!a.escalated && b.escalated) return 1

  if (order[a.status] !== order[b.status]) {
    return order[a.] - order[b.status]
  }

  if (b.priority !== a.priority) {
  return b.priority - a.priority
}

return b.createdAt?.seconds - a.createdAt?.seconds
})
      setComplaints(sorted)
      setLoading(false)
    })
    return unsub
  }, [])

  async function markStatus(id, newStatus) {
    setUpdating(id)
    const updates = { status: newStatus }
    if (newStatus === 'in_progress') updates.assignedAt = Timestamp.now()
    if (newStatus === 'awaiting_verification') updates.resolvedAt = Timestamp.now()
    try {
      await updateDoc(doc(db, 'complaints', id), updates)
    } catch (e) { console.log(e) }
    setUpdating(null)
  }
  async function uploadResolutionProof(id) {
  if (!proofPhoto) {
    alert('Please select a proof photo first')
    return
  }

  try {
    const formData = new FormData()

    formData.append('file', proofPhoto)
    formData.append('upload_preset', 'CIVICEYE')

    const res = await fetch(
      'https://api.cloudinary.com/v1_1/dged4n0du/image/upload',
      {
        method: 'POST',
        body: formData
      }
    )

    const data = await res.json()

    
await updateDoc(doc(db, 'complaints', id), {
  resolutionPhoto: data.secure_url,
  status: 'awaiting_verification',
  resolvedAt: Timestamp.now(),
  verificationVotes: []
})
setProofPhoto(null)

  } catch (e) {
    console.log(e)
  }
}

  const timeAgo = (ts) => {
    if (!ts) return ''
    const date = ts.toDate ? ts.toDate() : new Date(ts)
    const diff = Math.floor((Date.now() - date) / 60000)
    if (diff < 60) return `${diff}m ago`
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`
    return `${Math.floor(diff / 1440)}d ago`
  }

  const escalated = complaints.filter(c => c.escalated)

  return (
    <div>
      <Navbar title="CivicEye" role="authority" />
      <div className="page">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 2 }}>Ward Dashboard</h2>
            <p style={{ fontSize: 12, color: '#888' }}>GHMC Officer View</p>
          </div>
          <button onClick={() => navigate('/completed')} style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '7px 12px', fontSize: 12, color: '#166534', cursor: 'pointer', fontWeight: 500 }}>
            ✅ Completed
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-num" style={{ color: '#2563eb' }}>{complaints.length}</div>
            <div className="stat-label">Open complaints</div>
          </div>
          <div className="stat-card">
            <div className="stat-num" style={{ color: '#fa0505f0' }}>{escalated.length}</div>
            <div className="stat-label">Escalated</div>
          </div>
        </div>

        {escalated.length > 0 && (
          <div className="escalation-banner">
            ⚠️ {escalated.length} 🚨 Resolution Deadline Exceeded – Escalation Triggered (⚠️ Immediate Administrative Attention Required)
          </div>
        )}

        {loading && <div className="loading">Loading complaints...</div>}

        {!loading && complaints.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#888' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
            <p style={{ fontSize: 14 }}>All clear! No open complaints.</p>
          </div>
        )}

        <div className="section-label">Priority Queue</div>

        {complaints.map(c => {
          const isUpdating = updating === c.id
          const borderColor = c.escalated ? '#ef4444' : c.severity === 'high' ? '#f97316' : '#d1d5db'
          return (
            <div key={c.id} style={{
              background: '#fff', marginBottom: 10,
              border: `1px solid ${c.escalated ? '#fecaca' : '#eee'}`,
              borderLeft: `4px solid ${borderColor}`,
              borderRadius: '0 12px 12px 0', padding: '14px 14px 14px 12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 4 }}>
                    {(c.issueType || []).map(t => (
                      <span key={t} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 999, background: '#f3f4f6', color: '#374151', fontWeight: 500, textTransform: 'capitalize' }}>{t}</span>
                    ))}
                    {c.escalated && <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 999, background: '#fee2e2', color: '#e20707', fontWeight: 500 }}>⚠ escalated!! action required</span>}
                  </div>
                  <div style={{
  marginBottom: 8,
  fontWeight: 600
}}>
  {c.status === 'reported' && 'New Complaint'}
  {c.status === 'reopened' && ' ❌Reopened'}
  {c.status === 'in_progress' && '🔵 In Progress'}
  {c.status === 'awaiting_verification' && '🟣 Awaiting Verification'}
  {c. === 'resolved' && '🟢 Resolved'}
</div>
                  <a
  href={`https://www.google.com/maps?q=${c.location?.lat},${c.location?.lng}`}
  target="_blank"
  rel="noreferrer"
  style={{ color: '#2563eb', textDecoration: 'underline' }}
>
  📍 {c.location?.address}
</a>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                  <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 999, fontWeight: 500, background: c.severity === 'high' ? '#fee2e2' : '#fef9c3', color: c.severity === 'high' ? '#991b1b' : '#854d0e' }}>
                    {c.severity}
                  </span>
                  <span style={{ fontSize: 10, color: '#888' }}>{timeAgo(c.createdAt)}</span>
                </div>
              </div>

              {c.description && (
                <div
  style={{
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    background: "#eff6ff",
    color: "#1d4ed8",
    padding: "6px 10px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
    marginBottom: 10
  }}
>
  👥 {c.supportCount || 1} Citizens Reported
</div>
                
              )}
              {c.reopenReason && (
  <div
    style={{
      background: "#fff7ed",
      border: "1px solid #f5f3f0",
      borderRadius: 8,
      padding: 10,
      marginBottom: 10,
      color: "#9a3412"
    }}
  >
    <strong>Citizen Feedback</strong>

    <div style={{ marginTop: 6 }}>
      {c.reopenReason}
    </div>
  </div>
)}

              <div style={{
  display:'flex',
  gap:10,
  marginBottom:10
}}>

  {c.photoUrl && (
    <div style={{flex:1}}>
      <div style={{
        fontSize:12,
        fontWeight:600,
        marginBottom:4
      }}>
        Before
      </div>

      <img
        src={c.photoUrl}
        onClick={() => window.open(c.photoUrl,'_blank')}
        style={{
          width:'100%',
          height:180,
          objectFit:'cover',
          borderRadius:8
        }}
      />
    </div>
  )}

  {c.proofPhotoUrl && (
    <div style={{flex:1}}>
      <div style={{
        fontSize:12,
        fontWeight:600,
        marginBottom:4,
        color:'green'
      }}>
        After
      </div>

      <img
        src={c.proofPhotoUrl}
        onClick={() => window.open(c.proofPhotoUrl,'_blank')}
        style={{
          width:'100%',
          height:180,
          objectFit:'cover',
          borderRadius:8
        }}
      />
    </div>
  )}

</div>

              <div style={{ display: 'flex', gap: 8 }}>
                {c.status === 'reported' && (
                  <button onClick={() => markStatus(c.id, 'in_progress')} disabled={isUpdating} style={{ flex: 1, padding: '8px', borderRadius: 8, border: '1px solid #bfdbfe', background: '#dbeafe', color: '#1e40af', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>
                    {isUpdating ? '...' : '▶ Mark In Progress'}
                  </button>
                  
                )}
               
               {(c.status === "in_progress" || c.status === "reopened") && (
                
                  <>
                  <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
  }}
></div>
  <input
    type="file"
    accept="image/*"
    onChange={(e) => setProofPhoto(e.target.files[0])}
  />

  <button
    onClick={() => uploadResolutionProof(c.id)}
    disabled={isUpdating}
     style={{
      padding: "8px 16px",
      borderRadius: 8,
      cursor: "pointer",
      whiteSpace: "nowrap",
    }}
  >
    Upload Proof Photo
  </button>
</>
  
)}
 
               
              </div>

              <div style={{ marginTop: 8, fontSize: 11, color: '#888', display: 'flex', justifyContent: 'space-between' }}>
                <span>Priority: {c.priority}/10</span>
                <span style={{ textTransform: 'capitalize' }}>Status: {c.status?.replace('_', ' ')}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

import { useState } from 'react'
import { doc, updateDoc, Timestamp } from 'firebase/firestore'
import { db, auth } from "../firebase"
import StageTracker from './StageTracker'

export default function ComplaintCard({ complaint }) {
  const {
  issueType,
  severity,
  status,
  description,
  location,
  createdAt,
  escalated,
  photoUrl,
  resolutionPhoto,
} = complaint
const [reason, setReason] = useState("")

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
 async function verifyComplaint(isApproved) {

  if (!isApproved && !reason.trim()) {
    alert("Please enter the reason.")
    return
  }

  try {
  const uid = auth.currentUser.uid

  const votes = complaint.verificationVotes || []

  // Prevent duplicate voting
  if (votes.some(v => v.uid === uid)) {
    alert("You have already voted.")
    return
  }

  const updatedVotes = [
    ...votes,
    {
      uid,
      vote: isApproved ? "fixed" : "not_fixed"
    }
  ]
  



  const supporters = complaint.supporters || []
  const requiredVotes = Math.min(
  5,
  Math.ceil(supporters.length * 0.6)
)

  const fixedVotes = updatedVotes.filter(v => v.vote === "fixed").length
  const notFixedVotes = updatedVotes.filter(v => v.vote === "not_fixed").length

  const updates = {
    verificationVotes: updatedVotes,
    verifiedAt: Timestamp.now()
  }

  if (fixedVotes >= requiredVotes) {
    updates.status = "resolved"
  }

  else if (notFixedVotes >= requiredVotes) {
    updates.status = "reopened"
    updates.reopenReason = reason
    updates.reopenedAt = Timestamp.now()
  }
 if (
  updatedVotes.length === supporters.length &&
  fixedVotes === notFixedVotes
) {
  updates.status = "inspection_required"
}
  await updateDoc(
    doc(db, "complaints", complaint.id),
    updates
  )

  setReason("")
}

  catch (err) {
    console.log(err)
  }
}
const isSupporter =
  (complaint.supporters || []).includes(auth.currentUser?.uid)

const hasVoted =
  (complaint.verificationVotes || []).some(
    v => v.uid === auth.currentUser?.uid
  )

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
  👥 {complaint.supportCount || 1} Citizens Reported
</div>
       ) }{description}
      
      
      <div style={{
  display:'flex',
  gap:10,
  marginBottom:10
}}>

  {photoUrl && (
    <div style={{flex:1}}>
      <div style={{
        fontSize:12,
        fontWeight:600,
        marginBottom:4
      }}>
        Before
      </div>

      <img
        src={photoUrl}
        onClick={() => window.open(photoUrl,'_blank')}
        style={{
          width:'100%',
          height:180,
          objectFit:'cover',
          borderRadius:8
        }}
      />
    </div>
  )}

  {resolutionPhoto && (
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
        src={resolutionPhoto}
        onClick={() => window.open(resolutionPhoto,'_blank')}
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

      {/* Location + time */}
      <div style={{ fontSize: 11, color: '#888', display: 'flex', justifyContent: 'space-between' }}>
        <span>📍 {location?.address || 'Location not set'}</span>
        <span>{timeAgo(createdAt)}</span>
      </div>
      {complaint.reopenReason && (
  <div
    style={{
      background:"#fff7ed",
      border:"1px solid #fdba74",
      padding:10,
      borderRadius:8,
      marginTop:10,
      marginBottom:10
    }}
  >
    <strong>Previous Feedback</strong>

    <div style={{marginTop:5}}>
      {complaint.reopenReason}
    </div>
  </div>
)}

      {/* Stage tracker */}
      <StageTracker status={status} />
      
      
      {status === 'awaiting_verification' && isSupporter && !hasVoted && (
  <div style={{ marginTop: 12 }}>
    <textarea
  placeholder="Reason for not fixing..."
  value={reason}
  onChange={(e)=>setReason(e.target.value)}
  rows={3}
  style={{
    width:"100%",
    padding:10,
    borderRadius:8,
    border:"1px solid #ddd",
    marginBottom:12,
    resize:"vertical"
  }}
  
/>
{status === "awaiting_verification" && hasVoted && (
  <div
    style={{
      marginTop: 12,
      padding: 12,
      borderRadius: 8,
      background: "#ecfdf5",
      color: "#166534",
      textAlign: "center",
      fontWeight: 500
    }}
  >
    ✅ Thank you! 
  </div>
)}

{status === "awaiting_verification" && !isSupporter && (
  <div
    style={{
      marginTop: 12,
      padding: 12,
      borderRadius: 8,
      background: "#f3f4f6",
      color: "#555",
      textAlign: "center"
    }}
  >
    Waiting for community verification...
  </div>
)}
    
    {complaint.resolutionPhoto && (
      <img
        src={complaint.resolutionPhoto}
        alt="resolution"
        style={{
          width: '100%',
          maxHeight: 220,
          objectFit: 'cover',
          borderRadius: 8,
          marginBottom: 10
        }}
      />
    )}
<div
  style={{
    background: "#eff6ff",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "12px",
    fontSize: "14px",
    color: "#1d4ed8"
  }}
>
  Community Verification
  <br />
  {updatedVotes} / {requiredVotes} votes received
</div>
    <div style={{
      display: 'flex',
      gap: 10
    }}>
      <button
        onClick={() => verifyComplaint(true)}
        style={{
          flex: 1,
          padding: '10px',
          background: '#dcfce7',
          border: '1px solid #16a34a',
          borderRadius: 8,
          cursor: 'pointer'
        }}
      >
        ✅ Fixed
      </button>

      <button
        onClick={() => verifyComplaint(false)}
        style={{
          flex: 1,
          padding: '10px',
          background: '#fee2e2',
          border: '1px solid #dc2626',
          borderRadius: 8,
          cursor: 'pointer'
        }}
      >
        ❌ Not Fixed
      </button>
    </div>

  </div>
)}
    </div>
  )
}

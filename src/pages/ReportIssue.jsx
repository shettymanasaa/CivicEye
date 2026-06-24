import React,{useState,useRef} from 'react'

import { db,auth } from '../firebase'
import { collection, addDoc, Timestamp } from 'firebase/firestore'

import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import VoiceInput from '../components/VoiceInput'
import { detectIssue } from '../utils/detectIssue'

export default function ReportIssue() {
  
  const [photo, setPhoto] = useState(null)
  const [preview, setPreview] = useState(null)
  
  
  const [description, setDescription] = useState('')
  const [StreamRef,setStreamRef]=useState(null)
  
const [aiDescription, setAiDescription] = useState('')
const [detected, setDetected] = useState(null)
  const [manualType, setManualType] = useState([])
  const [location, setLocation] = useState(null)
  const [locLoading, setLocLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [detecting, setDetecting] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function startCamera() {
    

}

  

  function getLocation() {
    setLocLoading(true)
    navigator.geolocation.getCurrentPosition(
      pos => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          address: `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`
        })
        setLocLoading(false)
      },
      () => {
        setLocation({ lat: 17.4947, lng: 78.3996, address: 'Kukatpally, Hyderabad (default)' })
        setLocLoading(false)
      }
    )
  }

  async function handlePhoto(e) {
    const file = e.target.files[0]
    if (!file) return
    setPhoto(file)
    setPreview(URL.createObjectURL(file))
    setDetecting(true)
    getLocation()
    try {
      const tempUrl = URL.createObjectURL(file)
      const result = await detectIssue(tempUrl)
      setDetected(result)
      setManualType(result.issueTypes)
     
    const autoDesc = `Detected ${result.issueTypes.join(', ')} issue with ${result.severity} severity`
    setAiDescription(autoDesc)
    setDescription(autoDesc)  
    } catch (err) {
      setDetected({ issueTypes: ['garbage'], severity: 'medium', priority: 5 })
      setManualType(['garbage'])
    }
    setDetecting(false)
  }

  function toggleType(type) {
    setManualType(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    )
  }

  async function submitComplaint() {
    if (!photo) { setError('Please take or upload a photo first'); return }
    if (!description && manualType.length === 0) { setError('Please describe the issue or select issue type'); return }
    setError('')
    if (detected?.noComplaint) {
  setError('No civic issue detected in image')
  return
}
    setSubmitting(true)
    try {
      const formData = new FormData()
formData.append('file', photo)
formData.append('upload_preset', 'CIVICEYE')

const cloudinaryRes = await fetch(
  'https://api.cloudinary.com/v1_1/dged4n0du/image/upload',
  {
    method: 'POST',
    body: formData
  }
)

const cloudinaryData = await cloudinaryRes.json()
console.log(cloudinaryData)
const photoUrl = cloudinaryData.secure_url
console.log(photoUrl)

      const issueTypes = manualType.length > 0 ? manualType : (detected?.issueTypes || ['garbage'])
      const severity = detected?.severity || 'medium'
      const priority = detected?.priority || 5
      const dept = issueTypes.includes('garbage') && issueTypes.includes('pothole')
        ? 'both' : issueTypes.includes('pothole') ? 'roads' : 'sanitation'

      await addDoc(collection(db, 'complaints'), {
        citizenId: auth.currentUser.uid,
        issueType: issueTypes,
        description,
        severity,
        priority,
        department: dept,
        photoUrl,
        location: location || { lat: 17.4947, lng: 78.3996, address: 'Hyderabad' },
        status: 'reported',
        escalated: false,
        createdAt: Timestamp.now(),
        assignedAt: null,
        resolvedAt: null,
        resolutionPhoto:"",
        citizenVerified:false,
        verified:null,
        verificationstatus:'pending'

      })
      navigate('/citizen')
    } catch (err) {
      setError('Failed to submit. Check your internet connection and try again.')
      console.error(err)
    }
    setSubmitting(false)
  }

  return (
    <div>
      <Navbar title="Report Issue" showBack role="citizen" />
      <div className="page">

        {/* Photo upload */}
        <div style={{ marginBottom: 16 }}>
          <div className="section-label">Step 1 — Take a photo</div>
       



    <label style={{ display: 'block', cursor: 'pointer' }}>
            <div style={{
              border: `2px dashed ${preview ? '#93c5fd' : '#d1d5db'}`,
              borderRadius: 12, padding: preview ? 0 : '32px 20px',
              textAlign: 'center', background: preview ? 'transparent' : '#f9fafb',
              overflow: 'hidden'
            }}>
              {preview
                ? <img src={preview} onClick={() => window.open(c.photoUrl, '_blank')} style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 10 }} />
                : (
                  <div>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>📷</div>
                    <p style={{ fontSize: 14, color: '#555' }}>Tap to take photo or upload</p>
                    <p style={{ fontSize: 12, color: '#888', marginTop: 4 }}>Supports gallery or camera</p>
                  </div>
                )
              }
            </div>
          
<input
  type="file"
  accept="image/*"
  capture="environment"
  onChange={handlePhoto}
/>
          </label>
        </div>

        {/* AI Detection result */}
        {detecting && (
          <div style={{ padding: '12px 14px', background: '#eff6ff', borderRadius: 10, marginBottom: 16, fontSize: 13, color: '#1d4ed8' }}>
            🔍 Analysing photo...
          </div>
        )}
        {detected && !detecting && (
          <div style={{ padding: '12px 14px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, marginBottom: 16 }}>
            <p style={{ fontSize: 12, fontWeight: 500, marginBottom: 6 }}>
  {detected?.noComplaint
    ? '✅ No civic issue detected'
    : '✅ AI detected:'}
</p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {detected.issueTypes.map(t => (
                <span key={t} style={{ background: 'transparent', color:detected.severity === ' high' ? '#dc2626ec' : detected.severity === 'high' ? '#dc2626' : detected.severity === 'medium' ? '#d96106' : '#16a34a', fontSize: 12, padding: '3px 10px', borderRadius: 999, fontWeight: 500, textTransform: 'capitalize' }}>{t}</span>
              ))}
              {!detected?.noComplaint && (
  <span style={{
    background: 'transparent',
    color: detected.severity === 'high' ? '#dc4726' : detected.severity === 'medium' ? '#d95e06' : '#16a34a',
    fontSize: 12,
    padding: '4px 8px',
    borderRadius: 999
  }}>
  
    {detected.severity} severity({detected.confidence}% )
    
  
  <div style={{ marginTop: 8, fontSize: 12 }}>
  Pothole: {detected.potholePercent}% <br />
  Garbage: {detected.garbagePercent}% <br />
  Normal: {detected.normalPercent}%
</div> 

  </span>
              ) }</div>
       
       </div>)} 
  
  

  
          
          
        

        {/* Manual type selection */}
        <div style={{ marginBottom: 16 }}>
          <div className="section-label">Step 2 — Confirm issue type</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['garbage', 'pothole', 'both'].map(type => {
              const active = type === 'both'
                ? manualType.includes('garbage') && manualType.includes('pothole')
                : manualType.includes(type)
              return (
                <button key={type} onClick={() => {
                  if (type === 'both') { setManualType(['garbage', 'pothole']) }
                  else { toggleType(type) }
                }} style={{
                  flex: 1, padding: '10px 8px', borderRadius: 10, border: `1.5px solid ${active ? '#2563eb' : '#e5e7eb'}`,
                  background: active ? '#eff6ff' : '#fff', color: active ? '#2563eb' : '#555',
                  fontWeight: active ? 500 : 400, fontSize: 13, cursor: 'pointer', textTransform: 'capitalize'
                }}>
                  {type === 'garbage' ? '🗑 Garbage' : type === 'pothole' ? '🕳 Pothole' : '⚠️ Both'}
                </button>
              )
            })}
          </div>
        </div>

        {/* Voice input */}
        <div style={{ marginBottom: 16 }}>
          <div className="section-label">Step 3 — Describe the problem</div>
          
<VoiceInput onTranscript={text => {
  
  setDescription(prev => 
    prev ? prev + ' ' + text : text
  )
}} />
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Or type your description here..."
            rows={3}
            style={{
              width: '100%', marginTop: 10, padding: '12px 14px',
              border: '1px solid #ddd', borderRadius: 10,
              fontSize: 14, resize: 'none', fontFamily: 'inherit', outline: 'none'
            }}
          />
        </div>

        {/* Location */}
        <div style={{ marginBottom: 20 }}>
          <div className="section-label">Step 4 — Location</div>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 14px', background: '#f9fafb', border: '1px solid #eee', borderRadius: 10
          }}>
            <div style={{ fontSize: 13, color: '#555' }}>
              {locLoading ? '📍 Getting location...' : location ? `📍 ${location.address}` : '📍 Location not detected yet'}
            </div>
            <button onClick={getLocation} style={{
              background: 'none', border: 'none', color: '#2563eb',
              fontSize: 12, cursor: 'pointer', fontWeight: 500
            }}>
              {location ? 'Refresh' : 'Get Location'}
            </button>
          </div>
        </div>

        {error && (
          <div style={{ padding: '10px 14px', background: '#fee2e2', borderRadius: 8, fontSize: 13, color: '#991b1b', marginBottom: 12 }}>
            {error}
          </div>
        )}

       {detected?.noComplaint && (
  <p style={{ color: 'red', marginBottom: 10 }}>
    Please upload an image containing a civic issue.
  </p>
)} <button
  onClick={submitComplaint}
  disabled={submitting || !photo || detected?.noComplaint} className="btn btn-blue">
          {submitting ? 'Submitting...' : '✅ Submit Complaint'}
        </button>
      </div>
    </div>
  )

}
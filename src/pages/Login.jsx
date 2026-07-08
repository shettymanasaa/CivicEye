console.log("Button clicked");
import { useState } from 'react'
import { auth, db } from '../firebase'
import {
  signInAnonymously,
  signInWithEmailAndPassword
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [mode, setMode] = useState('citizen')
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
 
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const navigate = useNavigate()

 async function loginCitizen() {
  console.log("Button clicked");

  setLoading(true);
  setError("");

  try {
    console.log("Signing in...");

    const userCredential = await signInAnonymously(auth);

    console.log("Success!", userCredential.user);

    navigate("/citizen");
  } catch (err) {
    console.error(err);
    setError(err.message);
  }

  setLoading(false);
}
  
  async function loginAuthority() {
    if (!email || !password) { setError('Enter email and password'); return }
    setError(''); setLoading(true)
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      const snap = await getDoc(doc(db, 'users', result.user.uid))
      if (snap.exists() && snap.data().role === 'authority') { navigate('/authority') }
      else { setError('Not an authority account.'); await auth.signOut() }
    } catch (err) {
  console.log(err)
  setError(err.message)
}
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <div style={{ background: '#fff', padding: '32px 24px 24px', borderBottom: '1px solid #eee', textAlign: 'center' }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto 12px' }}>👁</div>
        <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>CivicEye</h1>
        <p style={{ fontSize: 13, color: '#888' }}>Smart civic reporting for better cities</p>
      </div>
      <div style={{ padding: '24px 20px', maxWidth: 400, margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: 12, padding: 4, marginBottom: 24 }}>
          <button onClick={() => { setMode('citizen'); setError('') }} style={{ flex: 1, padding: '10px', borderRadius: 9, border: 'none', background: mode === 'citizen' ? '#fff' : 'transparent', color: mode === 'citizen' ? '#2563eb' : '#888', fontWeight: mode === 'citizen' ? 500 : 400, fontSize: 14, cursor: 'pointer', boxShadow: mode === 'citizen' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none' }}>
            👤 Citizen
          </button>
          <button onClick={() => { setMode('authority'); setError('') }} style={{ flex: 1, padding: '10px', borderRadius: 9, border: 'none', background: mode === 'authority' ? '#fff' : 'transparent', color: mode === 'authority' ? '#b45309' : '#888', fontWeight: mode === 'authority' ? 500 : 400, fontSize: 14, cursor: 'pointer', boxShadow: mode === 'authority' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none' }}>
            🏛 Authority
          </button>
        </div>

        {mode === 'citizen' && (
  <div>
    <div
      style={{
        background: "#dcfce7",
        borderRadius: 10,
        padding: "12px 16px",
        color: "#166534",
        fontSize: 13,
        marginBottom: 20,
      }}
    >
      Continue anonymously. No phone number or account required.
    </div>

    <button onClick={loginCitizen}>
  Continue as Citizen
</button>
  </div>
)}

        {mode === 'authority' && (
          <div>
            <div style={{ background: '#fef3c7', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#92400e', marginBottom: 16 }}>
              For GHMC/municipality officers only.
            </div>
            <label style={{ fontSize: 13, color: '#555', fontWeight: 500, display: 'block', marginBottom: 6 }}>Official email</label>
            <input className="input" type="email" placeholder="officer@ghmc.gov.in" value={email} onChange={e => setEmail(e.target.value)} style={{ marginBottom: 12 }} />
            <label style={{ fontSize: 13, color: '#555', fontWeight: 500, display: 'block', marginBottom: 6 }}>Password</label>
            <input className="input" type="password" placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)} style={{ marginBottom: 16 }} />
            <button onClick={loginAuthority} disabled={loading} className="btn btn-amber">{loading ? 'Logging in...' : 'Login as Authority'}</button>
          </div>
        )}

        {error && <div style={{ marginTop: 14, padding: '10px 14px', background: '#fee2e2', borderRadius: 8, fontSize: 13, color: '#991b1b' }}>{error}</div>}
        <div id="recaptcha-container"></div>
      </div>
    </div>
  )
}

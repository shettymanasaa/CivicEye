import { useNavigate } from 'react-router-dom'
import { auth } from '../firebase'
import { signOut } from 'firebase/auth'

export default function Navbar({ title, showBack, role }) {
  const navigate = useNavigate()

  async function handleLogout() {
    await signOut(auth)
    navigate('/')
  }

  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: '#fff', borderBottom: '1px solid #eee',
      padding: '14px 16px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {showBack && (
          <button onClick={() => navigate(-1)} style={{
            background: 'none', border: 'none', fontSize: 20,
            cursor: 'pointer', color: '#555', padding: '0 4px 0 0'
          }}>←</button>
        )}
        <div>
          <div style={{ fontWeight: 500, fontSize: 15 }}>{title}</div>
          {role && (
            <div style={{
              fontSize: 11, color: role === 'authority' ? '#b45309' : '#1d4ed8',
              fontWeight: 500
            }}>
              {role === 'authority' ? 'Authority view' : 'Citizen view'}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* CivicEye logo */}
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: role === 'authority' ? '#fef3c7' : '#dbeafe',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14
        }}>👁</div>

        <button onClick={handleLogout} style={{
          background: '#f5f5f5', border: '1px solid #eee',
          borderRadius: 8, padding: '5px 10px',
          fontSize: 12, color: '#555', cursor: 'pointer'
        }}>
          Logout
        </button>
      </div>
    </div>
  )
}

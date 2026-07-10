
import{ BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { auth, db } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

import Signup from "./pages/Signup"
import Login from './pages/Login'
import CitizenHome from './pages/CitizenHome'
import ReportIssue from './pages/ReportIssue'
import AuthorityHome from './pages/AuthorityHome'
import CompletedIssues from './pages/CompletedIssues'
export default function App() {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
  setUser(u)

  if (u.isAnonymous) {
    setRole("citizen")
  } else {
    try {
      const snap = await getDoc(doc(db, "users", u.uid))
      if (snap.exists()) setRole(snap.data().role)
    } catch (e) {
      console.log(e)
    }
  }

      } else {
        setUser(null)
        setRole(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  if (loading) return <div className="loading">Loading CivicEye...</div>

return (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/citizen"
        element={
          user && (role === "citizen")
            ? <CitizenHome />
            : <Navigate to="/" />
        }
      />

      <Route
        path="/report"
        element={
          user && (role === "citizen")
            ? <ReportIssue />
            : <Navigate to="/" />
        }
      />

      <Route
        path="/authority"
        element={
          user && role === "authority"
            ? <AuthorityHome />
            : <Navigate to="/" />
        }
      />

      <Route
        path="/completed"
        element={
          user && role === "authority"
            ? <CompletedIssues />
            : <Navigate to="/" />
        }
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  </BrowserRouter>
)
}
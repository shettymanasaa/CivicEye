import { useState } from 'react'

export default function VoiceInput({ onTranscript }) {
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState('')
  const [language, setLanguage] = useState('en-IN')

  function startListening() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setError('Voice not supported. Please use Chrome browser.')
      return
    }
    setError('')
    const recognition = new SpeechRecognition()
    recognition.lang = language
    recognition.continuous = false
    recognition.interimResults = false
    recognition.onstart = () => setListening(true)
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript
      setTranscript(text)
      onTranscript(text)
      setListening(false)
    }
    recognition.onerror = () => {
      setListening(false)
      setError('Could not hear clearly. Try again.')
    }
    recognition.onend = () => setListening(false)
    recognition.start()
  }

  return (
    
    <div>
      <select
  value={language}
  onChange={(e) => setLanguage(e.target.value)}
  style={{
    width: '100%',
    padding: '8px',
    marginBottom: '8px',
    borderRadius: '8px'
  }}
>
  <option value="en-IN">English</option>
  <option value="te-IN">తెలుగు</option>
  <option value="hi-IN">हिन्दी</option>
</select>
      <button onClick={startListening} disabled={listening} style={{
        width: '100%', padding: '12px', borderRadius: 10,
        border: `1px solid ${listening ? '#fecaca' : '#e5e7eb'}`,
        background: listening ? '#fee2e2' : '#f9fafb',
        color: listening ? '#991b1b' : '#555',
        fontSize: 14, fontWeight: 500, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
      }}>
        <span style={{ fontSize: 18 }}>{listening ? '🎙️' : '🎤'}</span>
        {listening ? 'Listening... speak now' : 'Tap to speak your complaint'}
      </button>
      {transcript && (
        <div style={{
          marginTop: 8, padding: '10px 12px', background: '#f0fdf4',
          borderRadius: 8, border: '1px solid #bbf7d0',
          fontSize: 13, color: '#166534', fontStyle: 'italic'
        }}>"{transcript}"</div>
      )}
      {error && (
        <div style={{ marginTop: 6, fontSize: 12, color: '#991b1b', textAlign: 'center' }}>
          {error}
        </div>
      )}
    </div>
  )
}

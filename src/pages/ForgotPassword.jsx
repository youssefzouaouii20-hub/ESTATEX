import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useToast } from '../contexts/ToastContext'

export default function ForgotPassword() {
  const toast = useToast()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    setLoading(false)
    if (error) { toast(error.message || 'Failed to send reset email.', 'error'); return }
    setSent(true)
    toast('Password reset email sent! Check your inbox.')
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 8 }}>Reset Password</h1>
          <p style={{ color: 'var(--text2)' }}>Enter your email and we'll send you a reset link.</p>
        </div>

        <div className="card" style={{ padding: 32 }}>
          {sent ? (
            <div>
              <div style={{ fontSize: '3rem', textAlign: 'center', marginBottom: 16 }}>📧</div>
              <p style={{ textAlign: 'center', color: 'var(--text2)', lineHeight: 1.6 }}>
                Check your inbox at <strong style={{ color: 'var(--text)' }}>{email}</strong> for a password reset link.
              </p>
              <p style={{ textAlign: 'center', color: 'var(--text3)', fontSize: '.85rem', marginTop: 12 }}>
                Didn't receive it? Check spam or{' '}
                <button onClick={() => setSent(false)} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontWeight: 700 }}>
                  try again
                </button>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
              </div>
              <button className="btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          )}
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, color: 'var(--text2)', fontSize: '.9rem' }}>
          Remembered your password?{' '}
          <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 700 }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}

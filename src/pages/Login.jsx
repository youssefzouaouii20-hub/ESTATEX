import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'

export default function Login() {
  const { signIn } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  // Auto-fill admin credentials from env
  useEffect(() => {
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL
    const adminPass  = import.meta.env.VITE_ADMIN_PASSWORD
    if (adminEmail && adminPass) {
      setForm({ email: adminEmail, password: adminPass })
    }
  }, [])

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      await signIn(form)
      toast('Welcome back!')
      navigate('/account')
    } catch (err) {
      toast(err.message || 'Invalid credentials.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 8 }}>Welcome Back</h1>
          <p style={{ color: 'var(--text2)' }}>Sign in to your EstateEx account</p>
        </div>

        <div className="card" style={{ padding: 32 }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email" required
                value={form.email}
                onChange={e => setForm(p => ({...p, email: e.target.value}))}
                placeholder="you@example.com"
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password" required
                value={form.password}
                onChange={e => setForm(p => ({...p, password: e.target.value}))}
                placeholder="••••••••"
              />
            </div>
            <div style={{ textAlign: 'right', marginBottom: 20 }}>
              <Link to="/forgot-password" style={{ fontSize: '.85rem', color: 'var(--accent)' }}>Forgot password?</Link>
            </div>
            <button className="btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, color: 'var(--text2)', fontSize: '.9rem' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 700 }}>Create one</Link>
        </p>
      </div>
    </div>
  )
}

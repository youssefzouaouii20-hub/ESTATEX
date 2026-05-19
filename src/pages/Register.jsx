import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'

const profileTypes = ['investor','seller','renter','developer','other']

export default function Register() {
  const { signUp } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirm: '', profileType: 'investor' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    if (form.password !== form.confirm) { toast('Passwords do not match.', 'error'); return }
    if (form.password.length < 6) { toast('Password must be at least 6 characters.', 'error'); return }
    setLoading(true)
    try {
      await signUp({ email: form.email, password: form.password, fullName: form.fullName, profileType: form.profileType })
      toast('Account created! Please check your email to confirm.')
      navigate('/login')
    } catch (err) {
      toast(err.message || 'Registration failed.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 8 }}>Create Account</h1>
          <p style={{ color: 'var(--text2)' }}>Join Tunisia's real estate exchange</p>
        </div>

        <div className="card" style={{ padding: 32 }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input required value={form.fullName} onChange={e => setForm(p => ({...p, fullName: e.target.value}))} placeholder="Mohamed Ben Ali" />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" required value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} placeholder="you@example.com" />
            </div>
            <div className="form-group">
              <label>I am a...</label>
              <select value={form.profileType} onChange={e => setForm(p => ({...p, profileType: e.target.value}))}>
                {profileTypes.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Password</label>
                <input type="password" required value={form.password} onChange={e => setForm(p => ({...p, password: e.target.value}))} placeholder="••••••••" />
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input type="password" required value={form.confirm} onChange={e => setForm(p => ({...p, confirm: e.target.value}))} placeholder="••••••••" />
              </div>
            </div>
            <button className="btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, color: 'var(--text2)', fontSize: '.9rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 700 }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}

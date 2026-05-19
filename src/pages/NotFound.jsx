import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', padding: 40,
    }}>
      <div style={{ fontSize: '6rem', fontWeight: 800, color: 'var(--border2)', lineHeight: 1 }}>404</div>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '16px 0 8px' }}>Page Not Found</h1>
      <p style={{ color: 'var(--text2)', marginBottom: 32, maxWidth: 400 }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/" className="btn-primary">Go Home</Link>
        <Link to="/invest" className="btn-outline">Browse REITs</Link>
      </div>
    </div>
  )
}

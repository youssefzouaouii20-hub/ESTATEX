import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLang } from '../contexts/LangContext'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const { user, profile } = useAuth()
  const { t, lang, toggleLang } = useLang()
  const location = useLocation()
  const navigate = useNavigate()
  const [theme, setTheme] = useState(() => localStorage.getItem('estateex-theme') || 'dark')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    document.body.setAttribute('data-theme', theme)
    localStorage.setItem('estateex-theme', theme)
  }, [theme])

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    fn()
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  const links = [
    { to: '/buy',      label: t.nav_buy },
    { to: '/sell',     label: t.nav_sell },
    { to: '/rent',     label: t.nav_rent },
    { to: '/invest',   label: t.nav_invest },
    { to: '/features', label: t.nav_features },
    { to: '/pitch',    label: t.nav_story },
  ]

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <Link to="/" className="nav-logo">
        <img src="/logo.png" alt="EstateEx"
          onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='block' }} />
        <span className="nav-logo-text" style={{ display:'none' }}>
          Estate<span>Ex</span>
        </span>
      </Link>

      <div className="nav-center">
        {links.map(l => (
          <Link key={l.to} to={l.to} className={location.pathname === l.to ? 'active' : ''}>
            {l.label}
          </Link>
        ))}
        <a href="#contact" onClick={e => {
          e.preventDefault()
          if (location.pathname === '/') document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
          else { navigate('/'); setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 200) }
        }}>{t.nav_contact}</a>
      </div>

      <div className="nav-right">
        <button className="lang-toggle" onClick={toggleLang} title="Switch language">
          {lang === 'fr' ? 'EN' : 'FR'}
        </button>
        <button className="theme-toggle" onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}>
          {theme === 'dark' ? '☀' : '🌙'}
        </button>
        {user ? (
          <Link to="/account" style={{ display:'flex', alignItems:'center', gap:7, fontSize:'.75rem', fontWeight:600, color:'var(--text2)' }}>
            <div className="nav-avatar">{initials}</div>
            <span style={{ display:'none' }} className="nav-account-label">{t.nav_account}</span>
          </Link>
        ) : (
          <Link to="/login" className="nav-cta">{t.nav_login}</Link>
        )}
      </div>
    </nav>
  )
}

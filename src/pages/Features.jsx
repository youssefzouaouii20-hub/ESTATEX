import { useState } from 'react'
import { useToast } from '../contexts/ToastContext'
import Footer from '../components/Footer'

const features = [
  { icon: '📊', title: 'Live Portfolio View', desc: 'Track holdings, dividends, and performance with a dashboard that keeps investment metrics simple and visible.' },
  { icon: '🏠', title: 'Seller Intake Flows', desc: 'Single-property and bulk listing forms help owners and developers submit opportunities quickly without manual paperwork.' },
  { icon: '🔎', title: 'Smart Rental Discovery', desc: 'State, city, type, and budget filters shorten search time and help renters focus on properties that match their needs.' },
  { icon: '⚡', title: 'Fast Investment Simulation', desc: 'Return estimators and affordability tools let users test scenarios before committing capital, improving confidence.' },
  { icon: '🔐', title: 'Secure Account Sessions', desc: 'Session-based authentication, input validation, and server-side checks provide a safer baseline for account actions.' },
  { icon: '📩', title: 'Built-In Lead Capture', desc: 'Contact and application forms route qualified interest directly through the platform, reducing communication friction.' },
  { icon: '🤖', title: 'AI Chat Assistant', desc: 'An embedded AI assistant answers questions about listings, investment options, and platform features in real time.' },
  { icon: '📱', title: 'Mobile-First Design', desc: 'Every page is optimised for mobile users, ensuring the platform works as well on a phone as on a desktop.' },
  { icon: '🌙', title: 'Dark / Light Mode', desc: 'Toggle between a dark theme optimised for long sessions and a light theme for presentation and outdoor use.' },
]

const flowSteps = [
  { n: '1', title: 'Discover', desc: 'Explore listings and REIT opportunities with guided filters.' },
  { n: '2', title: 'Evaluate', desc: 'Use simulators and detail pages to estimate fit and returns.' },
  { n: '3', title: 'Apply / Invest', desc: 'Submit rental applications, property listings, or share orders.' },
  { n: '4', title: 'Track', desc: 'Monitor portfolio value and transactions from your account.' },
]

const roadmap = [
  { q: 'Q2', title: 'Saved Favorites', desc: 'Bookmark properties and REITs, then compare shortlisted options in one view.' },
  { q: 'Q3', title: 'Price Alerts', desc: 'Receive notifications when a watched REIT price or rental listing changes.' },
  { q: 'Q3', title: 'Document Vault', desc: 'Upload and manage verification files securely with status tracking.' },
  { q: 'Q4', title: 'Multi-Language UI', desc: 'Arabic and French interface options for broader accessibility across Tunisia and diaspora users.' },
  { q: 'Q4', title: 'Secondary Share Market', desc: 'Peer-to-peer REIT share trading between investors on the EstateEx platform.' },
  { q: '2026', title: 'Mobile App', desc: 'Native iOS and Android app for on-the-go portfolio management and property discovery.' },
]

export default function Features() {
  const toast = useToast()
  const [email, setEmail] = useState('')

  const handleWaitlist = e => {
    e.preventDefault()
    if (!email) return
    toast('Thanks! You are on the EstateEx feature waitlist.')
    setEmail('')
  }

  return (
    <>
      {/* HERO */}
      <section style={{
        padding: '80px 24px 64px',
        textAlign: 'center',
        background: 'radial-gradient(ellipse at 50% 20%, rgba(26,107,90,0.28) 0%, transparent 68%)',
      }}>
        <div className="container">
          <div className="section-label">Why EstateEx</div>
          <h1 style={{ fontSize: 'clamp(2rem,4vw,3rem)', marginBottom: 16 }}>
            Built For Real Estate,<br />Designed For Everyone
          </h1>
          <p style={{ color: 'var(--text2)', maxWidth: 760, margin: '0 auto', lineHeight: 1.8, fontSize: '1.05rem' }}>
            EstateEx combines brokerage workflows, transparent REIT investing, and renter/seller tools into one clear platform so users can move from discovery to transaction faster.
          </p>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="section" style={{ paddingTop: 32 }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))', gap: 20 }}>
            {features.map(f => (
              <div key={f.title} className="card" style={{ padding: 24 }}>
                <div style={{ fontSize: '1.8rem', marginBottom: 10 }}>{f.icon}</div>
                <h3 style={{ fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ color: 'var(--text2)', fontSize: '.9rem', lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS FLOW */}
      <section className="section" style={{ background: 'var(--bg2)', textAlign: 'center' }}>
        <div className="container">
          <div className="section-label">How It Works</div>
          <h2 style={{ marginBottom: 8 }}>One Unified Journey</h2>
          <p className="section-sub" style={{ margin: '0 auto 40px' }}>From first visit to final action in four clear steps.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 16, maxWidth: 980, margin: '0 auto' }}>
            {flowSteps.map(s => (
              <div key={s.n} style={{
                background: 'var(--card)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius)', padding: 24, textAlign: 'center',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'var(--accent2)', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: '.9rem', margin: '0 auto 14px',
                }}>{s.n}</div>
                <h4 style={{ fontWeight: 700, marginBottom: 8 }}>{s.title}</h4>
                <p style={{ color: 'var(--text2)', fontSize: '.85rem', lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROADMAP */}
      <section className="section">
        <div className="container">
          <div className="section-label" style={{ textAlign: 'center', display: 'block' }}>Roadmap</div>
          <h2 style={{ textAlign: 'center', marginBottom: 8 }}>What's Coming Next</h2>
          <p style={{ textAlign: 'center', color: 'var(--text2)', marginBottom: 36 }}>Feature ideas currently planned to improve user experience.</p>
          <div style={{ maxWidth: 940, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {roadmap.map(r => (
              <div key={r.title} className="card" style={{
                padding: '18px 24px', display: 'grid',
                gridTemplateColumns: '100px 1fr', gap: 20, alignItems: 'start',
              }}>
                <span className="badge badge-approved" style={{ alignSelf: 'flex-start', marginTop: 2 }}>{r.q}</span>
                <div>
                  <h4 style={{ fontWeight: 700, marginBottom: 6 }}>{r.title}</h4>
                  <p style={{ color: 'var(--text2)', fontSize: '.9rem', lineHeight: 1.65 }}>{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WAITLIST */}
      <section className="section" style={{ background: 'var(--bg2)' }} id="waitlist">
        <div className="container">
          <div className="card" style={{ maxWidth: 620, margin: '0 auto', padding: 32 }}>
            <h3 style={{ fontWeight: 800, fontSize: '1.3rem', marginBottom: 8 }}>Join the Product Updates Waitlist</h3>
            <p style={{ color: 'var(--text2)', marginBottom: 20, lineHeight: 1.7 }}>
              Be the first to know when new features launch. We only send important updates.
            </p>
            <form onSubmit={handleWaitlist} style={{ display: 'flex', gap: 10 }}>
              <input
                type="email" required
                value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{ flex: 1 }}
                className="form-group"
              />
              <button className="btn-primary" type="submit">Join</button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}

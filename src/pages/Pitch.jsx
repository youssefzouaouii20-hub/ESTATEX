import { Link } from 'react-router-dom'
import Footer from '../components/Footer'

const teamMembers = [
  { name: 'Youssef', role: 'Co-Founder & CEO', dept: 'Strategy', initials: 'Y' },
  { name: 'Amine', role: 'Co-Founder & CTO', dept: 'Technology', initials: 'A' },
  { name: 'Sarra', role: 'Head of Product', dept: 'Product', initials: 'S' },
  { name: 'Mehdi', role: 'Head of Finance', dept: 'Finance', initials: 'M' },
]

const problems = [
  { icon: '🏚️', title: '1 Million Idle Properties', desc: 'Over one million Tunisian properties sit vacant or underutilised due to ownership complexity, informal markets, and inaccessible pricing.' },
  { icon: '📉', title: '+75% Price Rise Since 2012', desc: 'Continuous price inflation has shut out young and middle-income Tunisians from property ownership entirely.' },
  { icon: '🌊', title: 'No Liquidity Mechanism', desc: 'The secondary market for real estate is entirely informal. No standardised pricing, no liquidity, no exit mechanism for sellers or investors.' },
  { icon: '💸', title: 'High Capital Barrier', desc: 'Buying even a studio requires six-figure TND sums upfront — impossible for most Tunisians without generational wealth.' },
]

const solutions = [
  { step: '01', title: 'Sellers List Properties', desc: 'Sellers submit idle properties through a simple digital workflow on EstateEx.' },
  { step: '02', title: 'Securitization', desc: 'Properties are pooled and securitized into REITs by licensed Tunisian investment banks.' },
  { step: '03', title: 'TSE Listing', desc: 'REIT shares are listed on the Tunis Stock Exchange and traded like stocks — fully liquid.' },
  { step: '04', title: 'Invest-to-Own', desc: 'Investors accumulate shares over time and convert them into full property title.' },
]

const businessModels = [
  { icon: '🪙', title: 'Fractional Ownership', desc: 'Investors buy fractions of real estate assets. Low barrier to entry means the market is accessible to small investors for the first time.' },
  { icon: '🏡', title: 'Invest-to-Own', desc: 'Transforms perpetual renting into a gradual path to ownership. Shares accumulated over time convert into a full property deed.' },
  { icon: '📈', title: 'Liquid Market', desc: 'Shares trade on the Tunis Stock Exchange like any stock, giving real estate investors an exit mechanism that never existed before.' },
]

const stats = [
  { n: '1M+', l: 'Idle Properties in Tunisia' },
  { n: '+75%', l: 'Price Rise Since 2012' },
  { n: '0', l: 'Existing REIT Platforms in TN' },
  { n: 'TSE', l: 'Exchange-Listed REITs' },
]

const swot = [
  { type: 's', label: 'Strengths', color: 'var(--accent)', items: ['First-mover advantage in Tunisia', 'Full-stack platform (buy, sell, rent, invest)', 'Real estate as inflation hedge', 'Tech-enabled securitization workflow'] },
  { type: 'w', label: 'Weaknesses', color: 'var(--warn)', items: ['Regulatory complexity', 'Market education required', 'Initial liquidity bootstrapping', 'Dependency on investment bank partners'] },
  { type: 'o', label: 'Opportunities', color: '#7bc8a4', items: ['Tunisian diaspora investor base', '1M+ idle properties available', 'Growing fintech regulatory framework', 'Young population seeking investment tools'] },
  { type: 't', label: 'Threats', color: 'var(--danger)', items: ['Regulatory changes', 'Economic instability in TND', 'Traditional banking resistance', 'Low digital adoption in rural areas'] },
]

export default function Pitch() {
  return (
    <>
      {/* HERO */}
      <section style={{
        minHeight: '80vh',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '80px 40px 60px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse at 50% -10%, rgba(34,138,114,0.45) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(26,107,90,0.2) 0%, transparent 50%)',
        }} />
        <div style={{ position: 'relative' }}>
          <span style={{
            fontSize: '.72rem', fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase',
            color: 'var(--accent)', background: 'rgba(45,186,135,.15)', border: '1px solid rgba(45,186,135,.3)',
            borderRadius: 100, padding: '6px 18px', display: 'inline-block', marginBottom: 28,
          }}>SAP NextGen Pitch — EstateEx 2025</span>

          <h1 style={{
            fontFamily: "'DM Serif Display', 'Georgia', serif",
            fontSize: 'clamp(3rem,7vw,5.5rem)', fontWeight: 400, lineHeight: 1.08,
            marginBottom: 14,
          }}>
            Tunisia's Real Estate<br /><em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>Exchange</em>
          </h1>

          <p style={{ color: 'var(--text2)', fontSize: '1.15rem', maxWidth: 560, margin: '0 auto 36px', lineHeight: 1.7 }}>
            We are securitizing Tunisian real estate into REIT shares tradeable on the Tunis Stock Exchange — making property investment accessible to everyone.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {teamMembers.map(m => (
              <span key={m.name} style={{
                background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.09)',
                borderRadius: 100, padding: '7px 18px', fontSize: '.85rem', color: 'var(--text2)',
              }}>
                <strong style={{ color: 'var(--text)' }}>{m.name}</strong> · {m.role}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <div style={{ background: 'var(--card)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '32px 24px' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 0 }}>
          {stats.map((s, i) => (
            <div key={s.l} style={{
              textAlign: 'center', padding: '12px 20px',
              borderRight: i < stats.length-1 ? '1px solid var(--border)' : 'none',
            }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent)' }}>{s.n}</div>
              <div style={{ fontSize: '.8rem', color: 'var(--text2)', marginTop: 4 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* PROBLEM */}
      <section className="section">
        <div className="container">
          <div className="section-label">The Problem</div>
          <h2 style={{ marginBottom: 12 }}>Tunisia's Real Estate Market Is Broken</h2>
          <p className="section-sub">Four interconnected problems that EstateEx is designed to solve.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20 }}>
            {problems.map(p => (
              <div key={p.title} className="card" style={{ padding: 28, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 3, background: 'linear-gradient(90deg, var(--danger), transparent)' }} />
                <div style={{ fontSize: '2rem', marginBottom: 12 }}>{p.icon}</div>
                <h3 style={{ fontWeight: 700, marginBottom: 8 }}>{p.title}</h3>
                <p style={{ color: 'var(--text2)', fontSize: '.9rem', lineHeight: 1.7 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUTION FLOW */}
      <section className="section" style={{ background: 'var(--bg2)' }}>
        <div className="container">
          <div className="section-label">The Solution</div>
          <h2 style={{ marginBottom: 12 }}>How EstateEx Works</h2>
          <p className="section-sub">A four-step securitization and investment pipeline.</p>
          <div style={{ display: 'flex', gap: 0, flexWrap: 'wrap' }}>
            {solutions.map((s, i) => (
              <div key={s.step} style={{ flex: '1 1 200px', display: 'flex', alignItems: 'flex-start', gap: 0 }}>
                <div style={{
                  background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
                  padding: 24, flex: 1, margin: '0 8px 16px',
                }}>
                  <div style={{ fontSize: '.75rem', fontWeight: 800, color: 'var(--accent)', letterSpacing: '.1em', marginBottom: 10 }}>{s.step}</div>
                  <h3 style={{ fontWeight: 700, marginBottom: 8 }}>{s.title}</h3>
                  <p style={{ color: 'var(--text2)', fontSize: '.88rem', lineHeight: 1.6 }}>{s.desc}</p>
                </div>
                {i < solutions.length - 1 && (
                  <div style={{ display: 'flex', alignItems: 'center', paddingTop: 36, color: 'var(--accent)', fontSize: '1.4rem', flexShrink: 0 }}>→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BUSINESS MODEL */}
      <section className="section">
        <div className="container">
          <div className="section-label">Business Model</div>
          <h2 style={{ marginBottom: 12 }}>Three Value Streams</h2>
          <p className="section-sub">How EstateEx creates and captures value for all stakeholders.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20 }}>
            {businessModels.map(m => (
              <div key={m.title} className="card" style={{ padding: 28 }}>
                <div style={{ fontSize: '2.2rem', marginBottom: 14 }}>{m.icon}</div>
                <h3 style={{ fontWeight: 700, marginBottom: 8 }}>{m.title}</h3>
                <p style={{ color: 'var(--text2)', fontSize: '.9rem', lineHeight: 1.7 }}>{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SWOT */}
      <section className="section" style={{ background: 'var(--bg2)' }}>
        <div className="container">
          <div className="section-label">Strategic Analysis</div>
          <h2 style={{ marginBottom: 36 }}>SWOT Analysis</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 16 }}>
            {swot.map(s => (
              <div key={s.type} className="card" style={{ padding: 24, borderTop: `3px solid ${s.color}` }}>
                <h3 style={{ fontWeight: 800, color: s.color, marginBottom: 16 }}>{s.label}</h3>
                <ul style={{ paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {s.items.map(item => (
                    <li key={item} style={{ color: 'var(--text2)', fontSize: '.88rem', lineHeight: 1.5 }}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="section">
        <div className="container">
          <div className="section-label">The Team</div>
          <h2 style={{ marginBottom: 12 }}>Who We Are</h2>
          <p className="section-sub">A cross-functional team with finance, tech, and product expertise.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 20 }}>
            {teamMembers.map(m => (
              <div key={m.name} className="card" style={{ padding: 28, textAlign: 'center' }}>
                <div style={{
                  width: 72, height: 72, borderRadius: '50%', background: 'var(--accent2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.6rem', fontWeight: 800, color: '#fff', margin: '0 auto 16px',
                }}>{m.initials}</div>
                <h3 style={{ fontWeight: 700, marginBottom: 4 }}>{m.name}</h3>
                <div style={{ color: 'var(--accent)', fontSize: '.82rem', fontWeight: 700, marginBottom: 4 }}>{m.role}</div>
                <div style={{ fontSize: '.78rem', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.08em' }}>{m.dept}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(34,138,114,0.25) 0%, transparent 70%)', padding: '80px 24px', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800, marginBottom: 14 }}>
            Ready to experience it?
          </h2>
          <p style={{ color: 'var(--text2)', fontSize: '1.05rem', marginBottom: 36, maxWidth: 480, margin: '0 auto 36px' }}>
            EstateEx is live. Explore the platform, browse REITs, or list your first property today.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/invest" className="btn-primary">Browse REITs</Link>
            <Link to="/register" className="btn-outline">Create Account</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}

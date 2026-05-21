import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Footer from '../components/Footer'

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'estateex2024'

// ── Demo Data ─────────────────────────────────────────────────
const DEMO = {
  users: [
    { id:1, full_name:'Mohamed Ben Ali', email:'mohamed@gmail.com', profile_type:'investor', cash_holdings:12500, created_at:'2026-04-01' },
    { id:2, full_name:'Sarra Hamdi', email:'sarra@outlook.com', profile_type:'renter', cash_holdings:3200, created_at:'2026-04-05' },
    { id:3, full_name:'Amine Trabelsi', email:'amine@gmail.com', profile_type:'developer', cash_holdings:85000, created_at:'2026-04-10' },
    { id:4, full_name:'Fatma Chaabane', email:'fatma@yahoo.com', profile_type:'investor', cash_holdings:9800, created_at:'2026-04-14' },
    { id:5, full_name:'Karim Mansouri', email:'karim@gmail.com', profile_type:'seller', cash_holdings:1500, created_at:'2026-04-18' },
    { id:6, full_name:'Youssef Zouaoui', email:'youssefzouaoui2405@gmail.com', profile_type:'admin', cash_holdings:5000, created_at:'2026-05-01' },
  ],
  listings: [
    { id:1, full_name:'Amine Trabelsi', address:'Rue de Marseille, Les Berges du Lac, Tunis', property_type:'Appartement', asking_price:320000, status:'pending', created_at:'2026-04-20' },
    { id:2, full_name:'Mohamed Ben Ali', address:'Corniche, La Marsa, Tunis', property_type:'Villa', asking_price:850000, status:'approved', created_at:'2026-04-22' },
    { id:3, full_name:'Karim Mansouri', address:'Avenue Habib Bourguiba, Sousse', property_type:'Appartement', asking_price:195000, status:'pending', created_at:'2026-05-01' },
    { id:4, full_name:'Sarra Hamdi', address:'Cité El Khadra, Tunis', property_type:'Studio', asking_price:120000, status:'rejected', created_at:'2026-05-03' },
  ],
  offers: [
    { id:1, full_name:'Fatma Chaabane', email:'fatma@yahoo.com', property_title:'Appartement à La Perle du Lac', property_price:280000, offer_amount:265000, status:'pending', created_at:'2026-04-25' },
    { id:2, full_name:'Mohamed Ben Ali', email:'mohamed@gmail.com', property_title:'Villa Sousse Balnéaire', property_price:750000, offer_amount:720000, status:'approved', created_at:'2026-04-28' },
    { id:3, full_name:'Sarra Hamdi', email:'sarra@outlook.com', property_title:'Studio Nabeul Centre', property_price:95000, offer_amount:90000, status:'pending', created_at:'2026-05-02' },
  ],
  rentapps: [
    { id:1, full_name:'Mohamed Ben Ali', email:'mohamed@gmail.com', property_title:'Appartement S+2 La Marsa', message:'Famille de 3 personnes, CDI, garant disponible.', status:'pending', created_at:'2026-04-30' },
    { id:2, full_name:'Fatma Chaabane', email:'fatma@yahoo.com', property_title:'Studio Ariana Ville', message:'Étudiante en master, bourse COUS.', status:'approved', created_at:'2026-05-01' },
    { id:3, full_name:'Karim Mansouri', email:'karim@gmail.com', property_title:'Appartement S+3 Sousse', message:'Ingénieur, 5 ans d\'expérience, revenus stables.', status:'pending', created_at:'2026-05-04' },
  ],
  contacts: [
    { id:1, first_name:'Jean', last_name:'Dupont', email:'jean@investfrance.com', profile:'Investisseur Étranger', message:'Je suis intéressé par vos REITs pour diversifier mon portefeuille immobilier en Tunisie.', created_at:'2026-04-15' },
    { id:2, first_name:'Leila', last_name:'Bouzid', email:'leila@gmail.com', profile:'Tunisien Non-Résident', message:'Je vis en France et je voudrais investir dans l\'immobilier tunisien via votre plateforme.', created_at:'2026-04-22' },
    { id:3, first_name:'Ahmed', last_name:'Sfaxi', email:'ahmed@sfaxdev.tn', profile:'Promoteur Immobilier', message:'Nous avons un projet de 40 appartements à Sfax. Comment fonctionne la sécurisation ?', created_at:'2026-05-03' },
  ],
  reits: [
    { id:1, name:'Tunis Résidentiel REIT', type:'residential', location:'Tunis', share_price:120, annual_return:7.2, risk_level:'low' },
    { id:2, name:'Sfax Commercial REIT', type:'commercial', location:'Sfax', share_price:250, annual_return:9.5, risk_level:'medium' },
    { id:3, name:'Sousse Luxury REIT', type:'luxury', location:'Sousse', share_price:500, annual_return:13.1, risk_level:'high' },
    { id:4, name:'Bizerte Mixed REIT', type:'mixed', location:'Bizerte', share_price:80, annual_return:6.8, risk_level:'low' },
    { id:5, name:'Grand Tunis Industrial', type:'commercial', location:'Tunis', share_price:180, annual_return:8.4, risk_level:'medium' },
    { id:6, name:'Sousse Student REIT', type:'student', location:'Sousse', share_price:60, annual_return:6.2, risk_level:'low' },
  ],
  portfolio: [
    { id:1, user: { full_name:'Mohamed Ben Ali', email:'mohamed@gmail.com' }, reit: { name:'Tunis Résidentiel REIT', share_price:120 }, shares_owned:42, buy_price:115, status:'active' },
    { id:2, user: { full_name:'Fatma Chaabane', email:'fatma@yahoo.com' }, reit: { name:'Sousse Luxury REIT', share_price:500 }, shares_owned:8, buy_price:480, status:'active' },
    { id:3, user: { full_name:'Amine Trabelsi', email:'amine@gmail.com' }, reit: { name:'Sfax Commercial REIT', share_price:250 }, shares_owned:25, buy_price:240, status:'active' },
    { id:4, user: { full_name:'Mohamed Ben Ali', email:'mohamed@gmail.com' }, reit: { name:'Bizerte Mixed REIT', share_price:80 }, shares_owned:60, buy_price:78, status:'active' },
  ],
  transactions: [
    { id:1, user: { full_name:'Mohamed Ben Ali' }, reit: { name:'Tunis Résidentiel REIT' }, type:'buy', shares:42, amount:4830, created_at:'2026-04-10' },
    { id:2, user: { full_name:'Fatma Chaabane' }, reit: { name:'Sousse Luxury REIT' }, type:'buy', shares:8, amount:3840, created_at:'2026-04-14' },
    { id:3, user: { full_name:'Amine Trabelsi' }, reit: { name:'Sfax Commercial REIT' }, type:'buy', shares:25, amount:6000, created_at:'2026-04-18' },
    { id:4, user: { full_name:'Mohamed Ben Ali' }, reit: { name:'Bizerte Mixed REIT' }, type:'buy', shares:60, amount:4680, created_at:'2026-04-22' },
    { id:5, user: { full_name:'Fatma Chaabane' }, reit: { name:'Tunis Résidentiel REIT' }, type:'dividend', shares:0, amount:346, created_at:'2026-05-01' },
  ],
}

function MiniBar({ data, color = '#1a9460' }) {
  const max = Math.max(...data, 1)
  return (
    <div style={{ display:'flex', alignItems:'flex-end', gap:3, height:36 }}>
      {data.map((v,i) => (
        <div key={i} style={{ flex:1, background:color, opacity: i===data.length-1?1:0.35, borderRadius:'2px 2px 0 0', height:`${Math.max(4,Math.round((v/max)*100))}%`, transition:'height .4s' }} />
      ))}
    </div>
  )
}

function StatCard({ label, value, sub, color, chart }) {
  return (
    <div className="card" style={{ padding:22 }}>
      <div style={{ fontSize:'.68rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', color:'var(--text2)', marginBottom:8 }}>{label}</div>
      <div style={{ fontSize:'1.8rem', fontWeight:800, color: color||'var(--text)', lineHeight:1, marginBottom:4 }}>{value}</div>
      {sub && <div style={{ fontSize:'.75rem', color:'var(--text2)' }}>{sub}</div>}
      {chart && <div style={{ marginTop:10 }}><MiniBar data={chart} color={color} /></div>}
    </div>
  )
}

function StatusBadge({ s }) {
  return <span className={`badge badge-${s==='approved'?'approved':s==='rejected'?'rejected':'pending'}`}>{s}</span>
}

const TABS = [
  { id:'overview', label:'📊 Overview' },
  { id:'users', label:'👥 Users' },
  { id:'listings', label:'🏠 Listings' },
  { id:'offers', label:'💰 Buy Offers' },
  { id:'rentapps', label:'🔑 Rent Apps' },
  { id:'contacts', label:'✉️ Messages' },
  { id:'reits', label:'📈 REITs' },
  { id:'portfolio', label:'💼 Portfolio' },
]

export default function Admin() {
  const { user } = useAuth()
  const [tab, setTab] = useState('overview')
  const [adminPass, setAdminPass] = useState('')
  const [adminUnlocked, setAdminUnlocked] = useState(() => sessionStorage.getItem('admin_unlocked') === '1')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [data, setData] = useState(DEMO)

  function updateStatus(table, id, status) {
    setData(prev => ({
      ...prev,
      [table]: prev[table].map(r => r.id === id ? { ...r, status } : r)
    }))
  }

  function deleteRow(table, id) {
    if (!window.confirm('Delete this record?')) return
    setData(prev => ({ ...prev, [table]: prev[table].filter(r => r.id !== id) }))
  }

  if (!adminUnlocked) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)' }}>
      <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:40, width:'100%', maxWidth:380, textAlign:'center' }}>
        <div style={{ fontSize:'2.5rem', marginBottom:16 }}>🔐</div>
        <h2 style={{ fontWeight:800, marginBottom:8 }}>Admin Access</h2>
        <p style={{ color:'var(--text2)', marginBottom:24, fontSize:'.9rem' }}>Enter the admin password to continue</p>
        <input type="password" placeholder="Admin password" value={adminPass}
          onChange={e => setAdminPass(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              if (adminPass === ADMIN_PASSWORD) { sessionStorage.setItem('admin_unlocked','1'); setAdminUnlocked(true) }
              else { alert('Wrong password'); setAdminPass('') }
            }
          }}
          style={{ width:'100%', background:'var(--bg3)', border:'1.5px solid var(--border)', borderRadius:'var(--radius2)', padding:'12px 16px', color:'var(--text)', fontSize:'1rem', marginBottom:16, textAlign:'center', outline:'none' }}
          autoFocus
        />
        <button className="btn-primary" style={{ width:'100%', justifyContent:'center' }}
          onClick={() => {
            if (adminPass === ADMIN_PASSWORD) { sessionStorage.setItem('admin_unlocked','1'); setAdminUnlocked(true) }
            else { alert('Wrong password'); setAdminPass('') }
          }}>
          Enter Dashboard
        </button>
      </div>
    </div>
  )

  const filterRows = (rows, keys) => {
    let r = rows
    if (search) r = r.filter(row => keys.some(k => String(row[k]||'').toLowerCase().includes(search.toLowerCase())))
    if (statusFilter) r = r.filter(row => row.status === statusFilter)
    return r
  }

  const ActionBtns = ({ table, id, status }) => (
    <div style={{ display:'flex', gap:5 }}>
      {status !== 'approved' && (
        <button onClick={() => updateStatus(table, id, 'approved')}
          style={{ background:'rgba(26,148,96,.12)', border:'1px solid rgba(26,148,96,.25)', borderRadius:5, padding:'3px 9px', fontSize:'.68rem', color:'var(--accent)', cursor:'pointer', fontWeight:700 }}>
          ✓
        </button>
      )}
      {status !== 'rejected' && (
        <button onClick={() => updateStatus(table, id, 'rejected')}
          style={{ background:'rgba(240,96,96,.1)', border:'1px solid rgba(240,96,96,.25)', borderRadius:5, padding:'3px 9px', fontSize:'.68rem', color:'var(--danger)', cursor:'pointer', fontWeight:700 }}>
          ✗
        </button>
      )}
      <button onClick={() => deleteRow(table, id)}
        style={{ background:'transparent', border:'1px solid var(--border2)', borderRadius:5, padding:'3px 7px', fontSize:'.68rem', color:'var(--text3)', cursor:'pointer' }}>
        🗑
      </button>
    </div>
  )

  const portfolioValue = data.portfolio.reduce((s,p) => s + (p.shares_owned * p.reit.share_price), 0)

  return (
    <>
      <section style={{ background:'var(--bg2)', borderBottom:'1px solid var(--border)', padding:'40px 0 28px' }}>
        <div className="container">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
            <div>
              <div className="label">Administration</div>
              <h1 style={{ fontSize:'1.8rem', fontWeight:800 }}>Admin Dashboard</h1>
              <p style={{ color:'var(--text2)', fontSize:'.88rem', marginTop:4 }}>
                {user
                  ? <>Logged in as <strong style={{ color:'var(--accent)' }}>{user.email}</strong></>
                  : <span style={{ color:'var(--accent)' }}>Demo Mode</span>
                }
                <span style={{ marginLeft:10, background:'rgba(240,160,48,.12)', border:'1px solid rgba(240,160,48,.25)', borderRadius:999, padding:'2px 10px', fontSize:'.72rem', color:'var(--warn)', fontWeight:700 }}>
                  DEMO DATA
                </span>
              </p>
            </div>
            <div style={{ display:'flex', gap:10, alignItems:'center' }}>
              <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:'.75rem', color:'var(--accent)', background:'var(--accent-dim)', border:'1px solid rgba(62,207,142,.2)', borderRadius:999, padding:'4px 12px' }}>
                <span style={{ width:6, height:6, borderRadius:'50%', background:'var(--accent)', display:'inline-block' }} />
                Live Demo
              </div>
              <Link to="/" className="btn-outline" style={{ fontSize:'.82rem' }}>← Back to Site</Link>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding:'32px 0 80px' }}>
        <div className="container">
          <div style={{ display:'grid', gridTemplateColumns:'200px 1fr', gap:24 }}>

            {/* Sidebar */}
            <aside>
              <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:'var(--radius)', overflow:'hidden' }}>
                {TABS.map(t => (
                  <button key={t.id} onClick={() => { setTab(t.id); setSearch(''); setStatusFilter('') }}
                    style={{
                      width:'100%', textAlign:'left', padding:'12px 16px',
                      background: tab===t.id ? 'var(--accent-dim)' : 'transparent',
                      border:'none', borderBottom:'1px solid var(--border)',
                      color: tab===t.id ? 'var(--accent)' : 'var(--text2)',
                      fontSize:'.84rem', fontWeight: tab===t.id ? 700 : 500,
                      cursor:'pointer', fontFamily:'var(--font)', transition:'all .15s',
                    }}>
                    {t.label}
                  </button>
                ))}
              </div>
            </aside>

            {/* Main */}
            <div>
              {tab !== 'overview' && (
                <div style={{ display:'flex', gap:10, marginBottom:20, flexWrap:'wrap' }}>
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
                    style={{ flex:1, minWidth:200, background:'var(--bg3)', border:'1.5px solid var(--border)', borderRadius:'var(--radius2)', padding:'9px 14px', color:'var(--text)', fontSize:'.88rem', outline:'none' }} />
                  {['listings','offers','rentapps'].includes(tab) && (
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                      style={{ background:'var(--bg3)', border:'1.5px solid var(--border)', borderRadius:'var(--radius2)', padding:'9px 12px', color:'var(--text)', fontSize:'.88rem' }}>
                      <option value="">All statuses</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  )}
                </div>
              )}

              {/* OVERVIEW */}
              {tab === 'overview' && (
                <div>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:16, marginBottom:24 }}>
                    <StatCard label="Total Users" value={data.users.length} color="var(--accent)" chart={[1,2,3,4,4,5,6]} />
                    <StatCard label="Active Listings" value={data.listings.length} color="var(--gold)" chart={[0,1,1,2,3,3,4]} sub={`${data.listings.filter(l=>l.status==='pending').length} pending`} />
                    <StatCard label="Buy Offers" value={data.offers.length} color="#a78bfa" chart={[0,0,1,1,2,2,3]} sub={`${data.offers.filter(o=>o.status==='pending').length} pending`} />
                    <StatCard label="Rent Applications" value={data.rentapps.length} color="#38bdf8" chart={[0,1,1,2,2,3,3]} />
                    <StatCard label="Contact Messages" value={data.contacts.length} color="#fb923c" chart={[0,1,1,1,2,2,3]} />
                    <StatCard label="Portfolio Value" value={portfolioValue.toLocaleString()+' TND'} color="var(--accent)" />
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
                    <div className="card" style={{ padding:0 }}>
                      <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--border)', fontWeight:700, fontSize:'.88rem' }}>Recent Users</div>
                      <div className="table-wrap">
                        <table>
                          <thead><tr><th>Name</th><th>Type</th><th>Joined</th></tr></thead>
                          <tbody>
                            {data.users.slice(0,5).map(u => (
                              <tr key={u.id}>
                                <td style={{ fontWeight:600, color:'var(--text)' }}>{u.full_name}</td>
                                <td><span className="badge badge-low" style={{ fontSize:'.65rem' }}>{u.profile_type}</span></td>
                                <td>{u.created_at}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="card" style={{ padding:0 }}>
                      <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--border)', fontWeight:700, fontSize:'.88rem' }}>Recent Transactions</div>
                      <div className="table-wrap">
                        <table>
                          <thead><tr><th>User</th><th>Type</th><th>Amount</th></tr></thead>
                          <tbody>
                            {data.transactions.slice(0,5).map(tx => (
                              <tr key={tx.id}>
                                <td style={{ fontWeight:600, color:'var(--text)' }}>{tx.user.full_name}</td>
                                <td><span className={`badge badge-${tx.type==='buy'?'approved':'pending'}`} style={{ fontSize:'.65rem' }}>{tx.type}</span></td>
                                <td style={{ fontWeight:700, color:'var(--accent)' }}>{tx.amount.toLocaleString()} TND</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* USERS */}
              {tab === 'users' && (
                <div className="card" style={{ padding:0 }}>
                  <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--border)' }}>
                    <h3 style={{ fontWeight:700 }}>All Users ({filterRows(data.users,['full_name','email']).length})</h3>
                  </div>
                  <div className="table-wrap">
                    <table>
                      <thead><tr><th>Name</th><th>Email</th><th>Type</th><th>Cash (TND)</th><th>Joined</th><th>Actions</th></tr></thead>
                      <tbody>
                        {filterRows(data.users,['full_name','email']).map(u => (
                          <tr key={u.id}>
                            <td style={{ fontWeight:600, color:'var(--text)' }}>{u.full_name}</td>
                            <td style={{ fontSize:'.82rem' }}>{u.email}</td>
                            <td><span className="badge badge-low">{u.profile_type}</span></td>
                            <td style={{ fontWeight:700, color:'var(--accent)' }}>{u.cash_holdings.toLocaleString()}</td>
                            <td>{u.created_at}</td>
                            <td><button onClick={() => deleteRow('users', u.id)} style={{ background:'transparent', border:'1px solid var(--border2)', borderRadius:5, padding:'3px 7px', fontSize:'.72rem', color:'var(--text3)', cursor:'pointer' }}>🗑</button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* LISTINGS */}
              {tab === 'listings' && (
                <div className="card" style={{ padding:0 }}>
                  <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--border)' }}>
                    <h3 style={{ fontWeight:700 }}>Property Listings ({filterRows(data.listings,['address','full_name']).length})</h3>
                  </div>
                  <div className="table-wrap">
                    <table>
                      <thead><tr><th>Owner</th><th>Address</th><th>Type</th><th>Price</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
                      <tbody>
                        {filterRows(data.listings,['address','full_name']).map(l => (
                          <tr key={l.id}>
                            <td style={{ fontWeight:600, color:'var(--text)' }}>{l.full_name}</td>
                            <td style={{ fontSize:'.8rem', maxWidth:160 }}>{l.address}</td>
                            <td>{l.property_type}</td>
                            <td style={{ fontWeight:700 }}>{l.asking_price.toLocaleString()} TND</td>
                            <td><StatusBadge s={l.status} /></td>
                            <td>{l.created_at}</td>
                            <td><ActionBtns table="listings" id={l.id} status={l.status} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* BUY OFFERS */}
              {tab === 'offers' && (
                <div className="card" style={{ padding:0 }}>
                  <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--border)' }}>
                    <h3 style={{ fontWeight:700 }}>Buy Offers ({filterRows(data.offers,['full_name','property_title']).length})</h3>
                  </div>
                  <div className="table-wrap">
                    <table>
                      <thead><tr><th>Buyer</th><th>Property</th><th>Listed</th><th>Offer</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
                      <tbody>
                        {filterRows(data.offers,['full_name','property_title','email']).map(o => (
                          <tr key={o.id}>
                            <td>
                              <div style={{ fontWeight:600, color:'var(--text)' }}>{o.full_name}</div>
                              <div style={{ fontSize:'.72rem', color:'var(--text3)' }}>{o.email}</div>
                            </td>
                            <td style={{ fontSize:'.82rem', maxWidth:160 }}>{o.property_title}</td>
                            <td>{o.property_price.toLocaleString()}</td>
                            <td style={{ fontWeight:700, color:'var(--accent)' }}>{o.offer_amount.toLocaleString()}</td>
                            <td><StatusBadge s={o.status} /></td>
                            <td>{o.created_at}</td>
                            <td><ActionBtns table="offers" id={o.id} status={o.status} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* RENT APPS */}
              {tab === 'rentapps' && (
                <div className="card" style={{ padding:0 }}>
                  <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--border)' }}>
                    <h3 style={{ fontWeight:700 }}>Rent Applications ({filterRows(data.rentapps,['full_name','property_title']).length})</h3>
                  </div>
                  <div className="table-wrap">
                    <table>
                      <thead><tr><th>Applicant</th><th>Property</th><th>Message</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
                      <tbody>
                        {filterRows(data.rentapps,['full_name','property_title','email']).map(a => (
                          <tr key={a.id}>
                            <td>
                              <div style={{ fontWeight:600, color:'var(--text)' }}>{a.full_name}</div>
                              <div style={{ fontSize:'.72rem', color:'var(--text3)' }}>{a.email}</div>
                            </td>
                            <td style={{ fontSize:'.82rem' }}>{a.property_title}</td>
                            <td style={{ maxWidth:200, fontSize:'.78rem', color:'var(--text2)' }}>{a.message?.slice(0,80)}</td>
                            <td><StatusBadge s={a.status} /></td>
                            <td>{a.created_at}</td>
                            <td><ActionBtns table="rentapps" id={a.id} status={a.status} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* CONTACTS */}
              {tab === 'contacts' && (
                <div className="card" style={{ padding:0 }}>
                  <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--border)' }}>
                    <h3 style={{ fontWeight:700 }}>Contact Messages ({filterRows(data.contacts,['first_name','last_name','email']).length})</h3>
                  </div>
                  <div className="table-wrap">
                    <table>
                      <thead><tr><th>From</th><th>Profile</th><th>Message</th><th>Date</th><th>Actions</th></tr></thead>
                      <tbody>
                        {filterRows(data.contacts,['first_name','last_name','email','message']).map(c => (
                          <tr key={c.id}>
                            <td>
                              <div style={{ fontWeight:600, color:'var(--text)' }}>{c.first_name} {c.last_name}</div>
                              <div style={{ fontSize:'.72rem', color:'var(--text3)' }}>{c.email}</div>
                            </td>
                            <td>{c.profile}</td>
                            <td style={{ maxWidth:280, fontSize:'.82rem', color:'var(--text2)' }}>{c.message?.slice(0,100)}...</td>
                            <td>{c.created_at}</td>
                            <td><button onClick={() => deleteRow('contacts', c.id)} style={{ background:'transparent', border:'1px solid var(--border2)', borderRadius:5, padding:'3px 7px', fontSize:'.72rem', color:'var(--text3)', cursor:'pointer' }}>🗑</button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* REITS */}
              {tab === 'reits' && (
                <div className="card" style={{ padding:0 }}>
                  <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--border)' }}>
                    <h3 style={{ fontWeight:700 }}>REITs ({data.reits.length})</h3>
                  </div>
                  <div className="table-wrap">
                    <table>
                      <thead><tr><th>Name</th><th>Type</th><th>Location</th><th>Share Price</th><th>Return/yr</th><th>Risk</th></tr></thead>
                      <tbody>
                        {data.reits.map(r => (
                          <tr key={r.id}>
                            <td style={{ fontWeight:700, color:'var(--text)' }}>{r.name}</td>
                            <td>{r.type}</td>
                            <td>📍 {r.location}</td>
                            <td style={{ fontWeight:700, color:'var(--accent)' }}>{r.share_price} TND</td>
                            <td style={{ color:'var(--green)', fontWeight:700 }}>+{r.annual_return}%</td>
                            <td><span className={`badge badge-${r.risk_level}`}>{r.risk_level}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* PORTFOLIO */}
              {tab === 'portfolio' && (
                <div className="card" style={{ padding:0 }}>
                  <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--border)' }}>
                    <h3 style={{ fontWeight:700 }}>All Portfolio Holdings ({data.portfolio.length})</h3>
                  </div>
                  <div className="table-wrap">
                    <table>
                      <thead><tr><th>Investor</th><th>REIT</th><th>Shares</th><th>Buy Price</th><th>Current Value</th><th>Status</th></tr></thead>
                      <tbody>
                        {data.portfolio.map(p => {
                          const val = p.shares_owned * p.reit.share_price
                          const gain = p.reit.share_price - p.buy_price
                          return (
                            <tr key={p.id}>
                              <td>
                                <div style={{ fontWeight:600, color:'var(--text)' }}>{p.user.full_name}</div>
                                <div style={{ fontSize:'.72rem', color:'var(--text3)' }}>{p.user.email}</div>
                              </td>
                              <td style={{ fontWeight:600 }}>{p.reit.name}</td>
                              <td style={{ fontWeight:700 }}>{p.shares_owned}</td>
                              <td>{p.buy_price} TND</td>
                              <td style={{ fontWeight:700, color: gain>=0?'var(--accent)':'var(--danger)' }}>
                                {val.toLocaleString()} TND
                              </td>
                              <td><span className={`badge badge-${p.status}`}>{p.status}</span></td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}

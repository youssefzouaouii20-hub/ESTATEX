import { useState, useEffect } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import Footer from '../components/Footer'

// ── Admin check — set VITE_ADMIN_EMAIL in your .env ─────────
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL

// ── Mini chart bar ──────────────────────────────────────────
function MiniBar({ data, color = 'var(--accent)' }) {
  const max = Math.max(...data, 1)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 40 }}>
      {data.map((v, i) => (
        <div key={i} style={{
          flex: 1, background: color, opacity: i === data.length - 1 ? 1 : 0.4,
          borderRadius: '2px 2px 0 0',
          height: `${Math.round((v / max) * 100)}%`, minHeight: 2,
          transition: 'height .4s ease',
        }} />
      ))}
    </div>
  )
}

// ── Stat card ───────────────────────────────────────────────
function StatCard({ label, value, sub, color, chart }) {
  return (
    <div className="card" style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ fontSize: '.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--text2)' }}>{label}</div>
      </div>
      <div style={{ fontSize: '2rem', fontWeight: 800, color: color || 'var(--text)', lineHeight: 1, marginBottom: 6 }}>{value}</div>
      {sub && <div style={{ fontSize: '.78rem', color: 'var(--text2)' }}>{sub}</div>}
      {chart && <div style={{ marginTop: 12 }}><MiniBar data={chart} color={color} /></div>}
    </div>
  )
}

const TABS = [
  { id: 'overview',  label: '📊 Overview' },
  { id: 'users',     label: '👥 Users' },
  { id: 'listings',  label: '🏠 Listings' },
  { id: 'offers',    label: '💰 Buy Offers' },
  { id: 'rentapps',  label: '🔑 Rent Apps' },
  { id: 'contacts',  label: '✉️ Messages' },
  { id: 'reits',     label: '📈 REITs' },
  { id: 'portfolio', label: '💼 Portfolio' },
]

export default function Admin() {
  const { user, profile, loading } = useAuth()
  const toast = useToast()
  const [tab, setTab] = useState('overview')
  const [data, setData] = useState({})
  const [dataLoading, setDataLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  // Simple password gate — no Supabase login needed
  const [adminPass, setAdminPass] = useState('')
  const [adminUnlocked, setAdminUnlocked] = useState(() => sessionStorage.getItem('admin_unlocked') === '1')
  
  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'estateex2024'
  
  const isAdmin = adminUnlocked

  useEffect(() => {
    if (isAdmin) loadAll()
  }, [isAdmin])

  async function loadAll() {
    setDataLoading(true)
    const [users, listings, offers, rentapps, contacts, reits, portfolio, transactions] = await Promise.all([
      supabase.from('users').select('*').order('created_at', { ascending: false }),
      supabase.from('listings').select('*').order('created_at', { ascending: false }),
      supabase.from('buy_offers').select('*').order('created_at', { ascending: false }),
      supabase.from('rent_applications').select('*').order('created_at', { ascending: false }),
      supabase.from('contact_messages').select('*').order('created_at', { ascending: false }),
      supabase.from('reits').select('*').order('annual_return', { ascending: false }),
      supabase.from('portfolio').select('*, users(full_name, email), reits(name, share_price)').order('created_at', { ascending: false }),
      supabase.from('transactions').select('*, users(full_name), reits(name)').order('created_at', { ascending: false }).limit(100),
    ])
    setData({
      users: users.data || [],
      listings: listings.data || [],
      offers: offers.data || [],
      rentapps: rentapps.data || [],
      contacts: contacts.data || [],
      reits: reits.data || [],
      portfolio: portfolio.data || [],
      transactions: transactions.data || [],
    })
    setDataLoading(false)
  }

  async function updateStatus(table, id, status) {
    const { error } = await supabase.from(table).update({ status }).eq('id', id)
    if (error) { toast('Update failed', 'error'); return }
    toast(`Status updated to "${status}"`)
    loadAll()
  }

  async function deleteRow(table, id) {
    if (!window.confirm('Delete this record?')) return
    await supabase.from(table).delete().eq('id', id)
    toast('Record deleted')
    loadAll()
  }

  if (!adminUnlocked) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)' }}>
      <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:40, width:'100%', maxWidth:380, textAlign:'center' }}>
        <div style={{ fontSize:'2.5rem', marginBottom:16 }}>🔐</div>
        <h2 style={{ fontWeight:800, marginBottom:8 }}>Admin Access</h2>
        <p style={{ color:'var(--text2)', marginBottom:24, fontSize:'.9rem' }}>Enter the admin password to continue</p>
        <input
          type="password"
          placeholder="Admin password"
          value={adminPass}
          onChange={e => setAdminPass(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              if (adminPass === ADMIN_PASSWORD) {
                sessionStorage.setItem('admin_unlocked', '1')
                setAdminUnlocked(true)
              } else {
                alert('Wrong password')
                setAdminPass('')
              }
            }
          }}
          style={{ width:'100%', background:'var(--bg3)', border:'1.5px solid var(--border)', borderRadius:'var(--radius2)', padding:'12px 16px', color:'var(--text)', fontSize:'1rem', marginBottom:16, textAlign:'center' }}
          autoFocus
        />
        <button
          className="btn-primary"
          style={{ width:'100%', justifyContent:'center' }}
          onClick={() => {
            if (adminPass === ADMIN_PASSWORD) {
              sessionStorage.setItem('admin_unlocked', '1')
              setAdminUnlocked(true)
            } else {
              alert('Wrong password')
              setAdminPass('')
            }
          }}
        >
          Enter Dashboard
        </button>
      </div>
    </div>
  )

  const {
    users = [], listings = [], offers = [], rentapps = [],
    contacts = [], reits = [], portfolio = [], transactions = []
  } = data

  // KPI calculations
  const totalRevenue = offers.filter(o => o.status === 'approved').reduce((s, o) => s + (o.offer_amount || 0), 0)
  const pendingListings = listings.filter(l => l.status === 'pending').length
  const pendingOffers = offers.filter(o => o.status === 'pending').length
  const totalPortfolioValue = portfolio.filter(p => p.status === 'active')
    .reduce((s, p) => s + (p.shares_owned * (p.reits?.share_price || p.buy_price || 0)), 0)

  // Sparkline data (last 7 days simulated from real counts)
  const last7 = (arr) => {
    const days = Array(7).fill(0)
    arr.forEach(item => {
      const d = new Date(item.created_at)
      const diff = Math.floor((Date.now() - d) / 86400000)
      if (diff < 7) days[6 - diff]++
    })
    return days
  }

  // filter helpers
  const filterRows = (rows, keys) => {
    if (!search) return rows
    return rows.filter(r => keys.some(k => String(r[k] || '').toLowerCase().includes(search.toLowerCase())))
  }
  const filterStatus = rows => statusFilter ? rows.filter(r => r.status === statusFilter) : rows

  const StatusBadge = ({ s }) => (
    <span className={`badge badge-${s === 'approved' ? 'approved' : s === 'rejected' ? 'rejected' : 'pending'}`}>{s}</span>
  )

  const ActionBtns = ({ table, id, status }) => (
    <div style={{ display: 'flex', gap: 6 }}>
      {status !== 'approved' && (
        <button onClick={() => updateStatus(table, id, 'approved')}
          style={{ background: 'rgba(62,207,142,.15)', border: '1px solid rgba(62,207,142,.3)', borderRadius: 6, padding: '4px 10px', fontSize: '.72rem', color: 'var(--accent)', cursor: 'pointer', fontWeight: 700 }}>
          ✓ Approve
        </button>
      )}
      {status !== 'rejected' && (
        <button onClick={() => updateStatus(table, id, 'rejected')}
          style={{ background: 'rgba(240,96,96,.1)', border: '1px solid rgba(240,96,96,.25)', borderRadius: 6, padding: '4px 10px', fontSize: '.72rem', color: 'var(--danger)', cursor: 'pointer', fontWeight: 700 }}>
          ✗ Reject
        </button>
      )}
      <button onClick={() => deleteRow(table, id)}
        style={{ background: 'transparent', border: '1px solid var(--border2)', borderRadius: 6, padding: '4px 8px', fontSize: '.72rem', color: 'var(--text3)', cursor: 'pointer' }}>
        🗑
      </button>
    </div>
  )

  return (
    <>
      {/* Header */}
      <section style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)', padding: '40px 0 28px' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div className="label">Administration</div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Admin Dashboard</h1>
              <p style={{ color: 'var(--text2)', fontSize: '.88rem', marginTop: 4 }}>
                Logged in as <strong style={{ color: 'var(--accent)' }}>{user?.email}</strong>
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn-ghost" onClick={loadAll}>↻ Refresh</button>
              <Link to="/" className="btn-outline" style={{ fontSize: '.82rem' }}>← Back to Site</Link>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '32px 0 80px' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 24 }}>

            {/* Sidebar */}
            <aside>
              <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                {TABS.map(t => (
                  <button key={t.id}
                    onClick={() => { setTab(t.id); setSearch(''); setStatusFilter('') }}
                    style={{
                      width: '100%', textAlign: 'left', padding: '12px 16px',
                      background: tab === t.id ? 'var(--accent-dim)' : 'transparent',
                      border: 'none', borderBottom: '1px solid var(--border)',
                      color: tab === t.id ? 'var(--accent)' : 'var(--text2)',
                      fontSize: '.84rem', fontWeight: tab === t.id ? 700 : 500,
                      cursor: 'pointer', fontFamily: 'var(--font)',
                      transition: 'all .15s ease',
                    }}>
                    {t.label}
                    {t.id === 'listings' && pendingListings > 0 && (
                      <span style={{ marginLeft: 8, background: 'var(--warn)', color: '#000', borderRadius: 999, padding: '1px 6px', fontSize: '.65rem', fontWeight: 800 }}>{pendingListings}</span>
                    )}
                    {t.id === 'offers' && pendingOffers > 0 && (
                      <span style={{ marginLeft: 8, background: 'var(--warn)', color: '#000', borderRadius: 999, padding: '1px 6px', fontSize: '.65rem', fontWeight: 800 }}>{pendingOffers}</span>
                    )}
                  </button>
                ))}
              </div>
            </aside>

            {/* Main */}
            <div>
              {/* Search & filter bar */}
              {tab !== 'overview' && (
                <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
                  <input
                    value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search..."
                    style={{ flex: 1, minWidth: 200, background: 'var(--bg3)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius2)', padding: '9px 14px', color: 'var(--text)', fontSize: '.88rem' }}
                  />
                  {['listings','offers','rentapps'].includes(tab) && (
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                      style={{ background: 'var(--bg3)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius2)', padding: '9px 12px', color: 'var(--text)', fontSize: '.88rem' }}>
                      <option value="">All statuses</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  )}
                </div>
              )}

              {dataLoading ? <div className="spinner" /> : <>

                {/* ── OVERVIEW ── */}
                {tab === 'overview' && (
                  <div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16, marginBottom: 28 }}>
                      <StatCard label="Total Users"       value={users.length}      color="var(--accent)"  chart={last7(users)} />
                      <StatCard label="Active Listings"   value={listings.length}   color="var(--gold)"    chart={last7(listings)} sub={`${pendingListings} pending`} />
                      <StatCard label="Buy Offers"        value={offers.length}     color="#a78bfa"        chart={last7(offers)} sub={`${pendingOffers} pending`} />
                      <StatCard label="Rent Applications" value={rentapps.length}   color="#38bdf8"        chart={last7(rentapps)} />
                      <StatCard label="Contact Messages"  value={contacts.length}   color="#fb923c"        chart={last7(contacts)} />
                      <StatCard label="Portfolio Value"   value={totalPortfolioValue.toLocaleString('fr-TN',{maximumFractionDigits:0})+' TND'} color="var(--accent)" />
                    </div>

                    {/* Recent activity */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                      <div className="card" style={{ padding: 0 }}>
                        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', fontWeight: 700, fontSize: '.88rem' }}>
                          Recent Users
                        </div>
                        <div className="table-wrap">
                          <table>
                            <thead><tr><th>Name</th><th>Type</th><th>Joined</th></tr></thead>
                            <tbody>
                              {users.slice(0,6).map(u => (
                                <tr key={u.id}>
                                  <td style={{ color: 'var(--text)', fontWeight: 600 }}>{u.full_name}</td>
                                  <td><span className="badge badge-low" style={{ fontSize: '.65rem' }}>{u.profile_type}</span></td>
                                  <td>{new Date(u.created_at).toLocaleDateString()}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="card" style={{ padding: 0 }}>
                        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', fontWeight: 700, fontSize: '.88rem' }}>
                          Recent Transactions
                        </div>
                        <div className="table-wrap">
                          <table>
                            <thead><tr><th>User</th><th>Type</th><th>Amount</th></tr></thead>
                            <tbody>
                              {data.transactions?.slice(0,6).map(tx => (
                                <tr key={tx.id}>
                                  <td style={{ color: 'var(--text)', fontWeight: 600 }}>{tx.users?.full_name || '—'}</td>
                                  <td><span className={`badge badge-${tx.type === 'buy' ? 'approved' : 'pending'}`} style={{ fontSize: '.65rem' }}>{tx.type}</span></td>
                                  <td style={{ fontWeight: 700, color: 'var(--accent)' }}>{tx.amount?.toLocaleString()} TND</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── USERS ── */}
                {tab === 'users' && (
                  <div className="card" style={{ padding: 0 }}>
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ fontWeight: 700 }}>All Users ({filterRows(users,['full_name','email']).length})</h3>
                    </div>
                    <div className="table-wrap">
                      <table>
                        <thead><tr><th>Name</th><th>Email</th><th>Type</th><th>Cash (TND)</th><th>Joined</th><th>Actions</th></tr></thead>
                        <tbody>
                          {filterRows(users, ['full_name','email']).map(u => (
                            <tr key={u.id}>
                              <td style={{ color: 'var(--text)', fontWeight: 600 }}>{u.full_name}</td>
                              <td style={{ fontFamily: 'monospace', fontSize: '.82rem' }}>{u.email}</td>
                              <td><span className="badge badge-low">{u.profile_type}</span></td>
                              <td style={{ fontWeight: 700, color: 'var(--accent)' }}>{u.cash_holdings?.toLocaleString()}</td>
                              <td>{new Date(u.created_at).toLocaleDateString()}</td>
                              <td><button onClick={() => deleteRow('users', u.id)} style={{ background: 'transparent', border: '1px solid var(--border2)', borderRadius: 6, padding: '3px 8px', fontSize: '.72rem', color: 'var(--text3)', cursor: 'pointer' }}>🗑</button></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* ── LISTINGS ── */}
                {tab === 'listings' && (
                  <div className="card" style={{ padding: 0 }}>
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
                      <h3 style={{ fontWeight: 700 }}>Property Listings ({filterStatus(filterRows(listings,['address','full_name'])).length})</h3>
                    </div>
                    <div className="table-wrap">
                      <table>
                        <thead><tr><th>Owner</th><th>Address</th><th>Type</th><th>Price (TND)</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
                        <tbody>
                          {filterStatus(filterRows(listings, ['address','full_name'])).map(l => (
                            <tr key={l.id}>
                              <td style={{ color: 'var(--text)', fontWeight: 600 }}>{l.full_name}</td>
                              <td style={{ maxWidth: 200, fontSize: '.82rem' }}>{l.address}</td>
                              <td>{l.property_type || '—'}</td>
                              <td style={{ fontWeight: 700 }}>{l.asking_price ? l.asking_price.toLocaleString() : '—'}</td>
                              <td><StatusBadge s={l.status} /></td>
                              <td>{new Date(l.created_at).toLocaleDateString()}</td>
                              <td><ActionBtns table="listings" id={l.id} status={l.status} /></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* ── BUY OFFERS ── */}
                {tab === 'offers' && (
                  <div className="card" style={{ padding: 0 }}>
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
                      <h3 style={{ fontWeight: 700 }}>Buy Offers ({filterStatus(filterRows(offers,['full_name','property_title'])).length})</h3>
                    </div>
                    <div className="table-wrap">
                      <table>
                        <thead><tr><th>Buyer</th><th>Property</th><th>Listed (TND)</th><th>Offer (TND)</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
                        <tbody>
                          {filterStatus(filterRows(offers, ['full_name','property_title','email'])).map(o => (
                            <tr key={o.id}>
                              <td>
                                <div style={{ fontWeight: 600, color: 'var(--text)' }}>{o.full_name}</div>
                                <div style={{ fontSize: '.72rem', color: 'var(--text3)' }}>{o.email}</div>
                              </td>
                              <td style={{ maxWidth: 180, fontSize: '.82rem' }}>{o.property_title}</td>
                              <td>{o.property_price ? o.property_price.toLocaleString() : '—'}</td>
                              <td style={{ fontWeight: 700, color: 'var(--accent)' }}>{o.offer_amount?.toLocaleString()}</td>
                              <td><StatusBadge s={o.status || 'pending'} /></td>
                              <td>{new Date(o.created_at).toLocaleDateString()}</td>
                              <td><ActionBtns table="buy_offers" id={o.id} status={o.status || 'pending'} /></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* ── RENT APPS ── */}
                {tab === 'rentapps' && (
                  <div className="card" style={{ padding: 0 }}>
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
                      <h3 style={{ fontWeight: 700 }}>Rent Applications ({filterStatus(filterRows(rentapps,['full_name','property_title'])).length})</h3>
                    </div>
                    <div className="table-wrap">
                      <table>
                        <thead><tr><th>Applicant</th><th>Property</th><th>Message</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
                        <tbody>
                          {filterStatus(filterRows(rentapps, ['full_name','property_title','email'])).map(a => (
                            <tr key={a.id}>
                              <td>
                                <div style={{ fontWeight: 600, color: 'var(--text)' }}>{a.full_name}</div>
                                <div style={{ fontSize: '.72rem', color: 'var(--text3)' }}>{a.email}</div>
                              </td>
                              <td style={{ fontSize: '.82rem' }}>{a.property_title || `#${a.property_id}`}</td>
                              <td style={{ maxWidth: 200, fontSize: '.78rem', color: 'var(--text2)' }}>{a.message?.slice(0,80) || '—'}</td>
                              <td><StatusBadge s={a.status} /></td>
                              <td>{new Date(a.created_at).toLocaleDateString()}</td>
                              <td><ActionBtns table="rent_applications" id={a.id} status={a.status} /></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* ── CONTACT MESSAGES ── */}
                {tab === 'contacts' && (
                  <div className="card" style={{ padding: 0 }}>
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
                      <h3 style={{ fontWeight: 700 }}>Contact Messages ({filterRows(contacts,['first_name','last_name','email']).length})</h3>
                    </div>
                    <div className="table-wrap">
                      <table>
                        <thead><tr><th>From</th><th>Profile</th><th>Message</th><th>Date</th><th>Actions</th></tr></thead>
                        <tbody>
                          {filterRows(contacts, ['first_name','last_name','email','message']).map(c => (
                            <tr key={c.id}>
                              <td>
                                <div style={{ fontWeight: 600, color: 'var(--text)' }}>{c.first_name} {c.last_name}</div>
                                <div style={{ fontSize: '.72rem', color: 'var(--text3)' }}>{c.email}</div>
                              </td>
                              <td>{c.profile || '—'}</td>
                              <td style={{ maxWidth: 280, fontSize: '.82rem', color: 'var(--text2)' }}>{c.message?.slice(0,120)}{c.message?.length > 120 ? '...' : ''}</td>
                              <td>{new Date(c.created_at).toLocaleDateString()}</td>
                              <td><button onClick={() => deleteRow('contact_messages', c.id)} style={{ background: 'transparent', border: '1px solid var(--border2)', borderRadius: 6, padding: '3px 8px', fontSize: '.72rem', color: 'var(--text3)', cursor: 'pointer' }}>🗑</button></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* ── REITS ── */}
                {tab === 'reits' && (
                  <div className="card" style={{ padding: 0 }}>
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ fontWeight: 700 }}>REITs ({reits.length})</h3>
                      <span style={{ fontSize: '.78rem', color: 'var(--text2)' }}>Edit via Supabase Dashboard</span>
                    </div>
                    <div className="table-wrap">
                      <table>
                        <thead><tr><th>Name</th><th>Type</th><th>Location</th><th>Share Price</th><th>Return / yr</th><th>Risk</th></tr></thead>
                        <tbody>
                          {reits.map(r => (
                            <tr key={r.id}>
                              <td style={{ fontWeight: 700, color: 'var(--text)' }}>{r.name}</td>
                              <td>{r.type}</td>
                              <td>📍 {r.location}</td>
                              <td style={{ fontWeight: 700, color: 'var(--accent)' }}>{r.share_price} TND</td>
                              <td style={{ color: 'var(--green)', fontWeight: 700 }}>+{r.annual_return}%</td>
                              <td><span className={`badge badge-${r.risk_level}`}>{r.risk_level}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* ── PORTFOLIO ── */}
                {tab === 'portfolio' && (
                  <div className="card" style={{ padding: 0 }}>
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
                      <h3 style={{ fontWeight: 700 }}>All Portfolio Holdings ({portfolio.length})</h3>
                    </div>
                    <div className="table-wrap">
                      <table>
                        <thead><tr><th>Investor</th><th>REIT</th><th>Shares</th><th>Buy Price</th><th>Current Value</th><th>Status</th></tr></thead>
                        <tbody>
                          {filterRows(portfolio, []).map(p => {
                            const current = p.reits?.share_price || p.buy_price
                            return (
                              <tr key={p.id}>
                                <td>
                                  <div style={{ fontWeight: 600, color: 'var(--text)' }}>{p.users?.full_name || '—'}</div>
                                  <div style={{ fontSize: '.72rem', color: 'var(--text3)' }}>{p.users?.email}</div>
                                </td>
                                <td style={{ fontWeight: 600 }}>{p.reits?.name || '—'}</td>
                                <td style={{ fontWeight: 700 }}>{p.shares_owned}</td>
                                <td>{p.buy_price?.toFixed(2)} TND</td>
                                <td style={{ fontWeight: 700, color: current >= p.buy_price ? 'var(--accent)' : 'var(--danger)' }}>
                                  {(p.shares_owned * current).toLocaleString('fr-TN', { maximumFractionDigits: 0 })} TND
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

              </>}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}

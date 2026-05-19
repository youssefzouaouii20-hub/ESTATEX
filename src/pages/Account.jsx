import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import Footer from '../components/Footer'

const QUICK_AMOUNTS = [500, 1000, 2500, 5000, 10000]

export default function Account() {
  const { user, profile, updateProfile, signOut, loading, fetchProfile, refreshProfile } = useAuth()
  const toast = useToast()
  const [tab, setTab] = useState('portfolio')
  const [portfolio, setPortfolio] = useState([])
  const [transactions, setTransactions] = useState([])
  const [listings, setListings] = useState([])
  const [rentApps, setRentApps] = useState([])
  const [dataLoading, setDataLoading] = useState(true)
  const [profileForm, setProfileForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [pwForm, setPwForm] = useState({ newPass:'', confirm:'' })
  const [changingPw, setChangingPw] = useState(false)
  // Add Funds
  const [fundsModal, setFundsModal] = useState(false)
  const [fundsAmount, setFundsAmount] = useState('')
  const [addingFunds, setAddingFunds] = useState(false)

  useEffect(() => {
    if (profile) setProfileForm({
      full_name: profile.full_name || '',
      profile_type: profile.profile_type || 'investor',
      phone: profile.phone || '',
      bio: profile.bio || '',
    })
  }, [profile])

  useEffect(() => { if (user) loadData() }, [user])

  async function loadData() {
    setDataLoading(true)
    const [port, tx, list, apps] = await Promise.all([
      supabase.from('portfolio').select('*, reits(*)').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('transactions').select('*, reits(name)').eq('user_id', user.id).order('created_at', { ascending: false }).limit(30),
      supabase.from('listings').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('rent_applications').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
    ])
    setPortfolio(port.data || [])
    setTransactions(tx.data || [])
    setListings(list.data || [])
    setRentApps(apps.data || [])
    setDataLoading(false)
  }

  async function handleProfileSave(e) {
    e.preventDefault()
    if (!profileForm.full_name.trim()) { toast('Le nom complet est requis.', 'error'); return }
    setSaving(true)
    try {
      await updateProfile(profileForm)
      toast('Profil mis à jour avec succès !')
    } catch { toast('Échec de la mise à jour.', 'error') }
    setSaving(false)
  }

  async function handlePasswordChange(e) {
    e.preventDefault()
    if (pwForm.newPass !== pwForm.confirm) { toast('Les mots de passe ne correspondent pas.', 'error'); return }
    if (pwForm.newPass.length < 6) { toast('Le mot de passe doit contenir au moins 6 caractères.', 'error'); return }
    setChangingPw(true)
    const { error } = await supabase.auth.updateUser({ password: pwForm.newPass })
    setChangingPw(false)
    if (error) { toast(error.message || 'Échec du changement.', 'error'); return }
    toast('Mot de passe changé avec succès !')
    setPwForm({ newPass:'', confirm:'' })
  }

  async function handleAddFunds(e) {
    e.preventDefault()
    const amount = parseFloat(fundsAmount)
    if (!amount || amount <= 0) { toast('Entrez un montant valide.', 'error'); return }
    if (amount > 100000) { toast('Montant maximum : 100 000 TND par transaction.', 'error'); return }
    setAddingFunds(true)
    try {
      const newBalance = (profile?.cash_holdings || 0) + amount
      const { error } = await supabase.from('users').update({ cash_holdings: newBalance }).eq('id', user.id)
      if (error) throw error
      await refreshProfile()
      setFundsModal(false)
      setFundsAmount('')
      toast(`✅ ${amount.toLocaleString('fr-TN')} TND ajoutés à votre solde !`)
    } catch (err) {
      toast('Échec. Réessayez.', 'error')
      console.error(err)
    } finally {
      setAddingFunds(false)
    }
  }

  if (loading) return <div className="spinner" />
  if (!user) return <Navigate to="/login" />

  const initials = profile?.full_name?.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase() || '?'
  const activePortfolio = portfolio.filter(p => p.status === 'active')
  const portfolioValue = activePortfolio.reduce((s,p) => s + (p.shares_owned * (p.reits?.share_price || p.buy_price)), 0)
  const totalInvested = activePortfolio.reduce((s,p) => s + (p.shares_owned * p.buy_price), 0)
  const annualIncome = activePortfolio.reduce((s,p) => s + (p.shares_owned * (p.reits?.share_price||0) * ((p.reits?.annual_return||0)/100)), 0)

  const tabs = ['portfolio','transactions','listings','rent-apps','settings']
  const tabLabels = { portfolio:'Portfolio', transactions:'Transactions', listings:'Mes Annonces', 'rent-apps':'Locations', settings:'Paramètres' }

  return (
    <>
      <section style={{ background:'var(--bg2)', padding:'40px 24px 32px' }}>
        <div className="container">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
            <h1 style={{ fontSize:'1.8rem', fontWeight:800 }}>Mon Compte</h1>
            <button className="btn-primary" onClick={() => setFundsModal(true)} style={{ fontSize:'.9rem' }}>
              + Ajouter des Fonds
            </button>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop:32 }}>
        <div className="container">
          <div className="account-grid">
            {/* SIDEBAR */}
            <aside className="account-sidebar">
              <div className="account-avatar-wrap">
                <div className="account-avatar">{initials}</div>
                <div className="account-name">{profile?.full_name}</div>
                <div className="account-type">{profile?.profile_type}</div>
                <div className="account-cash">{(profile?.cash_holdings || 0).toLocaleString('fr-TN', {maximumFractionDigits:2})} TND</div>
                <div style={{ fontSize:'.75rem', color:'var(--text3)', marginTop:2 }}>Solde disponible</div>
                <button
                  className="btn-outline"
                  style={{ marginTop:12, padding:'7px 16px', fontSize:'.82rem', width:'100%', justifyContent:'center' }}
                  onClick={() => setFundsModal(true)}
                >
                  + Recharger
                </button>
              </div>
              <div className="divider" />
              <ul className="sidebar-nav">
                {tabs.map(t => (
                  <li key={t}>
                    <button className={tab===t?'active':''} onClick={() => setTab(t)}>{tabLabels[t]}</button>
                  </li>
                ))}
                <li>
                  <button onClick={async () => { await signOut(); window.location.href='/' }} style={{ color:'var(--danger)' }}>
                    Se déconnecter
                  </button>
                </li>
              </ul>
            </aside>

            {/* MAIN CONTENT */}
            <div>

              {/* PORTFOLIO */}
              {tab === 'portfolio' && (
                <div>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:16, marginBottom:28 }}>
                    {[
                      { l:'Solde Disponible', v:(profile?.cash_holdings||0).toLocaleString('fr-TN',{maximumFractionDigits:2})+' TND', accent:true, btn:true },
                      { l:'Valeur du Portfolio', v:(portfolioValue).toLocaleString('fr-TN',{maximumFractionDigits:2})+' TND' },
                      { l:'Gain / Perte', v:((portfolioValue-totalInvested)>=0?'+':'')+((portfolioValue-totalInvested)).toLocaleString('fr-TN',{maximumFractionDigits:2})+' TND', color: portfolioValue>=totalInvested?'var(--accent)':'var(--danger)' },
                      { l:'Revenu Annuel Est.', v:(annualIncome).toLocaleString('fr-TN',{maximumFractionDigits:2})+' TND' },
                    ].map(s => (
                      <div key={s.l} className="card" style={{ padding:20, position:'relative' }}>
                        <div style={{ fontSize:'.75rem', color:'var(--text3)', marginBottom:6 }}>{s.l}</div>
                        <div style={{ fontSize:'1.15rem', fontWeight:800, color: s.color||(s.accent?'var(--accent)':'var(--text)') }}>{s.v}</div>
                        {s.btn && <button onClick={()=>setFundsModal(true)} style={{ position:'absolute', top:12, right:12, background:'rgba(45,186,135,.15)', border:'1px solid rgba(45,186,135,.3)', borderRadius:6, color:'var(--accent)', fontSize:'.7rem', fontWeight:700, padding:'3px 8px', cursor:'pointer' }}>+ Recharger</button>}
                      </div>
                    ))}
                  </div>

                  <div className="card">
                    <div style={{ padding:'20px 20px 0', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                      <h3 style={{ fontWeight:700 }}>Mes Positions</h3>
                      <a href="/invest" className="btn-primary" style={{ fontSize:'.8rem', padding:'6px 14px' }}>+ Investir</a>
                    </div>
                    {dataLoading ? <div className="spinner" /> : portfolio.length === 0 ? (
                      <div className="empty-state">
                        <p>Aucun investissement. <a href="/invest" style={{ color:'var(--accent)' }}>Explorer les REITs →</a></p>
                      </div>
                    ) : (
                      <div className="table-wrap">
                        <table>
                          <thead><tr><th>REIT</th><th>Parts</th><th>Prix moy.</th><th>Cours actuel</th><th>Valeur</th><th>Statut</th></tr></thead>
                          <tbody>
                            {portfolio.map(p => {
                              const current = p.reits?.share_price || p.buy_price
                              const val = p.shares_owned * current
                              const gain = current - p.buy_price
                              return (
                                <tr key={p.id}>
                                  <td style={{ fontWeight:600, color:'var(--text)' }}>{p.reits?.name||'Inconnu'}</td>
                                  <td>{p.shares_owned}</td>
                                  <td>{p.buy_price?.toFixed(2)} TND</td>
                                  <td style={{ color: gain>=0?'var(--accent)':'var(--danger)', fontWeight:600 }}>
                                    {current?.toFixed(2)} TND
                                    <span style={{ fontSize:'.75rem', marginLeft:4 }}>{gain>=0?'▲':'▼'}</span>
                                  </td>
                                  <td style={{ fontWeight:700, color:'var(--text)' }}>{val?.toLocaleString('fr-TN',{maximumFractionDigits:2})} TND</td>
                                  <td><span className={`badge badge-${p.status}`}>{p.status}</span></td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TRANSACTIONS */}
              {tab === 'transactions' && (
                <div className="card">
                  <div style={{ padding:'20px 20px 0' }}><h3 style={{ fontWeight:700 }}>Historique des Transactions</h3></div>
                  {dataLoading ? <div className="spinner" /> : transactions.length === 0 ? (
                    <div className="empty-state"><p>Aucune transaction pour le moment.</p></div>
                  ) : (
                    <div className="table-wrap">
                      <table>
                        <thead><tr><th>Date</th><th>Type</th><th>REIT</th><th>Parts</th><th>Montant</th></tr></thead>
                        <tbody>
                          {transactions.map(tx => (
                            <tr key={tx.id}>
                              <td>{new Date(tx.created_at).toLocaleDateString('fr-TN')}</td>
                              <td><span className={`badge ${tx.type==='buy'?'badge-approved':tx.type==='sell'?'badge-rejected':'badge-pending'}`}>{tx.type}</span></td>
                              <td style={{ color:'var(--text)' }}>{tx.reits?.name||'—'}</td>
                              <td>{tx.shares||'—'}</td>
                              <td style={{ fontWeight:700, color:'var(--text)' }}>{tx.amount?.toLocaleString('fr-TN',{maximumFractionDigits:2})} TND</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* LISTINGS */}
              {tab === 'listings' && (
                <div className="card">
                  <div style={{ padding:'20px 20px 0', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <h3 style={{ fontWeight:700 }}>Mes Annonces Immobilières</h3>
                    <a href="/sell" className="btn-primary" style={{ fontSize:'.8rem', padding:'6px 14px' }}>+ Nouvelle annonce</a>
                  </div>
                  {dataLoading ? <div className="spinner" /> : listings.length === 0 ? (
                    <div className="empty-state"><p>Aucune annonce. <a href="/sell" style={{ color:'var(--accent)' }}>Soumettre une propriété →</a></p></div>
                  ) : (
                    <div className="table-wrap">
                      <table>
                        <thead><tr><th>Adresse</th><th>Type</th><th>Prix</th><th>Statut</th><th>Date</th></tr></thead>
                        <tbody>
                          {listings.map(l => (
                            <tr key={l.id}>
                              <td style={{ color:'var(--text)', maxWidth:200 }}>{l.address}</td>
                              <td>{l.property_type||'—'}</td>
                              <td>{l.asking_price?l.asking_price.toLocaleString()+' TND':'—'}</td>
                              <td><span className={`badge badge-${l.status}`}>{l.status}</span></td>
                              <td>{new Date(l.created_at).toLocaleDateString('fr-TN')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* RENT APPS */}
              {tab === 'rent-apps' && (
                <div className="card">
                  <div style={{ padding:'20px 20px 0' }}><h3 style={{ fontWeight:700 }}>Candidatures de Location</h3></div>
                  {dataLoading ? <div className="spinner" /> : rentApps.length === 0 ? (
                    <div className="empty-state"><p>Aucune candidature. <a href="/rent" style={{ color:'var(--accent)' }}>Parcourir les locations →</a></p></div>
                  ) : (
                    <div className="table-wrap">
                      <table>
                        <thead><tr><th>Propriété</th><th>Statut</th><th>Date</th></tr></thead>
                        <tbody>
                          {rentApps.map(a => (
                            <tr key={a.id}>
                              <td style={{ color:'var(--text)' }}>{a.property_title||`Propriété #${a.property_id}`}</td>
                              <td><span className={`badge badge-${a.status}`}>{a.status}</span></td>
                              <td>{new Date(a.created_at).toLocaleDateString('fr-TN')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* SETTINGS */}
              {tab === 'settings' && profileForm && (
                <div>
                  <div className="card" style={{ padding:28, marginBottom:20 }}>
                    <h3 style={{ fontWeight:700, marginBottom:4 }}>Informations du Profil</h3>
                    <p style={{ color:'var(--text2)', fontSize:'.85rem', marginBottom:20 }}>Ces informations sont visibles uniquement par vous.</p>
                    <form onSubmit={handleProfileSave}>
                      <div className="form-group">
                        <label>Nom complet *</label>
                        <input required value={profileForm.full_name} onChange={e => setProfileForm(p => ({...p, full_name: e.target.value}))} placeholder="Mohamed Ben Ali" />
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Profil</label>
                          <select value={profileForm.profile_type} onChange={e => setProfileForm(p => ({...p, profile_type: e.target.value}))}>
                            {[['investor','Investisseur'],['seller','Vendeur'],['renter','Locataire'],['developer','Promoteur'],['other','Autre']].map(([v,l]) =>
                              <option key={v} value={v}>{l}</option>
                            )}
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Téléphone</label>
                          <input value={profileForm.phone} onChange={e => setProfileForm(p => ({...p, phone: e.target.value}))} placeholder="+216 XX XXX XXX" />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Biographie</label>
                        <textarea rows={3} value={profileForm.bio} onChange={e => setProfileForm(p => ({...p, bio: e.target.value}))} placeholder="Parlez-nous de vous..." />
                      </div>
                      <button className="btn-primary" type="submit" disabled={saving}>
                        {saving ? 'Enregistrement...' : 'Sauvegarder'}
                      </button>
                    </form>
                  </div>

                  <div className="card" style={{ padding:28, marginBottom:20 }}>
                    <h3 style={{ fontWeight:700, marginBottom:4 }}>Solde & Fonds</h3>
                    <p style={{ color:'var(--text2)', fontSize:'.85rem', marginBottom:16 }}>Rechargez votre solde pour investir dans les REITs.</p>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', background:'var(--bg3)', borderRadius:'var(--radius2)', padding:'16px 20px', marginBottom:16 }}>
                      <div>
                        <div style={{ fontSize:'.78rem', color:'var(--text3)', marginBottom:4 }}>Solde actuel</div>
                        <div style={{ fontSize:'1.6rem', fontWeight:800, color:'var(--accent)' }}>
                          {(profile?.cash_holdings||0).toLocaleString('fr-TN',{maximumFractionDigits:2})} TND
                        </div>
                      </div>
                      <button className="btn-primary" onClick={() => setFundsModal(true)}>+ Ajouter des Fonds</button>
                    </div>
                  </div>

                  <div className="card" style={{ padding:28 }}>
                    <h3 style={{ fontWeight:700, marginBottom:4 }}>Changer le Mot de Passe</h3>
                    <p style={{ color:'var(--text2)', fontSize:'.85rem', marginBottom:20 }}>Choisissez un mot de passe fort d'au moins 6 caractères.</p>
                    <form onSubmit={handlePasswordChange}>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Nouveau mot de passe</label>
                          <input type="password" value={pwForm.newPass} onChange={e => setPwForm(p => ({...p, newPass: e.target.value}))} placeholder="••••••••" />
                        </div>
                        <div className="form-group">
                          <label>Confirmer</label>
                          <input type="password" value={pwForm.confirm} onChange={e => setPwForm(p => ({...p, confirm: e.target.value}))} placeholder="••••••••" />
                        </div>
                      </div>
                      <button className="btn-primary" type="submit" disabled={changingPw}>
                        {changingPw ? 'Changement...' : 'Changer le mot de passe'}
                      </button>
                    </form>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </section>

      {/* ADD FUNDS MODAL */}
      {fundsModal && (
        <div className="modal-overlay" onClick={e => e.target===e.currentTarget && setFundsModal(false)}>
          <div className="modal" style={{ position:'relative', maxWidth:440 }}>
            <button className="modal-close" onClick={() => setFundsModal(false)}>×</button>
            <div style={{ textAlign:'center', marginBottom:24 }}>
              <div style={{ fontSize:'2.5rem', marginBottom:8 }}>💰</div>
              <h2 style={{ marginBottom:6 }}>Ajouter des Fonds</h2>
              <p style={{ color:'var(--text2)', fontSize:'.9rem' }}>
                Solde actuel : <strong style={{ color:'var(--accent)' }}>{(profile?.cash_holdings||0).toLocaleString('fr-TN',{maximumFractionDigits:2})} TND</strong>
              </p>
            </div>

            {/* Quick amounts */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:8, marginBottom:20 }}>
              {QUICK_AMOUNTS.map(a => (
                <button
                  key={a}
                  onClick={() => setFundsAmount(a.toString())}
                  style={{
                    background: fundsAmount===a.toString() ? 'var(--accent)' : 'var(--bg3)',
                    border: `1.5px solid ${fundsAmount===a.toString()?'var(--accent)':'var(--border)'}`,
                    borderRadius:'var(--radius2)', padding:'8px 4px',
                    fontSize:'.78rem', fontWeight:700, color: fundsAmount===a.toString()?'#fff':'var(--text2)',
                    cursor:'pointer', transition:'all .2s',
                  }}
                >
                  {a>=1000?a/1000+'K':a}
                </button>
              ))}
            </div>

            <form onSubmit={handleAddFunds}>
              <div className="form-group">
                <label>Montant personnalisé (TND)</label>
                <input
                  type="number" min="1" max="100000" step="1"
                  value={fundsAmount}
                  onChange={e => setFundsAmount(e.target.value)}
                  placeholder="ex: 3000"
                  style={{ fontSize:'1.1rem', textAlign:'center', fontWeight:700 }}
                />
              </div>

              {fundsAmount && parseFloat(fundsAmount) > 0 && (
                <div style={{ background:'var(--bg3)', borderRadius:'var(--radius2)', padding:'14px 16px', marginBottom:16, textAlign:'center' }}>
                  <div style={{ fontSize:'.82rem', color:'var(--text2)', marginBottom:4 }}>Nouveau solde après dépôt</div>
                  <div style={{ fontSize:'1.4rem', fontWeight:800, color:'var(--accent)' }}>
                    {((profile?.cash_holdings||0) + parseFloat(fundsAmount||0)).toLocaleString('fr-TN',{maximumFractionDigits:2})} TND
                  </div>
                </div>
              )}

              <button className="btn-primary" type="submit" disabled={addingFunds||!fundsAmount||parseFloat(fundsAmount)<=0}
                style={{ width:'100%', justifyContent:'center', padding:'13px' }}>
                {addingFunds ? 'Traitement...' : `Ajouter ${fundsAmount?parseFloat(fundsAmount).toLocaleString():''} TND`}
              </button>
              <p style={{ textAlign:'center', fontSize:'.75rem', color:'var(--text3)', marginTop:10 }}>
                Simulation uniquement — aucun paiement réel n'est effectué.
              </p>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}

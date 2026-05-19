import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useLang } from '../contexts/LangContext'
import Footer from '../components/Footer'

const typeLabels = { residential:'Residential', commercial:'Commercial', mixed:'Mixed Use', luxury:'Luxury', industrial:'Industrial', student:'Student Housing' }
const typeLabels_fr = { residential:'Résidentiel', commercial:'Commercial', mixed:'Usage Mixte', luxury:'Luxe', industrial:'Industriel', student:'Résidence Étudiante' }

export default function Invest() {
  const { t, lang } = useLang()
  const [reits, setReits] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ risk:'', type:'', location:'', maxPrice:1000 })
  const [showDisclaimer, setShowDisclaimer] = useState(false)
  const [disclaimerDone, setDisclaimerDone] = useState(false)
  const [simForm, setSimForm] = useState({ amount:'', duration:'5', rate:'', reinvest:'yes' })
  const [simResult, setSimResult] = useState(null)
  const labels = lang === 'fr' ? typeLabels_fr : typeLabels

  // Show disclaimer on first visit this session
  useEffect(() => {
    if (!disclaimerDone) setShowDisclaimer(true)
  }, [])

  useEffect(() => { if (disclaimerDone) fetchReits() }, [filters, disclaimerDone])

  async function fetchReits() {
    setLoading(true)
    let q = supabase.from('reits').select('*').lte('share_price', filters.maxPrice).order('annual_return', { ascending:false })
    if (filters.risk) q = q.eq('risk_level', filters.risk)
    if (filters.type) q = q.eq('type', filters.type)
    if (filters.location) q = q.ilike('location', `%${filters.location}%`)
    const { data } = await q
    setReits(data || [])
    setLoading(false)
  }

  function acceptDisclaimer() {
    setDisclaimerDone(true)
    setShowDisclaimer(false)
  }

  function calcSim() {
    const amount=parseFloat(simForm.amount), rate=parseFloat(simForm.rate), years=parseInt(simForm.duration)
    if (!amount||!rate||!years) return
    const r=rate/100
    const total = simForm.reinvest==='yes'
      ? amount*Math.pow(1+r,years)
      : amount+(amount*r*years)
    const returns=total-amount
    const fmt=n=>n.toLocaleString('fr-TN',{maximumFractionDigits:0})+' TND'
    setSimResult({ initial:fmt(amount), returns:fmt(returns), total:fmt(total), dividend:fmt(amount*r) })
  }

  return (
    <>
      {/* ── DISCLAIMER MODAL ── */}
      {showDisclaimer && (
        <div className="modal-overlay" style={{ zIndex:9999 }}>
          <div className="disclaimer-modal">
            <h2>
              <span style={{ fontSize:'1.2rem' }}>⚠️</span>
              {t.invest_disclaimer_title}
            </h2>
            <p>{t.invest_disclaimer_p1}</p>
            <p>{t.invest_disclaimer_p2}</p>
            <div className="disclaimer-check">
              {t.invest_disclaimer_confirm}
            </div>
            <button className="btn-accent" onClick={acceptDisclaimer} style={{ width:'100%', justifyContent:'center', padding:'13px' }}>
              {t.invest_disclaimer_btn}
            </button>
          </div>
        </div>
      )}

      {/* ── PAGE HEADER ── */}
      <section style={{ background:'var(--bg2)', borderBottom:'1px solid var(--border)', padding:'60px 0 48px' }}>
        <div className="container">
          <div className="label">{lang==='fr'?'Plateforme d\'Investissement':'Investment Platform'}</div>
          <h1 style={{ fontSize:'clamp(2rem,4.5vw,3.5rem)', fontWeight:800, marginBottom:12 }}>
            {t.invest_h1}<br/><span style={{ color:'var(--accent)' }}>{t.invest_h1_span}</span>
          </h1>
          <p style={{ color:'var(--text2)', maxWidth:560, lineHeight:1.75 }}>{t.invest_sub}</p>
          <div style={{ display:'flex', gap:10, marginTop:24, flexWrap:'wrap' }}>
            <a href="#simulator" className="btn-accent">{lang==='fr'?'Simulateur':'Simulator'}</a>
            <a href="#results" className="btn-outline">{lang==='fr'?'Parcourir les REITs':'Browse REITs'}</a>
          </div>
        </div>
      </section>

      {/* ── SIMULATOR ── */}
      <section className="section" id="simulator" style={{ paddingTop:64 }}>
        <div className="container">
          <div className="label">{t.invest_simulator}</div>
          <h2 style={{ fontSize:'1.6rem', fontWeight:800, marginBottom:8 }}>{t.invest_simulator}</h2>
          <p style={{ color:'var(--text2)', marginBottom:36 }}>{t.invest_sim_sub}</p>
          <div className="simulator-wrap">
            <div className="sim-card">
              <h3>{lang==='fr'?'Vos données':'Your inputs'}</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>{t.invest_amount}</label>
                  <input type="number" value={simForm.amount} onChange={e=>setSimForm(p=>({...p,amount:e.target.value}))} placeholder="5000" min="100" />
                </div>
                <div className="form-group">
                  <label>{t.invest_duration}</label>
                  <select value={simForm.duration} onChange={e=>setSimForm(p=>({...p,duration:e.target.value}))}>
                    <option value="1">1 {lang==='fr'?'An':'Year'}</option>
                    <option value="3">3 {lang==='fr'?'Ans':'Years'}</option>
                    <option value="5">5 {lang==='fr'?'Ans':'Years'}</option>
                    <option value="10">10 {lang==='fr'?'Ans':'Years'}</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>{t.invest_rate}</label>
                  <input type="number" value={simForm.rate} onChange={e=>setSimForm(p=>({...p,rate:e.target.value}))} placeholder="8" min="1" max="30" />
                </div>
                <div className="form-group">
                  <label>{t.invest_reinvest}</label>
                  <select value={simForm.reinvest} onChange={e=>setSimForm(p=>({...p,reinvest:e.target.value}))}>
                    <option value="yes">{t.invest_reinvest_yes}</option>
                    <option value="no">{t.invest_reinvest_no}</option>
                  </select>
                </div>
              </div>
              <button className="btn-accent" onClick={calcSim} style={{ width:'100%', justifyContent:'center', marginTop:8 }}>
                {t.invest_calc}
              </button>
            </div>
            <div className="sim-card">
              <h3>{t.invest_results}</h3>
              {simResult ? <>
                <div className="result-row"><span>{t.invest_initial}</span><strong>{simResult.initial}</strong></div>
                <div className="result-row"><span>{t.invest_returns}</span><strong>{simResult.returns}</strong></div>
                <div className="result-row"><span>{t.invest_final}</span><strong>{simResult.total}</strong></div>
                <div className="result-row"><span>{t.invest_dividend}</span><strong>{simResult.dividend}</strong></div>
                <p style={{ color:'var(--text3)', fontSize:'.75rem', marginTop:16 }}>{t.invest_sim_note}</p>
              </> : (
                <p style={{ color:'var(--text3)', fontSize:'.88rem' }}>
                  {lang==='fr'?'Remplissez le formulaire et cliquez sur Calculer.':'Fill in the form and click Calculate.'}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── FILTERS ── */}
      <section style={{ paddingBottom:16 }}>
        <div className="container">
          <div className="label">{t.invest_find}</div>
          <h2 style={{ fontSize:'1.6rem', fontWeight:800, marginBottom:8 }}>{t.invest_find}</h2>
          <p style={{ color:'var(--text2)', marginBottom:24 }}>{t.invest_filter_sub}</p>
          <div className="filters-bar">
            <div className="filter-group">
              <label>{t.invest_risk}</label>
              <select value={filters.risk} onChange={e=>setFilters(p=>({...p,risk:e.target.value}))}>
                <option value="">{t.invest_all_risk}</option>
                <option value="low">{t.invest_low}</option>
                <option value="medium">{t.invest_medium}</option>
                <option value="high">{t.invest_high}</option>
              </select>
            </div>
            <div className="filter-group">
              <label>{t.invest_type}</label>
              <select value={filters.type} onChange={e=>setFilters(p=>({...p,type:e.target.value}))}>
                <option value="">{t.invest_all_types}</option>
                {Object.entries(labels).map(([v,l])=><option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div className="filter-group">
              <label>{t.invest_max_price}: {filters.maxPrice} TND</label>
              <input type="range" min="10" max="1000" step="10" value={filters.maxPrice}
                onChange={e=>setFilters(p=>({...p,maxPrice:+e.target.value}))} />
            </div>
            <div className="filter-group">
              <label>{t.invest_location}</label>
              <select value={filters.location} onChange={e=>setFilters(p=>({...p,location:e.target.value}))}>
                <option value="">{t.invest_all_regions}</option>
                {['Tunis','Sfax','Sousse','Bizerte'].map(l=><option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <button className="btn-ghost" onClick={()=>setFilters({risk:'',type:'',location:'',maxPrice:1000})}>
              {t.invest_clear}
            </button>
          </div>
        </div>
      </section>

      {/* ── RESULTS ── */}
      <section id="results" style={{ paddingBottom:96 }}>
        <div className="container">
          <p style={{ marginBottom:24, color:'var(--text2)', fontSize:'.85rem' }}>
            {t.invest_showing} <strong style={{ color:'var(--text)' }}>{reits.length}</strong> {t.invest_reits}
          </p>
          {!disclaimerDone ? (
            <div className="empty-state">
              <p style={{ marginBottom:16 }}>⚠️ {lang==='fr'?'Veuillez accepter l\'avertissement légal pour voir les REITs.':'Please accept the legal disclaimer to view REITs.'}</p>
              <button className="btn-accent" onClick={()=>setShowDisclaimer(true)}>
                {lang==='fr'?'Voir l\'avertissement':'View Disclaimer'}
              </button>
            </div>
          ) : loading ? <div className="spinner" /> : (
            <div className="reit-grid">
              {reits.length === 0 ? (
                <div className="empty-state" style={{ gridColumn:'1/-1' }}>
                  <p>{t.invest_no_reits}</p>
                </div>
              ) : reits.map(reit => (
                <Link to={`/reit/${reit.id}`} key={reit.id} className="reit-card" style={{ display:'block' }}>
                  <div className="reit-img">
                    <img src={reit.image_url} alt={reit.name}
                      onError={e=>e.target.src='https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=80'} />
                  </div>
                  <div className="reit-body">
                    <div className="reit-meta">
                      <span className={`badge badge-${reit.risk_level}`}>{reit.risk_level}</span>
                      <span className="badge" style={{ background:'var(--bg3)', color:'var(--text3)', border:'1px solid var(--border)' }}>
                        {labels[reit.type]||reit.type}
                      </span>
                    </div>
                    <div className="reit-name">{reit.name}</div>
                    <div style={{ color:'var(--text3)', fontSize:'.78rem', marginBottom:8 }}>📍 {reit.location}</div>
                    <p style={{ color:'var(--text3)', fontSize:'.82rem', lineHeight:1.6 }}>
                      {reit.description?.slice(0,90)}...
                    </p>
                    <div className="reit-price-row">
                      <div>
                        <div style={{ fontSize:'.62rem', color:'var(--text3)', textTransform:'uppercase', letterSpacing:'.08em' }}>
                          {t.invest_share_price}
                        </div>
                        <div className="reit-price">{reit.share_price} TND</div>
                      </div>
                      <div className="reit-return">+{reit.annual_return}% / {lang==='fr'?'an':'yr'}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  )
}

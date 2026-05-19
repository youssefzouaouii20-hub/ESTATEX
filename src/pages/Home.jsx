import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useToast } from '../contexts/ToastContext'
import { useLang } from '../contexts/LangContext'
import Footer from '../components/Footer'

const SLIDES = [
  { url:'/tn4.jpg' },
  { url:'/tn2.webp' },
  { url:'/tn5.webp' },
  { url:'/tn9.jpg' },
  { url:'/tn6.jpg' },
  { url:'/tn7.webp' },
  { url:'/tn3.jpg' },
]

const MARQUEE = [
  'Tunis Résidentiel REIT', '+7.2% / an',
  'Sfax Commercial REIT', '+9.5% / an',
  'Sousse Luxury REIT', '+13.1% / an',
  'Bizerte Mixed REIT', '+6.8% / an',
  'TSE — Bourse de Tunis', '1M+ Propriétés',
]

const FAQS_FR = [
  ["Qu'est-ce qu'un REIT ?", "Un REIT est un fonds qui possède des propriétés génératrices de revenus. Vous achetez des parts, recevez des dividendes et bénéficiez de la valorisation — sans acheter un bien entier."],
  ["Montant minimum d'investissement ?", "Chaque REIT fixe son prix par part. Notre objectif est de rendre l'accès possible à tous les profils d'investisseurs, même avec un capital limité."],
  ["Comment fonctionne Invest-to-Own ?", "Vous accumulez des parts REIT au fil du temps. Une fois suffisantes, vous les convertissez en titre de propriété complet."],
  ["EstateEx possède-t-il les biens ?", "Non. EstateEx est une plateforme de courtage. La gestion est assurée par des partenaires professionnels agréés."],
  ["Accessible aux non-résidents ?", "Oui. Les parts REIT peuvent être souscrites par les Tunisiens non-résidents et les investisseurs étrangers."],
]
const FAQS_EN = [
  ["What is a REIT?", "A REIT owns income-producing properties. You buy shares, receive dividends and benefit from appreciation — without buying a whole property."],
  ["Minimum investment amount?", "Each REIT sets its own share price. Our goal is to make entry accessible to all investor profiles, even with limited capital."],
  ["How does Invest-to-Own work?", "You accumulate REIT shares over time. Once you hold enough tied to a property, you convert them into full ownership title."],
  ["Does EstateEx own the properties?", "No. EstateEx is a brokerage platform. Management is handled by licensed professional partners."],
  ["Accessible to non-residents?", "Yes. REIT shares can be subscribed by non-resident Tunisians and foreign investors."],
]

export default function Home() {
  const toast = useToast()
  const navigate = useNavigate()
  const { t, lang } = useLang()
  const [slide, setSlide] = useState(0)
  const [openFaq, setOpenFaq] = useState(null)
  const [contact, setContact] = useState({ fname:'', lname:'', email:'', profile:'', message:'' })
  const [aff, setAff] = useState({ income:'', rate:'', years:'', down:'' })
  const [affResult, setAffResult] = useState(null)
  const [sending, setSending] = useState(false)
  const [search, setSearch] = useState('')

  const faqs = lang === 'fr' ? FAQS_FR : FAQS_EN

  useEffect(() => {
    const timer = setInterval(() => setSlide(s => (s+1) % SLIDES.length), 10000)
    return () => clearInterval(timer)
  }, [])

  async function handleContact(e) {
    e.preventDefault(); setSending(true)
    await supabase.from('contact_messages').insert({
      first_name:contact.fname, last_name:contact.lname,
      email:contact.email, profile:contact.profile, message:contact.message,
    })
    setSending(false)
    toast(`${lang==='fr'?'Merci':'Thanks'} ${contact.fname}!`)
    setContact({ fname:'', lname:'', email:'', profile:'', message:'' })
  }

  function calcAff() {
    const i=parseFloat(aff.income), r=parseFloat(aff.rate), y=parseInt(aff.years), d=parseFloat(aff.down)||0
    if (!i||!r||!y) { toast(lang==='fr'?'Remplissez tous les champs.':'Fill in all fields.','error'); return }
    const mb=i*0.35, mr=(r/100)/12, m=y*12
    const loan=mb*((Math.pow(1+mr,m)-1)/(mr*Math.pow(1+mr,m)))
    const fmt=n=>n.toLocaleString('fr-TN',{maximumFractionDigits:0})+' TND'
    setAffResult({ monthly:fmt(mb), loan:fmt(loan), price:fmt(loan+d) })
  }

  const splashCards = [
    {
      to:'/sell', num:'01',
      img:'/tn2.webp',
      loc:'',
      tag:lang==='fr'?'Vente':'Sell',
      title:lang==='fr'?'Vendre':'Sell',
      desc:lang==='fr'
        ?'Cédez votre bien immédiatement via notre réseau REIT coté en bourse.'
        :'Offload your property immediately via our exchange-listed REIT network.',
      cta:lang==='fr'?'Mettre en vente →':'List a Property →',
    },
    {
      to:'/rent', num:'02',
      img:'/tn5.webp',
      loc:'',
      tag:lang==='fr'?'Location':'Rent',
      title:lang==='fr'?'Louer':'Rent',
      desc:lang==='fr'
        ?'Des centaines de logements vérifiés partout en Tunisie.'
        :'Hundreds of verified homes across Tunisia.',
      cta:lang==='fr'?'Trouver un logement →':'Find a Home →',
    },
    {
      to:'/invest', num:'03',
      img:'/tn4.jpg',
      loc:'',
      tag:lang==='fr'?'Investissement':'Invest',
      title:lang==='fr'?'Investir':'Invest',
      desc:lang==='fr'
        ?'Parts REIT cotées sur la TSE. Dividendes trimestriels. Invest-to-Own.'
        :'REIT shares on the TSE. Quarterly dividends. Invest-to-Own.',
      cta:lang==='fr'?'Explorer les REITs →':'Explore REITs →',
    },
  ]

  return (
    <>
      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-slides">
          {SLIDES.map((s,i) => (
            <div key={i} className={`hero-slide ${i===slide?'active':''}`}
              style={{ backgroundImage:`url(${s.url})` }} />
          ))}
        </div>
        <div className="hero-overlay" />

        <div className="hero-content">
          <div>
            <div className="hero-eyebrow">{t.hero_tag}</div>
            <h1>
              {t.hero_h1_1}<br/>
              <span>{t.hero_h1_2}</span>
            </h1>
            <p className="hero-sub">{t.hero_sub}</p>

            <div className="hero-search-bar">
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key==='Enter' && navigate(`/buy${search?`?search=${search}`:''}`)}
                placeholder={t.hero_search}
              />
              <button onClick={() => navigate(`/buy${search?`?search=${search}`:''}`)}>
                {t.hero_search_btn}
              </button>
            </div>

            <div className="hero-btns">
              <Link to="/invest" className="btn-accent">{t.hero_cta1}</Link>
              <Link to="/rent" className="btn-outline" style={{ borderColor:'rgba(255,255,255,.15)', color:'rgba(255,255,255,.6)' }}>
                {t.hero_cta2}
              </Link>
            </div>
          </div>

          {/* Live ticker */}
          <div className="hero-ticker">
            {[
              { label:'Tunis Résidentiel', val:'120 TND', chg:'+7.2%' },
              { label:'Sfax Commercial',   val:'250 TND', chg:'+9.5%' },
              { label:'Sousse Luxury',     val:'500 TND', chg:'+13.1%' },
              { label:'Bizerte Mixed',     val:'80 TND',  chg:'+6.8%' },
            ].map(item => (
              <div key={item.label} className="hero-ticker-item">
                <div>
                  <div className="hero-ticker-label">{item.label}</div>
                  <div className="hero-ticker-val">{item.val}</div>
                </div>
                <div className="hero-ticker-chg">{item.chg}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-meta">
          <div className="hero-dots">
            {SLIDES.map((_,i) => (
              <button key={i} className={`hero-dot ${i===slide?'active':''}`} onClick={() => setSlide(i)} />
            ))}
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="marquee-strip">
        <div className="marquee-track">
          {[...MARQUEE,...MARQUEE].map((item,i) => (
            <div key={i} className="marquee-item">
              <span>◆</span>{item}
            </div>
          ))}
        </div>
      </div>

      {/* ── SPLASH CARDS ── */}
      <section className="splash-section" id="services">
        <div className="container">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:40, flexWrap:'wrap', gap:16 }}>
            <div>
              <div className="label">{t.services_label}</div>
              <h2 style={{ fontSize:'clamp(1.8rem,3.5vw,2.8rem)', fontWeight:800 }}>
                {t.services_h2_1}<br/>{t.services_h2_2}
              </h2>
            </div>
            <div style={{ display:'flex', gap:16, color:'var(--text3)', fontSize:'.82rem' }}>
              <span>🏠 {lang==='fr'?'Vente':'Buy/Sell'}</span>
              <span>🔑 {lang==='fr'?'Location':'Rent'}</span>
              <span>📈 {lang==='fr'?'Investissement':'Invest'}</span>
            </div>
          </div>

          <div className="splash-cards">
            {splashCards.map(card => (
              <Link to={card.to} key={card.num} className="splash-card">
                <img src={card.img} alt={card.title}
                  onError={e => e.target.src='https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80'} />
                <div className="splash-card-overlay">
                  <div className="splash-card-tag">{card.tag}</div>
                  <div className="splash-card-num">{card.num}</div>
                  <h3>{card.title}</h3>
                  <p>{card.desc}</p>
                  <span className="splash-card-cta">{card.cta}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ROW ── */}
      <section style={{ borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)', background:'var(--bg2)' }}>
        <div className="container" style={{ padding:'48px 32px' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:0 }}>
            {[
              { n:'1M+', l:lang==='fr'?'Propriétés disponibles':'Properties available' },
              { n:'+75%', l:lang==='fr'?'Hausse des prix depuis 2012':'Price rise since 2012' },
              { n:'6', l:lang==='fr'?'REITs actifs':'Active REITs' },
              { n:'TSE', l:lang==='fr'?'Coté en bourse':'Exchange listed' },
              { n:'0', l:lang==='fr'?'Plateforme similaire en Tunisie':'Similar platform in Tunisia' },
            ].map((s,i,arr) => (
              <div key={s.l} style={{
                textAlign:'center', padding:'20px 16px',
                borderRight: i < arr.length-1 ? '1px solid var(--border)' : 'none',
              }}>
                <div style={{ fontSize:'2rem', fontWeight:900, color:'var(--accent)', fontFamily:'var(--mono)' }}>{s.n}</div>
                <div style={{ fontSize:'.72rem', color:'var(--text3)', marginTop:6, textTransform:'uppercase', letterSpacing:'.08em' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section" id="faq" style={{ background:'var(--bg2)' }}>
        <div className="container">
          <div className="label">FAQ</div>
          <h2 style={{ fontSize:'clamp(1.6rem,3vw,2.4rem)', fontWeight:800, marginBottom:48 }}>
            {t.faq_title}
          </h2>
          <div className="faq-list">
            {faqs.map(([q,a],i) => (
              <div className="faq-item" key={i}>
                <button className="faq-q" onClick={() => setOpenFaq(openFaq===i?null:i)}>
                  {q}
                  <span style={{ color:'var(--text3)', flexShrink:0 }}>{openFaq===i?'−':'+'}</span>
                </button>
                {openFaq===i && <div className="faq-a"><p>{a}</p></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section className="section" id="contact">
        <div className="container">
          <div className="contact-wrap">
            <div>
              <div className="label">{t.contact_label}</div>
              <h2>{t.contact_h2}</h2>
              <p style={{ color:'var(--text2)', margin:'14px 0 28px', lineHeight:1.8, fontSize:'.92rem' }}>
                {t.contact_sub}
              </p>
              <div className="contact-detail">
                {[
                  ['Email','hello@estateex.tn'],
                  [lang==='fr'?'Téléphone':'Phone','+216 XX XXX XXX'],
                  [lang==='fr'?'Localisation':'Location','Tunis, Tunisie'],
                ].map(([k,v]) => (
                  <div className="contact-detail-item" key={k}>
                    <strong>{k}</strong><span>{v}</span>
                  </div>
                ))}
              </div>
              <div className="social-links">
                {['LinkedIn','Instagram','Facebook'].map(s => (
                  <a key={s} href="#" className="social-link">{s}</a>
                ))}
              </div>
            </div>
            <form onSubmit={handleContact}>
              <div className="form-row">
                <div className="form-group">
                  <label>{t.contact_first}</label>
                  <input required value={contact.fname} onChange={e => setContact(p=>({...p,fname:e.target.value}))} placeholder="Foulen" />
                </div>
                <div className="form-group">
                  <label>{t.contact_last}</label>
                  <input required value={contact.lname} onChange={e => setContact(p=>({...p,lname:e.target.value}))} placeholder="BenFoulen" />
                </div>
              </div>
              <div className="form-group">
                <label>{t.contact_email}</label>
                <input type="email" required value={contact.email} onChange={e => setContact(p=>({...p,email:e.target.value}))} />
              </div>
              <div className="form-group">
                <label>{t.contact_profile}</label>
                <select value={contact.profile} onChange={e => setContact(p=>({...p,profile:e.target.value}))}>
                  <option value="">{t.contact_select}</option>
                  {(lang==='fr'
                    ? ['Promoteur Immobilier','Investisseur Particulier','Tunisien Non-Résident','Investisseur Étranger','Futur Locataire','Autre']
                    : ['Property Developer','Individual Investor','Non-Resident Tunisian','Foreign Investor','Prospective Renter','Other']
                  ).map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>{t.contact_message}</label>
                <textarea rows={4} required value={contact.message} onChange={e => setContact(p=>({...p,message:e.target.value}))} />
              </div>
              <button className="btn-accent" type="submit" disabled={sending} style={{ width:'100%', justifyContent:'center' }}>
                {sending ? t.contact_sending : t.contact_send}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ── AFFORDABILITY ── */}
      <section style={{ borderTop:'1px solid var(--border)', background:'var(--bg2)' }}>
        <div className="container" style={{ padding:'80px 32px' }}>
          <div className="label">{t.aff_label}</div>
          <h2 style={{ fontSize:'clamp(1.6rem,3vw,2.2rem)', fontWeight:800, marginBottom:40 }}>{t.aff_h2}</h2>
          <div className="simulator-wrap">
            <div className="sim-card">
              <h3>{lang==='fr'?'Vos données':'Your data'}</h3>
              <div className="form-row">
                <div className="form-group"><label>{t.aff_income}</label><input type="number" value={aff.income} onChange={e=>setAff(p=>({...p,income:e.target.value}))} placeholder="3 500" /></div>
                <div className="form-group"><label>{t.aff_rate}</label><input type="number" step=".1" value={aff.rate} onChange={e=>setAff(p=>({...p,rate:e.target.value}))} placeholder="8.2" /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>{t.aff_years}</label><input type="number" value={aff.years} onChange={e=>setAff(p=>({...p,years:e.target.value}))} placeholder="20" /></div>
                <div className="form-group"><label>{t.aff_down}</label><input type="number" value={aff.down} onChange={e=>setAff(p=>({...p,down:e.target.value}))} placeholder="25 000" /></div>
              </div>
              <button className="btn-accent" onClick={calcAff} style={{ width:'100%', justifyContent:'center' }}>{t.aff_calc}</button>
            </div>
            <div className="sim-card">
              <h3>{t.aff_results}</h3>
              {affResult ? <>
                <div className="result-row"><span>{t.aff_monthly}</span><strong>{affResult.monthly}</strong></div>
                <div className="result-row"><span>{t.aff_loan}</span><strong>{affResult.loan}</strong></div>
                <div className="result-row"><span>{t.aff_price}</span><strong>{affResult.price}</strong></div>
                <p style={{ color:'var(--text3)', fontSize:'.75rem', marginTop:16, lineHeight:1.7 }}>{t.aff_note}</p>
              </> : (
                <p style={{ color:'var(--text3)', fontSize:'.88rem' }}>{t.aff_placeholder}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}

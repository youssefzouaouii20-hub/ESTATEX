import { useState, useEffect } from 'react'
import { useToast } from '../contexts/ToastContext'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import Footer from '../components/Footer'

const VENTE_FILES = [
  { name: 'La Marsa',   file: '/data/vente_lamarsa.csv' },
  { name: 'La Manouba', file: '/data/vente_lamanouba.csv' },
  { name: 'Nabeul',     file: '/data/vente_nabeul.csv' },
  { name: 'Sfax',       file: '/data/vente_sfax.csv' },
  { name: 'Sousse',     file: '/data/vente_sousse.csv' },
]

const FALLBACKS = [
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80',
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80',
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&q=80',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80',
]

function parseCSV(text, cityName) {
  const rows = []
  const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n')

  function parseLine(line) {
    const fields = []
    let cur = '', inQ = false
    for (let i = 0; i < line.length; i++) {
      const ch = line[i]
      if (ch === '"') { if (inQ && line[i+1] === '"') { cur += '"'; i++ } else inQ = !inQ }
      else if (ch === ',' && !inQ) { fields.push(cur.trim()); cur = '' }
      else { cur += ch }
    }
    fields.push(cur.trim())
    return fields
  }

  const lines = normalized.split('\n')
  if (lines.length < 2) return rows
  const headers = parseLine(lines[0]).map(h => h.toLowerCase().trim())
  const idx = k => headers.indexOf(k)
  const iP=idx('price'), iT=idx('title'), iL=idx('location'), iD=idx('details'), iF=idx('features')
  const iDesc = idx('descriptions') !== -1 ? idx('descriptions') : idx('description')
  const iImg = idx('image')

  for (let li = 1; li < lines.length; li++) {
    const line = lines[li].trim()
    if (!line) continue
    const cols = parseLine(line)
    const title = iT >= 0 ? (cols[iT] || '').trim() : ''
    if (!title) continue

    const rawPrice = iP >= 0 ? (cols[iP] || '').trim() : ''
    const priceNum = parseFloat(rawPrice.replace(/[^0-9.]/g,'')) || 0
    const image = iImg >= 0 && iImg < cols.length ? cols[iImg].trim() : ''
    const details = iD >= 0 && iD < cols.length ? cols[iD] : ''
    const features = iF >= 0 && iF < cols.length ? cols[iF] : ''
    const desc = iDesc >= 0 && iDesc < cols.length ? cols[iDesc] : ''
    const location = (iL >= 0 && iL < cols.length ? cols[iL] : '') || cityName

    const surfM = details.match(/(\d+)\s*m²/)
    const surface = surfM ? parseInt(surfM[1]) : 0
    const bedM = details.match(/(\d+)\s*Chambre/i)
    const beds = bedM ? parseInt(bedM[1]) : 0
    const bathM = details.match(/(\d+)\s*Salle/i)
    const baths = bathM ? parseInt(bathM[1]) : 0

    const tl = title.toLowerCase()
    let type = 'Appartement'
    if (tl.includes('villa')) type = 'Villa'
    else if (tl.includes('maison')) type = 'Maison'
    else if (tl.includes('studio')) type = 'Studio'
    else if (tl.includes('duplex')) type = 'Duplex'
    else if (tl.includes('penthouse')) type = 'Penthouse'
    else if (tl.includes('terrain')) type = 'Terrain'
    else if (tl.includes('bureau')) type = 'Bureau'

    rows.push({ title, rawPrice, priceNum, location, city: cityName, details, features, desc, image, surface, beds, baths, type })
  }
  return rows
}

function getTags(features) {
  if (!features) return []
  const m = features.match(/'([^']+)'/g)
  return m ? m.map(s => s.replace(/'/g,'')).slice(0,4) : []
}

function getPaginationRange(current, total) {
  if (total <= 7) return Array.from({length:total},(_,i)=>i+1)
  if (current <= 4) return [1,2,3,4,5,'...',total]
  if (current >= total-3) return [1,'...',total-4,total-3,total-2,total-1,total]
  return [1,'...',current-1,current,current+1,'...',total]
}

const PER_PAGE = 12

// Mubawab blocks all external access — use Unsplash with property-aware search terms
const PROPERTY_IMAGES = {
  'Villa': ['https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&q=80', 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80'],
  'Appartement': ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80', 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80', 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=600&q=80'],
  'Maison': ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80', 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=600&q=80'],
  'Studio': ['https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&q=80', 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=600&q=80', 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=600&q=80'],
  'Duplex': ['https://images.unsplash.com/photo-1560185008-b033106af5c3?w=600&q=80', 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=600&q=80', 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80'],
  'Penthouse': ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80', 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&q=80', 'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=600&q=80'],
  'Terrain': ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80'],
  'Bureau': ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80', 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600&q=80', 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=600&q=80'],
  'Commerce': ['https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80'],
}

function proxyImg(url, fallback, type, seed) {
  const pool = PROPERTY_IMAGES[type] || PROPERTY_IMAGES['Appartement']
  const i = (typeof seed === 'number' && !isNaN(seed)) ? seed % pool.length : 0
  return pool[i] || pool[0]
}

function PropertyCard({ listing, fallback, onOffer, onDetail, idx }) {
  const imgSrc = proxyImg(listing.image, fallback, listing.type, idx)

  return (
    <div
      onClick={onDetail}
      style={{
        background:'var(--bg3)', border:'1px solid var(--glass-border)',
        borderRadius:'var(--radius)', overflow:'hidden',
        display:'flex', flexDirection:'column', cursor:'pointer',
        transition:'transform .22s, box-shadow .22s, border-color .22s',
        isolation:'isolate',
      }}
      onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow='0 8px 40px rgba(0,0,0,.4)';e.currentTarget.style.borderColor='var(--border2)'}}
      onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='';e.currentTarget.style.borderColor='var(--border)'}}
    >
      <div style={{position:'relative',aspectRatio:'4/3',overflow:'hidden',background:'#111',display:'block',lineHeight:0}}>
        <img
          src={imgSrc}
          alt={listing.title}
          onError={e=>{ e.target.onerror=null; e.target.src=fallback }}
          style={{width:'100%',height:'100%',objectFit:'cover',transition:'transform .5s'}}
          onMouseEnter={e=>e.target.style.transform='scale(1.05)'}
          onMouseLeave={e=>e.target.style.transform=''}
        />
        <span style={{position:'absolute',top:12,left:12,background:'rgba(0,0,0,.72)',backdropFilter:'blur(6px)',color:'#fff',fontSize:'.72rem',fontWeight:700,padding:'4px 10px',borderRadius:999}}>{listing.type}</span>
        <span style={{position:'absolute',top:12,right:12,background:'rgba(45,186,135,.85)',color:'#fff',fontSize:'.7rem',fontWeight:700,padding:'4px 10px',borderRadius:999}}>{listing.city}</span>
      </div>

      <div style={{padding:'16px 18px',flex:1,display:'flex',flexDirection:'column'}}>
        <h3 style={{fontSize:'.95rem',fontWeight:700,marginBottom:6,lineHeight:1.35,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>
          {listing.title}
        </h3>
        <p style={{fontSize:'.82rem',color:'var(--text2)',marginBottom:8}}>📍 {listing.location}</p>

        {(listing.surface>0||listing.beds>0||listing.baths>0) && (
          <div style={{display:'flex',gap:12,marginBottom:8,fontSize:'.8rem',color:'var(--text3)'}}>
            {listing.surface>0 && <span>📐 {listing.surface} m²</span>}
            {listing.beds>0 && <span>🛏 {listing.beds} ch.</span>}
            {listing.baths>0 && <span>🚿 {listing.baths} sdb</span>}
          </div>
        )}

        {getTags(listing.features).length>0 && (
          <div style={{display:'flex',gap:5,flexWrap:'wrap',marginBottom:10}}>
            {getTags(listing.features).map(t=>(
              <span key={t} style={{background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:999,padding:'2px 8px',fontSize:'.68rem',color:'var(--text3)'}}>{t}</span>
            ))}
          </div>
        )}

        <div style={{marginTop:'auto'}}>
          <div style={{fontSize:'1.1rem',fontWeight:800,color:'var(--accent)',marginBottom:10}}>
            {listing.rawPrice || 'Prix à consulter'}
          </div>
          <button
            className="btn-primary"
            style={{width:'100%',justifyContent:'center',fontSize:'.85rem',padding:'9px 16px'}}
            onClick={e=>{e.stopPropagation();onOffer()}}
          >
            Faire une offre
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Buy() {
  const { user, profile } = useAuth()
  const toast = useToast()
  const [all, setAll] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({city:'',type:'',minPrice:'',maxPrice:'',search:''})
  const [selected, setSelected] = useState(null)
  const [detailOpen, setDetailOpen] = useState(null)
  const [offerForm, setOfferForm] = useState({full_name:'',email:'',phone:'',offer_amount:'',message:''})
  const [submitting, setSubmitting] = useState(false)

  useEffect(()=>{
    if(profile) setOfferForm(p=>({...p,full_name:profile.full_name||'',email:profile.email||'',phone:profile.phone||''}))
  },[profile])

  useEffect(()=>{ loadAll() },[])

  async function loadAll() {
    setLoading(true)
    const results = await Promise.all(VENTE_FILES.map(async f => {
      try { const r=await fetch(f.file); if(!r.ok) return []; return parseCSV(await r.text(), f.name) }
      catch { return [] }
    }))
    setAll(results.flat().filter(l=>l.title))
    setLoading(false)
  }

  const setF = (k,v) => { setFilters(p=>({...p,[k]:v})); setPage(1) }

  const filtered = all.filter(l => {
    if(filters.city && l.city!==filters.city) return false
    if(filters.type && l.type!==filters.type) return false
    if(filters.minPrice && l.priceNum>0 && l.priceNum<parseFloat(filters.minPrice)) return false
    if(filters.maxPrice && l.priceNum>parseFloat(filters.maxPrice)) return false
    if(filters.search){const s=filters.search.toLowerCase();if(!l.title.toLowerCase().includes(s)&&!l.location.toLowerCase().includes(s))return false}
    return true
  })

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE)

  async function handleOffer(e) {
    e.preventDefault()
    setSubmitting(true)
    await supabase.from('buy_offers').insert({
      user_id:user?.id||null, property_title:selected.title, property_location:selected.location,
      property_price:selected.priceNum||null, offer_amount:parseFloat(offerForm.offer_amount),
      full_name:offerForm.full_name, email:offerForm.email, phone:offerForm.phone||null, message:offerForm.message||null,
    }).catch(()=>{})
    setSubmitting(false)
    toast(`✅ Offre soumise pour "${selected.title}" ! Notre équipe vous contactera sous 48h.`)
    setSelected(null)
  }

  return (
    <>
      <section style={{background:'var(--bg2)',padding:'60px 24px 40px'}}>
        <div className="container">
          <div className="section-label">Marché Immobilier</div>
          <h1 style={{fontSize:'clamp(2rem,5vw,3rem)',fontWeight:800,marginBottom:12}}>Acheter une Propriété</h1>
          <p style={{color:'var(--text2)',maxWidth:600}}>
            Parcourez <strong style={{color:'var(--text)'}}>{all.length}</strong> annonces réelles issues de Mubawab.
            {loading && ' (Chargement...)'}
          </p>
        </div>
      </section>

      <section style={{padding:'24px 24px 0'}}>
        <div className="container">
          <div className="filters-bar">
            <div className="filter-group" style={{flex:2,minWidth:180}}>
              <label>Recherche</label>
              <input value={filters.search} onChange={e=>setF('search',e.target.value)} placeholder="Titre ou localisation..." />
            </div>
            <div className="filter-group">
              <label>Ville</label>
              <select value={filters.city} onChange={e=>setF('city',e.target.value)}>
                <option value="">Toutes</option>
                {VENTE_FILES.map(f=><option key={f.name} value={f.name}>{f.name}</option>)}
              </select>
            </div>
            <div className="filter-group">
              <label>Type</label>
              <select value={filters.type} onChange={e=>setF('type',e.target.value)}>
                <option value="">Tous</option>
                {['Appartement','Villa','Maison','Studio','Duplex','Penthouse','Terrain','Bureau'].map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="filter-group">
              <label>Prix min (TND)</label>
              <input type="number" value={filters.minPrice} onChange={e=>setF('minPrice',e.target.value)} placeholder="0" />
            </div>
            <div className="filter-group">
              <label>Prix max (TND)</label>
              <input type="number" value={filters.maxPrice} onChange={e=>setF('maxPrice',e.target.value)} placeholder="Illimité" />
            </div>
            <button className="btn-ghost" onClick={()=>{setFilters({city:'',type:'',minPrice:'',maxPrice:'',search:''});setPage(1)}}>Réinitialiser</button>
          </div>
        </div>
      </section>

      <section className="section" style={{paddingTop:24}}>
        <div className="container">
          <p style={{color:'var(--text2)',marginBottom:24}}>
            <strong style={{color:'var(--text)'}}>{filtered.length}</strong> propriétés trouvées
          </p>

          {loading ? <div className="spinner" /> : (
            <>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:24}}>
                {paginated.map((listing,i)=>(
                  <PropertyCard
                    key={`${listing.city}-${i}-${page}`}
                    listing={listing}
                    fallback={FALLBACKS[i%FALLBACKS.length]}
                    idx={(page-1)*PER_PAGE + i}
                    onOffer={()=>{ setSelected(listing); setOfferForm(p=>({...p,offer_amount:listing.priceNum?Math.round(listing.priceNum*0.95):''})) }}
                    onDetail={()=>setDetailOpen(listing)}
                  />
                ))}
              </div>

              {filtered.length===0 && (
                <div className="empty-state">
                  <p style={{fontSize:'1.1rem'}}>Aucune propriété ne correspond à vos critères.</p>
                  <button className="btn-outline" style={{marginTop:16}} onClick={()=>{setFilters({city:'',type:'',minPrice:'',maxPrice:'',search:''});setPage(1)}}>Effacer les filtres</button>
                </div>
              )}

              {totalPages>1 && (
                <div className="pagination">
                  <button className="page-btn" onClick={()=>{setPage(p=>Math.max(1,p-1));window.scrollTo({top:0,behavior:'smooth'})}} disabled={page===1}>‹</button>
                  {getPaginationRange(page,totalPages).map((p,i)=>
                    p==='...' ? <span key={`d${i}`} style={{padding:'0 4px',color:'var(--text3)'}}>…</span> :
                    <button key={p} className={`page-btn ${page===p?'active':''}`} onClick={()=>{setPage(p);window.scrollTo({top:0,behavior:'smooth'})}}>{p}</button>
                  )}
                  <button className="page-btn" onClick={()=>{setPage(p=>Math.min(totalPages,p+1));window.scrollTo({top:0,behavior:'smooth'})}} disabled={page===totalPages}>›</button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* DETAIL MODAL */}
      {detailOpen && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setDetailOpen(null)}>
          <div className="modal" style={{maxWidth:640,position:'relative'}}>
            <button className="modal-close" onClick={()=>setDetailOpen(null)}>×</button>
            <div style={{borderRadius:'var(--radius2)',overflow:'hidden',marginBottom:20,aspectRatio:'16/9'}}>
              <img src={proxyImg(detailOpen.image, FALLBACKS[0], detailOpen.type, 99)} alt={detailOpen.title}
                onError={e=>e.target.src=FALLBACKS[0]} style={{width:'100%',height:'100%',objectFit:'cover'}} />
            </div>
            <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:12}}>
              <span className="badge badge-approved">{detailOpen.type}</span>
              <span className="badge" style={{background:'var(--bg3)',color:'var(--text2)',border:'1px solid var(--border)'}}>📍 {detailOpen.location}</span>
              <span className="badge" style={{background:'rgba(45,186,135,.15)',color:'var(--accent)',border:'1px solid rgba(45,186,135,.3)'}}>{detailOpen.city}</span>
            </div>
            <h2 style={{fontSize:'1.3rem',fontWeight:800,marginBottom:8}}>{detailOpen.title}</h2>
            <div style={{fontSize:'1.4rem',fontWeight:800,color:'var(--accent)',marginBottom:16}}>{detailOpen.rawPrice||'Prix à consulter'}</div>
            {(detailOpen.surface>0||detailOpen.beds>0||detailOpen.baths>0) && (
              <div style={{display:'flex',gap:20,marginBottom:16,flexWrap:'wrap'}}>
                {detailOpen.surface>0 && <span style={{color:'var(--text2)',fontSize:'.9rem'}}>📐 {detailOpen.surface} m²</span>}
                {detailOpen.beds>0 && <span style={{color:'var(--text2)',fontSize:'.9rem'}}>🛏 {detailOpen.beds} chambres</span>}
                {detailOpen.baths>0 && <span style={{color:'var(--text2)',fontSize:'.9rem'}}>🚿 {detailOpen.baths} SDB</span>}
              </div>
            )}
            {detailOpen.desc && <p style={{color:'var(--text2)',fontSize:'.9rem',lineHeight:1.7,marginBottom:16,maxHeight:140,overflow:'hidden'}}>{detailOpen.desc.slice(0,500)}{detailOpen.desc.length>500?'...':''}</p>}
            {getTags(detailOpen.features).length>0 && (
              <div style={{display:'flex',flexWrap:'wrap',gap:6,marginBottom:20}}>
                {getTags(detailOpen.features).map(t=>(
                  <span key={t} style={{background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:999,padding:'3px 10px',fontSize:'.78rem',color:'var(--text2)'}}>{t}</span>
                ))}
              </div>
            )}
            <button className="btn-primary" style={{width:'100%',justifyContent:'center'}}
              onClick={()=>{setDetailOpen(null);setSelected(detailOpen);setOfferForm(p=>({...p,offer_amount:detailOpen.priceNum?Math.round(detailOpen.priceNum*0.95):''})) }}>
              Faire une offre
            </button>
          </div>
        </div>
      )}

      {/* OFFER MODAL */}
      {selected && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setSelected(null)}>
          <div className="modal" style={{position:'relative'}}>
            <button className="modal-close" onClick={()=>setSelected(null)}>×</button>
            <h2>Faire une Offre</h2>
            <p style={{color:'var(--text2)',marginBottom:4}}>{selected.title}</p>
            <p style={{color:'var(--text3)',fontSize:'.85rem',marginBottom:4}}>📍 {selected.location}</p>
            {selected.rawPrice && <p style={{color:'var(--accent)',fontWeight:700,marginBottom:20}}>Prix affiché: {selected.rawPrice}</p>}
            <form onSubmit={handleOffer}>
              <div className="form-group"><label>Nom complet *</label><input required value={offerForm.full_name} onChange={e=>setOfferForm(p=>({...p,full_name:e.target.value}))} /></div>
              <div className="form-row">
                <div className="form-group"><label>Email *</label><input type="email" required value={offerForm.email} onChange={e=>setOfferForm(p=>({...p,email:e.target.value}))} /></div>
                <div className="form-group"><label>Téléphone</label><input value={offerForm.phone} onChange={e=>setOfferForm(p=>({...p,phone:e.target.value}))} placeholder="+216 XX XXX XXX" /></div>
              </div>
              <div className="form-group"><label>Montant de l'offre (TND) *</label><input type="number" required value={offerForm.offer_amount} onChange={e=>setOfferForm(p=>({...p,offer_amount:e.target.value}))} /></div>
              <div className="form-group"><label>Message (optionnel)</label><textarea rows={3} value={offerForm.message} onChange={e=>setOfferForm(p=>({...p,message:e.target.value}))} /></div>
              <button className="btn-primary" type="submit" disabled={submitting} style={{width:'100%',justifyContent:'center'}}>
                {submitting?'Envoi...':'Soumettre l\'offre'}
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}

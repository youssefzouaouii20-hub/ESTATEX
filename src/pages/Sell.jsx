import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import Footer from '../components/Footer'

const PROPERTY_TYPES = ['Apartment','Villa','House','Studio','Duplex','Penthouse','Commercial','Land','Other']

export default function Sell() {
  const { user, profile } = useAuth()
  const toast = useToast()
  const [form, setForm] = useState({
    full_name: profile?.full_name || '',
    id_type: 'cin',
    id_number: '',
    listing_mode: 'one',
    property_type: '',
    address: '',
    surface_area: '',
    asking_price: '',
    num_properties: '1',
  })
  const [submitting, setSubmitting] = useState(false)

  const set = (k, v) => setForm(p => ({...p, [k]: v}))

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.full_name || !form.id_number || !form.address) {
      toast('Please fill in all required fields.', 'error'); return
    }
    setSubmitting(true)
    const { error } = await supabase.from('listings').insert({
      user_id: user?.id || null,
      full_name: form.full_name,
      id_type: form.id_type,
      id_number: form.id_number,
      property_type: form.listing_mode === 'one' ? form.property_type : 'multiple',
      address: form.address,
      surface_area: form.surface_area ? parseFloat(form.surface_area) : null,
      asking_price: form.asking_price ? parseFloat(form.asking_price) : null,
      listing_mode: form.listing_mode,
      num_properties: form.listing_mode === 'multi' ? parseInt(form.num_properties) : 1,
      status: 'pending',
    })
    setSubmitting(false)
    if (error) { toast('Something went wrong. Please try again.', 'error'); return }
    toast('Your listing has been submitted! Our team will review it within 48 hours.')
    setForm({ full_name:'', id_type:'cin', id_number:'', listing_mode:'one', property_type:'', address:'', surface_area:'', asking_price:'', num_properties:'1' })
  }

  return (
    <>
      {/* HERO */}
      <section style={{ background:'var(--bg2)', padding:'60px 24px 40px' }}>
        <div className="container">
          <div className="section-label">List Your Property</div>
          <h1 style={{ fontSize:'clamp(2rem,5vw,3rem)', fontWeight:800, marginBottom:12 }}>Sell or Securitize</h1>
          <p style={{ color:'var(--text2)', maxWidth:600 }}>Offload your property fast. We package it into a REIT — no waiting for individual buyers. Our team handles everything.</p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section">
        <div className="container">
          <h2>How It Works</h2>
          <p className="section-sub">Three simple steps to turn your property into a tradeable asset.</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:20, marginBottom:60 }}>
            {[
              { num:'01', title:'Submit Your Listing', desc:'Fill in your property details below. We verify ownership and condition.' },
              { num:'02', title:'We Securitize', desc:'Our partner investment banks create a REIT prospectus for your property.' },
              { num:'03', title:'Get Paid', desc:'Your property enters the market as REIT shares and you receive payment.' },
            ].map(s => (
              <div key={s.num} className="card" style={{ padding:28 }}>
                <div style={{ fontSize:'2.5rem', fontWeight:800, color:'var(--accent)', opacity:.4, marginBottom:12 }}>{s.num}</div>
                <h3 style={{ fontSize:'1.05rem', fontWeight:700, marginBottom:8 }}>{s.title}</h3>
                <p style={{ color:'var(--text2)', fontSize:'.9rem' }}>{s.desc}</p>
              </div>
            ))}
          </div>

          {/* FORM */}
          <div style={{ maxWidth:680, margin:'0 auto' }}>
            <div className="card" style={{ padding:36 }}>
              <h2 style={{ marginBottom:4 }}>Submit Your Property</h2>
              <p style={{ color:'var(--text2)', marginBottom:28, fontSize:'.9rem' }}>All submissions are reviewed within 48 hours.</p>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Full Legal Name *</label>
                  <input required value={form.full_name} onChange={e => set('full_name', e.target.value)} placeholder="As it appears on your ID" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>ID Type *</label>
                    <select value={form.id_type} onChange={e => set('id_type', e.target.value)}>
                      <option value="cin">CIN (National ID)</option>
                      <option value="passport">Passport</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>ID Number *</label>
                    <input required value={form.id_number} onChange={e => set('id_number', e.target.value)} placeholder="e.g. 12345678" />
                  </div>
                </div>

                <div className="form-group">
                  <label>Listing Mode</label>
                  <div style={{ display:'flex', gap:12 }}>
                    {[['one','Single Property'],['multi','Multiple Properties']].map(([v,l]) => (
                      <label key={v} style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', flex:1, background:'var(--bg3)', padding:'10px 14px', borderRadius:'var(--radius2)', border:`1.5px solid ${form.listing_mode===v?'var(--accent)':'var(--border)'}`, transition:'border-color .2s' }}>
                        <input type="radio" value={v} checked={form.listing_mode===v} onChange={e => set('listing_mode', e.target.value)} style={{ accentColor:'var(--accent)' }} />
                        {l}
                      </label>
                    ))}
                  </div>
                </div>

                {form.listing_mode === 'one' ? (
                  <div className="form-group">
                    <label>Property Type *</label>
                    <select required value={form.property_type} onChange={e => set('property_type', e.target.value)}>
                      <option value="">Select type...</option>
                      {PROPERTY_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                ) : (
                  <div className="form-group">
                    <label>Number of Properties</label>
                    <input type="number" min="2" value={form.num_properties} onChange={e => set('num_properties', e.target.value)} />
                  </div>
                )}

                <div className="form-group">
                  <label>Property Address *</label>
                  <textarea required rows={2} value={form.address} onChange={e => set('address', e.target.value)} placeholder="Full address including city and postal code" />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Surface Area (m²)</label>
                    <input type="number" value={form.surface_area} onChange={e => set('surface_area', e.target.value)} placeholder="e.g. 120" />
                  </div>
                  <div className="form-group">
                    <label>Asking Price (TND)</label>
                    <input type="number" value={form.asking_price} onChange={e => set('asking_price', e.target.value)} placeholder="e.g. 500000" />
                  </div>
                </div>

                <button className="btn-primary" type="submit" disabled={submitting} style={{ width:'100%', justifyContent:'center', marginTop:8 }}>
                  {submitting ? 'Submitting...' : 'Submit Listing for Review'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}

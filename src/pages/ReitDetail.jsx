import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import Footer from '../components/Footer'

export default function ReitDetail() {
  const { id } = useParams()
  const { user, profile, fetchProfile } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [reit, setReit] = useState(null)
  const [shares, setShares] = useState(1)
  const [loading, setLoading] = useState(true)
  const [buying, setBuying] = useState(false)

  useEffect(() => {
    supabase.from('reits').select('*').eq('id', id).single().then(({ data }) => {
      setReit(data)
      setLoading(false)
    })
  }, [id])

  if (loading) return <div className="spinner" />
  if (!reit) return <div style={{ padding:40, textAlign:'center' }}><p>REIT not found. <Link to="/invest">Go back</Link></p></div>

  const total = shares * reit.share_price
  const typeLabels = { residential:'Residential', commercial:'Commercial', mixed:'Mixed Use', luxury:'Luxury', industrial:'Industrial', student:'Student Housing' }

  // Simulated price history
  const basePrice = reit.share_price
  const rate = reit.annual_return / 100
  const priceHistory = Array.from({length:13}, (_,i) => {
    const monthFraction = (12-i) / 12
    const noise = (Math.sin(i*2.5)*0.03) + (Math.cos(i*1.7)*0.02)
    return Math.round((basePrice / Math.pow(1+rate, monthFraction) + noise*basePrice) * 100)/100
  })

  async function handleBuy() {
    if (!user) { toast('Please log in to buy shares.', 'error'); navigate('/login'); return }
    if (shares < 1) { toast('Please enter at least 1 share.', 'error'); return }
    const cash = profile?.cash_holdings || 0
    if (total > cash) {
      toast(`Insufficient funds. Need ${total.toFixed(2)} TND but have ${cash.toFixed(2)} TND.`, 'error')
      return
    }
    setBuying(true)
    try {
      // Deduct cash
      const { error: cashErr } = await supabase.from('users')
        .update({ cash_holdings: cash - total })
        .eq('id', user.id)
      if (cashErr) throw cashErr

      // Update or insert portfolio
      const { data: existing } = await supabase.from('portfolio')
        .select('*').eq('user_id', user.id).eq('reit_id', id).eq('status', 'active').single()

      if (existing) {
        const newShares = existing.shares_owned + shares
        const newAvg = ((existing.shares_owned * existing.buy_price) + total) / newShares
        await supabase.from('portfolio').update({ shares_owned: newShares, buy_price: newAvg }).eq('id', existing.id)
      } else {
        await supabase.from('portfolio').insert({ user_id: user.id, reit_id: id, shares_owned: shares, buy_price: reit.share_price, status: 'active' })
      }

      // Log transaction
      await supabase.from('transactions').insert({ user_id: user.id, reit_id: parseInt(id), type: 'buy', shares, amount: total })
      await supabase.from('share_orders').insert({ user_id: user.id, reit_id: parseInt(id), shares, price_each: reit.share_price, total, status: 'completed' })

      await fetchProfile(user.id)
      toast(`✅ You bought ${shares} share${shares>1?'s':''} of ${reit.name} for ${total.toFixed(2)} TND!`)
    } catch (err) {
      toast('Transaction failed. Please try again.', 'error')
      console.error(err)
    } finally {
      setBuying(false)
    }
  }

  return (
    <>
      <section style={{ padding: '40px 0', background: 'var(--bg2)' }}>
        <div className="container">
          <Link to="/invest" style={{ color:'var(--text2)', fontSize:'.9rem', marginBottom:20, display:'inline-block' }}>← Back to REITs</Link>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 380px', gap:32, alignItems:'start' }}>
            <div>
              <div style={{ borderRadius:'var(--radius)', overflow:'hidden', marginBottom:24 }}>
                <img src={reit.image_url} alt={reit.name} style={{ width:'100%', aspectRatio:'16/9', objectFit:'cover' }}
                  onError={e => e.target.src='https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80'} />
              </div>

              <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap' }}>
                <span className={`badge badge-${reit.risk_level}`}>{reit.risk_level} risk</span>
                <span className="badge" style={{ background:'var(--bg3)', color:'var(--text2)', border:'1px solid var(--border)' }}>{typeLabels[reit.type]||reit.type}</span>
                <span className="badge" style={{ background:'var(--bg3)', color:'var(--text2)', border:'1px solid var(--border)' }}>📍 {reit.location}</span>
              </div>

              <h1 style={{ fontSize:'2rem', fontWeight:800, marginBottom:12 }}>{reit.name}</h1>
              <p style={{ color:'var(--text2)', lineHeight:1.7, marginBottom:24 }}>{reit.description}</p>

              {/* Price chart (visual only) */}
              <div className="card" style={{ padding:24, marginBottom:24 }}>
                <h3 style={{ marginBottom:16 }}>Price History (12 months)</h3>
                <div style={{ display:'flex', alignItems:'flex-end', gap:4, height:80 }}>
                  {priceHistory.map((p,i) => {
                    const max = Math.max(...priceHistory), min = Math.min(...priceHistory)
                    const h = max === min ? 50 : Math.round(((p-min)/(max-min))*70) + 10
                    return <div key={i} style={{ flex:1, height:h+'%', background: i===priceHistory.length-1?'var(--accent)':'var(--border2)', borderRadius:2, transition:'height .3s', title:p+' TND' }} title={p+' TND'} />
                  })}
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', marginTop:8, fontSize:'.75rem', color:'var(--text3)' }}>
                  <span>12m ago</span><span>Now</span>
                </div>
              </div>
            </div>

            {/* BUY PANEL */}
            <div>
              <div className="card" style={{ padding:24, position:'sticky', top:84 }}>
                <h3 style={{ marginBottom:4 }}>Buy Shares</h3>
                <p style={{ color:'var(--text2)', fontSize:'.85rem', marginBottom:20 }}>Current price: <strong style={{ color:'var(--accent)' }}>{reit.share_price} TND</strong> / share</p>

                <div style={{ display:'flex', gap:12, marginBottom:20, textAlign:'center' }}>
                  {[{l:'Annual Return',v:reit.annual_return+'%'},{l:'Risk',v:reit.risk_level},{l:'Location',v:reit.location}].map(s => (
                    <div key={s.l} style={{ flex:1, background:'var(--bg3)', borderRadius:'var(--radius2)', padding:'12px 8px' }}>
                      <div style={{ fontSize:'1rem', fontWeight:800, color:'var(--accent)' }}>{s.v}</div>
                      <div style={{ fontSize:'.72rem', color:'var(--text3)', marginTop:2 }}>{s.l}</div>
                    </div>
                  ))}
                </div>

                <div className="form-group">
                  <label>Number of Shares</label>
                  <input type="number" min="1" value={shares} onChange={e => setShares(Math.max(1, parseInt(e.target.value)||1))} />
                </div>

                <div style={{ background:'var(--bg3)', borderRadius:'var(--radius2)', padding:14, marginBottom:20 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                    <span style={{ color:'var(--text2)', fontSize:'.85rem' }}>Price per share</span>
                    <span>{reit.share_price} TND</span>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                    <span style={{ color:'var(--text2)', fontSize:'.85rem' }}>Shares</span>
                    <span>×{shares}</span>
                  </div>
                  <div style={{ height:1, background:'var(--border)', margin:'10px 0' }} />
                  <div style={{ display:'flex', justifyContent:'space-between', fontWeight:800 }}>
                    <span>Total</span>
                    <span style={{ color:'var(--accent)', fontSize:'1.1rem' }}>{total.toFixed(2)} TND</span>
                  </div>
                </div>

                {profile && (
                  <p style={{ fontSize:'.8rem', color:'var(--text2)', marginBottom:14 }}>
                    Your balance: <strong style={{ color:'var(--accent)' }}>{profile.cash_holdings?.toFixed(2)} TND</strong>
                  </p>
                )}

                {user ? (
                  <button className="btn-primary" onClick={handleBuy} disabled={buying} style={{ width:'100%', justifyContent:'center' }}>
                    {buying ? 'Processing...' : `Buy ${shares} Share${shares>1?'s':''}`}
                  </button>
                ) : (
                  <Link to="/login" className="btn-primary" style={{ width:'100%', justifyContent:'center', display:'flex' }}>
                    Login to Buy
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}

import { useState, useRef, useEffect } from 'react'

const CHIPS = [
  { label: 'Comment fonctionnent les REITs ?', q: 'Comment fonctionnent les REITs sur EstateEx ?' },
  { label: 'REITs disponibles', q: 'Quels REITs sont disponibles et quels rendements offrent-ils ?' },
  { label: 'Invest-to-Own', q: 'Comment fonctionne le programme Invest-to-Own ?' },
  { label: 'Louer une maison', q: 'Comment louer une propriété sur EstateEx ?' },
  { label: 'Vendre ma propriété', q: 'Comment vendre ma propriété sur EstateEx ?' },
]

const SYSTEM_PROMPT = `Tu es l'assistant IA d'EstateEx, la première bourse immobilière de Tunisie.
EstateEx permet d'investir dans l'immobilier tunisien via des parts de REITs cotées en bourse (TSE).
Services: Acheter des propriétés, Vendre, Louer, Investir dans des REITs.
REITs disponibles: Tunis Résidentiel (7.2%/an, faible risque), Sfax Commercial (9.5%/an, risque moyen), Sousse Luxury (13.1%/an, risque élevé), Bizerte Mixed (6.8%/an, faible risque), Grand Tunis Industrial (8.4%/an, risque moyen), Sousse Student (6.2%/an, faible risque).
Programme Invest-to-Own: accumule des parts REIT et convertis-les en titre de propriété.
Réponds toujours en français, de manière concise et professionnelle. Maximum 3 phrases courtes par réponse.`

export default function AiChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Bonjour ! Je suis votre assistant **EstateEx**. Comment puis-je vous aider aujourd'hui ?" }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showChips, setShowChips] = useState(true)
  const [badge, setBadge] = useState(1)
  const msgsRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight
  }, [messages, loading])

  useEffect(() => {
    if (open) { setBadge(0); setTimeout(() => inputRef.current?.focus(), 300) }
  }, [open])

  async function sendMessage(text) {
    const msg = text || input.trim()
    if (!msg || loading) return
    setInput('')
    setShowChips(false)
    setMessages(prev => [...prev, { role: 'user', text: msg }])
    setLoading(true)

    try {
      const history = messages
        .filter(m => m.role !== 'bot' || messages.indexOf(m) > 0)
        .map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text }))

      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...history,
            { role: 'user', content: msg },
          ],
          max_tokens: 300,
          temperature: 0.7,
        }),
      })

      if (!res.ok) throw new Error(`API error ${res.status}`)
      const data = await res.json()
      const reply = data.choices?.[0]?.message?.content || "Désolé, je n'ai pas pu traiter votre demande."
      setMessages(prev => [...prev, { role: 'bot', text: reply }])
    } catch (err) {
      console.error('Grok API error:', err)
      setMessages(prev => [...prev, {
        role: 'bot',
        text: "Désolé, le service IA est temporairement indisponible. Veuillez réessayer dans un moment ou contactez-nous via le formulaire de contact."
      }])
    } finally {
      setLoading(false)
    }
  }

  function formatText(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
  }

  return (
    <>
      {/* Chat Window */}
      <div className={`chat-window ${open ? 'open' : ''}`}>
        <div className="chat-header">
          <div className="chat-header-avatar">AI</div>
          <div className="chat-header-info">
            <div className="chat-header-name">EstateEx AI</div>
            <div className="chat-header-status">En ligne · Groq AI</div>
          </div>
          <button className="chat-close" onClick={() => setOpen(false)}>×</button>
        </div>

        <div className="chat-msgs" ref={msgsRef}>
          {messages.map((m, i) => (
            <div key={i} className={`chat-msg ${m.role}`}>
              {m.role === 'bot' && (
                <div className="chat-msg-avatar">AI</div>
              )}
              <div
                className="chat-bubble"
                dangerouslySetInnerHTML={{ __html: formatText(m.text) }}
              />
            </div>
          ))}

          {loading && (
            <div className="chat-msg bot">
              <div className="chat-msg-avatar">AI</div>
              <div className="chat-bubble">
                <div className="chat-typing">
                  <span/><span/><span/>
                </div>
              </div>
            </div>
          )}
        </div>

        {showChips && (
          <div className="chat-chips">
            {CHIPS.map(c => (
              <button key={c.label} className="chat-chip" onClick={() => sendMessage(c.q)}>
                {c.label}
              </button>
            ))}
          </div>
        )}

        <div className="chat-input-row">
          <input
            ref={inputRef}
            className="chat-input"
            placeholder="Posez votre question..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            disabled={loading}
          />
          <button className="chat-send" onClick={() => sendMessage()} disabled={loading || !input.trim()}>
            ➤
          </button>
        </div>
      </div>

      {/* FAB */}
      <button className="chat-fab" onClick={() => setOpen(o => !o)}>
        {open ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 2H4C2.9 2 2 2.9 2 4v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
        </svg>
      )}
        {!open && badge > 0 && <span className="chat-badge">{badge}</span>}
        {!open && <span className="chat-pulse" />}
      </button>
    </>
  )
}

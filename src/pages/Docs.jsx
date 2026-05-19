import { useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'

const SECTIONS = [
  { id: 'overview',      label: '01 — Overview' },
  { id: 'problem',       label: '02 — Problem Statement' },
  { id: 'architecture',  label: '03 — Architecture' },
  { id: 'stack',         label: '04 — Tech Stack' },
  { id: 'database',      label: '05 — Database Schema' },
  { id: 'reit',          label: '06 — REIT Model' },
  { id: 'auth',          label: '07 — Authentication' },
  { id: 'api',           label: '08 — API & Integrations' },
  { id: 'deployment',    label: '09 — Deployment' },
  { id: 'future',        label: '10 — Future Work' },
]

function Section({ id, title, children }) {
  return (
    <section id={id} style={{ marginBottom: 72, scrollMarginTop: 80 }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
        {title}
      </h2>
      {children}
    </section>
  )
}

function CodeBlock({ code, lang = 'sql' }) {
  const [copied, setCopied] = useState(false)
  return (
    <div style={{ position: 'relative', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius2)', marginTop: 16, marginBottom: 16, overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 16px', borderBottom: '1px solid var(--border)', background: 'var(--bg4)' }}>
        <span style={{ fontSize: '.68rem', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.1em' }}>{lang}</span>
        <button onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
          style={{ background: 'none', border: 'none', color: copied ? 'var(--accent)' : 'var(--text3)', fontSize: '.75rem', cursor: 'pointer', fontFamily: 'var(--font)' }}>
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <pre style={{ padding: '16px 20px', fontSize: '.82rem', lineHeight: 1.7, overflowX: 'auto', color: 'var(--text2)', margin: 0, fontFamily: 'monospace' }}>
        {code}
      </pre>
    </div>
  )
}

function InfoBox({ type = 'info', children }) {
  const colors = {
    info:    { bg: 'rgba(62,207,142,.08)',  border: 'rgba(62,207,142,.2)',  color: 'var(--accent)',  icon: 'ℹ' },
    warn:    { bg: 'rgba(240,160,48,.08)',  border: 'rgba(240,160,48,.2)',  color: 'var(--warn)',    icon: '⚠' },
    tip:     { bg: 'rgba(167,139,250,.08)', border: 'rgba(167,139,250,.2)', color: '#a78bfa',        icon: '💡' },
  }
  const c = colors[type]
  return (
    <div style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 'var(--radius2)', padding: '14px 18px', margin: '16px 0', fontSize: '.88rem', lineHeight: 1.7, color: 'var(--text2)' }}>
      <span style={{ color: c.color, marginRight: 8, fontWeight: 700 }}>{c.icon}</span>
      {children}
    </div>
  )
}

function TableRow({ cells }) {
  return (
    <tr>
      {cells.map((cell, i) => (
        <td key={i} style={{ padding: '11px 14px', borderBottom: '1px solid var(--border)', fontSize: '.85rem', color: i === 0 ? 'var(--text)' : 'var(--text2)', fontWeight: i === 0 ? 600 : 400, fontFamily: i === 0 ? 'monospace' : 'inherit' }}>
          {cell}
        </td>
      ))}
    </tr>
  )
}

export default function Docs() {
  const [activeSection, setActiveSection] = useState('overview')

  const scrollTo = (id) => {
    setActiveSection(id)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {/* Header */}
      <section style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)', padding: '48px 0 36px' }}>
        <div className="container">
          <div className="label">Documentation Technique</div>
          <h1 style={{ fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 800, marginBottom: 12 }}>
            EstateEx — Documentation
          </h1>
          <p style={{ color: 'var(--text2)', maxWidth: 640, lineHeight: 1.75 }}>
            Documentation technique complète du projet EstateEx — Première Bourse Immobilière de Tunisie.
            Réalisé dans le cadre du Projet de Fin d'Année (PFA).
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
            <span style={{ background: 'var(--accent-dim)', border: '1px solid rgba(62,207,142,.2)', borderRadius: 999, padding: '4px 14px', fontSize: '.75rem', fontWeight: 700, color: 'var(--accent)' }}>React 18</span>
            <span style={{ background: 'var(--accent-dim)', border: '1px solid rgba(62,207,142,.2)', borderRadius: 999, padding: '4px 14px', fontSize: '.75rem', fontWeight: 700, color: 'var(--accent)' }}>Supabase</span>
            <span style={{ background: 'var(--accent-dim)', border: '1px solid rgba(62,207,142,.2)', borderRadius: 999, padding: '4px 14px', fontSize: '.75rem', fontWeight: 700, color: 'var(--accent)' }}>Vite</span>
            <span style={{ background: 'var(--accent-dim)', border: '1px solid rgba(62,207,142,.2)', borderRadius: 999, padding: '4px 14px', fontSize: '.75rem', fontWeight: 700, color: 'var(--accent)' }}>Groq AI</span>
            <span style={{ background: 'var(--accent-dim)', border: '1px solid rgba(62,207,142,.2)', borderRadius: 999, padding: '4px 14px', fontSize: '.75rem', fontWeight: 700, color: 'var(--accent)' }}>Vercel</span>
          </div>
        </div>
      </section>

      <section style={{ padding: '48px 0 80px' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 40 }}>

            {/* Sidebar nav */}
            <aside style={{ position: 'sticky', top: 80, height: 'fit-content' }}>
              <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '8px 0', overflow: 'hidden' }}>
                <div style={{ padding: '10px 16px 8px', fontSize: '.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.12em', color: 'var(--text3)' }}>
                  Contents
                </div>
                {SECTIONS.map(s => (
                  <button key={s.id} onClick={() => scrollTo(s.id)}
                    style={{
                      width: '100%', textAlign: 'left', padding: '9px 16px',
                      background: activeSection === s.id ? 'var(--accent-dim)' : 'transparent',
                      border: 'none', borderLeft: `2px solid ${activeSection === s.id ? 'var(--accent)' : 'transparent'}`,
                      color: activeSection === s.id ? 'var(--accent)' : 'var(--text2)',
                      fontSize: '.8rem', fontWeight: activeSection === s.id ? 700 : 400,
                      cursor: 'pointer', fontFamily: 'var(--font)', transition: 'all .15s',
                    }}>
                    {s.label}
                  </button>
                ))}
              </div>
            </aside>

            {/* Content */}
            <div style={{ minWidth: 0 }}>

              {/* 01 OVERVIEW */}
              <Section id="overview" title="01 — Présentation du Projet">
                <p style={{ color: 'var(--text2)', lineHeight: 1.8, marginBottom: 16 }}>
                  <strong style={{ color: 'var(--text)' }}>EstateEx</strong> est une plateforme web full-stack qui transforme le marché immobilier tunisien en créant un système de bourse immobilière. Le projet permet à des investisseurs d'acheter des parts de <strong style={{ color: 'var(--accent)' }}>REITs (Real Estate Investment Trusts)</strong> cotées sur la Bourse de Tunis (TSE), rendant l'investissement immobilier accessible à tous les budgets.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14, margin: '24px 0' }}>
                  {[
                    { icon: '🏠', title: 'Acheter / Vendre', desc: 'Marketplace de propriétés avec données réelles issues de Mubawab' },
                    { icon: '🔑', title: 'Location', desc: '8 villes tunisiennes, 774+ annonces de location' },
                    { icon: '📈', title: 'Investissement REIT', desc: '6 REITs cotés, simulateur de rendements, achat de parts' },
                    { icon: '🤖', title: 'IA Intégrée', desc: 'Assistant Groq (LLaMA 3.1) pour accompagner les utilisateurs' },
                  ].map(f => (
                    <div key={f.title} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius2)', padding: 18 }}>
                      <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>{f.icon}</div>
                      <div style={{ fontWeight: 700, fontSize: '.9rem', marginBottom: 6 }}>{f.title}</div>
                      <div style={{ fontSize: '.82rem', color: 'var(--text2)' }}>{f.desc}</div>
                    </div>
                  ))}
                </div>
              </Section>

              {/* 02 PROBLEM */}
              <Section id="problem" title="02 — Problématique">
                <p style={{ color: 'var(--text2)', lineHeight: 1.8, marginBottom: 14 }}>
                  Le marché immobilier tunisien souffre de plusieurs dysfonctionnements structurels qui freinent l'accès à la propriété et l'investissement :
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    { n: '01', t: '1 Million de Propriétés Vacantes', d: 'Des biens immobiliers restent inexploités faute de mécanismes de liquidité et de marchés organisés.' },
                    { n: '02', t: '+75% de Hausse des Prix depuis 2012', d: 'L\'inflation immobilière a exclu les jeunes et les classes moyennes de l\'accès à la propriété.' },
                    { n: '03', t: 'Absence de Liquidité', d: 'Pas de marché secondaire standardisé. Les vendeurs attendent des mois ou des années pour trouver un acheteur.' },
                    { n: '04', t: 'Barrière Capitalistique Élevée', d: 'Acheter même un studio nécessite des sommes à 6 chiffres — inaccessible sans patrimoine familial.' },
                  ].map(p => (
                    <div key={p.n} style={{ display: 'flex', gap: 16, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius2)', padding: 18 }}>
                      <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'rgba(62,207,142,.2)', flexShrink: 0, fontFamily: 'monospace', lineHeight: 1 }}>{p.n}</div>
                      <div>
                        <div style={{ fontWeight: 700, marginBottom: 4 }}>{p.t}</div>
                        <div style={{ fontSize: '.85rem', color: 'var(--text2)', lineHeight: 1.6 }}>{p.d}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <InfoBox type="tip">
                  La solution EstateEx : <strong>sécuriser les propriétés en REITs cotés en bourse</strong>, permettant à chacun d'investir à partir de quelques dizaines de dinars et d'accumuler des parts jusqu'à devenir propriétaire (<em>Invest-to-Own</em>).
                </InfoBox>
              </Section>

              {/* 03 ARCHITECTURE */}
              <Section id="architecture" title="03 — Architecture Technique">
                <p style={{ color: 'var(--text2)', lineHeight: 1.8, marginBottom: 20 }}>
                  EstateEx suit une architecture <strong style={{ color: 'var(--text)' }}>JAMstack</strong> (JavaScript, APIs, Markup) avec un frontend React découplé d'un backend serverless Supabase.
                </p>
                <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius2)', padding: 24, fontFamily: 'monospace', fontSize: '.82rem', lineHeight: 2, color: 'var(--text2)' }}>
                  <div style={{ color: 'var(--accent)', marginBottom: 4 }}>┌─ Frontend (Vercel CDN) ────────────────────────────┐</div>
                  <div>│  React 18 + Vite + React Router v6                │</div>
                  <div>│  CSS Custom Properties — Outfit font               │</div>
                  <div>│  Context API (Auth, Toast, Lang)                   │</div>
                  <div style={{ color: 'var(--accent)', margin: '4px 0' }}>├─ Backend (Supabase) ───────────────────────────────┤</div>
                  <div>│  PostgreSQL Database (10 tables)                   │</div>
                  <div>│  Supabase Auth (email/password + JWT)              │</div>
                  <div>│  Row Level Security (RLS) — per-user policies      │</div>
                  <div>│  Supabase JS Client v2                             │</div>
                  <div style={{ color: 'var(--accent)', margin: '4px 0' }}>├─ AI Layer (Groq Cloud) ────────────────────────────┤</div>
                  <div>│  LLaMA 3.1 8B Instant — chat completions           │</div>
                  <div>│  Context-aware: knows all REITs & platform info    │</div>
                  <div style={{ color: 'var(--accent)', margin: '4px 0' }}>└─ Data Sources ─────────────────────────────────────┘</div>
                  <div>   CSV scraping from Mubawab (696 sale + 774 rental)</div>
                </div>
                <InfoBox type="info">
                  L'architecture JAMstack garantit des performances optimales — le frontend est pré-compilé et servi depuis un CDN global Vercel, sans serveur à maintenir.
                </InfoBox>
              </Section>

              {/* 04 TECH STACK */}
              <Section id="stack" title="04 — Stack Technologique">
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: 'var(--bg3)' }}>
                        {['Couche', 'Technologie', 'Version', 'Rôle'].map(h => (
                          <th key={h} style={{ textAlign: 'left', padding: '10px 14px', fontSize: '.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--text3)', borderBottom: '1px solid var(--border)' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['Frontend',   'React',           '18.x',     'UI framework — composants, routing, state'],
                        ['Bundler',    'Vite',            '5.x',      'Build tool ultra-rapide, HMR, optimisation'],
                        ['Routing',    'React Router',    'v6',       'SPA routing, routes protégées, navigation'],
                        ['Backend',    'Supabase',        'v2',       'BaaS — PostgreSQL + Auth + RLS + REST API'],
                        ['Auth',       'Supabase Auth',   'v2',       'JWT, sessions, email/password, magic link'],
                        ['AI',         'Groq + LLaMA',   '3.1-8b',   'Chatbot contextuel — réponses < 1 seconde'],
                        ['Hosting',    'Vercel',          'latest',   'CDN global, CI/CD automatique depuis GitHub'],
                        ['Fonts',      'Outfit',          'v2',       'Google Fonts — lisibilité et modernité'],
                        ['Data',       'CSV / Mubawab',  '—',        '1470+ annonces immobilières tunisiennes réelles'],
                      ].map((row, i) => <TableRow key={i} cells={row} />)}
                    </tbody>
                  </table>
                </div>
              </Section>

              {/* 05 DATABASE */}
              <Section id="database" title="05 — Schéma de Base de Données">
                <p style={{ color: 'var(--text2)', lineHeight: 1.8, marginBottom: 16 }}>
                  La base de données PostgreSQL hébergée sur Supabase contient <strong style={{ color: 'var(--text)' }}>10 tables</strong> avec Row Level Security (RLS) activé sur toutes.
                </p>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: 'var(--bg3)' }}>
                        {['Table', 'Description', 'Colonnes clés'].map(h => (
                          <th key={h} style={{ textAlign: 'left', padding: '10px 14px', fontSize: '.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--text3)', borderBottom: '1px solid var(--border)' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['users',              'Profils utilisateurs (étend auth.users)',       'id, full_name, profile_type, cash_holdings'],
                        ['reits',              'REITs disponibles à l\'investissement',          'name, type, share_price, annual_return, risk_level'],
                        ['portfolio',          'Parts REIT détenues par les utilisateurs',       'user_id, reit_id, shares_owned, buy_price, status'],
                        ['transactions',       'Historique achats/ventes/dividendes',           'user_id, reit_id, type, shares, amount'],
                        ['share_orders',       'Ordres de bourse passés',                       'user_id, reit_id, shares, price_each, total'],
                        ['listings',           'Propriétés soumises à la vente',               'user_id, address, property_type, asking_price, status'],
                        ['buy_offers',         'Offres d\'achat sur les annonces CSV',          'property_title, offer_amount, full_name, email'],
                        ['rent_applications',  'Candidatures de location',                      'user_id, property_title, full_name, status'],
                        ['rental_properties',  'Propriétés disponibles à la location (DB)',     'title, city, type, price, available'],
                        ['contact_messages',   'Messages du formulaire de contact',             'first_name, last_name, email, message'],
                      ].map((row, i) => <TableRow key={i} cells={row} />)}
                    </tbody>
                  </table>
                </div>
                <CodeBlock lang="sql" code={`-- Exemple de politique RLS — portfolio
CREATE POLICY "Portfolio own" ON public.portfolio
  FOR ALL USING (auth.uid() = user_id);

-- Lecture publique des REITs
CREATE POLICY "REITs public read" ON public.reits
  FOR SELECT USING (true);`} />
              </Section>

              {/* 06 REIT MODEL */}
              <Section id="reit" title="06 — Modèle REIT & Invest-to-Own">
                <p style={{ color: 'var(--text2)', lineHeight: 1.8, marginBottom: 16 }}>
                  Le cœur métier d'EstateEx repose sur la <strong style={{ color: 'var(--text)' }}>titrisation immobilière</strong> : transformer des biens physiques en instruments financiers négociables.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                  {[
                    { step: '1', title: 'Soumission', desc: 'Le propriétaire soumet son bien via le formulaire "Vendre". Notre équipe vérifie la propriété légale.' },
                    { step: '2', title: 'Titrisation', desc: 'Une banque d\'investissement partenaire crée un prospectus REIT et émet des parts en TND.' },
                    { step: '3', title: 'Cotation TSE', desc: 'Les parts sont cotées sur la Bourse de Tunis (TSE) et deviennent négociables comme des actions.' },
                    { step: '4', title: 'Invest-to-Own', desc: 'Un investisseur accumule des parts. Quand il en détient assez, il peut les convertir en titre de propriété.' },
                  ].map(s => (
                    <div key={s.step} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.82rem', fontWeight: 800, flexShrink: 0 }}>{s.step}</div>
                      <div>
                        <div style={{ fontWeight: 700, marginBottom: 3 }}>{s.title}</div>
                        <div style={{ fontSize: '.88rem', color: 'var(--text2)', lineHeight: 1.6 }}>{s.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <InfoBox type="tip">
                  Le simulateur d'investissement calcule les rendements avec ou sans réinvestissement des dividendes (intérêts composés). Formule : <code style={{ background: 'var(--bg4)', padding: '1px 6px', borderRadius: 4, fontSize: '.82rem' }}>V = P × (1 + r)ⁿ</code>
                </InfoBox>
              </Section>

              {/* 07 AUTH */}
              <Section id="auth" title="07 — Authentification & Sécurité">
                <p style={{ color: 'var(--text2)', lineHeight: 1.8, marginBottom: 16 }}>
                  L'authentification est gérée entièrement par <strong style={{ color: 'var(--text)' }}>Supabase Auth</strong>, basé sur des JWT (JSON Web Tokens) avec refresh automatique.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                  {[
                    { icon: '🔐', title: 'JWT Tokens', desc: 'Sessions sécurisées avec access token (1h) + refresh token (7 jours). Auto-refresh transparent.' },
                    { icon: '🛡', title: 'Row Level Security', desc: 'Chaque utilisateur ne voit que ses propres données. Les REITs sont publics, le reste est protégé.' },
                    { icon: '📧', title: 'Email Verification', desc: 'Confirmation email obligatoire à l\'inscription. Réinitialisation de mot de passe par email.' },
                    { icon: '👤', title: 'Profils Étendus', desc: 'La table users étend auth.users avec des métadonnées métier : type, cash, bio, téléphone.' },
                  ].map(f => (
                    <div key={f.title} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius2)', padding: 16 }}>
                      <div style={{ fontSize: '1.2rem', marginBottom: 6 }}>{f.icon}</div>
                      <div style={{ fontWeight: 700, fontSize: '.88rem', marginBottom: 4 }}>{f.title}</div>
                      <div style={{ fontSize: '.8rem', color: 'var(--text2)', lineHeight: 1.6 }}>{f.desc}</div>
                    </div>
                  ))}
                </div>
                <CodeBlock lang="javascript" code={`// Inscription avec création de profil
const { data } = await supabase.auth.signUp({ email, password })
await supabase.from('users').insert({
  id: data.user.id,
  full_name: fullName,
  profile_type: 'investor',
  cash_holdings: 5000.00,  // Solde initial de démonstration
})`} />
              </Section>

              {/* 08 API */}
              <Section id="api" title="08 — API & Intégrations Externes">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div>
                    <h3 style={{ fontWeight: 700, marginBottom: 8, fontSize: '1rem' }}>Supabase REST API</h3>
                    <p style={{ color: 'var(--text2)', fontSize: '.88rem', lineHeight: 1.7, marginBottom: 10 }}>
                      Toutes les opérations CRUD passent par le client Supabase JS v2 qui génère automatiquement des requêtes REST vers PostgreSQL.
                    </p>
                    <CodeBlock lang="javascript" code={`// Achat de parts REIT
const { error } = await supabase
  .from('users')
  .update({ cash_holdings: newBalance })
  .eq('id', user.id)

await supabase.from('portfolio').upsert({
  user_id: user.id, reit_id: id,
  shares_owned: totalShares, buy_price: avgPrice
})`} />
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 700, marginBottom: 8, fontSize: '1rem' }}>Groq AI API</h3>
                    <p style={{ color: 'var(--text2)', fontSize: '.88rem', lineHeight: 1.7, marginBottom: 10 }}>
                      Le chatbot utilise le modèle <strong style={{ color: 'var(--text)' }}>LLaMA 3.1 8B Instant</strong> via l'API Groq. Le system prompt est contextualisé avec tous les REITs et services EstateEx.
                    </p>
                    <CodeBlock lang="javascript" code={`const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
  method: 'POST',
  headers: { 'Authorization': \`Bearer \${GROQ_KEY}\` },
  body: JSON.stringify({
    model: 'llama-3.1-8b-instant',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory,
      { role: 'user', content: userMessage }
    ],
    max_tokens: 300,
  })
})`} />
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 700, marginBottom: 8, fontSize: '1rem' }}>Données CSV — Mubawab</h3>
                    <p style={{ color: 'var(--text2)', fontSize: '.88rem', lineHeight: 1.7 }}>
                      Les pages Buy et Rent utilisent des fichiers CSV parsés côté client, contenant des annonces réelles extraites de Mubawab.tn. Chaque fichier est servi depuis le CDN Vercel comme asset statique.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 10, marginTop: 12 }}>
                      {[
                        { f: '5 ventes CSV', n: '696 annonces', c: 'La Marsa, Nabeul, Sfax, Sousse, La Manouba' },
                        { f: '8 locations CSV', n: '774 annonces', c: 'Tunis, Ariana, Bizerte, Sfax, Sousse...' },
                      ].map(d => (
                        <div key={d.f} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius2)', padding: 14 }}>
                          <div style={{ fontWeight: 700, fontSize: '.88rem', color: 'var(--accent)', marginBottom: 4 }}>{d.f}</div>
                          <div style={{ fontSize: '.8rem', fontWeight: 700, marginBottom: 3 }}>{d.n}</div>
                          <div style={{ fontSize: '.75rem', color: 'var(--text3)' }}>{d.c}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Section>

              {/* 09 DEPLOYMENT */}
              <Section id="deployment" title="09 — Déploiement">
                <p style={{ color: 'var(--text2)', lineHeight: 1.8, marginBottom: 16 }}>
                  Le projet est déployé en production sur <strong style={{ color: 'var(--text)' }}>Vercel</strong> avec CI/CD automatique depuis GitHub.
                </p>
                <CodeBlock lang="bash" code={`# Variables d'environnement requises sur Vercel
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_GROQ_API_KEY=gsk_xxxxx...

# Build command (auto-détecté par Vercel)
npm run build  # → vite build → /dist

# Routing SPA — vercel.json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }`} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14, marginTop: 20 }}>
                  {[
                    { icon: '⚡', t: 'Build time', v: '~3 secondes' },
                    { icon: '📦', t: 'Bundle size', v: '~544 KB (gzip: 148 KB)' },
                    { icon: '🌍', t: 'CDN', v: 'Vercel Edge Network global' },
                    { icon: '🔄', t: 'CI/CD', v: 'Auto-deploy sur push GitHub' },
                  ].map(s => (
                    <div key={s.t} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius2)', padding: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
                      <span style={{ fontSize: '1.5rem' }}>{s.icon}</span>
                      <div>
                        <div style={{ fontSize: '.72rem', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.08em' }}>{s.t}</div>
                        <div style={{ fontWeight: 700, fontSize: '.88rem' }}>{s.v}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>

              {/* 10 FUTURE */}
              <Section id="future" title="10 — Perspectives & Travaux Futurs">
                <p style={{ color: 'var(--text2)', lineHeight: 1.8, marginBottom: 20 }}>
                  Fonctionnalités envisagées pour les prochaines versions d'EstateEx :
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    { q: 'Q3 2026', t: 'Marché Secondaire', d: 'Trading peer-to-peer de parts REIT entre investisseurs, avec carnet d\'ordres.' },
                    { q: 'Q3 2026', t: 'Alertes de Prix', d: 'Notifications email/push quand un REIT suivi change de prix ou qu\'une annonce correspond à des critères.' },
                    { q: 'Q4 2026', t: 'Interface Arabe', d: 'Version RTL complète en arabe tunisien pour élargir l\'accessibilité.' },
                    { q: 'Q4 2026', t: 'Carte Interactive', d: 'Visualisation des propriétés sur carte Leaflet.js avec filtres géographiques.' },
                    { q: '2027',    t: 'Application Mobile', d: 'App iOS/Android native (React Native) pour gestion de portefeuille en déplacement.' },
                    { q: '2027',    t: 'Intégration TSE Réelle', d: 'Connexion API avec la Bourse de Tunis pour des cotations en temps réel.' },
                  ].map(r => (
                    <div key={r.t} style={{ display: 'flex', gap: 16, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius2)', padding: '14px 18px' }}>
                      <span style={{ background: 'var(--accent-dim)', border: '1px solid rgba(62,207,142,.2)', borderRadius: 999, padding: '2px 10px', fontSize: '.68rem', fontWeight: 800, color: 'var(--accent)', height: 'fit-content', flexShrink: 0, whiteSpace: 'nowrap' }}>{r.q}</span>
                      <div>
                        <div style={{ fontWeight: 700, marginBottom: 3 }}>{r.t}</div>
                        <div style={{ fontSize: '.85rem', color: 'var(--text2)', lineHeight: 1.6 }}>{r.d}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 40, padding: 28, background: 'var(--accent-dim)', border: '1px solid rgba(62,207,142,.2)', borderRadius: 'var(--radius)', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: 12 }}>🎓</div>
                  <h3 style={{ fontWeight: 800, marginBottom: 8 }}>Projet de Fin d'Année</h3>
                  <p style={{ color: 'var(--text2)', fontSize: '.9rem', lineHeight: 1.7, maxWidth: 480, margin: '0 auto 20px' }}>
                    Ce projet a été réalisé dans le cadre du PFA. Il démontre la maîtrise des technologies web modernes, de la conception de bases de données relationnelles, et de l'intégration d'APIs tierces.
                  </p>
                  <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link to="/" className="btn-primary">Voir la Plateforme</Link>
                    <Link to="/pitch" className="btn-outline">Notre Histoire</Link>
                  </div>
                </div>
              </Section>

            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}

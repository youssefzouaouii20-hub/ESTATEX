import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AuthProvider } from './contexts/AuthContext'
import { ToastProvider } from './contexts/ToastContext'
import { LangProvider } from './contexts/LangContext'
import Navbar from './components/Navbar'
import AiChat from './components/AiChat'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import Account from './pages/Account'
import Invest from './pages/Invest'
import ReitDetail from './pages/ReitDetail'
import Buy from './pages/Buy'
import Rent from './pages/Rent'
import Sell from './pages/Sell'
import Features from './pages/Features'
import Pitch from './pages/Pitch'
import NotFound from './pages/NotFound'
import Admin from './pages/Admin'
import Docs from './pages/Docs'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function BackToTop() {
  useEffect(() => {
    const btn = document.getElementById('back-top-btn')
    if (!btn) return
    const onScroll = () => btn.classList.toggle('show', window.scrollY > 300)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <button id="back-top-btn" className="back-top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>↑</button>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <LangProvider>
        <AuthProvider>
          <ToastProvider>
            <ScrollToTop />
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/account" element={<Account />} />
                <Route path="/invest" element={<Invest />} />
                <Route path="/reit/:id" element={<ReitDetail />} />
                <Route path="/buy" element={<Buy />} />
                <Route path="/rent" element={<Rent />} />
                <Route path="/sell" element={<Sell />} />
                <Route path="/features" element={<Features />} />
                <Route path="/pitch" element={<Pitch />} />
                <Route path="/admin" element={<Admin />} />
              <Route path="/docs" element={<Docs />} />
              <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <AiChat />
            <BackToTop />
          </ToastProvider>
        </AuthProvider>
      </LangProvider>
    </BrowserRouter>
  )
}

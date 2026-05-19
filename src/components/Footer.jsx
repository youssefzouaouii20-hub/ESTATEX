import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer>
      <div className="footer-top">
        <div className="footer-brand">
          <img src="/logo.png" alt="EstateEx" onError={e => e.target.style.display='none'} />
          <p>Tunisia's first real estate exchange. Invest in properties through REIT shares listed on the Tunis Stock Exchange.</p>
        </div>

        <div className="footer-col">
          <h4>Platform</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/buy">Buy</Link></li>
            <li><Link to="/sell">Sell</Link></li>
            <li><Link to="/rent">Rent</Link></li>
            <li><Link to="/invest">Invest</Link></li>
            <li><Link to="/features">Features</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Account</h4>
          <ul>
            <li><Link to="/account">My Account</Link></li>
            <li><Link to="/account#portfolio">My Portfolio</Link></li>
            <li><Link to="/account#listings">My Listings</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            <li><Link to="/pitch">About Us</Link></li>
            <li><Link to="/docs">Documentation</Link></li>
            <li><Link to="/admin">Admin</Link></li>
          </ul>
          <div className="footer-social">
            <a href="#" className="social-link">LinkedIn</a>
            <a href="#" className="social-link">Instagram</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} EstateEx. All rights reserved.</p>
        <div style={{ display:'flex', gap:16 }}>
          <a href="#">Terms of Use</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Legal Disclaimer</a>
        </div>
      </div>
    </footer>
  )
}

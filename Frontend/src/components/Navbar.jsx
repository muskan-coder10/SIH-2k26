import { useState } from 'react'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="header">
      <div className="container nav-container">
        <a href="#home" className="brand">
          <img src="/images/anndisha-logo.png" alt="AnnDisha logo" />
        </a>

        <button className="mobile-menu-btn" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? '✕' : '☰'}
        </button>

        <nav className={open ? 'nav-links nav-open' : 'nav-links'}>
          <a href="#home" onClick={() => setOpen(false)}>Home</a>
          <a href="#how-it-works" onClick={() => setOpen(false)}>How It Works</a>
          <a href="#help" onClick={() => setOpen(false)}>Help</a>
          <a href="#contact" onClick={() => setOpen(false)}>Contact Us</a>
        </nav>

        <a className="btn btn-primary nav-login" href="#portals">User Login</a>
      </div>
    </header>
  )
}

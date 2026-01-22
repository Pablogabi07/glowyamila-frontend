import { useState } from 'react'
import '../styles/navbar.css'
import { useDarkMode } from '../context/DarkModeContext'
import logo from '../assets/logosinfondo.png'

export default function Navbar() {
  const { darkMode, setDarkMode } = useDarkMode()
  const [open, setOpen] = useState(false)

  return (
    <nav className="navbar">
      <div className="nav-left">
        <img src={logo} alt="GlowYamila Logo" className="nav-logo logo-animated" />
        <h1 className="logo-text">GlowYamila</h1>
      </div>

      {/* Botón hamburguesa */}
      <div className="hamburger" onClick={() => setOpen(!open)}>
        <span className={open ? 'line open' : 'line'}></span>
        <span className={open ? 'line open' : 'line'}></span>
        <span className={open ? 'line open' : 'line'}></span>
      </div>

      {/* Links */}
      <ul className={`nav-links ${open ? 'open' : ''}`}>
        <li><a href="#about" onClick={() => setOpen(false)}>Quién es</a></li>
        <li><a href="#products" onClick={() => setOpen(false)}>Productos</a></li>




      </ul>
    </nav>
  )
}
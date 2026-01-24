import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import FloatingCart from '../components/FloatingCart'
import CartPopup from '../components/CartPopup'
import WhatsAppButton from '../components/WhatsAppButton'
import Footer from '../components/Footer'
import '../styles/ofertas.css'

export default function Ofertas() {
  const [offers, setOffers] = useState([])

  const API_URL = import.meta.env.VITE_API_URL

  useEffect(() => {
    fetch(`${API_URL}/api/offers`)
      .then(res => res.json())
      .then(data => {
        // 🔥 Fix para imágenes viejas con localhost
        const cleaned = data.map(p => ({
          ...p,
          imageUrl: p.imageUrl
            ? p.imageUrl.replace('http://localhost:4000', '')
            : ''
        }))

        setOffers(cleaned)
      })
  }, [])

  return (
    <>
      <Navbar />

      <section className="ofertas-section">
        <h2 className="ofertas-title">🔥 Ofertas Especiales</h2>

        <div className="ofertas-grid">
          {offers.map(p => (
            <div key={p.id} className="oferta-card">
              <img
                src={`${API_URL}${p.imageUrl}`}
                alt={p.name}
                className="oferta-img"
                onError={(e) => (e.target.src = '/placeholder.jpg')}
              />

              <h3>{p.name}</h3>

              <p className="old-price">${p.price}</p>
              <p className="offer-price">${p.offerPrice}</p>

              <button className="add-btn">
                Agregar al carrito
              </button>
            </div>
          ))}
        </div>
      </section>

      <FloatingCart />
      <CartPopup />
      <WhatsAppButton />
      <Footer />
    </>
  )
}

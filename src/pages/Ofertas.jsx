import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import FloatingCart from '../components/FloatingCart'
import CartPopup from '../components/CartPopup'
import WhatsAppButton from '../components/WhatsAppButton'
import Footer from '../components/Footer'
import '../styles/ofertas.css'

export default function Ofertas() {
  const [offers, setOffers] = useState([])

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/offers`)
      .then(res => res.json())
      .then(data => setOffers(data))
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
                src={`${import.meta.env.VITE_API_URL}${p.imageUrl}`}
                alt={p.name}
                className="oferta-img"
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

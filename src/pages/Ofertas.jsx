import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import FloatingCart from '../components/FloatingCart'
import CartPopup from '../components/CartPopup'
import WhatsAppButton from '../components/WhatsAppButton'
import Footer from '../components/Footer'
import { useCart } from '../context/CartContext'
import '../styles/ofertas.css'

export default function Ofertas() {
  const [offers, setOffers] = useState([])
  const { addToCart } = useCart()

  useEffect(() => {
    fetch("https://kloliqzkdsegsutubzoh.functions.supabase.co/get-products")
      .then(res => res.json())
      .then(data => {
        const filtered = data
          .filter(p => p.is_offer)
          .map(p => ({
            ...p,
            imageUrl: p.image_url,
            isOffer: p.is_offer,
            offerPrice: p.offer_price,
            stock: p.stock
          }))

        setOffers(filtered)
      })
  }, [])

  return (
    <>
      <Navbar />

      <section className="ofertas-section">
        <h2 className="ofertas-title">🔥 Ofertas Especiales</h2>

        <div className="ofertas-grid">
          {offers.map(p => {
            const outOfStock = p.stock <= 0

            return (
              <div key={p.id} className="oferta-card">
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className="oferta-img"
                  onError={(e) => (e.target.src = '/placeholder.jpg')}
                />

                <h3>{p.name}</h3>

                <p className="old-price">${p.price}</p>
                <p className="offer-price">${p.offerPrice}</p>

                <p className={`stock ${outOfStock ? 'no-stock' : ''}`}>
                  {outOfStock ? 'Sin stock' : `Stock: ${p.stock}`}
                </p>

                <button
                  className={`add-btn ${outOfStock ? 'disabled' : ''}`}
                  disabled={outOfStock}
                  onClick={() => addToCart(p)}
                >
                  {outOfStock ? 'No disponible' : 'Agregar al carrito'}
                </button>
              </div>
            )
          })}
        </div>
      </section>

      <FloatingCart />
      <CartPopup />
      <WhatsAppButton />
      <Footer />
    </>
  )
}

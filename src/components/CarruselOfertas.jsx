import { useEffect, useState, useRef } from 'react'
import { useCart } from '../context/CartContext'
import '../styles/carrusel.css'

export default function CarruselOfertas() {
  const [offers, setOffers] = useState([])
  const { addToCart } = useCart()
  const carouselRef = useRef(null)

  // 🔥 Cargar ofertas desde API interna
  useEffect(() => {
    const loadOffers = async () => {
      const res = await fetch("/api/get-offers")
      const data = await res.json()

      if (!res.ok) {
        console.error("Error cargando ofertas:", data.error)
        return
      }

      const normalized = data.map(p => ({
        ...p,
        imageUrl: p.image_url,
        isOffer: p.is_offer,
        offerPrice: p.offer_price,
        stock: p.stock
      }))

      setOffers(normalized)
    }

    loadOffers()
  }, [])

  // ⏩ Auto-scroll
  useEffect(() => {
    if (offers.length === 0) return

    const interval = setInterval(() => {
      if (carouselRef.current) {
        carouselRef.current.scrollBy({
          left: 250,
          behavior: 'smooth'
        })
      }
    }, 3500)

    return () => clearInterval(interval)
  }, [offers])

  const scrollLeft = () => {
    carouselRef.current.scrollBy({ left: -250, behavior: 'smooth' })
  }

  const scrollRight = () => {
    carouselRef.current.scrollBy({ left: 250, behavior: 'smooth' })
  }

  if (offers.length === 0) return null

  return (
    <div className="carrusel-container">
      <h2 className="carrusel-title">🔥 Ofertas especiales</h2>

      <div className="carrusel-wrapper">
        <button className="arrow left" onClick={scrollLeft}>‹</button>

        <div className="carrusel" ref={carouselRef}>
          {offers.map(p => {
            const outOfStock = p.stock <= 0

            return (
              <div key={p.id} className="carrusel-item">
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className="carrusel-img"
                  onError={(e) => (e.target.src = '/placeholder.jpg')}
                />

                <h3>{p.name}</h3>

                <p className="old-price">${p.price}</p>
                <p className="offer-price">${p.offerPrice}</p>

                <p className={`stock ${outOfStock ? 'no-stock' : ''}`}>
                  {outOfStock ? 'Sin stock' : `Stock: ${p.stock}`}
                </p>

                <button
                  className="add-btn"
                  disabled={outOfStock}
                  onClick={() => addToCart(p)}
                >
                  {outOfStock ? 'No disponible' : '🛒 Agregar'}
                </button>
              </div>
            )
          })}
        </div>

        <button className="arrow right" onClick={scrollRight}>›</button>
      </div>
    </div>
  )
}

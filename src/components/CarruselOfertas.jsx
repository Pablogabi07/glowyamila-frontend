import { useEffect, useState, useRef } from 'react'
import { useCart } from '../context/CartContext'
import '../styles/carrusel.css'

export default function CarruselOfertas() {
  const [offers, setOffers] = useState([])
  const { addToCart } = useCart()
  const carouselRef = useRef(null)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/offers`)
      .then(res => res.json())
      .then(data => setOffers(data))
  }, [])

  // ⭐ Autoplay cada 3.5 segundos
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
          {offers.map(p => (
            <div key={p.id} className="carrusel-item">
              <img
                src={`${import.meta.env.VITE_API_URL}${p.imageUrl}`}
                alt={p.name}
                className="carrusel-img"
              />

              <h3>{p.name}</h3>

              <p className="old-price">${p.price}</p>
              <p className="offer-price">${p.offerPrice}</p>

              <button
                className="add-btn"
                onClick={() => addToCart(p)}
              >
                🛒 Agregar
              </button>
            </div>
          ))}
        </div>

        <button className="arrow right" onClick={scrollRight}>›</button>
      </div>
    </div>
  )
}

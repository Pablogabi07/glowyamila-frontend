import { useEffect, useState } from 'react'
import { useCart } from '../context/CartContext'
import '../styles/slider.css'

export default function SliderOfertas() {
  const [offers, setOffers] = useState([])
  const [index, setIndex] = useState(0)
  const { addToCart } = useCart()

  // Cargar ofertas desde el backend
  useEffect(() => {
    fetch('http://localhost:4000/api/offers')
      .then(res => res.json())
      .then(data => setOffers(data))
  }, [])

  // Autoplay cada 4 segundos
  useEffect(() => {
    if (offers.length === 0) return

    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % offers.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [offers])

  if (offers.length === 0) return null

  const current = offers[index]

  return (
    <div className="offer-slider">
      <h2 className="slider-title">🔥 Ofertas especiales</h2>

      <div className="slider-card">
        <img
          src={`http://localhost:4000${current.imageUrl}`}
          alt={current.name}
          className="slider-image"
        />

        <div className="slider-info">
          <h3>{current.name}</h3>

          <p className="old-price">${current.price}</p>
          <p className="offer-price">${current.offerPrice}</p>

          {/* ⭐ BOTÓN REAL DE AGREGAR AL CARRITO ⭐ */}
          <button
            className="slider-btn"
            onClick={() => addToCart(current)}
          >
            🛒 Agregar al carrito
          </button>
        </div>
      </div>

      {/* Dots */}
      <div className="slider-dots">
        {offers.map((_, i) => (
          <span
            key={i}
            className={`dot ${i === index ? 'active' : ''}`}
            onClick={() => setIndex(i)}
          ></span>
        ))}
      </div>
    </div>
  )
}
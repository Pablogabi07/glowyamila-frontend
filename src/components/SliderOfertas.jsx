import { useEffect, useState } from 'react'
import { useCart } from '../context/CartContext'
import '../styles/slider.css'

export default function SliderOfertas() {
  const [offers, setOffers] = useState([])
  const [index, setIndex] = useState(0)
  const { addToCart } = useCart()

  const API_URL = import.meta.env.VITE_API_URL

  // Cargar ofertas desde el backend
  useEffect(() => {
    fetch(`${API_URL}/api/offers`)
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

  // Fix para imágenes viejas con localhost
  const fixedImageUrl = current.imageUrl
    ? current.imageUrl.replace('http://localhost:4000', '')
    : ''

  return (
    <div className="offer-slider">
      <h2 className="slider-title">🔥 Ofertas especiales</h2>

      <div className="slider-card">
        <img
          src={`${API_URL}${fixedImageUrl}`}
          alt={current.name}
          className="slider-image"
          onError={(e) => (e.target.src = '/placeholder.jpg')}
        />

        <div className="slider-info">
          <h3>{current.name}</h3>

          <p className="old-price">${current.price}</p>
          <p className="offer-price">${current.offerPrice}</p>

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

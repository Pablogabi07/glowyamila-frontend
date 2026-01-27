import { useEffect, useState } from 'react'
import { useCart } from '../context/CartContext'
import { supabase } from '../supabase'
import '../styles/slider.css'

export default function SliderOfertas() {
  const [offers, setOffers] = useState([])
  const [index, setIndex] = useState(0)
  const { addToCart } = useCart()

  useEffect(() => {
    const loadOffers = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_offer', true)
        .eq('active', true)

      if (error) {
        console.error("Error cargando ofertas:", error)
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
  const outOfStock = current.stock <= 0

  return (
    <div className="offer-slider">
      <h2 className="slider-title">🔥 Ofertas especiales</h2>

      <div className="slider-card">
        <img
          src={current.imageUrl}
          alt={current.name}
          className="slider-image"
          onError={(e) => (e.target.src = '/placeholder.jpg')}
        />

        <div className="slider-info">
          <h3>{current.name}</h3>

          <p className="old-price">${current.price}</p>
          <p className="offer-price">${current.offerPrice}</p>

          <p className={`stock ${outOfStock ? 'no-stock' : ''}`}>
            {outOfStock ? 'Sin stock' : `Stock: ${current.stock}`}
          </p>

          <button
            className="slider-btn"
            disabled={outOfStock}
            onClick={() => addToCart(current)}
          >
            {outOfStock ? 'No disponible' : '🛒 Agregar al carrito'}
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

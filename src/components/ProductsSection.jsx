import { useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import CarruselOfertas from './CarruselOfertas'
import '../styles/products.css'

export default function ProductsSection() {
  const [products, setProducts] = useState([])

  const API_URL = import.meta.env.VITE_API_URL

  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then(res => res.json())
      .then(data => {
        // 🔥 Fix para productos viejos con localhost
        const cleaned = data.map(p => ({
          ...p,
          imageUrl: p.imageUrl
            ? p.imageUrl.replace('http://localhost:4000', '')
            : ''
        }))

        setProducts(cleaned)
      })
  }, [])

  return (
    <section id="products" className="products-section">

      {/* ⭐ CARRUSEL DE OFERTAS ⭐ */}
      <CarruselOfertas />

      <h2>Productos</h2>

      <div className="products-grid">
        {products.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  )
}

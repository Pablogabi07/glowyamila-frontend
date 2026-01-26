import { useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import CarruselOfertas from './CarruselOfertas'
import '../styles/products.css'

export default function ProductsSection() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    fetch("https://kloliqzkdsegsutubzoh.functions.supabase.co/get-products")
      .then(res => res.json())
      .then(data => {
        const normalized = data.map(p => ({
          ...p,
          imageUrl: p.image_url,
          isOffer: p.is_offer,
          offerPrice: p.offer_price,
          stock: p.stock
        }))

        setProducts(normalized)
      })
  }, [])

  return (
    <section id="products" className="products-section">

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

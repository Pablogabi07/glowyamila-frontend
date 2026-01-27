import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import ProductCard from './ProductCard'
import CarruselOfertas from './CarruselOfertas'
import '../styles/products.css'

export default function ProductsSection() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    const loadProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)

      if (error) {
        console.error("Error cargando productos:", error)
        return
      }

      const normalized = data.map(p => ({
        ...p,
        imageUrl: p.image_url,
        isOffer: p.is_offer,
        offerPrice: p.offer_price,
        stock: p.stock
      }))

      setProducts(normalized)
    }

    loadProducts()
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

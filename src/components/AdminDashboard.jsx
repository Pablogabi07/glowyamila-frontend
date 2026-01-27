import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import '../styles/admin.css'

export default function AdminDashboard() {
  const navigate = useNavigate()

  // 🔐 Protección de ruta
  useEffect(() => {
    const session = JSON.parse(localStorage.getItem("adminSession"))

    if (!session) {
      navigate('/admin')
      return
    }

    const now = Math.floor(Date.now() / 1000)
    if (session.expires_at < now) {
      localStorage.removeItem("adminSession")
      navigate('/admin')
    }
  }, [navigate])

  const [products, setProducts] = useState([])
  const [stats, setStats] = useState({
    total: 0,
    offers: 0,
    categories: 0,
    avgPrice: 0,
    maxPrice: 0,
    minPrice: 0,
    outOfStock: 0,
    lowStock: 0
  })

  // 🔥 Cargar productos desde Supabase (NO más Edge Functions)
  useEffect(() => {
    const loadProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')

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
      calculateStats(normalized)
    }

    loadProducts()
  }, [])

  const calculateStats = (data) => {
    if (!data.length) return

    const total = data.length
    const offers = data.filter(p => p.isOffer).length
    const categories = new Set(data.map(p => p.category)).size

    const prices = data.map(p => Number(p.price))
    const avgPrice = (prices.reduce((a, b) => a + b, 0) / total).toFixed(2)
    const maxPrice = Math.max(...prices)
    const minPrice = Math.min(...prices)

    const outOfStock = data.filter(p => p.stock <= 0).length
    const lowStock = data.filter(p => p.stock > 0 && p.stock <= 5).length

    setStats({
      total,
      offers,
      categories,
      avgPrice,
      maxPrice,
      minPrice,
      outOfStock,
      lowStock
    })
  }

  const categoryCount = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1
    return acc
  }, {})

  return (
    <div className="admin-container">

      <h2>Dashboard Administrativo</h2>

      <div className="dashboard-cards">

        <div className="dash-card">
          <h3>{stats.total}</h3>
          <p>Productos totales</p>
        </div>

        <div className="dash-card">
          <h3>{stats.offers}</h3>
          <p>En oferta</p>
        </div>

        <div className="dash-card">
          <h3>{stats.categories}</h3>
          <p>Categorías únicas</p>
        </div>

        <div className="dash-card">
          <h3>${stats.avgPrice}</h3>
          <p>Precio promedio</p>
        </div>

        <div className="dash-card">
          <h3>${stats.maxPrice}</h3>
          <p>Producto más caro</p>
        </div>

        <div className="dash-card">
          <h3>${stats.minPrice}</h3>
          <p>Producto más barato</p>
        </div>

        <div className="dash-card warning">
          <h3>{stats.lowStock}</h3>
          <p>Stock bajo (≤ 5)</p>
        </div>

        <div className="dash-card danger">
          <h3>{stats.outOfStock}</h3>
          <p>Sin stock</p>
        </div>

      </div>

      <h3 style={{ marginTop: '40px' }}>Productos por categoría</h3>

      <div className="chart-container">
        {Object.entries(categoryCount).map(([cat, count]) => (
          <div key={cat} className="chart-row">
            <span className="chart-label">{cat}</span>
            <div className="chart-bar" style={{ width: `${count * 40}px` }}>
              {count}
            </div>
          </div>
        ))}
      </div>

      <h3 style={{ marginTop: '40px' }}>Productos sin stock</h3>
      <ul>
        {products
          .filter(p => p.stock <= 0)
          .map(p => (
            <li key={p.id}>{p.name}</li>
          ))}
      </ul>

      <h3 style={{ marginTop: '40px' }}>Productos con stock bajo</h3>
      <ul>
        {products
          .filter(p => p.stock > 0 && p.stock <= 5)
          .map(p => (
            <li key={p.id}>{p.name} — {p.stock} unidades</li>
          ))}
      </ul>

    </div>
  )
}

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/admin.css'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const token = localStorage.getItem('adminToken')

  const [products, setProducts] = useState([])
  const [stats, setStats] = useState({
    total: 0,
    offers: 0,
    categories: 0,
    avgPrice: 0,
    maxPrice: 0,
    minPrice: 0
  })

  useEffect(() => {
    if (!token) navigate('/admin')
  }, [token, navigate])

  useEffect(() => {
    fetch('http://localhost:4000/api/admin/products', {
      headers: { 'x-admin-token': token }
    })
      .then(res => res.json())
      .then(data => {
        setProducts(data)
        calculateStats(data)
      })
  }, [])

  const calculateStats = (data) => {
    if (!data.length) return

    const total = data.length
    const offers = data.filter(p => p.isOffer).length
    const categories = new Set(data.map(p => p.category)).size
    const prices = data.map(p => p.price)
    const avgPrice = (prices.reduce((a, b) => a + b, 0) / total).toFixed(2)
    const maxPrice = Math.max(...prices)
    const minPrice = Math.min(...prices)

    setStats({ total, offers, categories, avgPrice, maxPrice, minPrice })
  }

  // Productos por categoría (para gráfico simple)
  const categoryCount = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1
    return acc
  }, {})

  return (
    <div className="admin-container">

      <h2>Dashboard Administrativo</h2>

      {/* TARJETAS DE ESTADÍSTICAS */}
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
      </div>

      <h3 style={{ marginTop: '40px' }}>Productos por categoría</h3>

      {/* GRÁFICO SIMPLE */}
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

    </div>
  )
}

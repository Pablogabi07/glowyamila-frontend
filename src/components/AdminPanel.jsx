import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/admin.css'

export default function AdminPanel() {
  const navigate = useNavigate()
  const token = localStorage.getItem('adminToken')

  // Redirección si no hay token
  useEffect(() => {
    if (!token) navigate('/admin')
  }, [token, navigate])

  const [products, setProducts] = useState([])
  const [filtered, setFiltered] = useState([])

  // Filtros
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [onlyOffers, setOnlyOffers] = useState(false)

  // Paginación
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Formulario
  const [form, setForm] = useState({
    id: null,
    name: '',
    description: '',
    price: '',
    category: '',
    isOffer: false,
    offerPrice: '',
    imageUrl: ''
  })

  const [imageFile, setImageFile] = useState(null)

  // Modo oscuro
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true'
  )

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode)
    localStorage.setItem('darkMode', darkMode)
  }, [darkMode])

  // Cargar productos
  const loadProducts = () => {
    fetch(`${import.meta.env.VITE_API_URL}/api/admin/products`, {
      headers: { 'x-admin-token': token }
    })
      .then(res => res.json())
      .then(data => {
        setProducts(data)
        setFiltered(data)
      })
  }

  useEffect(() => {
    loadProducts()
  }, [])

  // Filtrado
  useEffect(() => {
    let result = [...products]

    if (search.trim()) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (categoryFilter.trim()) {
      result = result.filter(
        p => p.category.toLowerCase() === categoryFilter.toLowerCase()
      )
    }

    if (onlyOffers) {
      result = result.filter(p => p.isOffer)
    }

    setFiltered(result)
    setCurrentPage(1)
  }, [search, categoryFilter, onlyOffers, products])

  // Paginación
  const indexOfLast = currentPage * itemsPerPage
  const indexOfFirst = indexOfLast - itemsPerPage
  const currentItems = filtered.slice(indexOfFirst, indexOfLast)
  const totalPages = Math.ceil(filtered.length / itemsPerPage)

  const changePage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page)
  }

  // Subir imagen
  const uploadImage = async () => {
    if (!imageFile) return form.imageUrl

    const formData = new FormData()
    formData.append('image', imageFile)

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/upload`, {
      method: 'POST',
      headers: { 'x-admin-token': token },
      body: formData
    })

    const data = await res.json()
    return data.imageUrl
  }

  // Crear o editar producto
  const handleSubmit = async (e) => {
    e.preventDefault()

    const finalImageUrl = await uploadImage()

    const payload = {
      ...form,
      price: Number(form.price),
      offerPrice: form.isOffer ? Number(form.offerPrice) : null,
      imageUrl: finalImageUrl
    }

    const method = form.id ? 'PUT' : 'POST'
    const url = form.id
      ? `${import.meta.env.VITE_API_URL}/api/admin/products/${form.id}`
      : `${import.meta.env.VITE_API_URL}/api/admin/products`

    await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': token
      },
      body: JSON.stringify(payload)
    })

    alert('Producto guardado')

    setForm({
      id: null,
      name: '',
      description: '',
      price: '',
      category: '',
      isOffer: false,
      offerPrice: '',
      imageUrl: ''
    })

    setImageFile(null)
    loadProducts()
  }

  // ELIMINAR PRODUCTO
  const deleteProduct = async (id) => {
    if (!confirm('¿Eliminar producto?')) return

    await fetch(`${import.meta.env.VITE_API_URL}/api/admin/products/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-token': token }
    })

    setProducts(prev => prev.filter(p => p.id !== id))
    setFiltered(prev => prev.filter(p => p.id !== id))
  }

  // Editar producto
  const editProduct = (p) => {
    setForm({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      category: p.category,
      isOffer: p.isOffer,
      offerPrice: p.offerPrice || '',
      imageUrl: p.imageUrl
    })
  }

  // Limpiar filtros
  const clearFilters = () => {
    setSearch('')
    setCategoryFilter('')
    setOnlyOffers(false)
  }

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    navigate('/admin')
  }

  return (
    <div className="admin-container">

      <button className="logout-btn" onClick={handleLogout}>
        Cerrar sesión
      </button>

      <button className="dark-toggle" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? '☀️ Modo Claro' : '🌙 Modo Oscuro'}
      </button>

      <h2>Administrar Productos</h2>

      {/* FILTROS */}
      <div className="admin-filters">
        <input
          type="text"
          placeholder="Buscar por nombre o descripción..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <input
          type="text"
          placeholder="Filtrar por categoría..."
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        />

        <label className="filter-checkbox">
          <input
            type="checkbox"
            checked={onlyOffers}
            onChange={(e) => setOnlyOffers(e.target.checked)}
          />
          Solo ofertas
        </label>

        <button className="clear-filters-btn" onClick={clearFilters}>
          Limpiar filtros
        </button>
      </div>

      {/* SELECTOR ITEMS POR PÁGINA */}
      <div className="items-per-page">
        <label>Mostrar:</label>
        <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))}>
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
        <span>productos por página</span>
      </div>

      <div className="admin-separator"></div>

      {/* FORMULARIO */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          type="text"
          placeholder="Descripción"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <input
          type="number"
          placeholder="Precio"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />

        <input
          type="text"
          placeholder="Categoría"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />

        <label>
          <input
            type="checkbox"
            checked={form.isOffer}
            onChange={(e) => setForm({ ...form, isOffer: e.target.checked })}
          />
          ¿Es oferta?
        </label>

        {form.isOffer && (
          <input
            type="number"
            placeholder="Precio oferta"
            value={form.offerPrice}
            onChange={(e) => setForm({ ...form, offerPrice: e.target.value })}
          />
        )}

        <label>Imagen del producto:</label>
        <input type="file" onChange={(e) => setImageFile(e.target.files[0])} />

        {form.imageUrl && (
          <img
            src={`${import.meta.env.VITE_API_URL}${form.imageUrl}`}
            className="admin-image-preview"
            alt="preview"
          />
        )}

        <button type="submit">
          {form.id ? 'Actualizar producto' : 'Crear producto'}
        </button>
      </form>

      <div className="admin-separator"></div>

      {/* LISTADO */}
      <h3>Productos existentes</h3>

      {currentItems.map(p => (
        <div key={p.id} className="admin-product-row">
          <img
            src={`${import.meta.env.VITE_API_URL}${p.imageUrl}`}
            alt={p.name}
            className="admin-thumb"
          />

          <div className="admin-info">
            <strong>{p.name}</strong>
            {p.isOffer && <span className="offer-badge">Oferta</span>}
            <p>Precio: ${p.price}</p>
            {p.isOffer && <p>Oferta: ${p.offerPrice}</p>}
            <p>Categoría: {p.category}</p>
          </div>

          <button onClick={() => editProduct(p)}>Editar</button>
          <button className="delete-btn" onClick={() => deleteProduct(p.id)}>
            Eliminar
          </button>
        </div>
      ))}

      {/* PAGINACIÓN */}
      <div className="pagination">
        <button onClick={() => changePage(currentPage - 1)}>⏮️</button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={currentPage === i + 1 ? 'active-page' : ''}
            onClick={() => changePage(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button onClick={() => changePage(currentPage + 1)}>⏭️</button>
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import '../styles/admin.css'

export default function AdminPanel() {
  const navigate = useNavigate()

  // 🔐 Protección de ruta con Supabase Auth
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
  const [filtered, setFiltered] = useState([])

  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [onlyOffers, setOnlyOffers] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const [form, setForm] = useState({
    id: null,
    name: '',
    description: '',
    price: '',
    category: '',
    isOffer: false,
    offerPrice: '',
    stock: '',
    imageUrl: ''
  })

  const [imageFile, setImageFile] = useState(null)

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true'
  )

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode)
    localStorage.setItem('darkMode', darkMode)
  }, [darkMode])

  const loadProducts = () => {
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
        setFiltered(normalized)
      })
  }

  useEffect(() => {
    loadProducts()
  }, [])

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

  const indexOfLast = currentPage * itemsPerPage
  const indexOfFirst = indexOfLast - itemsPerPage
  const currentItems = filtered.slice(indexOfFirst, indexOfLast)
  const totalPages = Math.ceil(filtered.length / itemsPerPage)

  const changePage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append("name", form.name)
    formData.append("description", form.description)
    formData.append("price", form.price)
    formData.append("category", form.category)
    formData.append("is_offer", form.isOffer)
    formData.append("offer_price", form.isOffer ? form.offerPrice : "")
    formData.append("stock", form.stock)

    if (imageFile) {
      formData.append("image", imageFile)
    }

    if (form.id) {
      formData.append("id", form.id)
      formData.append("current_image", form.imageUrl)

      await fetch("https://kloliqzkdsegsutubzoh.functions.supabase.co/update-product", {
        method: "POST",
        body: formData
      })
    } else {
      await fetch("https://kloliqzkdsegsutubzoh.functions.supabase.co/create-product", {
        method: "POST",
        body: formData
      })
    }

    alert("Producto guardado")

    setForm({
      id: null,
      name: "",
      description: "",
      price: "",
      category: "",
      isOffer: false,
      offerPrice: "",
      stock: "",
      imageUrl: ""
    })

    setImageFile(null)
    loadProducts()
  }

  const editProduct = (p) => {
    setForm({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      category: p.category,
      isOffer: p.isOffer,
      offerPrice: p.offerPrice || "",
      stock: p.stock,
      imageUrl: p.imageUrl
    })
  }

  const deleteProduct = async (id) => {
    if (!confirm("¿Eliminar producto?")) return

    const formData = new FormData()
    formData.append("id", id)

    await fetch("https://kloliqzkdsegsutubzoh.functions.supabase.co/delete-product", {
      method: "POST",
      body: formData
    })

    setProducts(prev => prev.filter(p => p.id !== id))
    setFiltered(prev => prev.filter(p => p.id !== id))
  }

  const clearFilters = () => {
    setSearch('')
    setCategoryFilter('')
    setOnlyOffers(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem("adminSession")
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

        {/* 🔥 STOCK REAL */}
        <input
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
        />

        <label>Imagen del producto:</label>
        <input type="file" onChange={(e) => setImageFile(e.target.files[0])} />

        {form.imageUrl && (
          <img
            src={form.imageUrl}
            className="admin-image-preview"
            alt="preview"
          />
        )}

        <button type="submit">
          {form.id ? 'Actualizar producto' : 'Crear producto'}
        </button>
      </form>

      <div className="admin-separator"></div>

      <h3>Productos existentes</h3>

      {currentItems.map(p => (
        <div key={p.id} className="admin-product-row">
          <img
            src={p.imageUrl}
            alt={p.name}
            className="admin-thumb"
          />

          <div className="admin-info">
            <strong>{p.name}</strong>
            {p.isOffer && <span className="offer-badge">Oferta</span>}
            <p>Precio: ${p.price}</p>
            {p.isOffer && <p>Oferta: ${p.offerPrice}</p>}
            <p>Categoría: {p.category}</p>
            <p>Stock: {p.stock}</p>
          </div>

          <button onClick={() => editProduct(p)}>Editar</button>
          <button className="delete-btn" onClick={() => deleteProduct(p.id)}>
            Eliminar
          </button>
        </div>
      ))}

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

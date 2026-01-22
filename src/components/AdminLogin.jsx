import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/admin.css'

export default function AdminLogin() {
  const [token, setToken] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!token) return alert('Ingresá el token')

    // Guardar token
    localStorage.setItem('adminToken', token)

    // Redirigir al panel
    navigate('/admin/panel')
  }

  return (
    <div className="admin-container">
      <h2>Panel Administrativo</h2>
      <p style={{ textAlign: 'center', marginBottom: '20px' }}>
        Ingresá tu token de administrador
      </p>

      <form onSubmit={handleSubmit} className="admin-login-form">
        <input
          type="password"
          placeholder="Token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />

        <button type="submit">Ingresar</button>
      </form>
    </div>
  )
}

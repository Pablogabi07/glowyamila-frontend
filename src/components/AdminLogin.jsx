import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import '../styles/admin.css'

export default function AdminLogin() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    setLoading(false)

    if (error) {
      setError("Credenciales incorrectas")
      return
    }

    // Guardamos sesión en localStorage
    localStorage.setItem("adminSession", JSON.stringify(data.session))

    navigate('/admin/panel')
  }

  return (
    <div className="admin-login-container">
      <h2>Acceso Administrador</h2>

      <form onSubmit={handleLogin} className="admin-login-form">
        <input
          type="email"
          placeholder="Email del administrador"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="admin-error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </div>
  )
}

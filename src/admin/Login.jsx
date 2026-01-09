import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL; // tu backend Strapi

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password: pass,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError("Credenciales incorrectas");
        return;
      }

      // Guardamos el token real de Strapi
      localStorage.setItem("admin_token", data.data.token);

      // Redirigimos al panel
      window.location.href = "/admin";
    } catch (err) {
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.box} onSubmit={handleLogin}>
        <h2>Panel Administrativo</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          style={styles.input}
        />

        {error && <p style={styles.error}>{error}</p>}

        <button style={styles.button}>Ingresar</button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f5f5",
  },
  box: {
    background: "#fff",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    width: "300px",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: "0.7rem",
    margin: "0.5rem 0",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: "0.7rem",
    background: "#e91e63",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "1rem",
  },
  error: {
    color: "red",
    fontSize: "0.9rem",
  },
};

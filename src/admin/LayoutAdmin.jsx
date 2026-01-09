import { Link } from "react-router-dom";

export default function LayoutAdmin({ children }) {
  const logout = () => {
    localStorage.removeItem("admin_token");
    window.location.href = "/admin/login";
  };

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <h2>Glowy Admin</h2>

        <Link to="/admin" style={styles.link}>Dashboard</Link>
        <Link to="/admin/productos" style={styles.link}>Productos</Link>
        <Link to="/admin/categorias" style={styles.link}>Categorías</Link>
        <Link to="/admin/combos" style={styles.link}>Combos</Link>
        <Link to="/admin/ofertas" style={styles.link}>Ofertas</Link>


        <button onClick={logout} style={styles.logout}>Cerrar sesión</button>
      </aside>

      <main style={styles.content}>{children}</main>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "100vh",
  },
  sidebar: {
    width: "250px",
    background: "#e91e63",
    color: "#fff",
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    fontSize: "1.1rem",
  },
  logout: {
    marginTop: "auto",
    padding: "0.7rem",
    background: "#fff",
    color: "#e91e63",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  content: {
    flex: 1,
    padding: "2rem",
    background: "#f5f5f5",
    overflowY: "auto",
  },
};

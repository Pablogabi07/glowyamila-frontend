import { useEffect, useState } from "react";
import { getProductos, getCategorias, getCombos, getOfertas } from "../services/api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    productos: 0,
    categorias: 0,
    combos: 0,
    ofertas: 0,
  });

  useEffect(() => {
    async function cargarDatos() {
      try {
        const productos = await getProductos();
        const categorias = await getCategorias();
        const combos = await getCombos();
        const ofertas = await getOfertas();

        setStats({
          productos: productos?.length || 0,
          categorias: categorias?.length || 0,
          combos: combos?.length || 0,
          ofertas: ofertas?.length || 0,
        });
      } catch (error) {
        console.error("Error cargando datos del dashboard:", error);
      }
    }

    cargarDatos();
  }, []);

  return (
    <div>
      <h1 style={styles.title}>Dashboard</h1>

      <div style={styles.grid}>
        <div style={styles.card}>
          <h3>Productos</h3>
          <p style={styles.number}>{stats.productos}</p>
        </div>

        <div style={styles.card}>
          <h3>Categorías</h3>
          <p style={styles.number}>{stats.categorias}</p>
        </div>

        <div style={styles.card}>
          <h3>Combos</h3>
          <p style={styles.number}>{stats.combos}</p>
        </div>

        <div style={styles.card}>
          <h3>Ofertas activas</h3>
          <p style={styles.number}>{stats.ofertas}</p>
        </div>
      </div>

      <p style={styles.update}>Última actualización: {new Date().toLocaleString()}</p>
    </div>
  );
}

const styles = {
  title: {
    fontSize: "2rem",
    marginBottom: "1.5rem",
    color: "#e91e63",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "1.5rem",
  },
  card: {
    background: "#fff",
    padding: "1.5rem",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  number: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginTop: "0.5rem",
    color: "#e91e63",
  },
  update: {
    marginTop: "2rem",
    color: "#777",
    fontSize: "0.9rem",
  },
};

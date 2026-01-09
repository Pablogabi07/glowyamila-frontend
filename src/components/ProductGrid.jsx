import { useEffect, useState, useContext } from "react";
import { getProductos } from "../services/api";
import { CartContext } from "../context/CartContext";

export default function ProductGrid() {
  const [productos, setProductos] = useState([]);
  const { agregar } = useContext(CCartContext);

  useEffect(() => {
    getProductos().then((data) => {
      setProductos(data || []);
    });
  }, []);

  return (
    <div style={styles.grid}>
      {productos.map((p) => {
        // Protección contra productos vacíos o corruptos
        if (!p || !p.attributes) return null;

        const info = p.attributes;

        // Imagen protegida
        const imagenUrl = info.imagen_principal?.data?.attributes?.url
          ? `${import.meta.env.VITE_MEDIA_URL}${info.imagen_principal.data.attributes.url}`
          : "";

        const handleAgregar = () => {
          agregar({
            id: p.id,
            nombre: info.nombre,
            precio: info.precio,
            cantidad: 1,
            imagen: imagenUrl,
          });
        };

        return (
          <div key={p.id} style={styles.card}>
            {imagenUrl && (
              <img src={imagenUrl} alt={info.nombre} style={styles.image} />
            )}

            <h2 style={styles.title}>{info.nombre}</h2>

            <p style={styles.category}>
              Categoría:{" "}
              {info.categoria?.data?.attributes?.nombre || "Sin categoría"}
            </p>

            <p style={styles.price}>${info.precio}</p>

            <button style={styles.button} onClick={handleAgregar}>
              Agregar al carrito
            </button>
          </div>
        );
      })}
    </div>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "2rem",
    padding: "2rem",
  },
  card: {
    border: "1px solid #eee",
    borderRadius: "12px",
    padding: "1rem",
    textAlign: "center",
    backgroundColor: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  image: {
    width: "100%",
    height: "auto",
    borderRadius: "8px",
    marginBottom: "1rem",
  },
  title: {
    fontSize: "1.2rem",
    margin: "0.5rem 0",
    color: "#333",
  },
  category: {
    fontSize: "0.9rem",
    color: "#888",
  },
  price: {
    fontSize: "1.1rem",
    fontWeight: "bold",
    color: "#e91e63",
    margin: "0.5rem 0",
  },
  button: {
    backgroundColor: "#e91e63",
    color: "#fff",
    border: "none",
    padding: "0.6rem 1.2rem",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "0.5rem",
  },
};

import { useEffect, useState } from "react";
import { getOfertas } from "../services/api";

export default function Ofertas() {
  const [ofertas, setOfertas] = useState([]);

  useEffect(() => {
    getOfertas().then((data) => {
      setOfertas(data || []);
    });
  }, []);

  const calcularDescuento = (original, oferta) => {
    if (!original || !oferta) return null;
    return Math.round(((original - oferta) / original) * 100);
  };

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.title}>Ofertas</h2>

      <div style={styles.grid}>
        {ofertas.map((p) => {
          const info = p.attributes;

          const imagenUrl = info.imagen_principal?.data?.attributes?.url
            ? `${import.meta.env.VITE_MEDIA_URL}${info.imagen_principal.data.attributes.url}`
            : "";

          const precioOriginal = info.precio_original;
          const precioOferta = info.precio_oferta;
          const precioFinal = precioOferta || info.precio;

          const descuento = calcularDescuento(precioOriginal, precioOferta);

          return (
            <div key={p.id} style={styles.card}>
              {descuento && <span style={styles.badge}>-{descuento}%</span>}

              {imagenUrl && (
                <img src={imagenUrl} alt={info.nombre} style={styles.image} />
              )}

              <h3 style={styles.name}>{info.nombre}</h3>

              <div style={styles.priceBox}>
                {precioOriginal && (
                  <span style={styles.oldPrice}>${precioOriginal}</span>
                )}
                <span style={styles.newPrice}>${precioFinal}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  wrapper: { padding: "2rem" },
  title: { fontSize: "2rem", marginBottom: "1rem", color: "#e91e63" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "2rem",
  },
  card: {
    border: "1px solid #eee",
    borderRadius: "12px",
    padding: "1rem",
    textAlign: "center",
    backgroundColor: "#fff",
    position: "relative",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  image: { width: "100%", borderRadius: "8px", marginBottom: "1rem" },
  name: { fontSize: "1.2rem", margin: "0.5rem 0" },
  priceBox: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    alignItems: "center",
  },
  oldPrice: {
    textDecoration: "line-through",
    color: "#999",
    fontSize: "0.9rem",
  },
  newPrice: {
    color: "#e91e63",
    fontWeight: "bold",
    fontSize: "1.1rem",
  },
  badge: {
    position: "absolute",
    top: "10px",
    right: "10px",
    backgroundColor: "#e91e63",
    color: "#fff",
    padding: "0.3rem 0.6rem",
    borderRadius: "6px",
    fontSize: "0.8rem",
    fontWeight: "bold",
  },
};

import { useEffect, useState } from "react";
import { getOfertas, editarProducto } from "../services/api";
import { Link } from "react-router-dom";

export default function Ofertas() {
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargar = async () => {
    setLoading(true);
    const data = await getOfertas();
    setOfertas(data || []);
    setLoading(false);
  };

  useEffect(() => {
    cargar();
  }, []);

  const quitarOferta = async (id) => {
    if (!confirm("¿Quitar oferta de este producto?")) return;

    const ok = await editarProducto(id, {
      es_oferta: false,
      precio_oferta: null,
    });

    if (ok) {
      alert("Oferta eliminada");
      cargar();
    } else {
      alert("Error al quitar oferta");
    }
  };

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>Ofertas activas</h1>
      </div>

      {loading ? (
        <p>Cargando ofertas...</p>
      ) : ofertas.length === 0 ? (
        <p>No hay productos en oferta.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Producto</th>
              <th>Precio original</th>
              <th>Precio oferta</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {ofertas.map((p) => {
              if (!p || !p.attributes) return null;

              const info = p.attributes;

              const img =
                info.imagen_principal?.data?.attributes?.url
                  ? `${import.meta.env.VITE_MEDIA_URL}${info.imagen_principal.data.attributes.url}`
                  : "";

              return (
                <tr key={p.id}>
                  <td>
                    {img ? (
                      <img
                        src={img}
                        alt={info.nombre}
                        style={{ width: "60px", borderRadius: "6px" }}
                      />
                    ) : (
                      "Sin imagen"
                    )}
                  </td>

                  <td>{info.nombre}</td>
                  <td>${info.precio}</td>
                  <td>${info.precio_oferta}</td>

                  <td>
                    <Link
                      to={`/admin/productos/${p.id}`}
                      style={styles.editButton}
                    >
                      Editar
                    </Link>

                    <button
                      onClick={() => quitarOferta(p.id)}
                      style={styles.deleteButton}
                    >
                      Quitar oferta
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "1.5rem",
  },
  title: {
    fontSize: "2rem",
    color: "#e91e63",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "#fff",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  editButton: {
    marginRight: "10px",
    background: "#2196f3",
    color: "#fff",
    padding: "0.4rem 0.7rem",
    borderRadius: "6px",
    textDecoration: "none",
  },
  deleteButton: {
    background: "#f44336",
    color: "#fff",
    padding: "0.4rem 0.7rem",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
  },
};

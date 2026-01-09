import { useEffect, useState } from "react";
import { getProductos, borrarProducto } from "../services/api";
import { Link } from "react-router-dom";

export default function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarProductos = async () => {
    setLoading(true);
    const data = await getProductos();
    setProductos(data || []);
    setLoading(false);
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("¿Seguro que querés borrar este producto?")) return;

    const ok = await borrarProducto(id);

    if (ok) {
      alert("Producto borrado");
      cargarProductos();
    } else {
      alert("Error al borrar");
    }
  };

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>Productos</h1>

        <Link to="/admin/productos/crear" style={styles.button}>
          + Crear producto
        </Link>
      </div>

      {loading ? (
        <p>Cargando productos...</p>
      ) : productos.length === 0 ? (
        <p>No hay productos cargados.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Oferta</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {productos.map((p) => {
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
                  <td>{info.stock}</td>
                  <td>{info.es_oferta ? "Sí" : "No"}</td>

                  <td>
                    <Link
                      to={`/admin/productos/${p.id}`}
                      style={styles.editButton}
                    >
                      Editar
                    </Link>

                    <button
                      onClick={() => handleDelete(p.id)}
                      style={styles.deleteButton}
                    >
                      Borrar
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
  button: {
    background: "#e91e63",
    color: "#fff",
    padding: "0.7rem 1rem",
    borderRadius: "6px",
    textDecoration: "none",
    fontWeight: "bold",
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

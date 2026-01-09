import { useEffect, useState } from "react";
import { getCategorias, borrarCategoria } from "../services/api";
import { Link } from "react-router-dom";

export default function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargar = async () => {
    setLoading(true);
    const data = await getCategorias();
    setCategorias(data || []);
    setLoading(false);
  };

  useEffect(() => {
    cargar();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("¿Seguro que querés borrar esta categoría?")) return;

    const ok = await borrarCategoria(id);

    if (ok) {
      alert("Categoría borrada");
      cargar();
    } else {
      alert("Error al borrar categoría");
    }
  };

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>Categorías</h1>

        <Link to="/admin/categorias/crear" style={styles.button}>
          + Crear categoría
        </Link>
      </div>

      {loading ? (
        <p>Cargando categorías...</p>
      ) : categorias.length === 0 ? (
        <p>No hay categorías creadas.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Slug</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {categorias.map((c) => {
              if (!c || !c.attributes) return null;

              const info = c.attributes;

              return (
                <tr key={c.id}>
                  <td>{info.nombre}</td>
                  <td>{info.slug}</td>

                  <td>
                    <Link
                      to={`/admin/categorias/${c.id}`}
                      style={styles.editButton}
                    >
                      Editar
                    </Link>

                    <button
                      onClick={() => handleDelete(c.id)}
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

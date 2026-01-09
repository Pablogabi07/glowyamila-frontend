import { useEffect, useState } from "react";
import { getCombos, borrarCombo } from "../services/api";
import { Link } from "react-router-dom";

export default function Combos() {
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargar = async () => {
    setLoading(true);
    const data = await getCombos();
    setCombos(data || []);
    setLoading(false);
  };

  useEffect(() => {
    cargar();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("¿Seguro que querés borrar este combo?")) return;

    const ok = await borrarCombo(id);

    if (ok) {
      alert("Combo borrado");
      cargar();
    } else {
      alert("Error al borrar combo");
    }
  };

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>Combos</h1>

        <Link to="/admin/combos/crear" style={styles.button}>
          + Crear combo
        </Link>
      </div>

      {loading ? (
        <p>Cargando combos...</p>
      ) : combos.length === 0 ? (
        <p>No hay combos creados.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {combos.map((c) => {
              if (!c || !c.attributes) return null;

              const info = c.attributes;

              const img =
                info.imagen_principal?.data?.attributes?.url
                  ? `${import.meta.env.VITE_MEDIA_URL}${info.imagen_principal.data.attributes.url}`
                  : "";

              return (
                <tr key={c.id}>
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

                  <td>
                    <Link
                      to={`/admin/combos/${c.id}`}
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

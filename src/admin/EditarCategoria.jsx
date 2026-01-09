import { useEffect, useState } from "react";
import { getCategorias, editarCategoria } from "../services/api";
import { useNavigate, useParams } from "react-router-dom";

export default function EditarCategoria() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    slug: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function cargar() {
      const cats = await getCategorias();
      const cat = cats.find((c) => c.id == id);

      if (cat && cat.attributes) {
        setForm({
          nombre: cat.attributes.nombre,
          slug: cat.attributes.slug,
        });
      }

      setLoading(false);
    }

    cargar();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const ok = await editarCategoria(id, form);

    setSaving(false);

    if (ok) {
      alert("Categoría actualizada");
      navigate("/admin/categorias");
    } else {
      alert("Error al actualizar categoría");
    }
  };

  if (loading) return <p>Cargando categoría...</p>;

  return (
    <div>
      <h1 style={styles.title}>Editar Categoría</h1>

      <form style={styles.form} onSubmit={handleSubmit}>
        <label>Nombre</label>
        <input
          type="text"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <label>Slug</label>
        <input
          type="text"
          name="slug"
          value={form.slug}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <button style={styles.button} disabled={saving}>
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  title: {
    fontSize: "2rem",
    marginBottom: "1.5rem",
    color: "#e91e63",
  },
  form: {
    background: "#fff",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    maxWidth: "500px",
  },
  input: {
    padding: "0.7rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    background: "#e91e63",
    color: "#fff",
    padding: "0.8rem",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "1rem",
  },
};

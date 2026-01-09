import { useEffect, useState } from "react";
import { getCombos, editarCombo, uploadImage } from "../services/api";
import { useNavigate, useParams } from "react-router-dom";

export default function EditarCombo() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    precio: "",
    descripcion: "",
  });

  const [imagenActual, setImagenActual] = useState(null);
  const [nuevaImagen, setNuevaImagen] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function cargar() {
      const combos = await getCombos();
      const combo = combos.find((c) => c.id == id);

      if (combo && combo.attributes) {
        const info = combo.attributes;

        setForm({
          nombre: info.nombre,
          precio: info.precio,
          descripcion: info.descripcion,
        });

        const img = info.imagen_principal?.data?.attributes?.url
          ? `${import.meta.env.VITE_MEDIA_URL}${info.imagen_principal.data.attributes.url}`
          : null;

        setImagenActual(img);
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

    let imagenId = null;

    if (nuevaImagen) {
      const img = await uploadImage(nuevaImagen);
      if (img) imagenId = img.id;
    }

    const data = {
      nombre: form.nombre,
      precio: Number(form.precio),
      descripcion: form.descripcion,
      ...(imagenId && { imagen_principal: imagenId }),
    };

    const ok = await editarCombo(id, data);

    setSaving(false);

    if (ok) {
      alert("Combo actualizado");
      navigate("/admin/combos");
    } else {
      alert("Error al actualizar combo");
    }
  };

  if (loading) return <p>Cargando combo...</p>;

  return (
    <div>
      <h1 style={styles.title}>Editar Combo</h1>

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

        <label>Precio</label>
        <input
          type="number"
          name="precio"
          value={form.precio}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <label>Descripción</label>
        <textarea
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          style={styles.textarea}
        />

        <label>Imagen actual</label>
        {imagenActual ? (
          <img
            src={imagenActual}
            alt="Imagen actual"
            style={{ width: "120px", borderRadius: "8px", marginBottom: "1rem" }}
          />
        ) : (
          <p>No tiene imagen</p>
        )}

        <label>Nueva imagen (opcional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setNuevaImagen(e.target.files[0])}
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
  textarea: {
    padding: "0.7rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
    minHeight: "80px",
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

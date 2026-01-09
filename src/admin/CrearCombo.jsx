import { useState } from "react";
import { crearCombo, uploadImage } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function CrearCombo() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    precio: "",
    descripcion: "",
  });

  const [imagen, setImagen] = useState(null);
  const [saving, setSaving] = useState(false);

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

    if (imagen) {
      const img = await uploadImage(imagen);
      if (img) imagenId = img.id;
    }

    const data = {
      nombre: form.nombre,
      precio: Number(form.precio),
      descripcion: form.descripcion,
      imagen_principal: imagenId,
    };

    const nuevo = await crearCombo(data);

    setSaving(false);

    if (nuevo) {
      alert("Combo creado");
      navigate("/admin/combos");
    } else {
      alert("Error al crear combo");
    }
  };

  return (
    <div>
      <h1 style={styles.title}>Crear Combo</h1>

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

        <label>Imagen principal</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImagen(e.target.files[0])}
          style={styles.input}
        />

        <button style={styles.button} disabled={saving}>
          {saving ? "Guardando..." : "Crear combo"}
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

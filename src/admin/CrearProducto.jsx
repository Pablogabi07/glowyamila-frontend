import { useEffect, useState } from "react";
import { getCategorias, crearProducto, uploadImage } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function CrearProducto() {
  const navigate = useNavigate();

  const [categorias, setCategorias] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    precio: "",
    stock: "",
    descripcion: "",
    categoria: "",
    es_oferta: false,
    precio_oferta: "",
  });

  const [imagen, setImagen] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCategorias().then((data) => setCategorias(data || []));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let imagenId = null;

    // Subir imagen si existe
    if (imagen) {
      const img = await uploadImage(imagen);
      if (img) imagenId = img.id;
    }

    const data = {
      nombre: form.nombre,
      precio: Number(form.precio),
      stock: Number(form.stock),
      descripcion: form.descripcion,
      es_oferta: form.es_oferta,
      precio_oferta: form.es_oferta ? Number(form.precio_oferta) : null,
      categoria: form.categoria ? Number(form.categoria) : null,
      imagen_principal: imagenId,
    };

    const nuevo = await crearProducto(data);

    setLoading(false);

    if (nuevo) {
      alert("Producto creado con éxito");
      navigate("/admin/productos");
    } else {
      alert("Error al crear producto");
    }
  };

  return (
    <div>
      <h1 style={styles.title}>Crear Producto</h1>

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

        <label>Stock</label>
        <input
          type="number"
          name="stock"
          value={form.stock}
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

        <label>Categoría</label>
        <select
          name="categoria"
          value={form.categoria}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="">Sin categoría</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.attributes.nombre}
            </option>
          ))}
        </select>

        <label style={styles.checkboxRow}>
          <input
            type="checkbox"
            name="es_oferta"
            checked={form.es_oferta}
            onChange={handleChange}
          />
          ¿Es oferta?
        </label>

        {form.es_oferta && (
          <>
            <label>Precio oferta</label>
            <input
              type="number"
              name="precio_oferta"
              value={form.precio_oferta}
              onChange={handleChange}
              style={styles.input}
            />
          </>
        )}

        <label>Imagen principal</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImagen(e.target.files[0])}
          style={styles.input}
        />

        <button style={styles.button} disabled={loading}>
          {loading ? "Guardando..." : "Crear producto"}
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
  checkboxRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
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

import { useEffect, useState } from "react";
import {
  getProducto,
  getCategorias,
  editarProducto,
  uploadImage,
} from "../services/api";
import { useNavigate, useParams } from "react-router-dom";

export default function EditarProducto() {
  const { id } = useParams();
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

  const [imagenActual, setImagenActual] = useState(null);
  const [nuevaImagen, setNuevaImagen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Cargar datos del producto
  useEffect(() => {
    async function cargar() {
      const prod = await getProducto(id);
      const cats = await getCategorias();

      setCategorias(cats || []);

      if (prod && prod.attributes) {
        const info = prod.attributes;

        setForm({
          nombre: info.nombre || "",
          precio: info.precio || "",
          stock: info.stock || "",
          descripcion: info.descripcion || "",
          categoria: info.categoria?.data?.id || "",
          es_oferta: info.es_oferta || false,
          precio_oferta: info.precio_oferta || "",
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
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    let imagenId = null;

    // Si se subió una nueva imagen, reemplazarla
    if (nuevaImagen) {
      const img = await uploadImage(nuevaImagen);
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
      ...(imagenId && { imagen_principal: imagenId }),
    };

    const actualizado = await editarProducto(id, data);

    setSaving(false);

    if (actualizado) {
      alert("Producto actualizado con éxito");
      navigate("/admin/productos");
    } else {
      alert("Error al actualizar producto");
    }
  };

  if (loading) return <p>Cargando producto...</p>;

  return (
    <div>
      <h1 style={styles.title}>Editar Producto</h1>

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

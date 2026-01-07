import { useContext } from "react";
import { CartContext } from "../context/CartContext";

export default function ProductCard({ producto }) {
  const { agregar } = useContext(CartContext);

  // Datos del producto desde Strapi
  const info = producto.attributes;
  const imagen = info.imagen_principal?.data?.attributes?.url;

  const handleAgregar = () => {
    agregar({
      id: producto.id,
      nombre: info.nombre,
      precio: info.precio,
      cantidad: 1,
      imagen,
    });
  };

  return (
    <div className="card">
      <img src={imagen} alt={info.nombre} className="card-img" />
      <h3>{info.nombre}</h3>
      <p>${info.precio}</p>

      <button onClick={handleAgregar} className="btn-agregar">
        Agregar al carrito
      </button>
    </div>
  );
}

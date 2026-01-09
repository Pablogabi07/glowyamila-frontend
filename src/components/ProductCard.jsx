import { useContext } from "react";
import { CartContext } from "../context/CartContext";

export default function ProductCard({ producto }) {
  const { agregar } = useContext(CartContext);

  const info = producto.attributes;

  const imagen = info.imagen_principal?.data?.attributes?.url
    ? `${import.meta.env.VITE_MEDIA_URL}${info.imagen_principal.data.attributes.url}`
    : "";

  const precioOriginal = info.precio_original;
  const precioOferta = info.precio_oferta;
  const precioFinal = precioOferta || info.precio;

  const calcularDescuento = (original, oferta) => {
    if (!original || !oferta) return null;
    return Math.round(((original - oferta) / original) * 100);
  };

  const descuento = calcularDescuento(precioOriginal, precioOferta);

  const handleAgregar = () => {
    agregar({
      id: producto.id,
      nombre: info.nombre,
      precio: precioFinal,
      cantidad: 1,
      imagen,
    });
  };

  return (
    <div className="card">
      {descuento && <span className="badge-oferta">-{descuento}%</span>}

      <img src={imagen} alt={info.nombre} className="card-img" />

      <h3>{info.nombre}</h3>

      <div className="price-box">
        {precioOriginal && (
          <span className="old-price">${precioOriginal}</span>
        )}
        <span className="new-price">${precioFinal}</span>
      </div>

      <button onClick={handleAgregar} className="btn-agregar">
        Agregar al carrito
      </button>
    </div>
  );
}

import { useEffect, useState } from "react";
import { getProductos } from "../services/api";

export default function ProductGrid() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    getProductos().then(setProductos);
  }, []);

  return (
    <div>
      {productos.map((p) => (
        <div key={p.id}>
          <h2>{p.attributes.nombre}</h2>
          <img
            src={
              p.attributes.imagen_principal?.data?.attributes?.url &&
              `http://localhost:1337${p.attributes.imagen_principal.data.attributes.url}`
            }
            alt={p.attributes.nombre}
          />
          <p>{p.attributes.descripcion}</p>
          <p>Categoría: {p.attributes.categoria?.data?.attributes?.nombre}</p>
        </div>
      ))}
    </div>
  );
}

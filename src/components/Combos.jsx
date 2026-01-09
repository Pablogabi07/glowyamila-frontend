import { useEffect, useState } from "react";
import { getCombos } from "../services/api";

export default function Combos() {
  const [combos, setCombos] = useState([]);

  useEffect(() => {
    getCombos().then((data) => setCombos(data || []));
  }, []);

  return (
    <section style={{ padding: "2rem" }}>
      <h2 style={{ color: "#e91e63", marginBottom: "1rem" }}>
        Combos especiales
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "2rem",
        }}
      >
        {combos.map((c) => {
          // Protección contra combos corruptos o vacíos
          if (!c || !c.attributes) return null;

          const info = c.attributes;

          // Imagen protegida
          const img = info.imagen_principal?.data?.attributes?.url
            ? `${import.meta.env.VITE_MEDIA_URL}${info.imagen_principal.data.attributes.url}`
            : "";

          return (
            <div
              key={c.id}
              style={{
                background: "#fff",
                padding: "1rem",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              {img && (
                <img
                  src={img}
                  alt={info.nombre}
                  style={{ width: "100%", borderRadius: "8px" }}
                />
              )}

              <h3 style={{ marginTop: "0.5rem" }}>{info.nombre}</h3>

              <p>{info.descripcion || "Sin descripción"}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

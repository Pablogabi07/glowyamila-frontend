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
          const info = c.attributes;

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
              <h3 style={{ marginTop: "0.5rem" }}>{info.nombre}</h3>
              <p>{info.descripcion}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

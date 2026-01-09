import { useEffect, useState } from "react";
import { getOfertas } from "../services/api";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function SliderOfertas() {
  const [ofertas, setOfertas] = useState([]);

  useEffect(() => {
    getOfertas().then((data) => setOfertas(data || []));
  }, []);

  return (
    <section style={{ padding: "2rem" }}>
      <h2 style={{ color: "#e91e63", marginBottom: "1rem" }}>
        Ofertas destacadas
      </h2>

      <Swiper spaceBetween={20} slidesPerView={1.2}>
        {ofertas.map((p) => {
          const info = p.attributes;

          const img = info.imagen_principal?.data?.attributes?.url
            ? `${import.meta.env.VITE_MEDIA_URL}${info.imagen_principal.data.attributes.url}`
            : "";

          return (
            <SwiperSlide key={p.id}>
              <div
                style={{
                  background: "#fff",
                  padding: "1rem",
                  borderRadius: "12px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                <img
                  src={img}
                  alt={info.nombre}
                  style={{ width: "100%", borderRadius: "8px" }}
                />
                <h3 style={{ marginTop: "0.5rem" }}>{info.nombre}</h3>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
}

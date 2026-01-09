import heroImg from "../assets/2.jpeg";
import Ofertas from "../components/Ofertas";
import SliderOfertas from "../components/SliderOfertas";
import Combos from "../components/Combos";

export default function Hero() {
  const scrollToOfertas = () => {
    const section = document.getElementById("ofertas");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* HERO PRINCIPAL */}
      <section className="hero" style={{ backgroundImage: `url(${heroImg})` }}>
        <div className="hero-box">
          <h2>Belleza que ilumina tu piel</h2>
          <p>Cosmética premium para realzar tu brillo natural.</p>

          <button className="hero-button" onClick={scrollToOfertas}>
            Ver productos
          </button>
        </div>
      </section>

      {/* SLIDER DE OFERTAS DESTACADAS */}
      <SliderOfertas />

      {/* SECCIÓN DE OFERTAS */}
      <Ofertas />

      {/* SECCIÓN DE COMBOS */}
      <Combos />
    </>
  );
}

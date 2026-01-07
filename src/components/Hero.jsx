import heroImg from "../assets/2.jpeg";

export default function Hero() {
  return (
    <section className="hero" style={{ backgroundImage: `url(${heroImg})` }}>
      <div className="hero-box">
        <h2>Belleza que ilumina tu piel</h2>
        <p>Cosmética premium para realzar tu brillo natural.</p>
        <button className="hero-button">Ver productos</button>
      </div>
    </section>
  );
}

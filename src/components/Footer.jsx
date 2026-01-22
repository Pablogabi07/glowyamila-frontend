import '../styles/footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">

        <h2 className="footer-logo">GlowYamila</h2>

        <p className="footer-text">
          Belleza, cuidado y bienestar. Productos seleccionados con amor.
        </p>

        <div className="footer-links">
          <a href="#about">Quién es</a>
          <a href="#products">Productos</a>
          <a href="https://wa.me/5491133007172" target="_blank">Contacto</a>
        </div>



        <p className="footer-copy">
          © {new Date().getFullYear()} GlowYamila — Todos los derechos reservados
        </p>

        {/* ⭐ Crédito Pablo Design Lab */}
<p className="footer-credit">
  Diseñado por <a href="https://pablodesignlab.vercel.app/" target="_blank">Pablo Design Lab</a>
</p>


      </div>
    </footer>
  )
}

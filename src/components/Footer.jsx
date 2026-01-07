export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h3>Pablo Design Lab</h3>
          <p>© {new Date().getFullYear()} Todos los derechos reservados.</p>
        </div>

        {/* Nuevo bloque con el link a tu estudio */}
        <div className="footer-links">
          <a
            href="https://rrfgw5.csb.app/#portfolio"
            target="_blank"
            rel="noopener noreferrer"
          >
            Sitio oficial
          </a>
        </div>

        <div className="footer-social">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Facebook
          </a>
          <a
            href="https://wa.me/5491162348510"
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </footer>
  );
}

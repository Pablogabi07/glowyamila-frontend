import { useContext } from "react";
import { CartContext } from "../context/CartContext";

export default function PopupCarrito() {
  const {
    abierto,
    cerrarCarrito,
    carrito,
    eliminar,
    vaciar,
    enviar,
    pagar,
    total,
    sumar,
    restar,
  } = useContext(CartContext);

  if (!abierto) return null;

  return (
    <div className="popup-overlay">
      <div className="popup">
        <h2>Tu Carrito</h2>

        {carrito.length === 0 ? (
          <p className="vacio">El carrito está vacío</p>
        ) : (
          <>
            {carrito.map((p, i) => (
              <div key={i} className="popup-item">

                {/* Imagen protegida */}
                {p.imagen && (
                  <img
                    src={p.imagen}
                    alt={p.nombre}
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      marginRight: "10px",
                    }}
                  />
                )}

                <span>{p.nombre}</span>

                <div className="cantidad-controls">
                  <button className="btn-cantidad" onClick={() => restar(p.id)}>
                    -
                  </button>

                  <span className="cantidad">{p.cantidad}</span>

                  <button className="btn-cantidad" onClick={() => sumar(p.id)}>
                    +
                  </button>
                </div>

                <span>${p.precio * p.cantidad}</span>

                <button className="btn-eliminar" onClick={() => eliminar(i)}>
                  X
                </button>
              </div>
            ))}

            <div className="popup-total">
              <strong>Total:</strong> ${total}
            </div>
          </>
        )}

        <div className="popup-buttons">
          <button className="btn-vaciar" onClick={vaciar}>
            Vaciar
          </button>

          <button className="btn-whatsapp" onClick={enviar}>
            Enviar por WhatsApp
          </button>

          {carrito.length > 0 && (
            <button className="btn-pagar" onClick={pagar}>
              Ir a pagar con Mercado Pago
            </button>
          )}
        </div>

        <button className="btn-cerrar" onClick={cerrarCarrito}>
          Cerrar
        </button>
      </div>
    </div>
  );
}

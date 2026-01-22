import { useCart } from '../context/CartContext'
import '../styles/popup.css'

export default function CartPopup() {
  const { cart, isOpen, setIsOpen, increase, decrease, removeFromCart, clearCart } = useCart()

  if (!isOpen) return null

  // Total general
  const total = cart.reduce((acc, item) => {
    const price = item.isOffer ? item.offerPrice : item.price
    return acc + price * item.quantity
  }, 0)

  // MENSAJE DINÁMICO DE WHATSAPP
  const sendWhatsApp = () => {
    const br = "%0A"

    const itemsText = cart
      .map(item => {
        const price = item.isOffer ? item.offerPrice : item.price
        const subtotal = price * item.quantity
        return `• ${item.name} x${item.quantity} — $${subtotal}`
      })
      .join(br)

    const finalMessage =
      `Hola! Quiero hacer un pedido:` + br +
      br +
      itemsText + br +
      br +
      `Total: $${total}` + br +
      br +
      `¿Está disponible?`

    const phone = "5491133007172" // Cambiar por el número real

    window.open(`https://wa.me/${phone}?text=${finalMessage}`)
  }

  return (
    <div className="cart-popup">
      <div className="popup-content popup-animate">
        
        {/* Cerrar */}
        <button className="close" onClick={() => setIsOpen(false)}>X</button>

        <h2>Tu carrito</h2>

        {cart.length === 0 && <p>No hay productos en el carrito.</p>}

        {/* LISTA DE PRODUCTOS */}
        {cart.map(item => {
          const price = item.isOffer ? item.offerPrice : item.price
          const subtotal = price * item.quantity

          return (
            <div key={item.id} className="cart-item">

              <div className="item-info">
                <span className="item-name">{item.name}</span>
                <span className="item-subtotal">
                  x{item.quantity} — ${subtotal}
                </span>
              </div>

              <div className="qty">
                <button onClick={() => decrease(item.id)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => increase(item.id)}>+</button>
              </div>

              <button className="remove" onClick={() => removeFromCart(item.id)}>
                Eliminar
              </button>
            </div>
          )
        })}

        {/* TOTAL GENERAL */}
        <div className="cart-total">
          <span>Total:</span>
          <strong>${total}</strong>
        </div>

        {/* SEGUIR COMPRANDO */}
        <button
          className="continue-btn"
          onClick={() => setIsOpen(false)}
        >
          Seguir comprando
        </button>

        {/* ENVIAR PEDIDO */}
        <button onClick={sendWhatsApp} className="whatsapp-btn">
          Enviar pedido
        </button>

        {/* VACIAR */}
        <button onClick={clearCart} className="clear-btn">
          Vaciar carrito
        </button>

      </div>
    </div>
  )
}

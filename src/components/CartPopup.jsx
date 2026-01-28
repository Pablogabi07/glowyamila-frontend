import { useCart } from '../context/CartContext'
import '../styles/popup.css'

export default function CartPopup() {
  const { cart, isOpen, setIsOpen, increase, decrease, removeFromCart, clearCart } = useCart()

  if (!isOpen) return null

  const total = cart.reduce((acc, item) => {
    const price = item.isOffer ? item.offerPrice : item.price
    return acc + price * item.quantity
  }, 0)

  const sendOrder = async () => {
    if (cart.length === 0) return

    // 1️⃣ Verificar stock usando API interna
    const stockCheck = await fetch("/api/check-stock", {
      method: "POST",
      body: JSON.stringify({ cart }),
      headers: { "Content-Type": "application/json" }
    })

    const stockResult = await stockCheck.json()

    if (!stockCheck.ok) {
      alert(stockResult.error || "Error verificando stock.")
      return
    }

    if (!stockResult.ok) {
      alert(stockResult.message)
      return
    }

    // 2️⃣ Descontar stock usando API interna
    await fetch("/api/decrement-stock", {
      method: "POST",
      body: JSON.stringify({ cart }),
      headers: { "Content-Type": "application/json" }
    })

    // 3️⃣ Armar mensaje de WhatsApp
    const br = "%0A"

    const itemsText = cart
      .map(item => {
        const price = item.isOffer ? item.offerPrice : item.price
        const subtotal = price * item.quantity
        return `• ${item.name} x${item.quantity} — $${subtotal}`
      })
      .join(br)

    const finalMessage =
      `🛒 *Nuevo pedido*` + br +
      br +
      itemsText + br +
      br +
      `*Total:* $${total}` + br +
      br +
      `¿Está disponible?`

    const phone = "5491133007172"

    clearCart()

    window.open(`https://wa.me/${phone}?text=${finalMessage}`)
  }

  return (
    <div className="cart-popup">
      <div className="popup-content popup-animate">
        <button className="close" onClick={() => setIsOpen(false)}>X</button>

        <h2>Tu carrito</h2>

        {cart.length === 0 && <p>No hay productos en el carrito.</p>}

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

        <div className="cart-total">
          <span>Total:</span>
          <strong>${total}</strong>
        </div>

        <button className="continue-btn" onClick={() => setIsOpen(false)}>
          Seguir comprando
        </button>

        <button onClick={sendOrder} className="whatsapp-btn">
          Enviar pedido
        </button>

        <button onClick={clearCart} className="clear-btn">
          Vaciar carrito
        </button>

      </div>
    </div>
  )
}

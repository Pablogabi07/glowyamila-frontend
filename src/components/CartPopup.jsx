import { useCart } from '../context/CartContext'
import { supabase } from '../supabase'
import '../styles/popup.css'

export default function CartPopup() {
  const { cart, isOpen, setIsOpen, increase, decrease, removeFromCart, clearCart } = useCart()

  if (!isOpen) return null

  // Total general
  const total = cart.reduce((acc, item) => {
    const price = item.isOffer ? item.offerPrice : item.price
    return acc + price * item.quantity
  }, 0)

  // 🟣 Enviar pedido con control de stock real
  const sendOrder = async () => {
    if (cart.length === 0) return

    // 1️⃣ Verificar stock en Supabase antes de enviar
    for (const item of cart) {
      const { data, error } = await supabase
        .from('products')
        .select('stock')
        .eq('id', item.id)
        .single()

      if (error) {
        alert("Error verificando stock.")
        return
      }

      if (data.stock < item.quantity) {
        alert(`No hay suficiente stock de ${item.name}. Disponible: ${data.stock}`)
        return
      }
    }

    // 2️⃣ Descontar stock en Supabase usando la función SQL
    for (const item of cart) {
      await supabase.rpc('decrement_stock', {
        product_id: item.id,
        qty: item.quantity
      })
    }

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

    // 4️⃣ Vaciar carrito
    clearCart()

    // 5️⃣ Abrir WhatsApp
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
        <button onClick={sendOrder} className="whatsapp-btn">
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

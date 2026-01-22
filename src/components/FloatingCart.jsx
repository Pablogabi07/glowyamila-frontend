import { useCart } from '../context/CartContext'
import { useEffect, useState } from 'react'
import '../styles/cart.css'

export default function FloatingCart() {
  const { cart, setIsOpen } = useCart()
  const [animateCount, setAnimateCount] = useState(false)
  const [animateCart, setAnimateCart] = useState(false)

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0)
  const totalPrice = cart.reduce((acc, item) => {
    const price = item.isOffer ? item.offerPrice : item.price
    return acc + price * item.quantity
  }, 0)

  // Animación del contador
  useEffect(() => {
    if (cart.length > 0) {
      setAnimateCount(true)
      setAnimateCart(true)

      const timer1 = setTimeout(() => setAnimateCount(false), 300)
      const timer2 = setTimeout(() => setAnimateCart(false), 400)

      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
      }
    }
  }, [totalItems])

  return (
    <div
      className={`floating-cart ${animateCart ? 'cart-pop' : ''}`}
      onClick={() => setIsOpen(true)}
    >
      <div className="cart-icon">🛒</div>

      <div className="cart-info">
        <span className={`cart-count ${animateCount ? 'count-pop' : ''}`}>
          {totalItems}
        </span>
        <strong>${totalPrice}</strong>
      </div>
    </div>
  )
}

import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart')
    return saved ? JSON.parse(saved) : []
  })

  const [toast, setToast] = useState(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2000)
  }

  // 🟣 Agregar producto con control de stock real
  const addToCart = (product) => {
    const stock = Number(product.stock) || 0

    setCart(prev => {
      const exists = prev.find(item => item.id === product.id)

      // Si ya está en el carrito
      if (exists) {
        if (exists.quantity + 1 > stock) {
          showToast(`No hay más stock de ${product.name}`)
          return prev
        }

        showToast(`Sumaste otro ${product.name}`)
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }

      // Si no está en el carrito
      if (stock <= 0) {
        showToast(`No hay stock de ${product.name}`)
        return prev
      }

      showToast(`${product.name} agregado al carrito`)
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  // 🟣 Eliminar producto
  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id))
  }

  // 🟣 Aumentar cantidad con control de stock
  const increase = (id) => {
    setCart(prev =>
      prev.map(item => {
        if (item.id === id) {
          const stock = Number(item.stock) || 0
          if (item.quantity + 1 > stock) {
            showToast(`No hay más stock de ${item.name}`)
            return item
          }
          return { ...item, quantity: item.quantity + 1 }
        }
        return item
      })
    )
  }

  // 🟣 Disminuir cantidad
  const decrease = (id) => {
    setCart(prev =>
      prev.map(item =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    )
  }

  const clearCart = () => {
    setCart([])
  }

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      increase,
      decrease,
      clearCart,
      isOpen,
      setIsOpen,
      toast,
      setToast
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}

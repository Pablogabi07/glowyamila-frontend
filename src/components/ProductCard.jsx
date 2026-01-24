import { useCart } from '../context/CartContext'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()

  // URL base del backend
  const API_URL = import.meta.env.VITE_API_URL

  // Fix para imágenes viejas que quedaron con localhost
  const fixedImageUrl = product.imageUrl
    ? product.imageUrl.replace('http://localhost:4000', '')
    : ''

  return (
    <div className="product-card">
      <img
        src={`${API_URL}${fixedImageUrl}`}
        alt={product.name}
        onError={(e) => (e.target.src = '/placeholder.jpg')}
      />

      <h3>{product.name}</h3>
      <p>{product.description}</p>

      {product.isOffer ? (
        <p className="price">
          <span className="old">${product.price}</span>
          <span className="offer">${product.offerPrice}</span>
        </p>
      ) : (
        <p className="price">${product.price}</p>
      )}

      <button onClick={() => addToCart(product)}>Agregar al carrito</button>
    </div>
  )
}

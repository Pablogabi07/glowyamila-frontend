import { useCart } from '../context/CartContext'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()

  // Ahora la imagen ya viene con URL completa desde Supabase
  const imageUrl = product.imageUrl || '/placeholder.jpg'

  return (
    <div className="product-card">
      <img
        src={imageUrl}
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

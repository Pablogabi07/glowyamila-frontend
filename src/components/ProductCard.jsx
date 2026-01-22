import { useCart } from '../context/CartContext'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()

  return (
    <div className="product-card">
      <img src={`http://localhost:4000${product.imageUrl}`} alt={product.name} />
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

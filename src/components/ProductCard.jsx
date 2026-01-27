import { useCart } from '../context/CartContext'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()

  // Normalización defensiva
  const imageUrl = product.imageUrl || product.image_url || '/placeholder.jpg'
  const isOffer = product.isOffer ?? product.is_offer
  const offerPrice = product.offerPrice ?? product.offer_price
  const stock = Number(product.stock) || 0

  const outOfStock = stock <= 0

  return (
    <div className="product-card">
      <img
        src={imageUrl}
        alt={product.name}
        onError={(e) => (e.target.src = '/placeholder.jpg')}
      />

      <h3>{product.name}</h3>
      <p>{product.description}</p>

      {isOffer ? (
        <p className="price">
          <span className="old">${product.price}</span>
          <span className="offer">${offerPrice}</span>
        </p>
      ) : (
        <p className="price">${product.price}</p>
      )}

      {/* STOCK */}
      <p className={`stock ${outOfStock ? 'no-stock' : ''}`}>
        {outOfStock ? 'Sin stock' : `Stock: ${stock}`}
      </p>

      <button
        disabled={outOfStock}
        className={outOfStock ? 'disabled' : ''}
        onClick={() => addToCart(product)}
      >
        {outOfStock ? 'No disponible' : 'Agregar al carrito'}
      </button>
    </div>
  )
}

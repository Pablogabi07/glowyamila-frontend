import { useContext } from "react";
import { CartContext } from "../context/CartContext";

export default function CartButton() {
  const { carrito, abrirCarrito } = useContext(CartContext);

  const cantidad = carrito.reduce((acc, p) => acc + p.cantidad, 0);

  return (
    <div className="carrito-flotante" onClick={abrirCarrito}>
      🛒 {cantidad}
    </div>
  );
}

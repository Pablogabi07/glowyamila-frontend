import { useContext } from "react";
import { CartContext } from "../context/CartContext";

export default function CartButton() {
  const { carrito, abrirCarrito, animarCarrito } = useContext(CartContext);

  const cantidad = carrito.reduce((acc, p) => acc + p.cantidad, 0);

  return (
    <div className="carrito-flotante" onClick={abrirCarrito}>
      🛒 {cantidad}

      {animarCarrito && <div className="burbuja-voladora"></div>}
    </div>
  );
}

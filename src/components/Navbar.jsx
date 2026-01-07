import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import logo from "../assets/19.png";

export default function Navbar() {
  const { carrito, abrirCarrito } = useContext(CartContext);

  // Cantidad total de productos en el carrito
  const cantidad = carrito.reduce((acc, p) => acc + p.cantidad, 0);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo + Marca */}
        <div className="navbar-logo">
          <img src={logo} alt="logo" />
          <h1>GlowyAmila</h1>
        </div>

        {/* Botón del carrito en el navbar */}
        <div className="navbar-cart" onClick={abrirCarrito}>
          🛒 <span className="cart-count">{cantidad}</span>
        </div>
      </div>
    </nav>
  );
}

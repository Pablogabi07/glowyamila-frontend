import { useContext } from "react";
import { CartContext } from "./context/CartContext";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Productos from "./components/ProductGrid";
import CarritoFlotante from "./components/CartButton";
import PopupCarrito from "./components/PopupCarrito";
import Footer from "./components/Footer";

export default function App() {
  const { abierto } = useContext(CartContext);

  return (
    <>
      <Navbar />

      <Hero />

      {/* Productos ya no recibe agregar como prop */}
      <Productos />

      {/* Carrito flotante usa el contexto */}
      <CarritoFlotante />

      {/* Popup del carrito se muestra solo si está abierto */}
      {abierto && <PopupCarrito />}

      <Footer />
    </>
  );
}

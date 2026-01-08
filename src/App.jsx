import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Productos from "./components/ProductGrid";
import CarritoFlotante from "./components/CartButton";
import PopupCarrito from "./components/PopupCarrito";
import Footer from "./components/Footer";

import { CartProvider } from "./context/CartContext";

export default function App() {
  return (
    <CartProvider>
      <Navbar />

      <Hero />

      <Productos />

      <CarritoFlotante />

      <PopupCarrito />

      <Footer />
    </CartProvider>
  );
}

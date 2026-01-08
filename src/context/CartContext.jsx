import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [carrito, setCarrito] = useState([]);
  const [abierto, setAbierto] = useState(false);
  const [animarCarrito, setAnimarCarrito] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("carrito");
    if (saved) setCarrito(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  const triggerAnimacion = () => {
    setAnimarCarrito(true);
    setTimeout(() => setAnimarCarrito(false), 700);
  };

  const agregar = (producto) => {
    setCarrito((prev) => {
      const index = prev.findIndex((p) => p.id === producto.id);

      if (index >= 0) {
        const nuevo = [...prev];
        nuevo[index].cantidad += 1;
        return nuevo;
      }

      return [...prev, { ...producto, cantidad: 1 }];
    });

    triggerAnimacion();
  };

  const sumar = (id) => {
    setCarrito((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, cantidad: p.cantidad + 1 } : p
      )
    );
  };

  const restar = (id) => {
    setCarrito((prev) =>
      prev
        .map((p) =>
          p.id === id ? { ...p, cantidad: p.cantidad - 1 } : p
        )
        .filter((p) => p.cantidad > 0)
    );
  };

  const eliminar = (index) => {
    setCarrito((prev) => prev.filter((_, i) => i !== index));
  };

  const vaciar = () => setCarrito([]);

  const abrirCarrito = () => setAbierto(true);
  const cerrarCarrito = () => setAbierto(false);

  const total = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  const enviar = () => {
    if (carrito.length === 0) return;

    const mensaje = carrito
      .map((p) => `${p.nombre} x${p.cantidad} = $${p.precio * p.cantidad}`)
      .join("\n");

    const numero = "54911XXXXYYYY"; // ← tu número

    const url = `https://wa.me/${numero}?text=${encodeURIComponent(
      `Hola! Quiero comprar:\n\n${mensaje}\n\nTotal: $${total}`
    )}`;

    window.open(url, "_blank");
  };

  const pagar = async () => {
    try {
      const response = await fetch("/api/create-preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ carrito }),
      });

      const data = await response.json();
      if (data.init_point) {
        window.location.href = data.init_point;
      }
    } catch (error) {
      console.error("Error al pagar:", error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        carrito,
        agregar,
        eliminar,
        vaciar,
        sumar,
        restar,
        abierto,
        abrirCarrito,
        cerrarCarrito,
        total,
        enviar,
        pagar,
        animarCarrito,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

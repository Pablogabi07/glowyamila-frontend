import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Productos from "./components/ProductGrid";
import CarritoFlotante from "./components/CartButton";
import PopupCarrito from "./components/PopupCarrito";
import Footer from "./components/Footer";

import { CartProvider } from "./context/CartContext";

// Admin
import Login from "./admin/Login";
import LayoutAdmin from "./admin/LayoutAdmin";
import ProtectedRoute from "./admin/ProtectedRoute";

import Dashboard from "./admin/Dashboard";

import AdminProductos from "./admin/Productos";
import CrearProducto from "./admin/CrearProducto";
import EditarProducto from "./admin/EditarProducto";

import Categorias from "./admin/Categorias";
import CrearCategoria from "./admin/CrearCategoria";
import EditarCategoria from "./admin/EditarCategoria";

import Combos from "./admin/Combos";
import CrearCombo from "./admin/CrearCombo";
import EditarCombo from "./admin/EditarCombo";

import Ofertas from "./admin/Ofertas";

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>

          {/* ---------------------- */}
          {/*        TIENDA         */}
          {/* ---------------------- */}
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <Hero />
                <Productos />
                <CarritoFlotante />
                <PopupCarrito />
                <Footer />
              </>
            }
          />

          {/* ---------------------- */}
          {/*        LOGIN ADMIN     */}
          {/* ---------------------- */}
          <Route path="/admin/login" element={<Login />} />

          {/* ---------------------- */}
          {/*        PANEL ADMIN     */}
          {/* ---------------------- */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <LayoutAdmin>
                  <Dashboard />
                </LayoutAdmin>
              </ProtectedRoute>
            }
          />

          {/* ---------------------- */}
          {/*     PRODUCTOS ADMIN    */}
          {/* ---------------------- */}
          <Route
            path="/admin/productos"
            element={
              <ProtectedRoute>
                <LayoutAdmin>
                  <AdminProductos />
                </LayoutAdmin>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/productos/crear"
            element={
              <ProtectedRoute>
                <LayoutAdmin>
                  <CrearProducto />
                </LayoutAdmin>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/productos/:id"
            element={
              <ProtectedRoute>
                <LayoutAdmin>
                  <EditarProducto />
                </LayoutAdmin>
              </ProtectedRoute>
            }
          />

          {/* ---------------------- */}
          {/*     CATEGORÍAS ADMIN   */}
          {/* ---------------------- */}
          <Route
            path="/admin/categorias"
            element={
              <ProtectedRoute>
                <LayoutAdmin>
                  <Categorias />
                </LayoutAdmin>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/categorias/crear"
            element={
              <ProtectedRoute>
                <LayoutAdmin>
                  <CrearCategoria />
                </LayoutAdmin>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/categorias/:id"
            element={
              <ProtectedRoute>
                <LayoutAdmin>
                  <EditarCategoria />
                </LayoutAdmin>
              </ProtectedRoute>
            }
          />

          {/* ---------------------- */}
          {/*       COMBOS ADMIN     */}
          {/* ---------------------- */}
          <Route
            path="/admin/combos"
            element={
              <ProtectedRoute>
                <LayoutAdmin>
                  <Combos />
                </LayoutAdmin>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/combos/crear"
            element={
              <ProtectedRoute>
                <LayoutAdmin>
                  <CrearCombo />
                </LayoutAdmin>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/combos/:id"
            element={
              <ProtectedRoute>
                <LayoutAdmin>
                  <EditarCombo />
                </LayoutAdmin>
              </ProtectedRoute>
            }
          />

          {/* ---------------------- */}
          {/*       OFERTAS ADMIN    */}
          {/* ---------------------- */}
          <Route
            path="/admin/ofertas"
            element={
              <ProtectedRoute>
                <LayoutAdmin>
                  <Ofertas />
                </LayoutAdmin>
              </ProtectedRoute>
            }
          />

        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

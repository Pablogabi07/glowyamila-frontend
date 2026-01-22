import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HeroAbout from './components/HeroAbout'
import ProductsSection from './components/ProductsSection'
import FloatingCart from './components/FloatingCart'
import CartPopup from './components/CartPopup'
import WhatsAppButton from './components/WhatsAppButton'
import Footer from './components/Footer'
import Toast from './components/Toast'
import AdminLogin from './components/AdminLogin'
import AdminPanel from './components/AdminPanel'
import AdminDashboard from './components/AdminDashboard'
import { useCart } from './context/CartContext'
import { DarkModeProvider } from './context/DarkModeContext'



function App() {
  const { toast } = useCart()

  return (
    <DarkModeProvider>
      <BrowserRouter>
        <Routes>

          {/* Página principal */}
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <HeroAbout />
                <ProductsSection />
                <FloatingCart />
                <CartPopup />
                <WhatsAppButton />
                <Footer />
                {toast && <Toast message={toast} />}
              </>
            }
          />

          {/* Panel admin */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/panel" element={<AdminPanel />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />


        </Routes>
      </BrowserRouter>
    </DarkModeProvider>
  )
}

export default App

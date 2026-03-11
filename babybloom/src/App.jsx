import { useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import ShopPage from './pages/ShopPage'
import ShopByAgePage from './pages/ShopByAgePage'
import ProductPage from './pages/ProductPage'
import CheckoutPage from './pages/CheckoutPage'
import WishlistPage from './pages/WishlistPage'
import AccountPage from './pages/AccountPage'
import GiftsPage from './pages/GiftsPage'
import LoginPage from './pages/LoginPage'
import AdminPage from './pages/AdminPage'
import NotFoundPage from './pages/NotFoundPage'
import LoadingPage from './components/home/Loading'  // ← add this

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  const [loaded, setLoaded] = useState(false)   // ← add this

  // Show loader until onComplete fires
  if (!loaded) {
    return <LoadingPage onComplete={() => setLoaded(true)} />
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Auth — no navbar/footer */}
        <Route path="/login" element={<LoginPage />} />

        {/* Admin — standalone layout */}
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/*" element={<AdminPage />} />

        {/* Main storefront */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path="shop-by-age" element={<ShopByAgePage />} />
          <Route path="product/:id" element={<ProductPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="account" element={<AccountPage />} />
          <Route path="gifts" element={<GiftsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
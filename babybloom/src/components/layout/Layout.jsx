import { Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './Navbar'
import Footer from './Footer'
import CartDrawer from '../common/CartDrawer'
import SearchModal from '../common/SearchModal'

export default function Layout() {
  return (
    <div className="min-h-screen bg-bloom-cream flex flex-col">
      <Navbar />
      <CartDrawer />
      <SearchModal />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
      <Toaster position="bottom-right" />
    </div>
  )
}
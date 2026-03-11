import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../store/useStore'

const NAV = [
  { label: 'New Arrivals', to: '/shop?filter=new' },
  {
    label: 'Shop',
    to: '/shop',
    children: [
      { label: 'All Products',   to: '/shop' },
      { label: 'Tops & Tees',    to: '/shop?cat=tops' },
      { label: 'Dresses',        to: '/shop?cat=dresses' },
      { label: 'Outerwear',      to: '/shop?cat=outerwear' },
      { label: 'Essentials',     to: '/shop?cat=essentials' },
      { label: 'Sleep',          to: '/shop?cat=sleep' },
      { label: 'Accessories',    to: '/shop?cat=accessories' },
    ],
  },
  { label: 'Shop by Age', to: '/shop-by-age' },
  { label: 'Sale', to: '/shop?filter=sale', accent: true },
  { label: 'Gift Guide', to: '/gifts' },
]

export default function Navbar() {
  const { cartCount, setCartOpen, setSearchOpen, wishlist } = useStore()
  const [scrolled, setScrolled]     = useState(false)
  const [promoIdx, setPromoIdx]     = useState(0)
  const [activeMenu, setActiveMenu] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  const PROMOS = [
    'Free Shipping on Orders Over $50',
    'New Spring Collection — Now Available',
    'Certified Organic Cotton on Every Style',
  ]

  useEffect(() => {
    const id = setInterval(() => setPromoIdx(i => (i + 1) % PROMOS.length), 4000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => { setMobileOpen(false); setActiveMenu(null) }, [location])

  return (
    <>
      {/* ── PROMO BAR ── */}
      <div className="bg-brand-navy text-white h-9 flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={promoIdx}
            className="font-heading font-medium text-xs tracking-wider text-center"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
          >
            {PROMOS[promoIdx]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* ── MAIN NAV ── */}
      <header
        className={`sticky top-0 z-50 bg-brand-cream transition-shadow duration-300 ${
          scrolled ? 'shadow-sm border-b border-ink-ghost/40' : 'border-b border-transparent'
        }`}
      >
        <div className="container">
          <div className="flex items-center h-16 lg:h-18 gap-8">

            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center gap-2.5">
              <div className="w-7 h-7 bg-brand-sage rounded-full" />
              <span className="font-display font-semibold text-xl text-ink tracking-tight">
                BabyBloom
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1 flex-1">
              {NAV.map(item => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.children && setActiveMenu(item.label)}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  <Link
                    to={item.to}
                    className={`font-heading font-medium text-sm px-3.5 py-2 rounded-md transition-colors duration-150 ${
                      item.accent
                        ? 'text-brand-terracotta hover:bg-brand-blush-light'
                        : 'text-ink-soft hover:text-ink hover:bg-brand-cream-dark'
                    }`}
                  >
                    {item.label}
                  </Link>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {item.children && activeMenu === item.label && (
                      <motion.div
                        className="absolute top-full left-0 mt-1 bg-white border border-ink-ghost/50 rounded-xl shadow-lg overflow-hidden min-w-48 z-50"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.18 }}
                      >
                        {item.children.map(child => (
                          <Link
                            key={child.label}
                            to={child.to}
                            className="block px-5 py-2.5 font-body text-sm text-ink-soft hover:text-ink hover:bg-brand-cream transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="ml-auto flex items-center gap-1">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="w-9 h-9 flex items-center justify-center rounded-md text-ink-muted hover:text-ink hover:bg-brand-cream-dark transition-colors"
                aria-label="Search"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
              </button>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="relative w-9 h-9 flex items-center justify-center rounded-md text-ink-muted hover:text-ink hover:bg-brand-cream-dark transition-colors"
                aria-label="Wishlist"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                {wishlist.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-terracotta text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Account */}
              <Link
                to="/account"
                className="w-9 h-9 hidden lg:flex items-center justify-center rounded-md text-ink-muted hover:text-ink hover:bg-brand-cream-dark transition-colors"
                aria-label="Account"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </Link>

              {/* Cart */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative ml-2 flex items-center gap-2.5 bg-ink text-white pl-4 pr-5 h-9 rounded-md font-heading font-semibold text-sm hover:bg-ink-soft transition-colors"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
                Bag
                {cartCount() > 0 && (
                  <span className="bg-brand-terracotta text-white rounded-full w-5 h-5 text-[10px] font-bold flex items-center justify-center -ml-1">
                    {cartCount()}
                  </span>
                )}
              </button>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(o => !o)}
                className="lg:hidden ml-1 w-9 h-9 flex items-center justify-center rounded-md text-ink-muted hover:text-ink"
                aria-label="Menu"
              >
                {mobileOpen ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ── MOBILE MENU ── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              className="lg:hidden bg-brand-cream border-t border-ink-ghost/40"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{ overflow: 'hidden' }}
            >
              <div className="container py-5 flex flex-col gap-1">
                {NAV.map(item => (
                  <Link
                    key={item.label}
                    to={item.to}
                    className={`font-heading font-medium text-sm px-4 py-3 rounded-lg ${
                      item.accent ? 'text-brand-terracotta' : 'text-ink-soft hover:text-ink hover:bg-brand-cream-dark'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="divider mt-3 pt-3">
                  <Link to="/account" className="font-heading font-medium text-sm px-4 py-3 block text-ink-soft hover:text-ink">
                    My Account
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}
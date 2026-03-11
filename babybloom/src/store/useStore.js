import { create } from 'zustand'

export const useStore = create((set, get) => ({
  // Cart
  cart: [],
  addToCart: (product, size = 'S', qty = 1) => {
    const cart = get().cart
    const existing = cart.find(i => i.id === product.id && i.size === size)
    if (existing) {
      set({ cart: cart.map(i => i.id === product.id && i.size === size ? { ...i, qty: i.qty + qty } : i) })
    } else {
      set({ cart: [...cart, { ...product, size, qty }] })
    }
  },
  removeFromCart: (id, size) => set({ cart: get().cart.filter(i => !(i.id === id && i.size === size)) }),
  updateQty: (id, size, qty) => {
    if (qty < 1) return get().removeFromCart(id, size)
    set({ cart: get().cart.map(i => i.id === id && i.size === size ? { ...i, qty } : i) })
  },
  clearCart: () => set({ cart: [] }),
  cartTotal: () => get().cart.reduce((sum, i) => sum + i.price * i.qty, 0),
  cartCount: () => get().cart.reduce((sum, i) => sum + i.qty, 0),

  // Wishlist
  wishlist: [],
  toggleWishlist: (product) => {
    const wl = get().wishlist
    const exists = wl.find(i => i.id === product.id)
    if (exists) {
      set({ wishlist: wl.filter(i => i.id !== product.id) })
    } else {
      set({ wishlist: [...wl, product] })
    }
  },
  isWishlisted: (id) => get().wishlist.some(i => i.id === id),

  // UI
  cartOpen: false,
  setCartOpen: (v) => set({ cartOpen: v }),
  searchOpen: false,
  setSearchOpen: (v) => set({ searchOpen: v }),
}))
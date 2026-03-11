import { AnimatePresence, motion } from 'framer-motion'
import { FiX, FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { useStore } from '../../store/useStore'

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, removeFromCart, updateQty, cartTotal } = useStore()
  const total = cartTotal()

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
          />

    
          <motion.div
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-bloom-cream z-50 shadow-soft-lg flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
          >
            <div className="p-6 border-b border-bloom-pink/20 flex items-center justify-between bg-white">
              <div>
                <h2 className="font-display font-extrabold text-2xl text-text-primary">Your Cart 🛒</h2>
                <p className="text-sm text-text-muted font-body">{cart.length} item{cart.length !== 1 ? 's' : ''}</p>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="btn-icon hover:bg-bloom-pink/30 text-text-secondary"
              >
                <FiX size={22} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <div className="text-7xl animate-float">🛍️</div>
                  <div>
                    <h3 className="font-display font-bold text-xl text-text-primary">Your cart is empty!</h3>
                    <p className="text-text-muted font-body text-sm mt-1">Add some cute items to get started</p>
                  </div>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="btn-primary text-sm"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <AnimatePresence>
                  {cart.map((item) => (
                    <motion.div
                      key={`${item.id}-${item.size}`}
                      className="card p-4 flex gap-4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      layout
                    >
                      <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-bloom-pink/20">
                        <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-display font-bold text-text-primary text-sm truncate">{item.name}</h4>
                        <p className="text-xs text-text-muted font-body">Size: {item.size} · {item.ageRange}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-display font-extrabold text-bloom-pink-dark">${(item.price * item.qty).toFixed(2)}</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQty(item.id, item.size, item.qty - 1)}
                              className="w-6 h-6 rounded-full bg-bloom-pink/30 flex items-center justify-center hover:bg-bloom-pink transition-colors"
                            >
                              <FiMinus size={12} />
                            </button>
                            <span className="font-bold text-sm w-4 text-center">{item.qty}</span>
                            <button
                              onClick={() => updateQty(item.id, item.size, item.qty + 1)}
                              className="w-6 h-6 rounded-full bg-bloom-pink/30 flex items-center justify-center hover:bg-bloom-pink transition-colors"
                            >
                              <FiPlus size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id, item.size)}
                        className="text-text-muted hover:text-red-400 transition-colors shrink-0"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-bloom-pink/20 bg-white space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-body font-semibold text-text-secondary">Subtotal</span>
                  <span className="font-display font-extrabold text-xl text-text-primary">${total.toFixed(2)}</span>
                </div>
                <p className="text-xs text-text-muted text-center font-body">
                  🎉 Free shipping on orders over $40!
                </p>
                <Link
                  to="/checkout"
                  onClick={() => setCartOpen(false)}
                  className="btn-primary w-full text-center block"
                >
                  Checkout Now →
                </Link>
                <button
                  onClick={() => setCartOpen(false)}
                  className="w-full text-center text-sm text-text-muted font-body hover:text-bloom-pink-dark transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
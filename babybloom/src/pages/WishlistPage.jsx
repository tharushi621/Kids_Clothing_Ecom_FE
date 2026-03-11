import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useStore } from '../store/useStore'
import ProductCard from '../components/common/ProductCard'

export default function WishlistPage() {
  const { wishlist } = useStore()

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="font-display font-extrabold text-4xl text-text-primary mb-2">
          My Wishlist ❤️
        </h1>
        <p className="text-text-muted font-body">{wishlist.length} saved item{wishlist.length !== 1 ? 's' : ''}</p>
      </div>

      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 gap-6 text-center">
          <motion.div
            className="text-8xl"
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            🤍
          </motion.div>
          <div>
            <h2 className="font-display font-bold text-2xl text-text-primary mb-2">Your wishlist is empty!</h2>
            <p className="font-body text-text-muted">Save your favorite items by clicking the ❤️ on any product.</p>
          </div>
          <Link to="/shop" className="btn-primary">Explore Products →</Link>
        </div>
      ) : (
        <AnimatePresence>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {wishlist.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  )
}
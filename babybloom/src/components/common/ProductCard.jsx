import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiHeart, FiShoppingCart, FiEye } from 'react-icons/fi'
import { useStore } from '../../store/useStore'
import toast from 'react-hot-toast'

export default function ProductCard({ product, index = 0 }) {
  const [imgIndex, setImgIndex] = useState(0)
  const [hovering, setHovering] = useState(false)
  const { addToCart, toggleWishlist, isWishlisted } = useStore()
  const wishlisted = isWishlisted(product.id)

  const handleAddToCart = (e) => {
    e.preventDefault()
    addToCart(product, product.sizes[0])
    toast.success(`Added ${product.name} to cart! 🛒`, {
      style: { background: '#FFD6E8', color: '#3D2C2C', fontFamily: 'Nunito', fontWeight: 700 },
      icon: '🌸',
    })
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    toggleWishlist(product)
    toast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist! ❤️', {
      style: { background: wishlisted ? '#f5f5f5' : '#FFD6E8', color: '#3D2C2C', fontFamily: 'Nunito', fontWeight: 700 },
    })
  }

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group"
    >
      <Link to={`/product/${product.id}`}>
        <div
          className="card overflow-hidden cursor-pointer"
          onMouseEnter={() => { setHovering(true); if (product.images[1]) setImgIndex(1) }}
          onMouseLeave={() => { setHovering(false); setImgIndex(0) }}
        >
   
          <div className="relative overflow-hidden bg-bloom-cream aspect-square">
            <motion.img
              key={imgIndex}
              src={product.images[imgIndex]}
              alt={product.name}
              className="w-full h-full object-cover"
              initial={{ opacity: 0.8, scale: 1.05 }}
              animate={{ opacity: 1, scale: hovering ? 1.08 : 1 }}
              transition={{ duration: 0.4 }}
            />

            {product.badge && (
              <div className={`absolute top-3 left-3 ${product.badgeColor} tag text-xs font-display font-bold shadow-soft`}>
                {product.badge}
              </div>
            )}

            {discount && (
              <div className="absolute top-3 right-3 bg-bloom-pink-dark text-white tag text-xs font-display font-bold shadow-pink">
                -{discount}%
              </div>
            )}

            <motion.div
              className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 px-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: hovering ? 1 : 0, y: hovering ? 0 : 10 }}
              transition={{ duration: 0.2 }}
            >
              <motion.button
                onClick={handleAddToCart}
                className="flex-1 bg-white/95 backdrop-blur-sm text-bloom-pink-dark font-display font-bold text-sm py-2 px-3 rounded-2xl shadow-soft flex items-center justify-center gap-2 hover:bg-bloom-pink-dark hover:text-white transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <FiShoppingCart size={14} />
                Add to Cart
              </motion.button>
              <motion.button
                onClick={handleWishlist}
                className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-soft transition-colors ${
                  wishlisted
                    ? 'bg-bloom-pink-dark text-white'
                    : 'bg-white/95 text-bloom-pink-dark hover:bg-bloom-pink-dark hover:text-white'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiHeart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
              </motion.button>
            </motion.div>

            {product.stock < 20 && (
              <div className="absolute bottom-0 left-0 right-0 bg-bloom-yellow/90 backdrop-blur-sm text-center text-xs font-bold font-body py-1 text-text-primary">
                Only {product.stock} left!
              </div>
            )}
          </div>

          <div className="p-4">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-display font-bold text-text-primary text-sm leading-tight group-hover:text-bloom-pink-dark transition-colors">
                {product.name}
              </h3>
            </div>

            <div className="flex items-center gap-1 mb-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`text-xs ${i < Math.floor(product.rating) ? 'text-bloom-yellow-dark' : 'text-gray-200'}`}>★</span>
                ))}
              </div>
              <span className="text-xs text-text-muted font-body">({product.reviews})</span>
            </div>

            <div className="flex items-center gap-1 mb-2">
              <span className="text-xs bg-bloom-lavender text-bloom-lavender-dark rounded-pill px-2 py-0.5 font-body font-semibold">
                {product.ageRange}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="font-display font-extrabold text-bloom-pink-dark text-lg">${product.price}</span>
                {product.originalPrice && (
                  <span className="font-body text-text-muted text-sm line-through">${product.originalPrice}</span>
                )}
              </div>
              <div className="flex gap-1">
                {product.colors?.slice(0, 3).map((c, i) => (
                  <div key={i} className="w-4 h-4 rounded-full border-2 border-white shadow-sm" style={{ background: c }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
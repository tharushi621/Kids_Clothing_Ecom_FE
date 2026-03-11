import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiHeart, FiShoppingCart, FiShare2, FiTruck, FiRefreshCw, FiShield, FiChevronDown, FiArrowLeft } from 'react-icons/fi'
import { useStore } from '../store/useStore'
import ProductCard from '../components/common/ProductCard'
import { products } from '../data/products'
import toast from 'react-hot-toast'

export default function ProductPage() {
  const { id } = useParams()
  const product = products.find(p => p.id === Number(id))
  const [mainImg, setMainImg] = useState(0)
  const [selectedSize, setSelectedSize] = useState(null)
  const [qty, setQty] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const { addToCart, toggleWishlist, isWishlisted, setCartOpen } = useStore()
  const wishlisted = isWishlisted(product?.id)

  if (!product) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <div className="text-7xl">😕</div>
      <h2 className="font-display font-bold text-2xl">Product not found</h2>
      <Link to="/shop" className="btn-primary">Back to Shop</Link>
    </div>
  )

  const related = products.filter(p => p.id !== product.id && p.category === product.category).slice(0, 4)
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : null

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size!', { style: { background: '#FFE0E0', fontFamily: 'Nunito', fontWeight: 700 } })
      return
    }
    addToCart(product, selectedSize, qty)
    toast.success(`${product.name} added to cart! 🛒`, {
      style: { background: '#FFD6E8', color: '#3D2C2C', fontFamily: 'Nunito', fontWeight: 700 },
    })
    setCartOpen(true)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-8 text-sm font-body text-text-muted">
        <Link to="/" className="hover:text-bloom-pink-dark transition-colors">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-bloom-pink-dark transition-colors">Shop</Link>
        <span>/</span>
        <span className="text-text-primary font-semibold">{product.name}</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 mb-20">
        {/* Images */}
        <div className="space-y-4">
          <motion.div
            className="aspect-square rounded-4xl overflow-hidden bg-bloom-cream shadow-soft-lg"
            layoutId={`product-${product.id}`}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={mainImg}
                src={product.images[mainImg]}
                alt={product.name}
                className="w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            </AnimatePresence>
          </motion.div>
          <div className="flex gap-3">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setMainImg(i)}
                className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                  mainImg === i ? 'border-bloom-pink-dark shadow-pink' : 'border-transparent'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-6">
          {/* Badge + Share */}
          <div className="flex items-center justify-between">
            {product.badge && (
              <span className={`${product.badgeColor} tag text-sm`}>{product.badge}</span>
            )}
            <div className="flex gap-2 ml-auto">
              <motion.button
                onClick={() => toggleWishlist(product)}
                className={`btn-icon ${wishlisted ? 'bg-bloom-pink-dark text-white' : 'bg-bloom-pink/30 text-bloom-pink-dark hover:bg-bloom-pink-dark hover:text-white'} transition-colors`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiHeart size={18} fill={wishlisted ? 'currentColor' : 'none'} />
              </motion.button>
              <motion.button
                className="btn-icon bg-bloom-blue/30 text-bloom-blue-dark hover:bg-bloom-blue-dark hover:text-white transition-colors"
                whileHover={{ scale: 1.1 }}
              >
                <FiShare2 size={18} />
              </motion.button>
            </div>
          </div>

          <div>
            <h1 className="font-display font-extrabold text-3xl lg:text-4xl text-text-primary mb-3">{product.name}</h1>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`${i < Math.floor(product.rating) ? 'text-bloom-yellow-dark' : 'text-gray-200'}`}>★</span>
                ))}
              </div>
              <span className="font-body text-text-muted text-sm">{product.rating} ({product.reviews} reviews)</span>
              <span className={`tag text-xs ${product.stock < 20 ? 'bg-bloom-yellow text-bloom-yellow-dark' : 'bg-bloom-mint text-bloom-mint-dark'}`}>
                {product.stock < 20 ? `⚡ Only ${product.stock} left!` : `✅ In Stock (${product.stock})`}
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="font-display font-extrabold text-4xl text-bloom-pink-dark">${product.price}</span>
            {product.originalPrice && (
              <>
                <span className="font-body text-text-muted text-xl line-through">${product.originalPrice}</span>
                <span className="bg-bloom-pink-dark text-white tag font-bold">-{discount}% OFF</span>
              </>
            )}
          </div>

          {/* Info Tags */}
          <div className="flex flex-wrap gap-2">
            <span className="tag bg-bloom-lavender text-bloom-lavender-dark text-xs">👶 {product.ageRange}</span>
            <span className="tag bg-bloom-mint text-bloom-mint-dark text-xs">🌱 {product.material}</span>
          </div>

          {/* Size Selector */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-bold text-text-primary">Select Size</h3>
              <button className="text-xs font-body text-bloom-blue-dark hover:underline">📏 Size Guide</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map(size => (
                <motion.button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-5 py-2 rounded-2xl font-display font-bold text-sm border-2 transition-all ${
                    selectedSize === size
                      ? 'bg-bloom-pink-dark text-white border-bloom-pink-dark shadow-pink'
                      : 'bg-white text-text-secondary border-bloom-pink/30 hover:border-bloom-pink-dark hover:text-bloom-pink-dark'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {size}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Qty */}
          <div>
            <h3 className="font-display font-bold text-text-primary mb-3">Quantity</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-bloom-cream rounded-2xl p-1">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-9 h-9 rounded-xl bg-white shadow-soft flex items-center justify-center font-bold text-bloom-pink-dark hover:bg-bloom-pink transition-colors"
                >
                  −
                </button>
                <span className="font-display font-bold text-text-primary w-8 text-center">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="w-9 h-9 rounded-xl bg-white shadow-soft flex items-center justify-center font-bold text-bloom-pink-dark hover:bg-bloom-pink transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="flex gap-3">
            <motion.button
              onClick={handleAddToCart}
              className="flex-1 btn-primary flex items-center justify-center gap-2 text-lg py-4"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <FiShoppingCart />
              Add to Cart
            </motion.button>
            <motion.button
              onClick={() => toggleWishlist(product)}
              className={`btn-icon w-14 h-14 ${wishlisted ? 'bg-bloom-pink-dark text-white' : 'bg-bloom-pink/30 text-bloom-pink-dark'} transition-colors`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiHeart size={20} fill={wishlisted ? 'currentColor' : 'none'} />
            </motion.button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-bloom-pink/20">
            {[
              { icon: FiTruck, label: 'Free Shipping', sub: 'Orders $40+', color: 'text-bloom-blue-dark' },
              { icon: FiRefreshCw, label: 'Easy Returns', sub: '30 days', color: 'text-bloom-mint-dark' },
              { icon: FiShield, label: 'Safe & Secure', sub: 'SSL Protected', color: 'text-bloom-lavender-dark' },
            ].map(({ icon: Icon, label, sub, color }) => (
              <div key={label} className="flex flex-col items-center text-center gap-1 p-3 rounded-2xl bg-bloom-cream">
                <Icon size={20} className={color} />
                <span className="font-display font-bold text-text-primary text-xs">{label}</span>
                <span className="font-body text-text-muted text-xs">{sub}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-16">
        <div className="flex gap-2 border-b border-bloom-pink/20 mb-8 overflow-x-auto scrollbar-hide">
          {['description', 'care', 'reviews'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-display font-bold text-sm capitalize whitespace-nowrap border-b-2 transition-all ${
                activeTab === tab
                  ? 'border-bloom-pink-dark text-bloom-pink-dark'
                  : 'border-transparent text-text-muted hover:text-text-secondary'
              }`}
            >
              {tab === 'description' ? '📋 Description' : tab === 'care' ? '🧺 Care Instructions' : '⭐ Reviews'}
            </button>
          ))}
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'description' && (
            <div className="max-w-2xl space-y-4">
              <p className="font-body text-text-secondary leading-relaxed">{product.description}</p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  ['Material', product.material],
                  ['Age Range', product.ageRange],
                  ['Sizes Available', product.sizes.join(', ')],
                  ['Category', product.category],
                ].map(([label, val]) => (
                  <div key={label} className="bg-bloom-cream rounded-2xl p-4">
                    <p className="font-body text-text-muted text-xs mb-1">{label}</p>
                    <p className="font-display font-bold text-text-primary text-sm">{val}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'care' && (
            <div className="max-w-lg">
              <div className="card p-6 space-y-3">
                <p className="font-body text-text-secondary">{product.careInstructions}</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {['🌊 Cold Wash', '🚫 No Bleach', '☀️ Dry Flat', '🔥 Low Heat'].map(tip => (
                    <span key={tip} className="tag bg-bloom-blue/30 text-bloom-blue-dark text-xs">{tip}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
          {activeTab === 'reviews' && (
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center gap-4 p-6 card">
                <div className="text-center">
                  <p className="font-display font-extrabold text-5xl text-bloom-pink-dark">{product.rating}</p>
                  <div className="flex gap-0.5 justify-center my-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-bloom-yellow-dark">★</span>
                    ))}
                  </div>
                  <p className="font-body text-text-muted text-xs">{product.reviews} reviews</p>
                </div>
                <div className="flex-1 space-y-2">
                  {[5,4,3,2,1].map(star => (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-xs text-text-muted w-2">{star}</span>
                      <div className="flex-1 h-2 bg-bloom-cream rounded-full overflow-hidden">
                        <div
                          className="h-full bg-bloom-yellow-dark rounded-full"
                          style={{ width: `${star === 5 ? 75 : star === 4 ? 18 : star === 3 ? 5 : 2}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <p className="font-body text-text-muted text-sm">Be the first to share your experience with this product!</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div>
          <h2 className="section-title text-3xl mb-8">You May Also <span className="text-gradient-pink">Love</span> 💝</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
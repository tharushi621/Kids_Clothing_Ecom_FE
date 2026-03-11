import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ProductCard from '../components/common/ProductCard'
import { products, ageGroups } from '../data/products'

export default function ShopByAgePage() {
  const [activeGroup, setActiveGroup] = useState(ageGroups[0].id)
  const navigate = useNavigate()

  const filtered = products.filter(p => p.ageGroup === activeGroup)
  const current = ageGroups.find(a => a.id === activeGroup)

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-bloom-blue/30 rounded-pill px-5 py-2 mb-4">
          <span>👶</span>
          <span className="font-body font-bold text-bloom-blue-dark text-sm">Perfectly Sized for Every Stage</span>
        </div>
        <h1 className="font-display font-extrabold text-5xl text-text-primary mb-4">
          Shop by <span className="text-gradient-pink">Age</span>
        </h1>
        <p className="font-body text-text-muted max-w-lg mx-auto">
          Every baby grows at their own pace. We've made it easy to find clothes that fit just right.
        </p>
      </div>

      {/* Age Selector */}
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-4 mb-10 justify-center flex-wrap">
        {ageGroups.map((group, i) => (
          <motion.button
            key={group.id}
            onClick={() => setActiveGroup(group.id)}
            className={`flex flex-col items-center gap-2 px-6 py-4 rounded-3xl border-2 transition-all min-w-max ${
              activeGroup === group.id
                ? `${group.color} border-transparent shadow-soft-lg`
                : 'bg-white border-bloom-pink/20 hover:border-bloom-pink-dark'
            }`}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <motion.span
              className="text-3xl"
              animate={activeGroup === group.id ? { y: [0, -6, 0] } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {group.emoji}
            </motion.span>
            <div className="text-center">
              <p className={`font-display font-extrabold text-sm ${activeGroup === group.id ? group.accent : 'text-text-secondary'}`}>
                {group.label}
              </p>
              <p className="font-body text-xs text-text-muted">{group.range}</p>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Products */}
      <motion.div
        key={activeGroup}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-bold text-2xl text-text-primary">
            {current?.emoji} {current?.label} ({filtered.length} items)
          </h2>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="text-7xl mb-4">{current?.emoji}</div>
            <h3 className="font-display font-bold text-2xl text-text-primary mb-2">Coming Soon!</h3>
            <p className="font-body text-text-muted mb-6">We're adding more products for this age group.</p>
            <motion.button
              onClick={() => navigate('/shop')}
              className="btn-primary"
              whileHover={{ scale: 1.05 }}
            >
              Browse All Products
            </motion.button>
          </div>
        )}
      </motion.div>
    </div>
  )
}
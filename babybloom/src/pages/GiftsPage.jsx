import { useState } from 'react'
import { motion } from 'framer-motion'
import ProductCard from '../components/common/ProductCard'
import { products } from '../data/products'

const giftTypes = [
  { id: 'newborn', label: 'Gift for Newborn', emoji: '👶', color: 'bg-bloom-pink', desc: 'Perfect for brand new arrivals' },
  { id: 'birthday', label: 'Birthday Gift', emoji: '🎂', color: 'bg-bloom-yellow', desc: 'Make their day extra special' },
  { id: 'shower', label: 'Baby Shower', emoji: '🍼', color: 'bg-bloom-blue', desc: 'Celebrate the new arrival' },
  { id: 'holiday', label: 'Holiday Gift', emoji: '🎁', color: 'bg-bloom-mint', desc: 'Seasonal favourites' },
]

export default function GiftsPage() {
  const [selected, setSelected] = useState('newborn')

  const giftProducts = products.filter(p =>
    selected === 'newborn' ? p.ageGroup === 'newborn' :
    selected === 'birthday' ? p.category === 'Party Wear' || p.bestseller :
    selected === 'shower' ? p.featured :
    p.badge === 'New'
  )

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-bloom-yellow/40 rounded-pill px-5 py-2 mb-4">
          <span>🎁</span>
          <span className="font-body font-bold text-bloom-yellow-dark text-sm">Curated with Love</span>
        </div>
        <h1 className="font-display font-extrabold text-5xl text-text-primary mb-4">
          Gift <span className="text-gradient-rainbow">Ideas</span> 🎁
        </h1>
        <p className="font-body text-text-muted max-w-md mx-auto">
          Find the perfect gift for any occasion. Every little one deserves something magical.
        </p>
      </div>

      {/* Gift Type Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {giftTypes.map((type, i) => (
          <motion.button
            key={type.id}
            onClick={() => setSelected(type.id)}
            className={`p-5 rounded-3xl text-center border-2 transition-all ${
              selected === type.id
                ? `${type.color} border-transparent shadow-soft-lg`
                : 'bg-white border-bloom-pink/20 hover:border-bloom-pink-dark'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.03, y: -3 }}
            whileTap={{ scale: 0.97 }}
          >
            <div className="text-4xl mb-2">{type.emoji}</div>
            <h3 className="font-display font-bold text-text-primary text-sm">{type.label}</h3>
            <p className="font-body text-text-muted text-xs mt-1">{type.desc}</p>
          </motion.button>
        ))}
      </div>

      {/* Gift Wrapping Banner */}
      <motion.div
        className="bg-gradient-to-r from-bloom-pink via-bloom-lavender/50 to-bloom-blue/30 rounded-4xl p-8 mb-12 flex flex-col md:flex-row items-center justify-between gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-4">
          <div className="text-5xl animate-float">🎀</div>
          <div>
            <h3 className="font-display font-extrabold text-2xl text-text-primary">Add Gift Wrapping!</h3>
            <p className="font-body text-text-secondary text-sm">Beautiful packaging with a personalized message card. Only $4.99.</p>
          </div>
        </div>
        <motion.button
          className="btn-primary whitespace-nowrap"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🎁 Add to Order
        </motion.button>
      </motion.div>

      {/* Products */}
      <motion.div
        key={selected}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
      >
        {giftProducts.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </motion.div>
    </div>
  )
}
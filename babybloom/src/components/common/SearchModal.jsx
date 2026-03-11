import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiSearch, FiX, FiArrowRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { useStore } from '../../store/useStore'
import { products } from '../../data/products'

const suggestions = ['bodysuits', 'dresses', 'newborn', 'winter', 'gift', 'party']

export default function SearchModal() {
  const { searchOpen, setSearchOpen } = useStore()
  const [query, setQuery] = useState('')

  const results = query.length > 1
    ? products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.ageRange.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : []

  useEffect(() => {
    if (!searchOpen) setQuery('')
  }, [searchOpen])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setSearchOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <AnimatePresence>
      {searchOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSearchOpen(false)}
          />
          <motion.div
            className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl mx-4 z-50"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="card overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-3 p-4 border-b border-bloom-pink/20">
                <FiSearch size={20} className="text-bloom-pink-dark shrink-0" />
                <input
                  autoFocus
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search for bodysuits, dresses, age groups..."
                  className="flex-1 font-body text-text-primary placeholder-text-muted outline-none bg-transparent text-lg"
                />
                {query && (
                  <button onClick={() => setQuery('')} className="btn-icon hover:bg-bloom-pink/30">
                    <FiX size={18} />
                  </button>
                )}
              </div>

              {/* Results or Suggestions */}
              <div className="p-4">
                {results.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-xs font-body font-semibold text-text-muted uppercase tracking-widest mb-3">Results</p>
                    {results.map(p => (
                      <Link
                        key={p.id}
                        to={`/product/${p.id}`}
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center gap-3 p-3 rounded-2xl hover:bg-bloom-pink/20 transition-colors group"
                      >
                        <img src={p.images[0]} alt={p.name} className="w-12 h-12 rounded-xl object-cover" />
                        <div className="flex-1">
                          <p className="font-display font-bold text-text-primary text-sm group-hover:text-bloom-pink-dark transition-colors">{p.name}</p>
                          <p className="text-xs text-text-muted font-body">{p.category} · {p.ageRange}</p>
                        </div>
                        <span className="font-display font-extrabold text-bloom-pink-dark">${p.price}</span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div>
                    <p className="text-xs font-body font-semibold text-text-muted uppercase tracking-widest mb-3">Popular Searches</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.map(s => (
                        <button
                          key={s}
                          onClick={() => setQuery(s)}
                          className="px-4 py-2 bg-bloom-pink/30 text-bloom-pink-dark rounded-pill text-sm font-body font-semibold hover:bg-bloom-pink transition-colors capitalize"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiFilter, FiGrid, FiList, FiX, FiChevronDown } from 'react-icons/fi'
import ProductCard from '../components/common/ProductCard'
import { products, ageGroups, categories } from '../data/products'

const sortOptions = ['Featured', 'Price: Low to High', 'Price: High to Low', 'Top Rated', 'Newest']

export default function ShopPage() {
  const [searchParams] = useSearchParams()
  const [sortBy, setSortBy] = useState('Featured')
  const [filterOpen, setFilterOpen] = useState(false)
  const [selectedAges, setSelectedAges] = useState([])
  const [selectedCats, setSelectedCats] = useState([])
  const [priceRange, setPriceRange] = useState([0, 100])

  const urlAge = searchParams.get('age')
  const urlCat = searchParams.get('cat')
  const urlFilter = searchParams.get('filter')

  const filtered = useMemo(() => {
    let list = [...products]
    const ages = urlAge ? [urlAge] : selectedAges
    const cats = urlCat ? [urlCat] : selectedCats
    if (ages.length) list = list.filter(p => ages.includes(p.ageGroup))
    if (cats.length) list = list.filter(p => cats.some(c => p.category.toLowerCase().replace(/\s/g, '-') === c))
    if (urlFilter === 'new') list = list.filter(p => p.badge === 'New')
    if (urlFilter === 'bestseller') list = list.filter(p => p.bestseller)
    if (urlFilter === 'sale') list = list.filter(p => p.originalPrice)
    list = list.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])
    if (sortBy === 'Price: Low to High') list.sort((a, b) => a.price - b.price)
    if (sortBy === 'Price: High to Low') list.sort((a, b) => b.price - a.price)
    if (sortBy === 'Top Rated') list.sort((a, b) => b.rating - a.rating)
    return list
  }, [selectedAges, selectedCats, priceRange, sortBy, urlAge, urlCat, urlFilter])

  const toggleAge = (id) => setSelectedAges(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id])
  const toggleCat = (id) => setSelectedCats(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id])

  const activeAges = urlAge ? [urlAge] : selectedAges
  const activeCats = urlCat ? [urlCat] : selectedCats
  const filtersActive = activeAges.length + activeCats.length

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display font-extrabold text-4xl text-text-primary mb-2">
          {urlFilter === 'sale' ? '🏷️ Sale Items' :
           urlFilter === 'new' ? '✨ New Arrivals' :
           urlFilter === 'bestseller' ? '🌟 Best Sellers' :
           urlCat ? `${categories.find(c => c.id === urlCat)?.emoji} ${categories.find(c => c.id === urlCat)?.label}` :
           urlAge ? `${ageGroups.find(a => a.id === urlAge)?.emoji} ${ageGroups.find(a => a.id === urlAge)?.label}` :
           'All Products 🛍️'}
        </h1>
        <p className="text-text-muted font-body">{filtered.length} products found</p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filter - Desktop */}
        <aside className="hidden lg:block w-72 shrink-0 space-y-6">
          {/* Age Filter */}
          <div className="card p-5">
            <h3 className="font-display font-bold text-text-primary mb-4 flex items-center gap-2">
              <span>👶</span> Age Group
            </h3>
            <div className="space-y-2">
              {ageGroups.map(group => (
                <label key={group.id} className="flex items-center gap-3 cursor-pointer group">
                  <div
                    onClick={() => toggleAge(group.id)}
                    className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all cursor-pointer ${
                      activeAges.includes(group.id)
                        ? 'bg-bloom-pink-dark border-bloom-pink-dark'
                        : 'border-bloom-pink/40 hover:border-bloom-pink-dark'
                    }`}
                  >
                    {activeAges.includes(group.id) && <span className="text-white text-xs">✓</span>}
                  </div>
                  <span className="font-body text-text-secondary text-sm group-hover:text-bloom-pink-dark transition-colors">
                    {group.emoji} {group.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="card p-5">
            <h3 className="font-display font-bold text-text-primary mb-4 flex items-center gap-2">
              <span>🏷️</span> Category
            </h3>
            <div className="space-y-2">
              {categories.map(cat => (
                <label key={cat.id} className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div
                      onClick={() => toggleCat(cat.id)}
                      className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all cursor-pointer ${
                        activeCats.includes(cat.id)
                          ? 'bg-bloom-pink-dark border-bloom-pink-dark'
                          : 'border-bloom-pink/40 hover:border-bloom-pink-dark'
                      }`}
                    >
                      {activeCats.includes(cat.id) && <span className="text-white text-xs">✓</span>}
                    </div>
                    <span className="font-body text-text-secondary text-sm group-hover:text-bloom-pink-dark transition-colors">
                      {cat.emoji} {cat.label}
                    </span>
                  </div>
                  <span className="text-xs text-text-muted font-body">{cat.count}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div className="card p-5">
            <h3 className="font-display font-bold text-text-primary mb-4 flex items-center gap-2">
              <span>💰</span> Price Range
            </h3>
            <div className="space-y-4">
              <input
                type="range"
                min="0"
                max="100"
                value={priceRange[1]}
                onChange={e => setPriceRange([0, +e.target.value])}
                className="w-full accent-pink-400"
              />
              <div className="flex justify-between text-sm font-display font-bold text-bloom-pink-dark">
                <span>$0</span>
                <span>Up to ${priceRange[1]}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Sort + Filter Bar */}
          <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              {filtersActive > 0 && (
                <span className="tag bg-bloom-pink text-bloom-pink-dark text-xs">
                  {filtersActive} filter{filtersActive > 1 ? 's' : ''}
                  <button onClick={() => { setSelectedAges([]); setSelectedCats([]) }} className="ml-1 hover:text-red-400">
                    <FiX size={12} />
                  </button>
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                className="lg:hidden flex items-center gap-2 btn-secondary text-sm py-2"
                onClick={() => setFilterOpen(true)}
              >
                <FiFilter size={16} /> Filters {filtersActive > 0 && `(${filtersActive})`}
              </button>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="input-field w-auto py-2 text-sm"
              >
                {sortOptions.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>

          {/* Grid */}
          <AnimatePresence mode="wait">
            {filtered.length > 0 ? (
              <motion.div
                className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                key={sortBy + activeAges.join() + activeCats.join()}
              >
                {filtered.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-20">
                <div className="text-7xl mb-4">😔</div>
                <h3 className="font-display font-bold text-2xl text-text-primary mb-2">No products found</h3>
                <p className="text-text-muted font-body">Try adjusting your filters</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
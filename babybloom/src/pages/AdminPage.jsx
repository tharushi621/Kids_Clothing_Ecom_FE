import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiGrid, FiPackage, FiShoppingBag, FiUsers, FiTrendingUp,
  FiPlusCircle, FiEdit2, FiTrash2, FiEye, FiSearch,
  FiBell, FiSettings, FiLogOut, FiChevronRight,
  FiArrowUp, FiArrowDown, FiFilter, FiDownload,
  FiAlertCircle, FiCheckCircle, FiClock, FiTruck,
  FiBarChart2, FiDollarSign, FiRefreshCw, FiMenu, FiX
} from 'react-icons/fi'
import { products, categories } from '../data/products'

// ─── Mock Data ────────────────────────────────────────────────
const stats = [
  { label: 'Total Revenue',  value: '$48,295', change: '+12.5%', up: true,  icon: FiDollarSign, color: 'bg-bloom-pink',     accent: 'text-bloom-pink-dark' },
  { label: 'Total Orders',   value: '1,284',   change: '+8.2%',  up: true,  icon: FiShoppingBag,color: 'bg-bloom-blue',     accent: 'text-bloom-blue-dark' },
  { label: 'Total Customers',value: '6,742',   change: '+5.1%',  up: true,  icon: FiUsers,      color: 'bg-bloom-mint',     accent: 'text-bloom-mint-dark' },
  { label: 'Avg. Order Value',value: '$37.61', change: '-2.3%',  up: false, icon: FiBarChart2,  color: 'bg-bloom-lavender', accent: 'text-bloom-lavender-dark' },
]

const recentOrders = [
  { id: '#BB-2501', customer: 'Sarah M.',   items: 3, total: '$78.98', status: 'Delivered',  date: 'Mar 05' },
  { id: '#BB-2500', customer: 'Emma K.',    items: 2, total: '$44.99', status: 'In Transit', date: 'Mar 05' },
  { id: '#BB-2499', customer: 'Priya R.',   items: 1, total: '$29.99', status: 'Processing', date: 'Mar 04' },
  { id: '#BB-2498', customer: 'Jessica T.', items: 4, total: '$112.00',status: 'Delivered',  date: 'Mar 04' },
  { id: '#BB-2497', customer: 'Mia L.',     items: 2, total: '$58.50', status: 'Cancelled',  date: 'Mar 03' },
  { id: '#BB-2496', customer: 'Aisha N.',   items: 1, total: '$24.99', status: 'Processing', date: 'Mar 03' },
]

const topProducts = [
  { name: 'Floral Smocked Dress',  sales: 204, revenue: '$7,956', stock: 18  },
  { name: 'Star Snuggle Sleepsuit',sales: 312, revenue: '$9,347', stock: 60  },
  { name: 'Cloud Ruffle Bodysuit', sales: 128, revenue: '$3,199', stock: 45  },
  { name: 'Tutu Party Dress',      sales: 155, revenue: '$8,060', stock: 12  },
  { name: 'Bunny Ear Headband',    sales: 234, revenue: '$3,039', stock: 88  },
]

const navItems = [
  { id: 'dashboard', label: 'Dashboard',   icon: FiGrid,       badge: null },
  { id: 'products',  label: 'Products',    icon: FiPackage,    badge: '124' },
  { id: 'orders',    label: 'Orders',      icon: FiShoppingBag,badge: '6' },
  { id: 'customers', label: 'Customers',   icon: FiUsers,      badge: null },
  { id: 'analytics', label: 'Analytics',   icon: FiTrendingUp, badge: null },
  { id: 'inventory', label: 'Inventory',   icon: FiRefreshCw,  badge: '3' },
  { id: 'settings',  label: 'Settings',    icon: FiSettings,   badge: null },
]

const statusStyle = {
  Delivered:  'bg-bloom-mint   text-bloom-mint-dark',
  'In Transit':'bg-bloom-blue  text-bloom-blue-dark',
  Processing: 'bg-bloom-yellow text-bloom-yellow-dark',
  Cancelled:  'bg-red-100      text-red-500',
}

// ─── Sub-pages ────────────────────────────────────────────────

function DashboardHome() {
  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display font-extrabold text-3xl text-text-primary">
            Good morning, Admin! 🌸
          </h1>
          <p className="font-body text-text-muted mt-1">Here's what's happening with BabyBloom today.</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary text-sm py-2 flex items-center gap-2">
            <FiDownload size={16} /> Export
          </button>
          <button className="btn-primary text-sm py-2 flex items-center gap-2">
            <FiPlusCircle size={16} /> Add Product
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -3 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center shadow-soft`}>
                <stat.icon size={22} className={stat.accent} />
              </div>
              <span className={`flex items-center gap-1 text-xs font-bold font-body px-2 py-1 rounded-pill ${stat.up ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                {stat.up ? <FiArrowUp size={11} /> : <FiArrowDown size={11} />}
                {stat.change}
              </span>
            </div>
            <p className="font-display font-extrabold text-3xl text-text-primary">{stat.value}</p>
            <p className="font-body text-text-muted text-sm mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart (visual mockup) */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-bold text-xl text-text-primary">Revenue Overview</h3>
            <select className="input-field w-auto py-1.5 text-sm">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 3 months</option>
            </select>
          </div>
          {/* Bar chart visual */}
          <div className="flex items-end gap-3 h-40">
            {[65,80,55,90,72,88,95,60,75,85,70,92].map((h, i) => (
              <motion.div
                key={i}
                className="flex-1 bg-gradient-to-t from-bloom-pink-dark to-bloom-lavender-dark rounded-t-xl opacity-80 hover:opacity-100 transition-opacity cursor-pointer relative group"
                style={{ height: `${h}%` }}
                initial={{ scaleY: 0, originY: 1 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: i * 0.05, duration: 0.4, ease: 'easeOut' }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-text-primary text-white text-xs rounded-lg px-2 py-1 font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  ${(h * 48).toLocaleString()}
                </div>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-between mt-3 text-xs font-body text-text-muted">
            {['Feb 22','Feb 24','Feb 26','Feb 28','Mar 01','Mar 03'].map(d => (
              <span key={d}>{d}</span>
            ))}
          </div>
        </div>

        {/* Category Donut */}
        <div className="card p-6">
          <h3 className="font-display font-bold text-xl text-text-primary mb-6">Sales by Category</h3>
          <div className="flex justify-center mb-6">
            <div className="relative w-32 h-32">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                {[
                  { pct: 30, color: '#FF8FAB', offset: 0 },
                  { pct: 22, color: '#B07FFF', offset: 30 },
                  { pct: 18, color: '#5AABFF', offset: 52 },
                  { pct: 15, color: '#52D17C', offset: 70 },
                  { pct: 15, color: '#FFD60A', offset: 85 },
                ].map((seg, i) => (
                  <circle
                    key={i}
                    cx="18" cy="18" r="15.9"
                    fill="none"
                    stroke={seg.color}
                    strokeWidth="3.5"
                    strokeDasharray={`${seg.pct} ${100 - seg.pct}`}
                    strokeDashoffset={`${-seg.offset}`}
                    strokeLinecap="round"
                  />
                ))}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display font-extrabold text-xl text-text-primary">124</span>
                <span className="font-body text-xs text-text-muted">products</span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            {[
              { label: 'Dresses',     pct: 30, color: 'bg-bloom-pink-dark' },
              { label: 'Bodysuits',   pct: 22, color: 'bg-bloom-lavender-dark' },
              { label: 'T-Shirts',    pct: 18, color: 'bg-bloom-blue-dark' },
              { label: 'Sleepwear',   pct: 15, color: 'bg-bloom-mint-dark' },
              { label: 'Accessories', pct: 15, color: 'bg-bloom-yellow-dark' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${item.color} shrink-0`} />
                <span className="font-body text-text-secondary text-sm flex-1">{item.label}</span>
                <span className="font-display font-bold text-text-primary text-sm">{item.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display font-bold text-xl text-text-primary">Recent Orders</h3>
            <button className="text-xs font-body font-bold text-bloom-blue-dark hover:underline">View All →</button>
          </div>
          <div className="space-y-3">
            {recentOrders.slice(0,5).map((order, i) => (
              <motion.div
                key={order.id}
                className="flex items-center gap-4 p-3 rounded-2xl hover:bg-bloom-cream transition-colors cursor-pointer"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <div className="w-9 h-9 bg-bloom-pink/30 rounded-xl flex items-center justify-center text-lg shrink-0">📦</div>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-bold text-text-primary text-sm">{order.id}</p>
                  <p className="font-body text-text-muted text-xs truncate">{order.customer} · {order.items} items</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-display font-bold text-bloom-pink-dark text-sm">{order.total}</p>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-pill ${statusStyle[order.status]}`}>{order.status}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display font-bold text-xl text-text-primary">Top Products</h3>
            <button className="text-xs font-body font-bold text-bloom-blue-dark hover:underline">View All →</button>
          </div>
          <div className="space-y-3">
            {topProducts.map((p, i) => (
              <motion.div
                key={p.name}
                className="flex items-center gap-4 p-3 rounded-2xl hover:bg-bloom-cream transition-colors"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-bloom-pink to-bloom-lavender rounded-xl flex items-center justify-center font-display font-extrabold text-white text-sm shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-bold text-text-primary text-sm truncate">{p.name}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <div className="flex-1 h-1.5 bg-bloom-cream rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-bloom-pink-dark to-bloom-lavender-dark rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(p.sales / 312) * 100}%` }}
                        transition={{ delay: 0.3 + i * 0.07, duration: 0.6 }}
                      />
                    </div>
                    <span className="font-body text-xs text-text-muted w-14 text-right">{p.sales} sold</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-display font-bold text-bloom-pink-dark text-sm">{p.revenue}</p>
                  <p className={`font-body text-xs ${p.stock < 20 ? 'text-amber-500 font-bold' : 'text-text-muted'}`}>
                    {p.stock < 20 ? `⚠️ ${p.stock} left` : `${p.stock} in stock`}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ProductsPanel() {
  const [search, setSearch] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="font-display font-extrabold text-2xl text-text-primary">Products 📦</h2>
        <motion.button
          className="btn-primary flex items-center gap-2 text-sm"
          onClick={() => setShowAddModal(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          <FiPlusCircle size={16} /> Add Product
        </motion.button>
      </div>

      {/* Search + Filter Bar */}
      <div className="card p-4 flex flex-wrap gap-3">
        <div className="flex-1 relative min-w-48">
          <FiSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            className="input-field pl-9 py-2 text-sm"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select className="input-field w-auto py-2 text-sm">
          <option>All Categories</option>
          {categories.map(c => <option key={c.id}>{c.label}</option>)}
        </select>
        <select className="input-field w-auto py-2 text-sm">
          <option>All Ages</option>
          <option>0–3 months</option>
          <option>3–6 months</option>
          <option>6–12 months</option>
          <option>1–2 years</option>
        </select>
        <button className="btn-secondary flex items-center gap-2 text-sm py-2">
          <FiFilter size={14} /> Filter
        </button>
      </div>

      {/* Products Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-bloom-pink/20 bg-bloom-cream">
                <th className="text-left px-5 py-4 font-display font-bold text-text-secondary text-sm">Product</th>
                <th className="text-left px-4 py-4 font-display font-bold text-text-secondary text-sm">Category</th>
                <th className="text-left px-4 py-4 font-display font-bold text-text-secondary text-sm">Age</th>
                <th className="text-left px-4 py-4 font-display font-bold text-text-secondary text-sm">Price</th>
                <th className="text-left px-4 py-4 font-display font-bold text-text-secondary text-sm">Stock</th>
                <th className="text-left px-4 py-4 font-display font-bold text-text-secondary text-sm">Rating</th>
                <th className="text-center px-4 py-4 font-display font-bold text-text-secondary text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product, i) => (
                <motion.tr
                  key={product.id}
                  className="border-b border-bloom-pink/10 hover:bg-bloom-cream/50 transition-colors"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-12 h-12 rounded-2xl object-cover bg-bloom-cream shrink-0"
                      />
                      <div>
                        <p className="font-display font-bold text-text-primary text-sm">{product.name}</p>
                        {product.badge && (
                          <span className={`text-xs px-2 py-0.5 rounded-pill font-bold ${product.badgeColor}`}>{product.badge}</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-body text-text-secondary text-sm">{product.category}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="tag bg-bloom-lavender text-bloom-lavender-dark text-xs">{product.ageRange}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <span className="font-display font-bold text-bloom-pink-dark">${product.price}</span>
                      {product.originalPrice && (
                        <span className="font-body text-text-muted text-xs line-through ml-1">${product.originalPrice}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`font-body font-semibold text-sm ${product.stock < 20 ? 'text-amber-500' : 'text-bloom-mint-dark'}`}>
                      {product.stock < 20 ? `⚠️ ${product.stock}` : product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      <span className="text-bloom-yellow-dark text-sm">★</span>
                      <span className="font-body text-sm font-semibold text-text-primary">{product.rating}</span>
                      <span className="font-body text-xs text-text-muted">({product.reviews})</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <motion.button className="btn-icon w-8 h-8 hover:bg-bloom-blue/30 text-bloom-blue-dark" whileHover={{ scale: 1.1 }}>
                        <FiEye size={15} />
                      </motion.button>
                      <motion.button className="btn-icon w-8 h-8 hover:bg-bloom-yellow/40 text-bloom-yellow-dark" whileHover={{ scale: 1.1 }}>
                        <FiEdit2 size={15} />
                      </motion.button>
                      <motion.button className="btn-icon w-8 h-8 hover:bg-red-100 text-red-400" whileHover={{ scale: 1.1 }}>
                        <FiTrash2 size={15} />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-bloom-pink/10 flex items-center justify-between">
          <span className="font-body text-text-muted text-sm">Showing {filtered.length} of {products.length} products</span>
          <div className="flex gap-2">
            {[1,2,3,'...', 12].map((p, i) => (
              <button key={i} className={`w-8 h-8 rounded-xl text-sm font-bold font-display transition-all ${p === 1 ? 'bg-bloom-pink-dark text-white shadow-pink' : 'bg-bloom-cream text-text-secondary hover:bg-bloom-pink/30'}`}>{p}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="bg-white rounded-4xl shadow-soft-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-display font-extrabold text-2xl text-text-primary">➕ Add New Product</h3>
                    <button onClick={() => setShowAddModal(false)} className="btn-icon hover:bg-bloom-pink/30 text-text-secondary"><FiX size={20} /></button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      ['Product Name', 'text', 'e.g. Cloud Ruffle Bodysuit'],
                      ['Price ($)', 'number', 'e.g. 24.99'],
                      ['Original Price ($)', 'number', 'e.g. 34.99 (optional)'],
                      ['Stock Quantity', 'number', 'e.g. 50'],
                    ].map(([label, type, placeholder]) => (
                      <div key={label}>
                        <label className="font-body font-semibold text-text-secondary text-sm mb-2 block">{label}</label>
                        <input className="input-field" type={type} placeholder={placeholder} />
                      </div>
                    ))}
                    <div>
                      <label className="font-body font-semibold text-text-secondary text-sm mb-2 block">Category</label>
                      <select className="input-field">
                        {categories.map(c => <option key={c.id}>{c.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="font-body font-semibold text-text-secondary text-sm mb-2 block">Age Range</label>
                      <select className="input-field">
                        {['0–3 months','3–6 months','6–12 months','1–2 years','2–3 years','3–5 years'].map(a => <option key={a}>{a}</option>)}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="font-body font-semibold text-text-secondary text-sm mb-2 block">Material</label>
                      <input className="input-field" placeholder="e.g. 100% Organic Cotton" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="font-body font-semibold text-text-secondary text-sm mb-2 block">Description</label>
                      <textarea className="input-field resize-none" rows={3} placeholder="Product description..." />
                    </div>
                    <div className="md:col-span-2">
                      <label className="font-body font-semibold text-text-secondary text-sm mb-2 block">Product Images</label>
                      <div className="border-2 border-dashed border-bloom-pink/40 rounded-2xl p-8 text-center hover:border-bloom-pink-dark transition-colors cursor-pointer">
                        <div className="text-4xl mb-2">📸</div>
                        <p className="font-display font-bold text-text-secondary text-sm">Drop images here or click to upload</p>
                        <p className="font-body text-text-muted text-xs mt-1">PNG, JPG up to 5MB each</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button onClick={() => setShowAddModal(false)} className="btn-secondary flex-1">Cancel</button>
                    <motion.button className="btn-primary flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                      Save Product ✓
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

function OrdersPanel() {
  const [filter, setFilter] = useState('All')
  const statuses = ['All', 'Processing', 'In Transit', 'Delivered', 'Cancelled']

  const filtered = filter === 'All' ? recentOrders : recentOrders.filter(o => o.status === filter)

  return (
    <div className="space-y-6">
      <h2 className="font-display font-extrabold text-2xl text-text-primary">Orders 🛍️</h2>

      {/* Status Tabs */}
      <div className="flex gap-2 flex-wrap">
        {statuses.map(s => (
          <motion.button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-5 py-2 rounded-pill font-display font-bold text-sm transition-all ${filter === s ? 'bg-bloom-pink-dark text-white shadow-pink' : 'bg-white text-text-secondary hover:bg-bloom-pink/30 shadow-card'}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            {s}
          </motion.button>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-bloom-pink/20 bg-bloom-cream">
                {['Order ID', 'Customer', 'Date', 'Items', 'Total', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-4 font-display font-bold text-text-secondary text-sm">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((order, i) => (
                <motion.tr
                  key={order.id}
                  className="border-b border-bloom-pink/10 hover:bg-bloom-cream/50 transition-colors"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <td className="px-5 py-4 font-display font-bold text-text-primary text-sm">{order.id}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-bloom-pink to-bloom-lavender rounded-full flex items-center justify-center text-white font-bold text-xs">
                        {order.customer[0]}
                      </div>
                      <span className="font-body text-text-secondary text-sm">{order.customer}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-body text-text-muted text-sm">{order.date}</td>
                  <td className="px-5 py-4 font-body text-text-secondary text-sm">{order.items} item{order.items > 1 ? 's' : ''}</td>
                  <td className="px-5 py-4 font-display font-bold text-bloom-pink-dark">{order.total}</td>
                  <td className="px-5 py-4">
                    <span className={`tag text-xs font-bold ${statusStyle[order.status]}`}>{order.status}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button className="btn-icon w-8 h-8 hover:bg-bloom-blue/30 text-bloom-blue-dark"><FiEye size={14} /></button>
                      <button className="btn-icon w-8 h-8 hover:bg-bloom-yellow/40 text-bloom-yellow-dark"><FiEdit2 size={14} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function CustomersPanel() {
  const customers = [
    { name: 'Sarah M.',   email: 'sarah@mail.com',   orders: 8,  spent: '$312.00', joined: 'Jan 2025', status: 'Active' },
    { name: 'Emma K.',    email: 'emma@mail.com',    orders: 5,  spent: '$189.50', joined: 'Feb 2025', status: 'Active' },
    { name: 'Priya R.',   email: 'priya@mail.com',   orders: 12, spent: '$520.20', joined: 'Dec 2024', status: 'VIP' },
    { name: 'Jessica T.', email: 'jess@mail.com',    orders: 3,  spent: '$98.00',  joined: 'Mar 2025', status: 'New' },
    { name: 'Mia L.',     email: 'mia@mail.com',     orders: 7,  spent: '$278.00', joined: 'Jan 2025', status: 'Active' },
    { name: 'Aisha N.',   email: 'aisha@mail.com',   orders: 1,  spent: '$24.99',  joined: 'Mar 2025', status: 'New' },
  ]
  const statusColor = { Active: 'bg-bloom-mint text-bloom-mint-dark', VIP: 'bg-bloom-lavender text-bloom-lavender-dark', New: 'bg-bloom-blue text-bloom-blue-dark' }

  return (
    <div className="space-y-6">
      <h2 className="font-display font-extrabold text-2xl text-text-primary">Customers 👥</h2>
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Customers', value: '6,742', icon: '👥', color: 'bg-bloom-blue' },
          { label: 'VIP Members',     value: '428',   icon: '💎', color: 'bg-bloom-lavender' },
          { label: 'New This Month',  value: '312',   icon: '🌱', color: 'bg-bloom-mint' },
        ].map(s => (
          <div key={s.label} className="card p-5 flex items-center gap-4">
            <div className={`w-12 h-12 ${s.color} rounded-2xl flex items-center justify-center text-2xl`}>{s.icon}</div>
            <div>
              <p className="font-display font-extrabold text-2xl text-text-primary">{s.value}</p>
              <p className="font-body text-text-muted text-xs">{s.label}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-bloom-pink/20 bg-bloom-cream">
                {['Customer', 'Email', 'Orders', 'Total Spent', 'Joined', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-4 font-display font-bold text-text-secondary text-sm">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {customers.map((c, i) => (
                <motion.tr
                  key={c.email}
                  className="border-b border-bloom-pink/10 hover:bg-bloom-cream/50 transition-colors"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-bloom-pink to-bloom-lavender rounded-full flex items-center justify-center text-white font-bold text-sm">{c.name[0]}</div>
                      <span className="font-display font-bold text-text-primary text-sm">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-body text-text-muted text-sm">{c.email}</td>
                  <td className="px-5 py-4 font-body text-text-secondary text-sm">{c.orders}</td>
                  <td className="px-5 py-4 font-display font-bold text-bloom-pink-dark text-sm">{c.spent}</td>
                  <td className="px-5 py-4 font-body text-text-muted text-sm">{c.joined}</td>
                  <td className="px-5 py-4"><span className={`tag text-xs ${statusColor[c.status]}`}>{c.status}</span></td>
                  <td className="px-5 py-4">
                    <button className="btn-icon w-8 h-8 hover:bg-bloom-blue/30 text-bloom-blue-dark"><FiEye size={14} /></button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function InventoryPanel() {
  const lowStock = products.filter(p => p.stock < 25)
  return (
    <div className="space-y-6">
      <h2 className="font-display font-extrabold text-2xl text-text-primary">Inventory 📋</h2>
      <div className="card p-5 bg-amber-50 border border-amber-200 flex items-center gap-4">
        <FiAlertCircle size={24} className="text-amber-500 shrink-0" />
        <div>
          <p className="font-display font-bold text-amber-700">{lowStock.length} products are running low on stock!</p>
          <p className="font-body text-amber-600 text-sm">Consider restocking these items soon.</p>
        </div>
        <button className="btn-primary ml-auto text-sm py-2 whitespace-nowrap">Restock All</button>
      </div>
      <div className="card overflow-hidden">
        <div className="p-5 border-b border-bloom-pink/20">
          <h3 className="font-display font-bold text-lg text-text-primary">Low Stock Items ⚠️</h3>
        </div>
        <div className="divide-y divide-bloom-pink/10">
          {lowStock.map((p, i) => (
            <motion.div
              key={p.id}
              className="flex items-center gap-4 p-5 hover:bg-bloom-cream/50 transition-colors"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <img src={p.images[0]} alt={p.name} className="w-14 h-14 rounded-2xl object-cover bg-bloom-cream shrink-0" />
              <div className="flex-1">
                <p className="font-display font-bold text-text-primary">{p.name}</p>
                <p className="font-body text-text-muted text-sm">{p.category} · {p.ageRange}</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 max-w-48 h-2 bg-bloom-cream rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${p.stock < 15 ? 'bg-red-400' : 'bg-amber-400'}`}
                      style={{ width: `${(p.stock / 100) * 100}%` }}
                    />
                  </div>
                  <span className={`font-body text-xs font-bold ${p.stock < 15 ? 'text-red-500' : 'text-amber-500'}`}>{p.stock} left</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="font-display font-bold text-bloom-pink-dark">${p.price}</p>
                <motion.button
                  className="mt-2 text-xs font-bold text-bloom-blue-dark border border-bloom-blue/40 px-3 py-1 rounded-pill hover:bg-bloom-blue/20 transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  + Restock
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

function AnalyticsPanel() {
  const months = ['Sep','Oct','Nov','Dec','Jan','Feb','Mar']
  const values = [22000, 28000, 35000, 52000, 38000, 41000, 48295]

  return (
    <div className="space-y-8">
      <h2 className="font-display font-extrabold text-2xl text-text-primary">Analytics 📊</h2>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly Revenue */}
        <div className="card p-6">
          <h3 className="font-display font-bold text-xl text-text-primary mb-6">Monthly Revenue</h3>
          <div className="flex items-end gap-3 h-48 mb-3">
            {values.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="font-body text-xs text-text-muted">${(v/1000).toFixed(0)}k</span>
                <motion.div
                  className={`w-full rounded-t-xl ${i === values.length - 1 ? 'bg-gradient-to-t from-bloom-pink-dark to-bloom-lavender-dark' : 'bg-bloom-pink/40'}`}
                  style={{ height: `${(v / 52000) * 100}%` }}
                  initial={{ scaleY: 0, originY: 1 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: i * 0.06, duration: 0.5 }}
                />
                <span className="font-body text-xs text-text-muted">{months[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Order Status Pie */}
        <div className="card p-6">
          <h3 className="font-display font-bold text-xl text-text-primary mb-6">Order Status Breakdown</h3>
          <div className="space-y-4">
            {[
              { label: 'Delivered',   count: 892, pct: 70, color: 'bg-bloom-mint-dark' },
              { label: 'In Transit',  count: 218, pct: 17, color: 'bg-bloom-blue-dark' },
              { label: 'Processing',  count: 102, pct: 8,  color: 'bg-bloom-yellow-dark' },
              { label: 'Cancelled',   count: 72,  pct: 5,  color: 'bg-red-400' },
            ].map((item, i) => (
              <div key={item.label}>
                <div className="flex justify-between mb-1">
                  <span className="font-body font-semibold text-text-secondary text-sm">{item.label}</span>
                  <span className="font-display font-bold text-text-primary text-sm">{item.count} ({item.pct}%)</span>
                </div>
                <div className="h-3 bg-bloom-cream rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${item.color} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${item.pct}%` }}
                    transition={{ delay: 0.2 + i * 0.1, duration: 0.7 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Ages */}
        <div className="card p-6">
          <h3 className="font-display font-bold text-xl text-text-primary mb-6">Sales by Age Group</h3>
          <div className="space-y-3">
            {[
              { label: '👶 0–3 months', sales: 412, pct: 32 },
              { label: '🍼 3–6 months', sales: 298, pct: 23 },
              { label: '🧸 6–12 months',sales: 231, pct: 18 },
              { label: '🚼 1–2 years',  sales: 180, pct: 14 },
              { label: '🎈 2–3 years',  sales: 103, pct: 8 },
              { label: '🪁 3–5 years',  sales: 60,  pct: 5 },
            ].map((item, i) => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="font-body text-sm text-text-secondary w-32 shrink-0">{item.label}</span>
                <div className="flex-1 h-2.5 bg-bloom-cream rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-bloom-pink-dark to-bloom-lavender-dark rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${item.pct}%` }}
                    transition={{ delay: i * 0.08, duration: 0.6 }}
                  />
                </div>
                <span className="font-display font-bold text-bloom-pink-dark text-sm w-12 text-right">{item.sales}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="card p-6 space-y-4">
          <h3 className="font-display font-bold text-xl text-text-primary mb-2">Key Metrics</h3>
          {[
            { label: 'Conversion Rate',   value: '3.4%',   icon: '🎯', up: true },
            { label: 'Cart Abandonment',  value: '62.1%',  icon: '🛒', up: false },
            { label: 'Repeat Customers',  value: '41.8%',  icon: '💝', up: true },
            { label: 'Avg. Session Time', value: '4m 32s', icon: '⏱️', up: true },
            { label: 'Return Rate',       value: '2.1%',   icon: '↩️', up: true },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between p-3 rounded-2xl bg-bloom-cream">
              <div className="flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <span className="font-body font-semibold text-text-secondary text-sm">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-text-primary">{item.value}</span>
                <span className={`text-xs ${item.up ? 'text-green-500' : 'text-red-400'}`}>
                  {item.up ? <FiArrowUp size={12} /> : <FiArrowDown size={12} />}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SettingsPanel() {
  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="font-display font-extrabold text-2xl text-text-primary">Settings ⚙️</h2>

      {[
        {
          title: '🏪 Store Settings',
          fields: [
            { label: 'Store Name', value: 'BabyBloom', type: 'text' },
            { label: 'Store Email', value: 'hello@babybloom.com', type: 'email' },
            { label: 'Currency', type: 'select', options: ['USD ($)', 'EUR (€)', 'GBP (£)'] },
            { label: 'Tax Rate (%)', value: '8.5', type: 'number' },
          ]
        },
        {
          title: '🚚 Shipping Settings',
          fields: [
            { label: 'Free Shipping Threshold ($)', value: '40', type: 'number' },
            { label: 'Standard Shipping Rate ($)', value: '5.99', type: 'number' },
            { label: 'Processing Time (days)', value: '1', type: 'number' },
          ]
        },
        {
          title: '🔔 Notifications',
          toggles: [
            { label: 'New Order Alerts', on: true },
            { label: 'Low Stock Alerts', on: true },
            { label: 'Customer Reviews', on: false },
            { label: 'Weekly Summary Email', on: true },
          ]
        }
      ].map(section => (
        <div key={section.title} className="card p-6 space-y-4">
          <h3 className="font-display font-bold text-lg text-text-primary">{section.title}</h3>
          {section.fields?.map(f => (
            <div key={f.label}>
              <label className="font-body font-semibold text-text-secondary text-sm mb-2 block">{f.label}</label>
              {f.type === 'select'
                ? <select className="input-field">{f.options?.map(o => <option key={o}>{o}</option>)}</select>
                : <input className="input-field" type={f.type} defaultValue={f.value} />
              }
            </div>
          ))}
          {section.toggles?.map(t => (
            <div key={t.label} className="flex items-center justify-between p-3 rounded-2xl bg-bloom-cream">
              <span className="font-body font-semibold text-text-secondary text-sm">{t.label}</span>
              <div className={`w-12 h-6 rounded-full cursor-pointer transition-colors ${t.on ? 'bg-bloom-pink-dark' : 'bg-gray-200'} relative`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${t.on ? 'left-7' : 'left-1'}`} />
              </div>
            </div>
          ))}
          <motion.button className="btn-primary text-sm py-2" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            Save Changes ✓
          </motion.button>
        </div>
      ))}
    </div>
  )
}

// ─── Main Admin Layout ─────────────────────────────────────────
export default function AdminPage() {
  const [activePage, setActivePage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const pageComponents = {
    dashboard: <DashboardHome />,
    products:  <ProductsPanel />,
    orders:    <OrdersPanel />,
    customers: <CustomersPanel />,
    inventory: <InventoryPanel />,
    analytics: <AnalyticsPanel />,
    settings:  <SettingsPanel />,
  }

  return (
    <div className="flex h-screen bg-bloom-cream overflow-hidden font-body">
      {/* Sidebar */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.aside
            className="w-64 bg-white border-r border-bloom-pink/20 flex flex-col shrink-0 z-40 shadow-soft"
            initial={{ x: -256, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -256, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {/* Logo */}
            <div className="p-6 border-b border-bloom-pink/20">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-gradient-to-br from-bloom-pink-dark to-bloom-lavender-dark rounded-2xl flex items-center justify-center shadow-pink">
                  <span className="text-white text-xl">🌸</span>
                </div>
                <div>
                  <span className="font-display font-extrabold text-xl text-text-primary">
                    Baby<span className="text-gradient-pink">Bloom</span>
                  </span>
                  <p className="font-body text-xs text-text-muted">Admin Panel</p>
                </div>
              </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {navItems.map(item => (
                <motion.button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all ${
                    activePage === item.id
                      ? 'bg-gradient-to-r from-bloom-pink to-bloom-lavender/50 text-bloom-pink-dark shadow-soft'
                      : 'text-text-secondary hover:bg-bloom-cream hover:text-text-primary'
                  }`}
                  whileHover={{ x: activePage === item.id ? 0 : 4 }}
                >
                  <item.icon size={18} />
                  <span className="font-display font-bold text-sm flex-1">{item.label}</span>
                  {item.badge && (
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-pill ${activePage === item.id ? 'bg-bloom-pink-dark text-white' : 'bg-bloom-pink text-bloom-pink-dark'}`}>
                      {item.badge}
                    </span>
                  )}
                </motion.button>
              ))}
            </nav>

            {/* Admin Profile */}
            <div className="p-4 border-t border-bloom-pink/20">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-bloom-cream">
                <div className="w-9 h-9 bg-gradient-to-br from-bloom-pink-dark to-bloom-lavender-dark rounded-full flex items-center justify-center text-white font-bold text-sm">A</div>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-bold text-text-primary text-sm truncate">Admin User</p>
                  <p className="font-body text-text-muted text-xs truncate">admin@babybloom.com</p>
                </div>
                <motion.button className="text-text-muted hover:text-red-400 transition-colors" whileHover={{ scale: 1.1 }}>
                  <FiLogOut size={16} />
                </motion.button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-bloom-pink/20 px-6 py-4 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="btn-icon hover:bg-bloom-pink/30 text-text-secondary"
            >
              {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
            <div className="relative hidden md:block">
              <FiSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                className="pl-9 pr-4 py-2 rounded-2xl border-2 border-bloom-pink/30 focus:outline-none focus:border-bloom-pink-dark text-sm font-body bg-bloom-cream w-64"
                placeholder="Search anything..."
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              className="btn-icon relative hover:bg-bloom-pink/30 text-text-secondary"
              whileHover={{ scale: 1.1 }}
            >
              <FiBell size={20} />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-bloom-pink-dark rounded-full border-2 border-white" />
            </motion.button>
            <div className="w-9 h-9 bg-gradient-to-br from-bloom-pink-dark to-bloom-lavender-dark rounded-full flex items-center justify-center text-white font-bold text-sm cursor-pointer">
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {pageComponents[activePage]}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
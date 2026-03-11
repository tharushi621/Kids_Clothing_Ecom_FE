import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiPackage, FiHeart, FiMapPin, FiUser, FiEdit2, FiLogOut, FiChevronRight } from 'react-icons/fi'

const tabs = [
  { id: 'orders', label: 'My Orders', icon: FiPackage, emoji: '📦' },
  { id: 'wishlist', label: 'Wishlist', icon: FiHeart, emoji: '❤️' },
  { id: 'addresses', label: 'Addresses', icon: FiMapPin, emoji: '📍' },
  { id: 'account', label: 'Account', icon: FiUser, emoji: '👤' },
]

const mockOrders = [
  { id: '#BB-2401', date: 'Mar 01, 2025', status: 'Delivered', total: '$78.98', items: 3, color: 'bg-bloom-mint text-bloom-mint-dark' },
  { id: '#BB-2389', date: 'Feb 18, 2025', status: 'In Transit', total: '$44.99', items: 2, color: 'bg-bloom-blue text-bloom-blue-dark' },
  { id: '#BB-2356', date: 'Jan 30, 2025', status: 'Processing', total: '$29.99', items: 1, color: 'bg-bloom-yellow text-bloom-yellow-dark' },
]

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('orders')
  const [loggedIn, setLoggedIn] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [name, setName] = useState('')

  const handleAuth = (e) => {
    e.preventDefault()
    setLoggedIn(true)
  }

  if (!loggedIn) return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-gradient-to-br from-bloom-pink/20 to-bloom-lavender/20">
      <motion.div
        className="card p-10 w-full max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-8">
          <div className="text-5xl mb-3 animate-float">🌸</div>
          <h1 className="font-display font-extrabold text-3xl text-text-primary">
            {isLogin ? 'Welcome Back!' : 'Join BabyBloom'}
          </h1>
          <p className="font-body text-text-muted text-sm mt-2">
            {isLogin ? 'Sign in to your account' : 'Create your free account'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="font-body font-semibold text-text-secondary text-sm mb-2 block">Full Name</label>
              <input className="input-field" placeholder="Sarah Johnson" value={name} onChange={e => setName(e.target.value)} />
            </div>
          )}
          <div>
            <label className="font-body font-semibold text-text-secondary text-sm mb-2 block">Email</label>
            <input className="input-field" type="email" placeholder="hello@example.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="font-body font-semibold text-text-secondary text-sm mb-2 block">Password</label>
            <input className="input-field" type="password" placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} />
          </div>
          {isLogin && (
            <div className="text-right">
              <button type="button" className="font-body text-sm text-bloom-blue-dark hover:underline">Forgot password?</button>
            </div>
          )}
          <motion.button
            type="submit"
            className="btn-primary w-full py-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            {isLogin ? '🌸 Sign In' : '✨ Create Account'}
          </motion.button>
        </form>

        <p className="text-center mt-6 font-body text-text-muted text-sm">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="font-bold text-bloom-pink-dark hover:underline"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>

        <div className="mt-6 pt-6 border-t border-bloom-pink/20 space-y-3">
          <p className="text-center font-body text-text-muted text-xs mb-3">Or continue with</p>
          {['🔵 Continue with Google', '🍎 Continue with Apple'].map(btn => (
            <motion.button
              key={btn}
              onClick={() => setLoggedIn(true)}
              className="w-full py-3 rounded-2xl border-2 border-bloom-pink/30 font-body font-semibold text-text-secondary hover:border-bloom-pink-dark hover:text-bloom-pink-dark transition-all text-sm"
              whileHover={{ scale: 1.01 }}
            >
              {btn}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-10">
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="space-y-3">
          {/* Profile Card */}
          <div className="card p-6 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-bloom-pink to-bloom-lavender rounded-full flex items-center justify-center text-3xl mx-auto mb-3 shadow-soft">
              👩
            </div>
            <h3 className="font-display font-extrabold text-text-primary">{name || 'Sarah Johnson'}</h3>
            <p className="font-body text-text-muted text-sm">{email || 'sarah@example.com'}</p>
            <div className="mt-3 flex justify-center gap-2">
              <span className="tag bg-bloom-pink text-bloom-pink-dark text-xs">💗 Bloom Member</span>
            </div>
          </div>

          {/* Nav */}
          <div className="card p-3">
            {tabs.map(tab => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all ${
                  activeTab === tab.id
                    ? 'bg-bloom-pink text-bloom-pink-dark'
                    : 'text-text-secondary hover:bg-bloom-cream'
                }`}
                whileHover={{ x: 3 }}
              >
                <span>{tab.emoji}</span>
                <span className="font-display font-bold text-sm flex-1">{tab.label}</span>
                <FiChevronRight size={14} className="opacity-50" />
              </motion.button>
            ))}
            <motion.button
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left text-red-400 hover:bg-red-50 mt-1 transition-all"
              onClick={() => setLoggedIn(false)}
              whileHover={{ x: 3 }}
            >
              <FiLogOut size={16} />
              <span className="font-display font-bold text-sm">Sign Out</span>
            </motion.button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Orders */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <h2 className="font-display font-bold text-2xl text-text-primary">My Orders 📦</h2>
                {mockOrders.map((order, i) => (
                  <motion.div
                    key={order.id}
                    className="card p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="w-14 h-14 bg-bloom-cream rounded-2xl flex items-center justify-center text-3xl shrink-0">📦</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-display font-extrabold text-text-primary">{order.id}</span>
                        <span className={`tag text-xs ${order.color}`}>{order.status}</span>
                      </div>
                      <p className="font-body text-text-muted text-sm">{order.date} · {order.items} item{order.items > 1 ? 's' : ''}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-display font-extrabold text-bloom-pink-dark text-lg">{order.total}</p>
                      <button className="text-xs font-body text-bloom-blue-dark hover:underline">Track Order →</button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Addresses */}
            {activeTab === 'addresses' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-display font-bold text-2xl text-text-primary">Saved Addresses 📍</h2>
                  <button className="btn-secondary text-sm py-2">+ Add New</button>
                </div>
                <div className="card p-6 border-2 border-bloom-pink-dark/20">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="tag bg-bloom-pink text-bloom-pink-dark text-xs mb-3">Default</span>
                      <p className="font-display font-bold text-text-primary mt-2">{name || 'Sarah Johnson'}</p>
                      <p className="font-body text-text-secondary text-sm">123 Bloom Street, Apt 4B</p>
                      <p className="font-body text-text-secondary text-sm">Los Angeles, CA 90001</p>
                      <p className="font-body text-text-secondary text-sm">United States</p>
                    </div>
                    <button className="btn-icon hover:bg-bloom-pink/30 text-bloom-pink-dark">
                      <FiEdit2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Account */}
            {activeTab === 'account' && (
              <div className="space-y-6">
                <h2 className="font-display font-bold text-2xl text-text-primary">Account Details 👤</h2>
                <div className="card p-6 space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="font-body font-semibold text-text-secondary text-sm mb-2 block">Full Name</label>
                      <input className="input-field" defaultValue={name || 'Sarah Johnson'} />
                    </div>
                    <div>
                      <label className="font-body font-semibold text-text-secondary text-sm mb-2 block">Email</label>
                      <input className="input-field" defaultValue={email || 'sarah@example.com'} />
                    </div>
                    <div>
                      <label className="font-body font-semibold text-text-secondary text-sm mb-2 block">Phone</label>
                      <input className="input-field" placeholder="+1 (555) 000-0000" />
                    </div>
                    <div>
                      <label className="font-body font-semibold text-text-secondary text-sm mb-2 block">Birthday</label>
                      <input className="input-field" type="date" />
                    </div>
                  </div>
                  <motion.button
                    className="btn-primary text-sm"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Save Changes ✓
                  </motion.button>
                </div>

                {/* Password */}
                <div className="card p-6 space-y-4">
                  <h3 className="font-display font-bold text-lg text-text-primary">Change Password 🔒</h3>
                  <input className="input-field" type="password" placeholder="Current Password" />
                  <input className="input-field" type="password" placeholder="New Password" />
                  <input className="input-field" type="password" placeholder="Confirm New Password" />
                  <button className="btn-secondary text-sm">Update Password</button>
                </div>
              </div>
            )}

            {/* Wishlist in dashboard */}
            {activeTab === 'wishlist' && (
              <div>
                <h2 className="font-display font-bold text-2xl text-text-primary mb-6">Saved Items ❤️</h2>
                <div className="text-center py-20 text-text-muted font-body">
                  <div className="text-6xl mb-4">❤️</div>
                  <p>View your wishlist in the <a href="/wishlist" className="text-bloom-pink-dark font-bold hover:underline">Wishlist page</a></p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
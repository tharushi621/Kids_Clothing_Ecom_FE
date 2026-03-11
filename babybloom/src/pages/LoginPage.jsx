import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiMail, FiLock, FiUser, FiEye, FiEyeOff,
  FiArrowRight, FiCheck
} from 'react-icons/fi'
import toast from 'react-hot-toast'

const floatingItems = [
  { emoji: '🌸', x: '8%',  y: '12%', delay: 0,   size: 'text-5xl' },
  { emoji: '⭐', x: '88%', y: '10%', delay: 0.5, size: 'text-4xl' },
  { emoji: '🧸', x: '5%',  y: '68%', delay: 1,   size: 'text-5xl' },
  { emoji: '🎀', x: '90%', y: '60%', delay: 0.7, size: 'text-4xl' },
  { emoji: '🍼', x: '50%', y: '5%',  delay: 1.2, size: 'text-3xl' },
  { emoji: '💖', x: '92%', y: '85%', delay: 0.3, size: 'text-3xl' },
  { emoji: '🌈', x: '10%', y: '88%', delay: 0.9, size: 'text-3xl' },
]

const benefits = [
  '🛍️ Track all your orders easily',
  '❤️ Save items to your wishlist',
  '🎁 Get exclusive member deals',
  '📦 Faster checkout every time',
]

export default function LoginPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('login') // 'login' | 'signup' | 'forgot'
  const [showPass, setShowPass] = useState(false)
  const [showConfirmPass, setShowConfirmPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
  })

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (mode === 'signup' && form.password !== form.confirmPassword) {
      toast.error('Passwords do not match!', {
        style: { background: '#FFE0E0', fontFamily: 'Nunito', fontWeight: 700 }
      })
      return
    }

    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)

    if (mode === 'forgot') {
      setSuccess(true)
      return
    }

    toast.success(mode === 'login' ? 'Welcome back! 🌸' : 'Account created! Welcome to BabyBloom 🎉', {
      style: { background: '#FFD6E8', color: '#3D2C2C', fontFamily: 'Nunito', fontWeight: 700 },
    })
    navigate('/')
  }

  const handleSocial = async (provider) => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    setLoading(false)
    toast.success(`Signed in with ${provider}! 🌸`, {
      style: { background: '#FFD6E8', color: '#3D2C2C', fontFamily: 'Nunito', fontWeight: 700 },
    })
    navigate('/')
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-bloom-pink/60 via-bloom-lavender/40 to-bloom-blue/30 relative overflow-hidden flex-col items-center justify-center p-12">
        {/* Floating decoration */}
        {floatingItems.map((item, i) => (
          <motion.div
            key={i}
            className={`absolute ${item.size} pointer-events-none select-none opacity-60`}
            style={{ left: item.x, top: item.y }}
            animate={{ y: [0, -14, 0], rotate: [0, 6, -6, 0] }}
            transition={{ duration: 3 + i * 0.3, delay: item.delay, repeat: Infinity }}
          >
            {item.emoji}
          </motion.div>
        ))}

        {/* Background dots */}
        <div className="absolute inset-0 bg-dots opacity-20 pointer-events-none" />

        <div className="relative z-10 text-center max-w-md">
          {/* Logo */}
          <motion.div
            className="flex items-center justify-center gap-3 mb-10"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="w-14 h-14 bg-gradient-to-br from-bloom-pink-dark to-bloom-lavender-dark rounded-3xl flex items-center justify-center shadow-pink"
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <span className="text-white text-3xl">🌸</span>
            </motion.div>
            <span className="font-display font-extrabold text-4xl text-text-primary">
              Baby<span className="text-gradient-pink">Bloom</span>
            </span>
          </motion.div>

          <motion.h2
            className="font-display font-extrabold text-4xl text-text-primary mb-4 leading-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Dress Them in<br /><span className="text-gradient-rainbow">Pure Joy</span> ✨
          </motion.h2>

          <motion.p
            className="font-body text-text-secondary text-lg mb-10 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            Join 50,000+ happy parents who shop premium organic baby clothing.
          </motion.p>

          {/* Benefits */}
          <motion.div
            className="space-y-3 text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {benefits.map((b, i) => (
              <motion.div
                key={b}
                className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-2xl px-5 py-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 + i * 0.1 }}
              >
                <div className="w-6 h-6 bg-bloom-mint-dark rounded-full flex items-center justify-center shrink-0">
                  <FiCheck size={12} className="text-white" strokeWidth={3} />
                </div>
                <span className="font-body font-semibold text-text-secondary text-sm">{b}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Floating product card */}
          <motion.div
            className="mt-10 bg-white/80 backdrop-blur-md rounded-3xl p-4 shadow-soft-lg flex items-center gap-4 text-left"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div className="w-14 h-14 bg-bloom-pink/30 rounded-2xl flex items-center justify-center text-3xl">🎀</div>
            <div>
              <p className="font-display font-bold text-text-primary text-sm">Cloud Ruffle Bodysuit</p>
              <p className="font-body text-text-muted text-xs">Just added by Sarah M.</p>
            </div>
            <span className="font-display font-extrabold text-bloom-pink-dark ml-auto">$24.99</span>
          </motion.div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-bloom-cream relative overflow-hidden">
        {/* Subtle bg pattern */}
        <div className="absolute inset-0 bg-dots opacity-10 pointer-events-none" />

        <motion.div
          className="w-full max-w-md relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-bloom-pink-dark to-bloom-lavender-dark rounded-2xl flex items-center justify-center">
              <span className="text-white text-xl">🌸</span>
            </div>
            <span className="font-display font-extrabold text-2xl text-text-primary">
              Baby<span className="text-gradient-pink">Bloom</span>
            </span>
          </div>

          {/* Mode Tabs */}
          <AnimatePresence mode="wait">
            {!success ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                {/* Tabs */}
                {mode !== 'forgot' && (
                  <div className="flex bg-white rounded-2xl p-1 shadow-card mb-8">
                    {['login', 'signup'].map(m => (
                      <button
                        key={m}
                        onClick={() => setMode(m)}
                        className={`flex-1 py-3 rounded-xl font-display font-bold text-sm transition-all ${
                          mode === m
                            ? 'bg-bloom-pink-dark text-white shadow-pink'
                            : 'text-text-secondary hover:text-bloom-pink-dark'
                        }`}
                      >
                        {m === 'login' ? '👋 Sign In' : '✨ Sign Up'}
                      </button>
                    ))}
                  </div>
                )}

                {/* Header */}
                <div className="mb-8">
                  <h1 className="font-display font-extrabold text-3xl text-text-primary">
                    {mode === 'login' ? 'Welcome back! 👋' : mode === 'signup' ? 'Create account ✨' : 'Reset password 🔑'}
                  </h1>
                  <p className="font-body text-text-muted mt-2">
                    {mode === 'login' ? "Sign in to your BabyBloom account" :
                     mode === 'signup' ? "Join the BabyBloom family today" :
                     "Enter your email to receive a reset link"}
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {mode === 'signup' && (
                    <div>
                      <label className="font-body font-semibold text-text-secondary text-sm mb-2 block">Full Name</label>
                      <div className="relative">
                        <FiUser size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                        <input
                          className="input-field pl-11"
                          placeholder="Sarah Johnson"
                          value={form.name}
                          onChange={update('name')}
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="font-body font-semibold text-text-secondary text-sm mb-2 block">Email Address</label>
                    <div className="relative">
                      <FiMail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                      <input
                        className="input-field pl-11"
                        type="email"
                        placeholder="hello@example.com"
                        value={form.email}
                        onChange={update('email')}
                        required
                      />
                    </div>
                  </div>

                  {mode !== 'forgot' && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="font-body font-semibold text-text-secondary text-sm">Password</label>
                        {mode === 'login' && (
                          <button
                            type="button"
                            onClick={() => setMode('forgot')}
                            className="font-body text-xs font-bold text-bloom-blue-dark hover:underline"
                          >
                            Forgot password?
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <FiLock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                        <input
                          className="input-field pl-11 pr-12"
                          type={showPass ? 'text' : 'password'}
                          placeholder="Enter your password"
                          value={form.password}
                          onChange={update('password')}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPass(!showPass)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-bloom-pink-dark transition-colors"
                        >
                          {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                        </button>
                      </div>

                      {/* Password strength (signup only) */}
                      {mode === 'signup' && form.password.length > 0 && (
                        <motion.div
                          className="mt-2 space-y-1"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                        >
                          <div className="flex gap-1">
                            {[1, 2, 3, 4].map(level => (
                              <div
                                key={level}
                                className={`flex-1 h-1.5 rounded-full transition-colors ${
                                  form.password.length >= level * 2
                                    ? level <= 2 ? 'bg-red-400' : level === 3 ? 'bg-amber-400' : 'bg-bloom-mint-dark'
                                    : 'bg-bloom-cream'
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-xs font-body text-text-muted">
                            {form.password.length < 4 ? '😟 Too short'
                              : form.password.length < 6 ? '😐 Weak'
                              : form.password.length < 8 ? '🙂 Fair'
                              : '💪 Strong password!'}
                          </p>
                        </motion.div>
                      )}
                    </div>
                  )}

                  {mode === 'signup' && (
                    <div>
                      <label className="font-body font-semibold text-text-secondary text-sm mb-2 block">Confirm Password</label>
                      <div className="relative">
                        <FiLock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                        <input
                          className={`input-field pl-11 pr-12 ${form.confirmPassword && form.confirmPassword !== form.password ? 'border-red-300 focus:border-red-400' : ''}`}
                          type={showConfirmPass ? 'text' : 'password'}
                          placeholder="Re-enter your password"
                          value={form.confirmPassword}
                          onChange={update('confirmPassword')}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPass(!showConfirmPass)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-bloom-pink-dark transition-colors"
                        >
                          {showConfirmPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                        </button>
                      </div>
                      {form.confirmPassword && form.confirmPassword !== form.password && (
                        <p className="text-xs text-red-400 font-body mt-1">⚠️ Passwords don't match</p>
                      )}
                    </div>
                  )}

                  {mode === 'signup' && (
                    <label className="flex items-start gap-3 cursor-pointer">
                      <div className="w-5 h-5 mt-0.5 rounded-lg border-2 border-bloom-pink/40 bg-white flex items-center justify-center shrink-0">
                        <FiCheck size={12} className="text-bloom-pink-dark" />
                      </div>
                      <span className="font-body text-text-muted text-sm">
                        I agree to the{' '}
                        <a href="#" className="text-bloom-pink-dark font-bold hover:underline">Terms of Service</a>{' '}
                        and{' '}
                        <a href="#" className="text-bloom-pink-dark font-bold hover:underline">Privacy Policy</a>
                      </span>
                    </label>
                  )}

                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.97 }}
                  >
                    {loading ? (
                      <>
                        <motion.div
                          className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                        />
                        {mode === 'login' ? 'Signing in...' : mode === 'signup' ? 'Creating account...' : 'Sending link...'}
                      </>
                    ) : (
                      <>
                        {mode === 'login' ? '🌸 Sign In' : mode === 'signup' ? '✨ Create Account' : '📧 Send Reset Link'}
                        <FiArrowRight />
                      </>
                    )}
                  </motion.button>
                </form>

                {mode === 'forgot' && (
                  <button
                    onClick={() => setMode('login')}
                    className="mt-4 w-full text-center font-body text-text-muted text-sm hover:text-bloom-pink-dark transition-colors"
                  >
                    ← Back to Sign In
                  </button>
                )}

                {mode !== 'forgot' && (
                  <>
                    {/* Divider */}
                    <div className="flex items-center gap-4 my-6">
                      <div className="flex-1 h-px bg-bloom-pink/20" />
                      <span className="font-body text-text-muted text-sm">or continue with</span>
                      <div className="flex-1 h-px bg-bloom-pink/20" />
                    </div>

                    {/* Social Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: 'Google',  emoji: '🔵', provider: 'Google' },
                        { label: 'Apple',   emoji: '🍎', provider: 'Apple' },
                      ].map(btn => (
                        <motion.button
                          key={btn.label}
                          onClick={() => handleSocial(btn.provider)}
                          className="flex items-center justify-center gap-2 py-3 bg-white rounded-2xl border-2 border-bloom-pink/20 font-body font-semibold text-text-secondary hover:border-bloom-pink-dark hover:text-bloom-pink-dark transition-all shadow-card"
                          whileHover={{ scale: 1.03, y: -1 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          <span className="text-lg">{btn.emoji}</span>
                          {btn.label}
                        </motion.button>
                      ))}
                    </div>
                  </>
                )}
              </motion.div>
            ) : (
              /* Success State */
              <motion.div
                key="success"
                className="text-center py-10"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <motion.div
                  className="text-8xl mb-6"
                  animate={{ y: [0, -15, 0], rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  📧
                </motion.div>
                <h2 className="font-display font-extrabold text-3xl text-text-primary mb-3">Check your inbox!</h2>
                <p className="font-body text-text-secondary mb-2">
                  We sent a reset link to <span className="font-bold text-bloom-pink-dark">{form.email}</span>
                </p>
                <p className="font-body text-text-muted text-sm mb-8">
                  Didn't get it? Check your spam folder or try again.
                </p>
                <div className="space-y-3">
                  <motion.button
                    className="btn-primary w-full"
                    onClick={() => { setSuccess(false); setMode('login') }}
                    whileHover={{ scale: 1.02 }}
                  >
                    ← Back to Sign In
                  </motion.button>
                  <button
                    className="w-full text-sm font-body text-bloom-blue-dark hover:underline"
                    onClick={() => setSuccess(false)}
                  >
                    Resend email
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Back to shop link */}
          <div className="mt-8 text-center">
            <Link
              to="/"
              className="font-body text-text-muted text-sm hover:text-bloom-pink-dark transition-colors inline-flex items-center gap-1"
            >
              ← Continue shopping without account
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
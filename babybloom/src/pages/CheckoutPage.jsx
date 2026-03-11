import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiCheck, FiCreditCard, FiTruck, FiPackage, FiSmile } from 'react-icons/fi'
import { useStore } from '../store/useStore'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

const steps = ['Shipping', 'Payment', 'Review', 'Confirm']

export default function CheckoutPage() {
  const [step, setStep] = useState(0)
  const [ordered, setOrdered] = useState(false)
  const { cart, cartTotal, clearCart } = useStore()
  const total = cartTotal()

  const [shipping, setShipping] = useState({ name: '', email: '', address: '', city: '', zip: '', country: '' })
  const [payment, setPayment] = useState('card')
  const [coupon, setCoupon] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)

  const discount = couponApplied ? total * 0.1 : 0
  const shipping_fee = total >= 40 ? 0 : 5.99
  const finalTotal = total - discount + shipping_fee

  const applyCoupon = () => {
    if (coupon.toUpperCase() === 'BLOOM10') {
      setCouponApplied(true)
      toast.success('10% discount applied! 🎉', { style: { background: '#C7F9CC', fontFamily: 'Nunito', fontWeight: 700 } })
    } else {
      toast.error('Invalid coupon code', { style: { background: '#FFE0E0', fontFamily: 'Nunito', fontWeight: 700 } })
    }
  }

  const handlePlaceOrder = () => {
    setOrdered(true)
    clearCart()
  }

  if (ordered) return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        className="text-center max-w-md"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <motion.div
          className="text-9xl mb-6"
          animate={{ rotate: [0, -10, 10, -10, 0], y: [0, -20, 0] }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          🎉
        </motion.div>
        <h1 className="font-display font-extrabold text-4xl text-text-primary mb-4">Order Placed!</h1>
        <p className="font-body text-text-secondary text-lg mb-2">Thank you for shopping with BabyBloom! 🌸</p>
        <p className="font-body text-text-muted mb-8">Your order will be delivered in 2–5 business days.</p>
        <div className="space-y-3">
          <Link to="/" className="btn-primary block">🏠 Back to Home</Link>
          <Link to="/account" className="btn-secondary block">📦 Track Your Order</Link>
        </div>
      </motion.div>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-10">
      <h1 className="font-display font-extrabold text-3xl text-text-primary mb-8">Checkout 💳</h1>

      {/* Step Indicator */}
      <div className="flex items-center mb-10 overflow-x-auto scrollbar-hide">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-display font-extrabold text-sm transition-all ${
                  i < step ? 'bg-bloom-mint-dark text-white'
                  : i === step ? 'bg-bloom-pink-dark text-white shadow-pink'
                  : 'bg-bloom-cream text-text-muted border-2 border-bloom-pink/30'
                }`}
                whileHover={{ scale: 1.1 }}
              >
                {i < step ? <FiCheck size={16} /> : i + 1}
              </motion.div>
              <span className={`text-xs font-body font-semibold whitespace-nowrap ${i === step ? 'text-bloom-pink-dark' : 'text-text-muted'}`}>{s}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`h-0.5 w-12 md:w-24 mx-2 mb-5 rounded-full transition-all ${i < step ? 'bg-bloom-mint-dark' : 'bg-bloom-pink/30'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form Area */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {/* Step 0: Shipping */}
            {step === 0 && (
              <motion.div
                key="shipping"
                className="card p-8 space-y-5"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-bloom-blue rounded-2xl flex items-center justify-center text-xl">🚚</div>
                  <h2 className="font-display font-bold text-xl">Shipping Address</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-body font-semibold text-text-secondary text-sm mb-2 block">Full Name</label>
                    <input className="input-field" placeholder="Sarah Johnson" value={shipping.name} onChange={e => setShipping({...shipping, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="font-body font-semibold text-text-secondary text-sm mb-2 block">Email</label>
                    <input className="input-field" placeholder="sarah@example.com" type="email" value={shipping.email} onChange={e => setShipping({...shipping, email: e.target.value})} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="font-body font-semibold text-text-secondary text-sm mb-2 block">Street Address</label>
                    <input className="input-field" placeholder="123 Bloom Street, Apt 4B" value={shipping.address} onChange={e => setShipping({...shipping, address: e.target.value})} />
                  </div>
                  <div>
                    <label className="font-body font-semibold text-text-secondary text-sm mb-2 block">City</label>
                    <input className="input-field" placeholder="Los Angeles" value={shipping.city} onChange={e => setShipping({...shipping, city: e.target.value})} />
                  </div>
                  <div>
                    <label className="font-body font-semibold text-text-secondary text-sm mb-2 block">ZIP Code</label>
                    <input className="input-field" placeholder="90001" value={shipping.zip} onChange={e => setShipping({...shipping, zip: e.target.value})} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="font-body font-semibold text-text-secondary text-sm mb-2 block">Country</label>
                    <select className="input-field" value={shipping.country} onChange={e => setShipping({...shipping, country: e.target.value})}>
                      <option value="">Select Country</option>
                      <option>United States</option>
                      <option>Canada</option>
                      <option>United Kingdom</option>
                      <option>Australia</option>
                    </select>
                  </div>
                </div>
                <motion.button
                  className="btn-primary w-full mt-4"
                  onClick={() => setStep(1)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Continue to Payment →
                </motion.button>
              </motion.div>
            )}

            {/* Step 1: Payment */}
            {step === 1 && (
              <motion.div
                key="payment"
                className="card p-8 space-y-5"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-bloom-lavender rounded-2xl flex items-center justify-center text-xl">💳</div>
                  <h2 className="font-display font-bold text-xl">Payment Method</h2>
                </div>
                {[
                  { id: 'card', label: 'Credit / Debit Card', icon: '💳', desc: 'Visa, Mastercard, Amex' },
                  { id: 'paypal', label: 'PayPal / Online Payment', icon: '🌐', desc: 'Secure online transfer' },
                  { id: 'cod', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when it arrives' },
                ].map(opt => (
                  <motion.button
                    key={opt.id}
                    onClick={() => setPayment(opt.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                      payment === opt.id
                        ? 'border-bloom-pink-dark bg-bloom-pink/10'
                        : 'border-bloom-pink/20 hover:border-bloom-pink-dark/50'
                    }`}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${payment === opt.id ? 'bg-bloom-pink' : 'bg-bloom-cream'}`}>
                      {opt.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-display font-bold text-text-primary">{opt.label}</p>
                      <p className="font-body text-text-muted text-xs">{opt.desc}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${payment === opt.id ? 'border-bloom-pink-dark bg-bloom-pink-dark' : 'border-bloom-pink/40'}`}>
                      {payment === opt.id && <span className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                  </motion.button>
                ))}
                {payment === 'card' && (
                  <motion.div className="space-y-4 mt-2" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                    <input className="input-field" placeholder="Card Number: 1234 5678 9012 3456" />
                    <div className="grid grid-cols-2 gap-4">
                      <input className="input-field" placeholder="MM / YY" />
                      <input className="input-field" placeholder="CVV" />
                    </div>
                  </motion.div>
                )}
                <div className="flex gap-3">
                  <button onClick={() => setStep(0)} className="btn-secondary flex-1">← Back</button>
                  <motion.button className="btn-primary flex-1" onClick={() => setStep(2)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                    Review Order →
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Review */}
            {step === 2 && (
              <motion.div
                key="review"
                className="card p-8 space-y-5"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-bloom-yellow rounded-2xl flex items-center justify-center text-xl">📋</div>
                  <h2 className="font-display font-bold text-xl">Review Order</h2>
                </div>
                <div className="space-y-3">
                  {cart.map(item => (
                    <div key={`${item.id}-${item.size}`} className="flex items-center gap-4 p-4 bg-bloom-cream rounded-2xl">
                      <img src={item.images[0]} alt={item.name} className="w-14 h-14 rounded-xl object-cover" />
                      <div className="flex-1">
                        <p className="font-display font-bold text-text-primary text-sm">{item.name}</p>
                        <p className="text-xs text-text-muted font-body">Size: {item.size} · Qty: {item.qty}</p>
                      </div>
                      <span className="font-display font-extrabold text-bloom-pink-dark">${(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 p-4 bg-bloom-cream rounded-2xl text-sm font-body">
                  <div className="flex justify-between text-text-secondary"><span>Subtotal</span><span className="font-bold">${total.toFixed(2)}</span></div>
                  {couponApplied && <div className="flex justify-between text-bloom-mint-dark"><span>Discount (BLOOM10)</span><span className="font-bold">-${discount.toFixed(2)}</span></div>}
                  <div className="flex justify-between text-text-secondary"><span>Shipping</span><span className="font-bold">{shipping_fee === 0 ? '🎉 Free' : `$${shipping_fee}`}</span></div>
                  <div className="flex justify-between text-text-primary font-display font-extrabold text-lg pt-2 border-t border-bloom-pink/20"><span>Total</span><span className="text-bloom-pink-dark">${finalTotal.toFixed(2)}</span></div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="btn-secondary flex-1">← Back</button>
                  <motion.button className="btn-primary flex-1" onClick={handlePlaceOrder} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                    Place Order 🎉
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Order Summary Sidebar */}
        <div className="space-y-4">
          <div className="card p-6 space-y-4">
            <h3 className="font-display font-bold text-xl text-text-primary">Order Summary</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-hide">
              {cart.map(item => (
                <div key={`${item.id}-${item.size}`} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-bloom-cream shrink-0">
                    <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-bold text-text-primary text-xs truncate">{item.name}</p>
                    <p className="text-xs text-text-muted font-body">×{item.qty} · {item.size}</p>
                  </div>
                  <span className="font-bold text-sm text-bloom-pink-dark shrink-0">${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Coupon */}
            <div className="pt-3 border-t border-bloom-pink/20">
              <p className="font-body font-semibold text-text-secondary text-sm mb-2">🎟️ Coupon Code</p>
              <div className="flex gap-2">
                <input
                  className="flex-1 input-field py-2 text-sm"
                  placeholder="BLOOM10"
                  value={coupon}
                  onChange={e => setCoupon(e.target.value)}
                  disabled={couponApplied}
                />
                <button
                  onClick={applyCoupon}
                  disabled={couponApplied}
                  className={`px-4 py-2 rounded-2xl font-bold text-sm transition-all ${couponApplied ? 'bg-bloom-mint text-bloom-mint-dark cursor-not-allowed' : 'bg-bloom-pink-dark text-white hover:shadow-pink'}`}
                >
                  {couponApplied ? '✓' : 'Apply'}
                </button>
              </div>
            </div>

            <div className="space-y-2 pt-3 border-t border-bloom-pink/20 text-sm font-body">
              <div className="flex justify-between text-text-secondary"><span>Subtotal</span><span className="font-semibold">${total.toFixed(2)}</span></div>
              {couponApplied && <div className="flex justify-between text-bloom-mint-dark"><span>Discount</span><span className="font-semibold">-${discount.toFixed(2)}</span></div>}
              <div className="flex justify-between text-text-secondary"><span>Shipping</span><span className="font-semibold">{shipping_fee === 0 ? 'Free 🎉' : `$${shipping_fee}`}</span></div>
              <div className="flex justify-between text-text-primary font-display font-extrabold text-lg pt-2 border-t border-bloom-pink/20">
                <span>Total</span>
                <span className="text-bloom-pink-dark">${finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {total < 40 && (
            <div className="card p-4 bg-bloom-yellow/40 border border-bloom-yellow-dark/20">
              <p className="font-body text-text-secondary text-sm text-center">
                🚚 Add <span className="font-bold text-bloom-yellow-dark">${(40 - total).toFixed(2)}</span> more for free shipping!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
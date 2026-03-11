import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-bloom-pink/20 to-bloom-lavender/20">
      <div className="text-center">
        <motion.div
          className="text-9xl mb-6"
          animate={{ y: [0, -20, 0], rotate: [0, -5, 5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          🧸
        </motion.div>
        <h1 className="font-display font-extrabold text-8xl text-bloom-pink-dark mb-4">404</h1>
        <h2 className="font-display font-bold text-3xl text-text-primary mb-4">Oops! Page Not Found</h2>
        <p className="font-body text-text-muted text-lg mb-8">This page went on a little adventure and got lost!</p>
        <Link to="/" className="btn-primary text-lg px-10 py-4">🏠 Go Back Home</Link>
      </div>
    </div>
  )
}
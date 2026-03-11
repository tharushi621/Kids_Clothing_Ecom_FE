import { Link } from 'react-router-dom'

const LINKS = {
  'Shop': [
    { label: 'New Arrivals', to: '/shop?filter=new' },
    { label: 'Dresses',      to: '/shop?cat=dresses' },
    { label: 'Tops & Tees',  to: '/shop?cat=tops' },
    { label: 'Outerwear',    to: '/shop?cat=outerwear' },
    { label: 'Sale',         to: '/shop?filter=sale' },
  ],
  'Help': [
    { label: 'Size Guide',       to: '#' },
    { label: 'Shipping & Returns', to: '#' },
    { label: 'Order Status',     to: '#' },
    { label: 'FAQ',              to: '#' },
    { label: 'Contact Us',       to: '#' },
  ],
  'Company': [
    { label: 'About Us',         to: '#' },
    { label: 'Sustainability',   to: '#' },
    { label: 'Press',            to: '#' },
    { label: 'Careers',          to: '#' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-brand-navy text-white">
      {/* Main footer */}
      <div className="container py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-8">

          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-6 h-6 bg-brand-sage rounded-full" />
              <span className="font-display font-semibold text-lg text-white">BabyBloom</span>
            </Link>
            <p className="font-body text-sm text-white/55 leading-relaxed max-w-xs mb-6">
              Thoughtfully designed children's clothing made from certified organic cotton. Better for your little one, better for the planet.
            </p>

            {/* Newsletter */}
            <p className="font-heading font-semibold text-xs tracking-wider uppercase text-white/40 mb-3">
              Stay in the Loop
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-2.5 bg-white/8 border border-white/15 rounded-md font-body text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/35"
              />
              <button className="px-4 py-2.5 bg-brand-sage rounded-md font-heading font-semibold text-sm text-white hover:bg-brand-sage-dark transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([title, items]) => (
            <div key={title}>
              <p className="font-heading font-semibold text-xs tracking-wider uppercase text-white/40 mb-4">
                {title}
              </p>
              <ul className="space-y-2.5">
                {items.map(item => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className="font-body text-sm text-white/60 hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-body text-xs text-white/35">
            © {new Date().getFullYear()} BabyBloom. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {['Privacy Policy', 'Terms', 'Accessibility'].map(l => (
              <Link key={l} to="#" className="font-body text-xs text-white/35 hover:text-white/60 transition-colors">
                {l}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
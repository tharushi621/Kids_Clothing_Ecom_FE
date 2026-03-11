import HeroSection from '../components/home/HeroSection'
import TrustBadges from '../components/home/TrustBadges'
import ShopByAge from '../components/home/ShopByAge'
import CategoriesSection from '../components/home/CategoriesSection'
import FeaturedProducts from '../components/home/FeaturedProducts'
import ReviewsSection from '../components/home/ReviewsSection'
import Newsletter from '../components/home/Newsletter'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustBadges />
      <ShopByAge />
      <CategoriesSection />
      <FeaturedProducts />
      <ReviewsSection />
      <Newsletter />
    </>
  )
}
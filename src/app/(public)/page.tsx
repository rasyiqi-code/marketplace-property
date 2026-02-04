import { HeroMUI } from '@/components/HeroMUI';
import { PropertyShowcase } from '@/components/PropertyShowcase';
import { StatsSection } from '@/components/homepage/StatsSection';
import { CategorySection } from '@/components/homepage/CategorySection';
import { TestimonialSection } from '@/components/homepage/TestimonialSection';
import {
  getFeaturedProperties,
  getPopularProperties,
  getNewProperties,
} from '@/lib/data/properties';

/**
 * Homepage ProEstate
 * Menampilkan Hero section dan showcase properti dengan MUI
 */
export default async function Home() {
  // Fetch semua data properti secara paralel
  const [featured, popular, newProps] = await Promise.all([
    getFeaturedProperties(),
    getPopularProperties(),
    getNewProperties(),
  ]);

  return (
    <>
      <HeroMUI />
      <StatsSection />
      <CategorySection />
      <PropertyShowcase
        featuredProperties={featured}
        popularProperties={popular}
        newProperties={newProps}
      />
      <TestimonialSection />
    </>
  );
}

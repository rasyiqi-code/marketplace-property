import { HeroMUI } from '@/components/HeroMUI';
import { PropertyShowcase } from '@/components/PropertyShowcase';
import { StatsSection } from '@/components/homepage/StatsSection';
import { CategorySection } from '@/components/homepage/CategorySection';
import { TestimonialSection } from '@/components/homepage/TestimonialSection';
import {
  getFeaturedProperties,
  getPopularProperties,
  getNewProperties,
} from '@/lib/data/properties/queries';
import {
  getHomepageStats,
  getCategoryCounts,
  getTestimonials,
  getFeaturedPropertyImages
} from '@/lib/data/homepage';

export const dynamic = 'force-dynamic';

/**
 * Homepage ProEstate
 * Menampilkan Hero section dan showcase properti dengan MUI
 */
export default async function Home() {
  // Fetch semua data properti secara paralel
  const [
    featured,
    popular,
    newProps,
    stats,
    categories,
    testimonials,
    heroImages
  ] = await Promise.all([
    getFeaturedProperties(),
    getPopularProperties(),
    getNewProperties(),
    getHomepageStats(),
    getCategoryCounts(),
    getTestimonials(),
    getFeaturedPropertyImages(),
  ]);

  return (
    <main>
      <HeroMUI heroImages={heroImages} />
      <StatsSection stats={stats} />
      <CategorySection categories={categories} />
      <PropertyShowcase
        featuredProperties={featured}
        popularProperties={popular}
        newProperties={newProps}
      />
      <TestimonialSection testimonials={testimonials} />
    </main>
  );
}

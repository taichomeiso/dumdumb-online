import { ProductGrid } from '@/components/ProductGrid';
import { HeroSection } from '@/components/HeroSection';

export default function StorePage() {
  return (
    <main className="w-full">
      <HeroSection />
      <ProductGrid />
    </main>
  );
}
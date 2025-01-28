'use client';

import { HeroSection } from '@/components/HeroSection';
import { CategoryFilter } from '@/components/CategoryFilter';
import { ProductList } from '@/components/ProductList';
import { getProducts } from './_actions';
import { useState, useEffect } from 'react';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts(selectedCategory);
      setProducts(data);
    };
    fetchProducts();
  }, [selectedCategory]);

  return (
    <main className="w-full">
      <HeroSection />
      <CategoryFilter 
        selectedCategory={selectedCategory} 
        onCategoryChange={setSelectedCategory} 
      />
      <ProductList products={products} />
    </main>
  );
}
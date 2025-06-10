'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Product } from '@/lib/types';
import { ProductCard } from './ProductCard';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductCarouselProps {
  products: Product[];
}

export function ProductCarousel({ products }: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleProducts, setVisibleProducts] = useState(3);

  const updateVisibleProducts = useCallback(() => {
    if (window.innerWidth < 640) { // Tailwind 'sm' breakpoint
      setVisibleProducts(1);
    } else if (window.innerWidth < 1024) { // Tailwind 'lg' breakpoint
      setVisibleProducts(2);
    } else {
      setVisibleProducts(3);
    }
  }, []);

  useEffect(() => {
    updateVisibleProducts();
    window.addEventListener('resize', updateVisibleProducts);
    return () => window.removeEventListener('resize', updateVisibleProducts);
  }, [updateVisibleProducts]);

  const featuredProducts = products.filter(p => p.isFeatured);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % Math.max(1, (featuredProducts.length - visibleProducts + 1)) );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + Math.max(1, (featuredProducts.length - visibleProducts + 1))) % Math.max(1, (featuredProducts.length - visibleProducts + 1)));
  };

  if (!featuredProducts.length) {
    return <p className="text-center text-muted-foreground">No featured products available.</p>;
  }
  
  // Ensure currentIndex is valid after visibleProducts change
  useEffect(() => {
    const maxPossibleIndex = Math.max(0, featuredProducts.length - visibleProducts);
    if (currentIndex > maxPossibleIndex) {
      setCurrentIndex(maxPossibleIndex);
    }
  }, [currentIndex, featuredProducts.length, visibleProducts]);


  return (
    <div className="relative w-full">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * (100 / visibleProducts)}%)` }}
        >
          {featuredProducts.map((product) => (
            <div key={product.id} className="p-2" style={{ flex: `0 0 ${100 / visibleProducts}%` }}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
      {featuredProducts.length > visibleProducts && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1/2 z-10 bg-background/80 hover:bg-background"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-1/2 z-10 bg-background/80 hover:bg-background"
            onClick={nextSlide}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}
    </div>
  );
}

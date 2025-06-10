'use client';

import { useState, useMemo } from 'react';
import { ProductCard } from '@/components/products/ProductCard';
import { FilterSidebar, Filters } from '@/components/products/FilterSidebar';
import { mockProducts } from '@/lib/mockData';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { LayoutGrid, ListFilter } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';


const uniqueCategories = Array.from(new Set(mockProducts.map(p => p.category)));
const uniqueTypes = Array.from(new Set(mockProducts.map(p => p.type)));

export default function ProductsPage() {
  const [filters, setFilters] = useState<Filters>({
    category: 'all',
    type: 'all',
    sortBy: 'name_asc',
    searchQuery: '',
  });
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  const filteredAndSortedProducts = useMemo(() => {
    let products = [...mockProducts];

    // Filter by search query
    if (filters.searchQuery) {
      products = products.filter(product =>
        product.name.toLowerCase().includes(filters.searchQuery.toLowerCase())
      );
    }
    
    // Filter by category
    if (filters.category !== 'all') {
      products = products.filter(
        (product) => product.category.toLowerCase() === filters.category
      );
    }

    // Filter by type
    if (filters.type !== 'all') {
      products = products.filter(
        (product) => product.type.toLowerCase() === filters.type
      );
    }

    // Sort products
    switch (filters.sortBy) {
      case 'name_asc':
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        products.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price_asc':
        products.sort((a, b) => (a.type === 'auction' ? a.currentBid || 0 : a.price) - (b.type === 'auction' ? b.currentBid || 0 : b.price));
        break;
      case 'price_desc':
        products.sort((a, b) => (b.type === 'auction' ? b.currentBid || 0 : b.price) - (a.type === 'auction' ? a.currentBid || 0 : a.price));
        break;
      case 'date_desc': // Assuming products have a creation date or ID can be used
        products.sort((a,b) => parseInt(b.id) - parseInt(a.id)); // Simplistic sort by ID as proxy for newest
        break;
      default:
        break;
    }

    return products;
  }, [filters]);

  const SidebarContent = () => (
     <FilterSidebar
        categories={uniqueCategories}
        productTypes={uniqueTypes}
        onFilterChange={handleFilterChange}
        initialFilters={filters}
      />
  );

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="md:hidden mb-4">
        <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">
              <ListFilter className="mr-2 h-4 w-4" />
              Filter & Sort
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full sm:w-[320px] p-0">
            <SheetHeader className="p-4 border-b">
                <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="p-4">
              <SidebarContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <aside className="hidden md:block md:w-1/4 lg:w-1/5">
        <SidebarContent />
      </aside>

      <main className="md:w-3/4 lg:w-4/5">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-headline font-semibold">
            All Products ({filteredAndSortedProducts.length})
          </h1>
          {/* <Button variant="outline" size="icon">
            <LayoutGrid className="h-5 w-5" />
          </Button> */}
        </div>

        {filteredAndSortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">No products match your filters.</p>
            <Button variant="link" onClick={() => setFilters({ category: 'all', type: 'all', sortBy: 'name_asc', searchQuery: ''})} className="mt-4">
              Clear Filters
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}

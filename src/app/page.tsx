import { ProductCarousel } from '@/components/products/ProductCarousel';
import { mockProducts } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
  const featuredProducts = mockProducts.filter(p => p.isFeatured);

  return (
    <div className="space-y-12">
      <section className="text-center py-12 bg-card rounded-lg shadow-sm">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary mb-4">
          Welcome to Storefront Vista
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Discover amazing products, bid on exclusive auctions, and find unique digital goods.
        </p>
        <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="/products">
            Shop All Products <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </section>

      <section>
        <h2 className="text-3xl font-headline font-semibold text-center mb-8">
          Featured Products
        </h2>
        {featuredProducts.length > 0 ? (
          <ProductCarousel products={featuredProducts} />
        ) : (
          <p className="text-center text-muted-foreground">No featured products to display at the moment.</p>
        )}
      </section>

      <section className="py-12">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="p-6 bg-card rounded-lg shadow-sm">
            <h3 className="text-xl font-headline font-semibold text-primary mb-2">Wide Selection</h3>
            <p className="text-muted-foreground">Explore a diverse range of physical, digital, and auction items.</p>
          </div>
          <div className="p-6 bg-card rounded-lg shadow-sm">
            <h3 className="text-xl font-headline font-semibold text-primary mb-2">Secure & Easy</h3>
            <p className="text-muted-foreground">Enjoy a seamless and secure shopping experience.</p>
          </div>
          <div className="p-6 bg-card rounded-lg shadow-sm">
            <h3 className="text-xl font-headline font-semibold text-primary mb-2">Exciting Auctions</h3>
            <p className="text-muted-foreground">Place your bids and win unique products in our auctions.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

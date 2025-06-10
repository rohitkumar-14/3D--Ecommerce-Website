'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Tag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <CardHeader className="p-0">
        <Link href={`/products/${product.id}`} className="block">
          <div className="aspect-[4/3] relative w-full overflow-hidden">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              data-ai-hint={product.dataAiHint || 'product image'}
            />
          </div>
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <Badge variant={product.type === 'auction' ? 'destructive' : 'secondary'} className="capitalize">
            {product.type}
          </Badge>
          {product.isFeatured && <Badge variant="default">Featured</Badge>}
        </div>
        <CardTitle className="text-lg font-headline mb-1 leading-tight">
          <Link href={`/products/${product.id}`} className="hover:text-primary transition-colors">
            {product.name}
          </Link>
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground mb-2 h-10 overflow-hidden">
          {product.description.substring(0, 70)}...
        </CardDescription>
        
        <div className="mt-2 text-base font-semibold text-foreground">
          {product.type === 'auction' ? (
            <>
              Current Bid: <span className="text-primary">${product.currentBid?.toFixed(2)}</span>
            </>
          ) : (
            `$${product.price.toFixed(2)}`
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t">
        <Button asChild className="w-full" variant="outline">
          <Link href={`/products/${product.id}`}>
            {product.type === 'auction' ? 'View Auction' : 'View Details'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

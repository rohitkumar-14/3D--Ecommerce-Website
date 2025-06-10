
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { mockProducts, getProductById } from '@/lib/mockData';
import type { Product, SelectedCustomizations, Bid } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageGallery } from '@/components/products/ImageGallery';
import { BiddingForm } from '@/components/products/BiddingForm';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, ShoppingCart, Download, Tag, Orbit, Settings2, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { ModelViewer } from '@/components/products/ModelViewer';
import { ProductCustomization } from '@/components/products/ProductCustomization';
import { useCart } from '@/context/CartContext';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCustomizations, setSelectedCustomizations] = useState<SelectedCustomizations>({});

  useEffect(() => {
    if (params.id) {
      const fetchedProduct = getProductById(params.id as string);
      if (fetchedProduct) {
        setProduct(fetchedProduct);
        const initialCustomizations: SelectedCustomizations = {};
        if (fetchedProduct.customizationOptions) {
          fetchedProduct.customizationOptions.forEach(opt => {
            if (opt.defaultValue) {
              initialCustomizations[opt.id] = opt.defaultValue;
            } else if (opt.type === 'select' && opt.choices && opt.choices.length > 0) {
              // Ensure a default is set for select if not provided, to avoid uncontrolled component
              initialCustomizations[opt.id] = opt.choices[0].value;
            } else if (opt.type === 'radio' && opt.choices && opt.choices.length > 0) {
               initialCustomizations[opt.id] = opt.choices[0].value;
            }
          });
        }
        setSelectedCustomizations(initialCustomizations);
      }
      setIsLoading(false);
    }
  }, [params.id]);

  const handleCustomizationChange = (optionId: string, value: string) => {
    setSelectedCustomizations(prev => ({ ...prev, [optionId]: value }));
  };

  const handleBidPlaced = (newBidAmount: number) => {
    if (product && product.type === 'auction') {
      const newBid: Bid = {
        id: `bid-${Date.now()}`,
        productId: product.id,
        userId: 'currentUser', 
        userName: 'You', 
        amount: newBidAmount,
        timestamp: new Date().toISOString(),
      };
      setProduct(prev => prev ? ({
        ...prev,
        currentBid: newBidAmount,
        bids: [...(prev.bids || []), newBid].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      }) : null);
    }
  };

  const handleBuyNow = () => {
    if (!product) return;
    router.push(`/checkout/${product.id}`);
  };
  
  const handleDownload = () => {
    if(product && product.type === 'digital' && product.digitalFileUrl) {
        toast({
            title: "Download Started",
            description: `Downloading ${product.name}. Check your downloads folder.`,
        });
        window.open(product.digitalFileUrl, '_blank');
    } else {
        toast({
            title: "Download Failed",
            description: "Digital file not available for this product.",
            variant: "destructive",
        });
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart(product, 1, selectedCustomizations);

    const customizationsText = Object.entries(selectedCustomizations)
      .filter(([, value]) => value)
      .map(([key, value]) => {
        const option = product.customizationOptions?.find(opt => opt.id === key);
        const choiceLabel = option?.choices?.find(c => c.value === value)?.label;
        return `${option?.name || key}: ${choiceLabel || value}`;
      })
      .join(', ');

    toast({
      title: "Added to Cart!",
      description: `${product.name}${customizationsText ? ` (${customizationsText})` : ''} has been added to your cart.`,
      action: (
        <Button variant="link" asChild>
            <Link href="/cart">View Cart</Link>
        </Button>
      )
    });
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading product details...</div>;
  }

  if (!product) {
    return <div className="text-center py-10">Product not found.</div>;
  }

  return (
    <div className="space-y-8">
      <Button variant="outline" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
      </Button>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div>
          <ImageGallery images={product.images} productName={product.name} dataAiHint={product.dataAiHint} />
          {product.modelUrl && (
            <div className="mt-8">
              <ModelViewer modelUrl={product.modelUrl} productName={product.name} />
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex justify-between items-start">
                <Badge variant={product.type === 'auction' ? 'destructive' : 'secondary'} className="capitalize text-sm mb-2">
                  {product.type}
                </Badge>
                 {product.isFeatured && <Badge variant="default">Featured</Badge>}
              </div>
              <CardTitle className="text-3xl md:text-4xl font-headline">{product.name}</CardTitle>
              <div className="text-2xl font-semibold text-primary mt-1">
                {product.type === 'auction' 
                  ? `Current Bid: $${(product.currentBid || product.price).toFixed(2)}`
                  : `$${product.price.toFixed(2)}`}
              </div>
               <p className="text-sm text-muted-foreground">Category: {product.category}</p>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                {product.description}
              </CardDescription>
            </CardContent>
          </Card>

          {product.customizationOptions && product.customizationOptions.length > 0 && (
            <ProductCustomization 
              options={product.customizationOptions}
              selectedCustomizations={selectedCustomizations}
              onCustomizationChange={handleCustomizationChange}
            />
          )}

          <div className="space-y-3">
            {(product.type === 'physical' || product.type === 'digital') && (
              <Button variant="outline" size="lg" className="w-full text-lg py-3" onClick={handleAddToCart}>
                <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
              </Button>
            )}

            {product.type === 'auction' ? (
              <BiddingForm product={product} onBidPlaced={handleBidPlaced} />
            ) : product.type === 'digital' ? (
              <Button size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-3" onClick={handleDownload}>
                <Download className="mr-2 h-5 w-5" /> Download Now
              </Button>
            ) : ( // Physical
              <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3" onClick={handleBuyNow}>
                <ArrowRight className="mr-2 h-5 w-5" /> Buy Now
              </Button>
            )}
          </div>
        </div>
      </div>

      {product.type === 'auction' && product.auctionEndDate && (
         <Card>
            <CardHeader>
                <CardTitle className="font-headline text-xl">Auction Details</CardTitle>
            </CardHeader>
            <CardContent>
                <p><strong>Ends:</strong> {new Date(product.auctionEndDate).toLocaleString()}</p>
                <p><strong>Starting Bid:</strong> ${product.price.toFixed(2)}</p>
                {product.bids && product.bids.length > 0 && (
                    <div className="mt-4">
                        <h4 className="font-semibold mb-2">Bid History ({product.bids.length} bids):</h4>
                        <ul className="list-disc list-inside space-y-1 max-h-48 overflow-y-auto text-sm">
                        {product.bids.slice().reverse().map(bid => ( // Show newest first
                            <li key={bid.id}>
                            {bid.userName} bid ${bid.amount.toFixed(2)} on {new Date(bid.timestamp).toLocaleTimeString()}
                            </li>
                        ))}
                        </ul>
                    </div>
                )}
            </CardContent>
         </Card>
      )}
    </div>
  );
}

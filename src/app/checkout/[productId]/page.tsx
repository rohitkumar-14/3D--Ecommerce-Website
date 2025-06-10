
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { getProductById } from '@/lib/mockData';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { CheckCircle, Package, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { currentUser, isLoading: authIsLoading } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  useEffect(() => {
    if (!authIsLoading && !currentUser) {
      router.push(`/login?redirect=/checkout/${params.productId}`);
    }
  }, [currentUser, authIsLoading, router, params.productId]);

  useEffect(() => {
    if (params.productId) {
      const fetchedProduct = getProductById(params.productId as string);
      if (fetchedProduct) {
        setProduct(fetchedProduct);
      }
      setIsLoadingProduct(false);
    }
  }, [params.productId]);

  const handleConfirmOrder = () => {
    if (!product) return;
    
    if (product.type === 'digital') {
        toast({
            title: "Order Confirmed!",
            description: `${product.name} is now available. Check 'My Account' for downloads.`,
            action: <Button variant="link" asChild><Link href="/my-account">Go to My Account</Link></Button>
        });
    } else if (product.type === 'auction') {
         toast({
            title: "Auction Won & Payment Confirmed!",
            description: `You've successfully paid for ${product.name}.`,
            action: <Button variant="link" asChild><Link href="/my-account">View My Orders</Link></Button>
        });
    }
    else { 
        toast({
            title: "Order Confirmed!",
            description: `Your order for ${product.name} has been placed successfully. Payment will be collected upon delivery.`,
             action: <Button variant="link" asChild><Link href="/my-account">View My Orders</Link></Button>
        });
    }
    setOrderConfirmed(true);
  };

  if (authIsLoading || isLoadingProduct) {
    return (
        <div className="flex justify-center items-center min-h-[300px]">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    );
  }

  if (!currentUser) {
     // Should be redirected by the effect, but this is a fallback.
    return <div className="text-center py-10">Redirecting to login...</div>;
  }

  if (!product) {
    return <div className="text-center py-10">Product not found for checkout.</div>;
  }

  if (orderConfirmed) {
    return (
      <Card className="max-w-2xl mx-auto my-10 shadow-xl">
        <CardHeader className="text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <CardTitle className="text-3xl font-headline text-green-600">Order Confirmed!</CardTitle>
          <CardDescription className="text-lg">
            Thank you for your purchase of {product.name}.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {product.type === 'physical' && <p>Your order will be shipped soon. Payment is Cash on Delivery.</p>}
          {product.type === 'auction' && <p>Your payment for the won auction is confirmed.</p>}
          {product.type === 'digital' && (
            <>
              <p>Your digital product is now available.</p>
              {product.digitalFileUrl && (
                 <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    <a href={product.digitalFileUrl} target="_blank" rel="noopener noreferrer">Download Now</a>
                </Button>
              )}
            </>
          )}
          <Separator />
          <p className="text-sm text-muted-foreground">An order confirmation has been (not really) sent to your email.</p>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
          <Button asChild>
            <Link href="/my-account">View My Orders</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  const priceToPay = product.type === 'auction' ? product.currentBid || product.price : product.price;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-headline font-semibold mb-8 text-center">Checkout</h1>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Image
              src={product.images[0]}
              alt={product.name}
              width={100}
              height={100}
              className="rounded-md border object-cover aspect-square"
              data-ai-hint={product.dataAiHint || 'product image'}
            />
            <div>
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-sm text-muted-foreground capitalize">{product.type} Product</p>
              <p className="text-lg font-bold text-primary">${priceToPay.toFixed(2)}</p>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="text-lg font-semibold mb-2">Payment Method</h4>
            <div className="border rounded-md p-4 flex items-center justify-between bg-secondary/30">
              <div className="flex items-center">
                <Package className="h-6 w-6 mr-3 text-primary" />
                <div>
                  <p className="font-medium">Cash on Delivery</p>
                  <p className="text-sm text-muted-foreground">Pay when your order arrives.</p>
                </div>
              </div>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
          </div>
          
          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between text-lg">
              <span>Subtotal:</span>
              <span>${priceToPay.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg">
              <span>Shipping:</span>
              <span>{product.type === 'digital' ? '$0.00 (Digital)' : 'Calculated at next step (Free for now)'}</span>
            </div>
            <Separator/>
            <div className="flex justify-between text-xl font-bold text-primary">
              <span>Total:</span>
              <span>${priceToPay.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-3" onClick={handleConfirmOrder}>
            Confirm Order (Pay on Delivery)
          </Button>
          <Button variant="outline" className="w-full" onClick={() => router.back()}>
            Cancel
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

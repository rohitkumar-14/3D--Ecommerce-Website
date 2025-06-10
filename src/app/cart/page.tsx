
'use client';

import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Trash2, Plus, Minus, ShoppingBag, Package, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CartPage() {
  const { cartItems, removeFromCart, updateItemQuantity, getCartTotalItems, getCartTotalPrice, clearCart } = useCart();
  const { currentUser, isLoading: authIsLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!authIsLoading && !currentUser) {
      router.push('/login?redirect=/cart');
    }
  }, [currentUser, authIsLoading, router]);

  const handleQuantityChange = (itemId: string, currentQuantity: number, change: number) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      toast({
        title: 'Item Removed',
        description: 'Product removed from your cart.',
      });
    } else {
      updateItemQuantity(itemId, newQuantity);
    }
  };

  if (authIsLoading || !currentUser) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-20">
        <ShoppingBag className="mx-auto h-24 w-24 text-muted-foreground mb-6" />
        <h1 className="text-3xl font-headline font-semibold mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="/products">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  const checkoutLink = cartItems.length > 0 ? `/checkout/${cartItems[0].product.id}` : '#';

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-headline font-bold mb-8 text-center">Your Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {cartItems.map(item => (
            <Card key={item.id} className="shadow-md overflow-hidden">
              <CardContent className="p-4 flex flex-col sm:flex-row gap-4">
                <div className="relative w-full sm:w-28 h-28 sm:h-auto aspect-square flex-shrink-0">
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.name}
                    fill
                    className="rounded-md object-cover border"
                    data-ai-hint={item.product.dataAiHint || 'product image'}
                  />
                </div>
                <div className="flex-grow space-y-2">
                  <Link href={`/products/${item.product.id}`}>
                    <h3 className="text-lg font-semibold hover:text-primary transition-colors">{item.product.name}</h3>
                  </Link>
                  {Object.keys(item.selectedCustomizations).length > 0 && (
                    <div className="text-xs text-muted-foreground">
                      {Object.entries(item.selectedCustomizations).map(([key, value]) => (
                        <span key={key} className="block">
                          {item.product.customizationOptions?.find(opt => opt.id === key)?.name || key}: {value}
                        </span>
                      ))}
                    </div>
                  )}
                   <p className="text-sm text-muted-foreground capitalize">Type: {item.product.type}</p>
                </div>
                <div className="flex flex-col items-end justify-between sm:w-40">
                  <p className="text-lg font-semibold text-primary">${item.totalPrice.toFixed(2)}</p>
                  <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive hover:text-destructive/80"
                      onClick={() => {
                        removeFromCart(item.id);
                        toast({ title: 'Item Removed', description: `${item.product.name} removed from cart.`});
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card className="shadow-lg sticky top-24"> {/* Adjust top based on header height */}
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal ({getCartTotalItems()} items)</span>
                <span>${getCartTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-sm">Calculated at next step</span>
              </div>
              <Separator />
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="text-primary">${getCartTotalPrice().toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button 
                asChild 
                size="lg" 
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-3"
                disabled={cartItems.length === 0}
              >
                <Link href={checkoutLink}>
                  Proceed to Checkout
                </Link>
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  clearCart();
                  toast({ title: 'Cart Cleared', description: 'All items removed from your cart.'});
                }}
              >
                Clear Cart
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

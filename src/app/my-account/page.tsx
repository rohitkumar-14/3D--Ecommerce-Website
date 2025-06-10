
'use client';

import { useState, useEffect } from 'react';
import { mockOrders, mockProducts } from '@/lib/mockData';
import type { Order, Product, User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';
import Link from 'next/link';
import { Download, ListOrdered, Package, ShoppingBag, Gavel, UserCircle, Briefcase, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';


export default function MyAccountPage() {
  const { currentUser, isLoading: authIsLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeBids, setActiveBids] = useState<Product[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (!authIsLoading && !currentUser) {
      router.push('/login?redirect=/my-account');
    }
  }, [currentUser, authIsLoading, router]);

  useEffect(() => {
    if (currentUser) {
      // In a real app, fetch orders & bids for currentUser.id
      setOrders(mockOrders.filter(order => order.status === 'Order Placed' || order.status === 'Delivered' || order.status === 'Auction Won'));
      
      const userBidsOnProductIds = ['2', '5']; // Mocked: these would be fetched based on currentUser.id
      const currentActiveBids = mockProducts.filter(p => 
          p.type === 'auction' && 
          p.auctionEndDate && 
          new Date(p.auctionEndDate).getTime() > Date.now() &&
          userBidsOnProductIds.includes(p.id)
      );
      setActiveBids(currentActiveBids);
    }
  }, [currentUser]);

  const handleBecomeSellerRequest = () => {
    toast({
      title: "Request Submitted!",
      description: "Your request to become a seller has been received. We'll review it and get back to you soon.",
    });
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (authIsLoading || !currentUser) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }


  const OrderItemCard = ({ order }: { order: Order }) => (
    <Card className="mb-4 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-headline">{order.productName}</CardTitle>
            <Badge variant={order.status === 'Delivered' || (order.status === 'Order Placed' && order.isDigitalDownloadReady) ? "default" : "secondary"} className="capitalize">{order.status}</Badge>
        </div>
        <CardDescription className="text-xs">Order ID: {order.id} | Placed: {new Date(order.purchaseDate).toLocaleDateString()}</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center gap-4 pt-2 pb-4">
        <Image 
            src={order.productImage || 'https://placehold.co/100x100.png'} 
            alt={order.productName} 
            width={80} height={80} 
            className="rounded border object-cover aspect-square"
            data-ai-hint="product image" 
        />
        <div className="flex-grow">
          <p className="font-semibold">Total: ${order.totalAmount.toFixed(2)}</p>
        </div>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        {order.isDigitalDownloadReady && order.digitalFileUrl && (
          <Button size="sm" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <a href={order.digitalFileUrl} target="_blank" rel="noopener noreferrer">
              <Download className="mr-2 h-4 w-4" /> Download
            </a>
          </Button>
        )}
        <Button size="sm" variant="outline" asChild>
          <Link href={`/products/${order.productId}`}>View Product</Link>
        </Button>
      </CardFooter>
    </Card>
  );

  const ActiveBidCard = ({ product }: { product: Product }) => (
     <Card className="mb-4 shadow-sm">
        <CardHeader className="pb-2">
            <CardTitle className="text-lg font-headline">{product.name}</CardTitle>
            <CardDescription className="text-xs">Auction ends: {product.auctionEndDate ? new Date(product.auctionEndDate).toLocaleDateString() : 'N/A'}</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-4 pt-2 pb-4">
            <Image 
                src={product.images[0]} 
                alt={product.name} 
                width={80} height={80} 
                className="rounded border object-cover aspect-square"
                data-ai-hint={product.dataAiHint || 'product image'}
            />
            <div className="flex-grow">
                <p className="font-semibold">Current Bid: <span className="text-primary">${product.currentBid?.toFixed(2)}</span></p>
                <p className="text-sm text-muted-foreground">Your bid: (Simulated - you are likely highest bidder)</p> 
            </div>
        </CardContent>
        <CardFooter className="justify-end">
            <Button size="sm" variant="default" asChild>
            <Link href={`/products/${product.id}`}>View Auction</Link>
            </Button>
        </CardFooter>
    </Card>
  );


  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-headline font-bold mb-8 text-center">My Account</h1>
      
      <Tabs defaultValue="profile" className="w-full"> {/* Default to profile */}
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-3 mb-6">
           <TabsTrigger value="profile" className="text-base py-2.5">
            <UserCircle className="mr-2 h-5 w-5" /> Profile Settings
          </TabsTrigger>
          <TabsTrigger value="orders" className="text-base py-2.5">
            <ListOrdered className="mr-2 h-5 w-5" /> My Orders & Purchases
          </TabsTrigger>
          <TabsTrigger value="bids" className="text-base py-2.5">
            <Gavel className="mr-2 h-5 w-5" /> My Active Bids
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl flex items-center">
                <UserCircle className="mr-3 h-6 w-6 text-primary"/>
                Profile Information
              </CardTitle>
              <CardDescription>View and manage your account details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={'https://placehold.co/100x100.png?text=' + getInitials(currentUser.name)} alt={currentUser.name} data-ai-hint="avatar user" />
                  <AvatarFallback>{getInitials(currentUser.name)}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h2 className="text-2xl font-semibold">{currentUser.name}</h2>
                  <p className="text-muted-foreground">{currentUser.email}</p>
                  <p className="text-sm text-muted-foreground">Role: <span className="capitalize">{currentUser.role}</span></p>
                  {/* <p className="text-sm text-muted-foreground">Member since: {new Date().toLocaleDateString()}</p> Simulated */}
                </div>
              </div>
              
              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-2">Account Actions</h3>
                 <Button variant="outline" disabled>Edit Profile (Coming Soon)</Button>
              </div>

              <Separator />
              
             {currentUser.role === 'customer' && (
                <div>
                    <h3 className="text-lg font-semibold mb-2">Seller Program</h3>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-md bg-secondary/20">
                    <div className="mb-4 sm:mb-0">
                        <p className="font-medium flex items-center"><Briefcase className="mr-2 h-5 w-5 text-accent"/>Interested in Selling?</p>
                        <p className="text-sm text-muted-foreground ">Join our platform and reach new customers.</p>
                    </div>
                    <Button 
                        onClick={handleBecomeSellerRequest} 
                        className="bg-accent hover:bg-accent/90 text-accent-foreground"
                    >
                        Request to Become a Seller
                    </Button>
                    </div>
                </div>
             )}
            </CardContent>
             <CardFooter>
                <p className="text-xs text-muted-foreground">For account deletion or data requests, please contact support.</p>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl flex items-center"><ShoppingBag className="mr-3 h-6 w-6 text-primary"/>Your Orders</CardTitle>
              <CardDescription>Review your past purchases and downloads.</CardDescription>
            </CardHeader>
            <CardContent>
              {orders.length > 0 ? (
                orders.map(order => <OrderItemCard key={order.id} order={order} />)
              ) : (
                <p className="text-muted-foreground text-center py-8">You have no orders yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bids">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl flex items-center"><Gavel className="mr-3 h-6 w-6 text-primary"/>Your Active Bids</CardTitle>
              <CardDescription>Track auctions you are currently bidding on.</CardDescription>
            </CardHeader>
            <CardContent>
              {activeBids.length > 0 ? (
                activeBids.map(bidProduct => <ActiveBidCard key={bidProduct.id} product={bidProduct} />)
              ) : (
                <p className="text-muted-foreground text-center py-8">You have no active bids.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

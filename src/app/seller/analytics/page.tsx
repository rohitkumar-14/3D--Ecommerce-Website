
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SimpleAreaChart } from '@/components/charts/SimpleAreaChart';
import { DollarSign, BarChartBig, ShoppingCart, Users, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const mockSalesData = [
  { month: 'Jan', sales: 1200, itemsSold: 50 },
  { month: 'Feb', sales: 1800, itemsSold: 75 },
  { month: 'Mar', sales: 1500, itemsSold: 60 },
  { month: 'Apr', sales: 2200, itemsSold: 90 },
  { month: 'May', sales: 1900, itemsSold: 80 },
  { month: 'Jun', sales: 2500, itemsSold: 110 },
];

const mockTopProducts = [
    { name: 'Handmade Leather Wallet', sales: 800, units: 16 },
    { name: 'Custom Digital Art', sales: 600, units: 8 },
    { name: 'Vintage Chess Set', sales: 330, units: 3 },
]

export default function SellerAnalyticsPage() {
  const { currentUser, isLoading: authIsLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authIsLoading && (!currentUser || currentUser.role !== 'seller')) {
      router.push('/login?redirect=/seller/analytics');
    }
  }, [currentUser, authIsLoading, router]);

  if (authIsLoading || !currentUser || currentUser.role !== 'seller') {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline font-bold flex items-center">
        <BarChartBig className="mr-3 h-8 w-8 text-primary" /> Seller Analytics
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$9,100.00</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items Sold</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">365</div>
            <p className="text-xs text-muted-foreground">+80 items from last month</p>
          </CardContent>
        </Card>
         <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">1 product out of stock</p>
          </CardContent>
        </Card>
      </div>

      <SimpleAreaChart
        data={mockSalesData}
        title="Monthly Sales Overview"
        description="Track your sales performance over the past few months."
        dataKey="sales"
        xAxisDataKey="month"
        strokeColor="hsl(var(--accent))"
        fillColor="hsl(var(--accent))"
      />

      <Card>
        <CardHeader>
            <CardTitle className="font-headline">Top Selling Products</CardTitle>
            <CardDescription>Your most popular items by revenue this month.</CardDescription>
        </CardHeader>
        <CardContent>
            <ul className="space-y-2">
                {mockTopProducts.map(product => (
                    <li key={product.name} className="flex justify-between items-center p-2 border-b last:border-b-0">
                        <span>{product.name}</span>
                        <span className="font-semibold">${product.sales.toFixed(2)} ({product.units} units)</span>
                    </li>
                ))}
            </ul>
        </CardContent>
      </Card>
       <div className="text-center">
        <Button variant="link" asChild>
          <Link href="/seller/products">Manage My Products</Link>
        </Button>
      </div>
    </div>
  );
}

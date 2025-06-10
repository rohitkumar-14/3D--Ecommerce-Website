
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SimpleAreaChart } from '@/components/charts/SimpleAreaChart';
import { DollarSign, BarChartBig, ShoppingCart, Users, Activity, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const mockSiteTrafficData = [
  { date: '2023-05-01', visitors: 1200 },
  { date: '2023-05-02', visitors: 1800 },
  { date: '2023-05-03', visitors: 1500 },
  { date: '2023-05-04', visitors: 2200 },
  { date: '2023-05-05', visitors: 1900 },
  { date: '2023-05-06', visitors: 2500 },
  { date: '2023-05-07', visitors: 2300 },
];

const mockConversionData = [
  { stage: 'Visitors', value: 2500 },
  { stage: 'Product Views', value: 1800 },
  { stage: 'Add to Cart', value: 400 },
  { stage: 'Checkout', value: 200 },
  { stage: 'Purchases', value: 150 },
];


export default function AdminAnalyticsPage() {
  const { currentUser, isLoading: authIsLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authIsLoading && (!currentUser || currentUser.role !== 'admin')) {
      router.push('/login?redirect=/admin/analytics');
    }
  }, [currentUser, authIsLoading, router]);

  if (authIsLoading || !currentUser || currentUser.role !== 'admin') {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline font-bold flex items-center">
        <BarChartBig className="mr-3 h-8 w-8 text-primary" /> Site-wide Analytics
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue (All Sellers)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$75,830.50</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,250</div>
            <p className="text-xs text-muted-foreground">+50 orders from last month</p>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4,320</div>
            <p className="text-xs text-muted-foreground">+150 new users this week</p>
          </CardContent>
        </Card>
         <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6.00%</div>
            <p className="text-xs text-muted-foreground">(Purchases / Visitors)</p>
          </CardContent>
        </Card>
      </div>

      <SimpleAreaChart
        data={mockSiteTrafficData}
        title="Daily Unique Visitors"
        description="Track unique visitor traffic to the site."
        dataKey="visitors"
        xAxisDataKey="date"
        strokeColor="hsl(var(--primary))"
        fillColor="hsl(var(--primary))"
      />
      
      <Card>
        <CardHeader>
            <CardTitle className="font-headline">Sales Conversion Funnel</CardTitle>
            <CardDescription>Overview of customer journey from visit to purchase.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            {mockConversionData.map((item, index) => (
                <div key={item.stage}>
                    <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{item.stage}</span>
                        <span className="text-sm text-muted-foreground">{item.value} users</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                        <div 
                            className="bg-accent h-2.5 rounded-full" 
                            style={{ width: `${(item.value / mockConversionData[0].value) * 100}%` }}
                        ></div>
                    </div>
                    {index < mockConversionData.length -1 && (
                         <p className="text-xs text-right text-muted-foreground mt-1">
                            {((mockConversionData[index+1].value / item.value) * 100).toFixed(1)}% to next stage
                         </p>
                    )}
                </div>
            ))}
        </CardContent>
      </Card>

    </div>
  );
}

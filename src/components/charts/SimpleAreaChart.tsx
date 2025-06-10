
'use client';

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { ChartConfig } from '@/components/ui/chart'; // Assuming ChartConfig is needed, if not, remove.

interface SimpleAreaChartProps {
  data: any[];
  title: string;
  description?: string;
  dataKey: string;
  xAxisDataKey: string;
  strokeColor?: string; // e.g., "hsl(var(--primary))"
  fillColor?: string;   // e.g., "hsl(var(--primary))"
}

export function SimpleAreaChart({
  data,
  title,
  description,
  dataKey,
  xAxisDataKey,
  strokeColor = "hsl(var(--primary))",
  fillColor = "hsl(var(--primary))"
}: SimpleAreaChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id={`color${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={fillColor} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={fillColor} stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey={xAxisDataKey} 
                tickLine={false} 
                axisLine={false} 
                fontSize={12}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis 
                tickLine={false} 
                axisLine={false} 
                fontSize={12} 
                stroke="hsl(var(--muted-foreground))"
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    borderColor: 'hsl(var(--border))',
                    borderRadius: 'var(--radius)',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                itemStyle={{ color: strokeColor }}
              />
              <Area
                type="monotone"
                dataKey={dataKey}
                stroke={strokeColor}
                fillOpacity={1}
                fill={`url(#color${dataKey})`}
                strokeWidth={2}
                dot={{ r: 4, fill: strokeColor, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: strokeColor, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

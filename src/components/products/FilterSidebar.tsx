'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '../ui/input';

export type Filters = {
  category: string;
  type: string;
  sortBy: string;
  searchQuery: string;
};

interface FilterSidebarProps {
  categories: string[];
  productTypes: string[];
  onFilterChange: (filters: Filters) => void;
  initialFilters: Filters;
}

const sortOptions = [
  { value: 'name_asc', label: 'Name (A-Z)' },
  { value: 'name_desc', label: 'Name (Z-A)' },
  { value: 'price_asc', label: 'Price (Low to High)' },
  { value: 'price_desc', label: 'Price (High to Low)' },
  { value: 'date_desc', label: 'Newest Arrivals' },
];

export function FilterSidebar({
  categories,
  productTypes,
  onFilterChange,
  initialFilters,
}: FilterSidebarProps) {
  const [filters, setFilters] = useState<Filters>(initialFilters);

  const handleInputChange = (field: keyof Filters, value: string) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <Card className="sticky top-24"> {/* Adjust top value based on header height */}
      <CardHeader>
        <CardTitle className="font-headline">Filter & Sort</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="search" className="text-sm font-medium">Search Products</Label>
          <Input
            id="search"
            type="text"
            placeholder="Search by name..."
            value={filters.searchQuery}
            onChange={(e) => handleInputChange('searchQuery', e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="category" className="text-sm font-medium">Category</Label>
          <Select
            value={filters.category}
            onValueChange={(value) => handleInputChange('category', value)}
          >
            <SelectTrigger id="category" className="mt-1">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category.toLowerCase()}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="type" className="text-sm font-medium">Product Type</Label>
          <Select
            value={filters.type}
            onValueChange={(value) => handleInputChange('type', value)}
          >
            <SelectTrigger id="type" className="mt-1">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {productTypes.map((type) => (
                <SelectItem key={type} value={type.toLowerCase()} className="capitalize">
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="sort" className="text-sm font-medium">Sort By</Label>
          <Select
            value={filters.sortBy}
            onValueChange={(value) => handleInputChange('sortBy', value)}
          >
            <SelectTrigger id="sort" className="mt-1">
              <SelectValue placeholder="Default" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Example for future checkbox filters:
        <div>
          <Label className="text-sm font-medium">Options</Label>
          <div className="mt-2 space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="inStock" />
              <Label htmlFor="inStock" className="font-normal">In Stock</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="onSale" />
              <Label htmlFor="onSale" className="font-normal">On Sale</Label>
            </div>
          </div>
        </div> */}
      </CardContent>
    </Card>
  );
}

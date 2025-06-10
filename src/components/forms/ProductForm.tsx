
'use client';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { PackagePlus, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

const productFormSchema = z.object({
  name: z.string().min(3, { message: "Product name must be at least 3 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  price: z.coerce.number().positive({ message: "Price must be a positive number." }),
  category: z.string().min(2, { message: "Category must be at least 2 characters." }),
  type: z.enum(['physical', 'digital', 'auction'], { required_error: "Product type is required." }),
  stock: z.coerce.number().int().min(0).optional(),
  imageUrl: z.string().url({ message: "Please enter a valid image URL." }),
  dataAiHint: z.string().optional(),
  isFeatured: z.boolean().optional(),
}).refine(data => data.type === 'physical' ? data.stock !== undefined && data.stock >= 0 : true, {
  message: "Stock is required for physical products.",
  path: ["stock"],
});

export type ProductFormData = z.infer<typeof productFormSchema>;

interface ProductFormProps {
  onSubmitSuccess: (data: ProductFormData, isEditing: boolean) => void;
  initialData?: Partial<ProductFormData>;
  onCancel?: () => void;
}

export function ProductForm({ onSubmitSuccess, initialData, onCancel }: ProductFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!initialData;

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: initialData || {
      name: '',
      description: '',
      price: 0,
      category: '',
      type: undefined,
      stock: 0,
      imageUrl: '',
      dataAiHint: '',
      isFeatured: false,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const productType = form.watch('type');

  const handleFormSubmit: SubmitHandler<ProductFormData> = async (data) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: `Product ${isEditing ? 'Updated' : 'Added'}!`,
      description: `Product "${data.name}" has been successfully ${isEditing ? 'updated' : 'added'}. (Simulated)`,
    });
    setIsLoading(false);
    onSubmitSuccess(data, isEditing);
    if (!isEditing) {
        form.reset({ // Reset to blank for add, not for edit
          name: '',
          description: '',
          price: 0,
          category: '',
          type: undefined,
          stock: 0,
          imageUrl: '',
          dataAiHint: '',
          isFeatured: false,
        });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Wireless Headphones" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe your product..." {...field} rows={4} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price / Starting Bid ($)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0.00" {...field} step="0.01" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Electronics" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select product type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="physical">Physical</SelectItem>
                    <SelectItem value="digital">Digital</SelectItem>
                    <SelectItem value="auction">Auction</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {productType === 'physical' && (
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.png" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="dataAiHint"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image AI Hint (Optional, max 2 words)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 'headphones tech'" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* isFeatured field could be added here if needed for admin/seller directly */}
        {/* <FormField
          control={form.control}
          name="isFeatured"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Feature this product?</FormLabel>
                <FormDescription>
                  Featured products appear on the homepage carousel.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        /> */}


        <div className="flex flex-col sm:flex-row gap-2">
            <Button type="submit" className="w-full sm:flex-1" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <PackagePlus className="mr-2 h-4 w-4" />
                  {isEditing ? 'Update Product' : 'Add Product'}
                </>
              )}
            </Button>
            {onCancel && (
                 <Button type="button" variant="outline" className="w-full sm:flex-1" onClick={onCancel} disabled={isLoading}>
                    Cancel
                </Button>
            )}
        </div>
      </form>
    </Form>
  );
}


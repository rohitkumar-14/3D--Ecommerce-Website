
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PackagePlus, Edit3, Trash2, ShoppingBag, PlusCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { ProductForm, type ProductFormData } from '@/components/forms/ProductForm';
import type { Product } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

// Mock data for seller products
const initialSellerProducts: Product[] = [
  { id: 'prod_seller_1', name: 'Handmade Leather Wallet', price: 49.99, stock: 15, type: 'physical', category: 'Accessories', images: ['https://placehold.co/100x75.png'], description:"A cool wallet", isFeatured: false, dataAiHint: 'wallet leather' },
  { id: 'prod_seller_2', name: 'Custom Digital Art Commission', price: 75.00, type: 'digital', category: 'Digital Goods', images: ['https://placehold.co/100x75.png'], description:"Some art", dataAiHint: 'art digital' },
  { id: 'prod_seller_3', name: 'Vintage Wooden Chess Set (Auction)', price: 100.00, type: 'auction', category: 'Games', currentBid: 110.00, images: ['https://placehold.co/100x75.png'], description:"A chess set", dataAiHint: 'chess game' },
  { id: 'prod_seller_4', name: 'Organic Dog Treats', price: 12.50, stock: 0, type: 'physical', category: 'Pet Supplies', images: ['https://placehold.co/100x75.png'], description:"Treats for dogs", dataAiHint: 'dog treats' },
];

export default function SellerProductsPage() {
  const { currentUser, isLoading: authIsLoading } = useAuth();
  const router = useRouter();
  const [sellerProducts, setSellerProducts] = useState<Product[]>(initialSellerProducts);
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false);
  const [isEditProductDialogOpen, setIsEditProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!authIsLoading && (!currentUser || currentUser.role !== 'seller')) {
      router.push('/login?redirect=/seller/products'); // Or to a 'not authorized' page
    }
    // In a real app, fetch products for currentUser.id if they are a seller
  }, [currentUser, authIsLoading, router]);


  const handleProductFormSubmit = (data: ProductFormData, isEditing: boolean) => {
    if (isEditing && editingProduct) {
      setSellerProducts(prevProducts =>
        prevProducts.map(p =>
          p.id === editingProduct.id
            ? {
                ...p,
                ...data,
                images: [data.imageUrl || p.images[0]], 
              }
            : p
        )
      );
      toast({
        title: "Product Updated",
        description: `Product "${data.name}" has been successfully updated.`,
      });
      setIsEditProductDialogOpen(false);
      setEditingProduct(null);
    } else {
      const newProduct: Product = {
        id: `prod_seller_${Date.now()}`,
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        type: data.type,
        stock: data.type === 'physical' ? data.stock : undefined,
        images: [data.imageUrl || 'https://placehold.co/600x400.png'],
        dataAiHint: data.dataAiHint,
        isFeatured: data.isFeatured || false,
        sellerId: currentUser?.id // Associate product with current seller
      };
      setSellerProducts(prevProducts => [newProduct, ...prevProducts]);
      toast({
        title: "Product Added",
        description: `Product "${newProduct.name}" has been successfully added.`,
      });
      setIsAddProductDialogOpen(false);
    }
  };

  const openEditDialog = (product: Product) => {
    const formData: ProductFormData = {
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        type: product.type,
        stock: product.stock,
        imageUrl: product.images[0], 
        dataAiHint: product.dataAiHint,
        isFeatured: product.isFeatured,
    };
    setEditingProduct({...product, ...formData}); 
    setIsEditProductDialogOpen(true);
  };

  const openDeleteDialog = (product: Product) => {
    setProductToDelete(product);
  };

  const confirmDeleteProduct = () => {
    if (productToDelete) {
      setSellerProducts(prevProducts => prevProducts.filter(p => p.id !== productToDelete.id));
      toast({
        title: "Product Deleted",
        description: `Product "${productToDelete.name}" has been deleted.`,
        variant: "destructive",
      });
      setProductToDelete(null); 
    }
  };
  
  const getProductStatus = (product: Product): { text: string, variant: "default" | "destructive" | "secondary" | "outline" | null | undefined } => {
    if (product.type === 'auction' && product.auctionEndDate && new Date(product.auctionEndDate) < new Date()) {
      return { text: 'Auction Ended', variant: 'outline' };
    }
    if (product.type === 'physical' && product.stock === 0) {
      return { text: 'Out of Stock', variant: 'destructive' };
    }
    return { text: 'Active', variant: 'default' };
  }

  if (authIsLoading || !currentUser || currentUser.role !== 'seller') {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }


  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-headline font-bold flex items-center">
          <ShoppingBag className="mr-3 h-8 w-8 text-primary" /> My Products
        </h1>
        <Dialog open={isAddProductDialogOpen} onOpenChange={setIsAddProductDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <PlusCircle className="mr-2 h-5 w-5" /> Add New Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle className="font-headline text-2xl">Add New Product</DialogTitle>
              <DialogDescription>
                Fill in the details below to list a new product.
              </DialogDescription>
            </DialogHeader>
            <ProductForm 
              onSubmitSuccess={(data) => handleProductFormSubmit(data, false)}
              onCancel={() => setIsAddProductDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl">Product Listings</CardTitle>
          <CardDescription>Manage your active and inactive product listings.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price / Bid</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sellerProducts.map((product) => {
                const status = getProductStatus(product);
                return (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="capitalize">{product.type}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>
                      {product.type === 'auction' 
                        ? `$${(product.currentBid || product.price).toFixed(2)} (current)` 
                        : `$${product.price.toFixed(2)}`}
                    </TableCell>
                    <TableCell>{product.type === 'physical' ? product.stock : 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>
                        {status.text}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => openEditDialog(product)}>
                        <Edit3 className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => openDeleteDialog(product)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
           {sellerProducts.length === 0 && (
            <p className="text-center text-muted-foreground py-8">You haven't listed any products yet.</p>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditProductDialogOpen} onOpenChange={setIsEditProductDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl">Edit Product</DialogTitle>
            <DialogDescription>
              Update the details of your product below.
            </DialogDescription>
          </DialogHeader>
          {editingProduct && (
            <ProductForm
              initialData={{
                name: editingProduct.name,
                description: editingProduct.description,
                price: editingProduct.price,
                category: editingProduct.category,
                type: editingProduct.type,
                stock: editingProduct.stock,
                imageUrl: editingProduct.images[0],
                dataAiHint: editingProduct.dataAiHint,
                isFeatured: editingProduct.isFeatured,
              }}
              onSubmitSuccess={(data) => handleProductFormSubmit(data, true)}
              onCancel={() => {
                setIsEditProductDialogOpen(false);
                setEditingProduct(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!productToDelete} onOpenChange={(open) => !open && setProductToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product
              "{productToDelete?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setProductToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteProduct} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

       <div className="text-center">
        <Button variant="link" asChild>
          <Link href="/seller/analytics">View Sales Analytics</Link>
        </Button>
      </div>
    </div>
  );
}

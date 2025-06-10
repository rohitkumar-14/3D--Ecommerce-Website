
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit3, Trash2, Package, PlusCircle, Search, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { ProductForm, type ProductFormData } from '@/components/forms/ProductForm';
import { mockProducts as initialSiteProducts } from '@/lib/mockData'; 
import type { Product } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function AdminProductsPage() {
  const { currentUser, isLoading: authIsLoading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialSiteProducts);
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false);
  const [isEditProductDialogOpen, setIsEditProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (!authIsLoading && (!currentUser || currentUser.role !== 'admin')) {
      router.push('/login?redirect=/admin/products'); 
    }
  }, [currentUser, authIsLoading, router]);


  const handleProductFormSubmit = (data: ProductFormData, isEditing: boolean) => {
    if (isEditing && editingProduct) {
      setProducts(prevProducts =>
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
        description: `Product "${data.name}" has been successfully updated on the site.`,
      });
      setIsEditProductDialogOpen(false);
      setEditingProduct(null);
    } else {
      const newProduct: Product = {
        id: `prod_admin_${Date.now()}`,
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        type: data.type,
        stock: data.type === 'physical' ? data.stock : undefined,
        images: [data.imageUrl || 'https://placehold.co/600x400.png?text=New+Product'],
        dataAiHint: data.dataAiHint,
        isFeatured: data.isFeatured || false,
      };
      setProducts(prevProducts => [newProduct, ...prevProducts]);
      toast({
        title: "Product Added",
        description: `Product "${newProduct.name}" has been successfully added to the site.`,
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
      setProducts(prevProducts => prevProducts.filter(p => p.id !== productToDelete.id));
      toast({
        title: "Product Deleted",
        description: `Product "${productToDelete.name}" has been removed from the site.`,
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
    if (product.isFeatured) {
        return { text: 'Active & Featured', variant: 'default'}
    }
    return { text: 'Active', variant: 'secondary' };
  }

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (authIsLoading || !currentUser || currentUser.role !== 'admin') {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-headline font-bold flex items-center">
          <Package className="mr-3 h-8 w-8 text-primary" /> Site Product Management
        </h1>
        <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-grow sm:flex-grow-0">
                 <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                 <Input 
                    type="search" 
                    placeholder="Search products..." 
                    className="pl-8 w-full sm:w-[250px]" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                 />
            </div>
            <Dialog open={isAddProductDialogOpen} onOpenChange={setIsAddProductDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <PlusCircle className="mr-2 h-5 w-5" /> Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                  <DialogTitle className="font-headline text-2xl">Add New Site Product</DialogTitle>
                  <DialogDescription>
                    Fill in the details to add a new product to the site.
                  </DialogDescription>
                </DialogHeader>
                <ProductForm 
                  onSubmitSuccess={(data) => handleProductFormSubmit(data, false)}
                  onCancel={() => setIsAddProductDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
        </div>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl">All Product Listings</CardTitle>
          <CardDescription>View and manage all products available on the platform.</CardDescription>
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
              {filteredProducts.map((product) => {
                 const status = getProductStatus(product);
                return (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="capitalize">{product.type}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    {product.type === 'auction' 
                      ? `$${(product.currentBid || product.price).toFixed(2)}` 
                      : `$${product.price.toFixed(2)}`}
                  </TableCell>
                  <TableCell>{product.type === 'physical' ? product.stock : (product.type === 'digital' ? 'N/A (Digital)' : 'N/A (Auction)')}</TableCell>
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
              )})}
            </TableBody>
          </Table>
          {filteredProducts.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              {searchTerm ? 'No products match your search.' : 'No products found.'}
            </p>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditProductDialogOpen} onOpenChange={setIsEditProductDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl">Edit Site Product</DialogTitle>
            <DialogDescription>
              Modify the details for this product across the site.
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
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product
              "{productToDelete?.name}" from the entire site.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setProductToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteProduct} className="bg-destructive hover:bg-destructive/90">
              Delete Product
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}

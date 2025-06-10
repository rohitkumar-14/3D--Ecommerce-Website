
'use client';

import Link from 'next/link';
import { ShoppingCart, User, Home, List, Tag, Settings, LayoutDashboard, Users, UserCheck, BarChartBig, PackagePlus, DollarSign, Briefcase, Package, LogIn, LogOut, UserPlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggleButton } from './ThemeToggleButton';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext'; // Import useAuth
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState, useEffect } from 'react';

export function Header() {
  const { getCartTotalItems } = useCart();
  const { currentUser, logout, isLoading } = useAuth(); // Get auth state and logout function
  const totalItems = getCartTotalItems();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const getInitials = (name?: string) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <header className="bg-card text-card-foreground shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-headline font-bold text-primary hover:text-primary/90 transition-colors">
          Storefront Vista
        </Link>
        <nav className="flex items-center space-x-1 md:space-x-2">
          <Button variant="ghost" asChild className="text-xs sm:text-sm md:text-base px-2 sm:px-3">
            <Link href="/">
              <Home className="mr-1 h-3 w-3 sm:h-4 sm:w-4 md:mr-2 md:h-5 md:w-5" />
              Home
            </Link>
          </Button>
          <Button variant="ghost" asChild className="text-xs sm:text-sm md:text-base px-2 sm:px-3">
            <Link href="/products">
              <List className="mr-1 h-3 w-3 sm:h-4 sm:w-4 md:mr-2 md:h-5 md:w-5" />
              Products
            </Link>
          </Button>

          {!isLoading && currentUser && (
            <>
              <Button variant="ghost" asChild className="text-xs sm:text-sm md:text-base px-2 sm:px-3">
                <Link href="/my-account">
                  <Avatar className="mr-1 h-5 w-5 sm:h-6 sm:w-6 md:mr-2">
                    {/* Add AvatarImage if you have URLs, otherwise Fallback is fine */}
                    <AvatarFallback className="text-xs">{getInitials(currentUser.name)}</AvatarFallback>
                  </Avatar>
                  Account
                </Link>
              </Button>
              {currentUser.role === 'seller' && (
                 <Button variant="ghost" asChild className="text-xs sm:text-sm md:text-base px-2 sm:px-3">
                    <Link href="/seller/products">
                    <Briefcase className="mr-1 h-3 w-3 sm:h-4 sm:w-4 md:mr-2 md:h-5 md:w-5" />
                    Seller
                    </Link>
                </Button>
              )}
            </>
          )}

          {!isLoading && currentUser && currentUser.role === 'admin' && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-xs sm:text-sm md:text-base px-2 sm:px-3">
                  <Settings className="mr-1 h-3 w-3 sm:h-4 sm:w-4 md:mr-2 md:h-5 md:w-5" />
                  Admin
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Admin Tools</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin/products"><Package className="mr-2 h-4 w-4" />Product Management</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/users"><Users className="mr-2 h-4 w-4" />User Management</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/seller-approvals"><UserCheck className="mr-2 h-4 w-4" />Seller Approvals</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/analytics"><BarChartBig className="mr-2 h-4 w-4" />Site Analytics</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/suggest-tags"><Tag className="mr-2 h-4 w-4" />Suggest Tags (AI)</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          <ThemeToggleButton />
          
          <Button variant="ghost" asChild className="text-xs sm:text-sm md:text-base px-2 sm:px-3 relative">
            <Link href="/cart">
              <ShoppingCart className="mr-1 h-4 w-4 md:h-5 md:w-5" />
              Cart
              {hasMounted && totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </Button>

          {!isLoading && !currentUser && (
            <>
              <Button variant="ghost" asChild className="text-xs sm:text-sm md:text-base px-2 sm:px-3">
                <Link href="/login">
                  <LogIn className="mr-1 h-3 w-3 sm:h-4 sm:w-4 md:mr-2 md:h-5 md:w-5" />
                  Login
                </Link>
              </Button>
              <Button variant="default" size="sm" asChild className="text-xs sm:text-sm md:text-base px-2 sm:px-3">
                <Link href="/register">
                  <UserPlusIcon className="mr-1 h-3 w-3 sm:h-4 sm:w-4 md:mr-2 md:h-5 md:w-5" />
                  Register
                </Link>
              </Button>
            </>
          )}
          {!isLoading && currentUser && (
            <Button variant="outline" size="sm" onClick={logout} className="text-xs sm:text-sm md:text-base px-2 sm:px-3">
              <LogOut className="mr-1 h-3 w-3 sm:h-4 sm:w-4 md:mr-2 md:h-5 md:w-5" />
              Logout
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}

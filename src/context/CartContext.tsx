
'use client';

import type { Product, CartItem, SelectedCustomizations } from '@/lib/types';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Helper function to generate a unique ID for a cart item
const generateCartItemId = (productId: string, customizations: SelectedCustomizations): string => {
  if (Object.keys(customizations).length === 0) {
    return productId; // If no customizations, ID is just product ID
  }
  const customizationString = Object.entries(customizations)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, value]) => `${key}:${value}`)
    .join('|');
  return `${productId}-${customizationString}`;
};


interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number, customizations: SelectedCustomizations) => void;
  removeFromCart: (itemId: string) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotalItems: () => number;
  getCartTotalPrice: () => number;
  isCartOpen: boolean;
  setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const localData = localStorage.getItem('cartItems');
      return localData ? JSON.parse(localData) : [];
    }
    return [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const addToCart = (product: Product, quantity: number, customizations: SelectedCustomizations) => {
    setCartItems(prevItems => {
      const itemId = generateCartItemId(product.id, customizations);
      const existingItem = prevItems.find(item => item.id === itemId);

      if (existingItem) {
        return prevItems.map(item =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + quantity, totalPrice: (item.quantity + quantity) * item.unitPrice }
            : item
        );
      } else {
        const unitPrice = product.price; // Assuming product.price is the unit price
        return [
          ...prevItems,
          {
            id: itemId,
            product,
            quantity,
            selectedCustomizations: customizations,
            unitPrice,
            totalPrice: quantity * unitPrice,
          },
        ];
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const updateItemQuantity = (itemId: string, quantity: number) => {
    setCartItems(prevItems =>
      prevItems
        .map(item =>
          item.id === itemId
            ? { ...item, quantity, totalPrice: quantity * item.unitPrice }
            : item
        )
        .filter(item => item.quantity > 0) // Remove item if quantity is 0 or less
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.totalPrice, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateItemQuantity,
        clearCart,
        getCartTotalItems,
        getCartTotalPrice,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

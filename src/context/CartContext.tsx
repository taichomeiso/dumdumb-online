'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';

interface CartContextType {
  cartItemsCount: number;
  updateCartCount: (newCount: number) => void;
  incrementCartCount: (amount?: number) => void;
  decrementCartCount: (amount?: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const { status } = useSession();

  useEffect(() => {
    const fetchCartCount = async () => {
      if (status === 'authenticated') {
        try {
          const response = await fetch('/api/cart');
          if (response.ok) {
            const cartItems = await response.json();
            const totalItems = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0);
            setCartItemsCount(totalItems);
          }
        } catch (error) {
          console.error('Error fetching cart count:', error);
        }
      }
    };

    fetchCartCount();
  }, [status]);

  const updateCartCount = (newCount: number) => {
    setCartItemsCount(newCount);
  };

  const incrementCartCount = (amount = 1) => {
    setCartItemsCount(prev => prev + amount);
  };

  const decrementCartCount = (amount = 1) => {
    setCartItemsCount(prev => Math.max(0, prev - amount));
  };

  return (
    <CartContext.Provider 
      value={{ 
        cartItemsCount, 
        updateCartCount,
        incrementCartCount,
        decrementCartCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
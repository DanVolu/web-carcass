import React, { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  updateCart: () => void;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const fetchCart = async () => {
    try {
      const { data } = await axios.get("http://localhost:7000/api/v1/cart", { withCredentials: true });
      setCart(data.cartItems); // Assuming API returns `cartItems` array
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  const addToCart = async (productId: string, quantity = 1) => {
    try {
      await axios.post(
        `http://localhost:7000/api/v1/cart/add`,
        { productId, quantity },
        { withCredentials: true }
      );
      await fetchCart(); // Update the cart after adding
    } catch (err) {
      console.error("Error adding item to cart:", err);
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      await axios.delete(`http://localhost:7000/api/v1/cart/remove/${productId}`, { withCredentials: true });
      await fetchCart(); // Update the cart after removal
    } catch (err) {
      console.error("Error removing item from cart:", err);
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete("http://localhost:7000/api/v1/cart/clear", { withCredentials: true });
      await fetchCart(); // Clear the cart
    } catch (err) {
      console.error("Error clearing cart:", err);
    }
  };

  useEffect(() => {
    fetchCart(); // Fetch the cart when the component mounts
  }, []);

  return (
    <CartContext.Provider value={{ cart, updateCart: fetchCart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

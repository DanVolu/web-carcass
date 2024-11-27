import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface CartItem {
  productId: string;
  name: string; // Product name
  image: string; // Product image
  price: number;
  quantity: number;
}

interface Cart {
  items: CartItem[];
  count: number;
  subtotal: number;
  total: number;
}

const CartPage: React.FC = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const apiUrl = "http://localhost:7000/api/v1/cart";

  // Fetch the cart
  const fetchCart = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(apiUrl, { withCredentials: true });
      setCart(data.cart);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error fetching cart.");
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart
  const handleAddToCart = async (productId: string) => {
    try {
      await axios.post(
        `${apiUrl}/cart/add`,
        { productId, quantity: 1 },
        { withCredentials: true }
      );
      fetchCart(); // Refresh cart after adding item
    } catch (err: any) {
      alert(err.response?.data?.message || "Error adding item to cart.");
    }
  };

  // Remove item from cart
  const handleRemoveFromCart = async (productId: string) => {
    try {
      await axios.delete(`${apiUrl}/remove/${productId}`, { withCredentials: true });
      fetchCart(); // Refresh cart after removing item
    } catch (err: any) {
      alert(err.response?.data?.message || "Error removing item from cart.");
    }
  };

  // Clear the cart
  const handleClearCart = async () => {
    try {
      await axios.delete(`${apiUrl}/clear`, { withCredentials: true });
      fetchCart(); // Refresh cart after clearing it
    } catch (err: any) {
      alert(err.response?.data?.message || "Error clearing cart.");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) {
    return <p>Loading cart...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
        <p>Your cart is empty. Start adding some products!</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

      <div className="space-y-4">
        {cart.items.map((item) => (
          <div
            key={item.productId}
            className="flex items-center justify-between bg-white p-4 shadow rounded-lg"
          >
            <div className="flex items-center space-x-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p>Price: ${item.price}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Total: ${(item.quantity * item.price).toFixed(2)}</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={() => handleAddToCart(item.productId)}
              >
                Add More
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={() => handleRemoveFromCart(item.productId)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded-lg shadow">
        <p className="text-lg">Total Items: {cart.count}</p>
        <p className="text-lg">Subtotal: ${cart.subtotal.toFixed(2)}</p>
        <p className="text-lg font-bold">Total: ${cart.total.toFixed(2)}</p>
        <button
          className="bg-red-500 text-white px-6 py-3 mt-4 rounded hover:bg-red-600"
          onClick={handleClearCart}
        >
          Clear Cart
        </button>
        <button
          className="bg-blue-500 text-white px-6 py-3 mt-4 rounded hover:bg-blue-600 ml-4"
          onClick={() => navigate("/cart/purchase")}
        >
          Proceed to Self Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface CartItem {
  productId: string;
  name: string;
  image: string;
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

  const apiUrl = "http://localhost:7000/api/v1/cart/cart";

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
        `${apiUrl}/add`,
        { productId, quantity: 1 },
        { withCredentials: true }
      );
      fetchCart(); // Refresh cart after adding item
    } catch (err: any) {
      alert(err.response?.data?.message || "Error adding item to cart.");
    }
  };

  // Decrease item quantity in cart
  const handleDecreaseQuantity = async (productId: string) => {
    try {
      await axios.patch(
        `${apiUrl}/decrease`,
        { productId },
        { withCredentials: true }
      );
      fetchCart(); // Refresh cart after decreasing quantity
    } catch (err: any) {
      alert(err.response?.data?.message || "Error decreasing item quantity.");
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
                src={
                  item.image
                    ? item.image.startsWith("/uploads/")
                      ? `http://localhost:7000${item.image}`
                      : item.image
                    : "https://via.placeholder.com/150"
                }
                alt={item.name || "Product Image"}
                className="w-16 h-16 object-cover rounded"
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/150";
                }}
              />
              <div>
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p>Price: ${item.price}</p>
                <p>Total: ${(item.quantity * item.price).toFixed(2)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                className="bg-gray-300 text-gray-700 px-2 py-1 rounded hover:bg-gray-400"
                disabled={item.quantity <= 1}
                onClick={() => handleDecreaseQuantity(item.productId)}
              >
                -
              </button>
              <span className="text-lg font-semibold">{item.quantity}</span>
              <button
                className="bg-gray-300 text-gray-700 px-2 py-1 rounded hover:bg-gray-400"
                onClick={() => handleAddToCart(item.productId)}
              >
                +
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
          onClick={async () => {
            await axios.delete(`${apiUrl}/clear`, { withCredentials: true });
            fetchCart();
          }}
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

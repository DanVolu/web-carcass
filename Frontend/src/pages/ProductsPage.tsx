import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";

interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  size: string;
  image: string;
  liked: number; // Total number of likes
  usersLiked: string[]; // List of users who liked the product
}

interface ValidationError {
  msg: string;
  param: string;
}

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    size: "",
    image: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const { user } = useContext(AuthContext); // Get user from AuthContext

  const apiUrl = "http://localhost:7000/api/v1/products/products";

  // Fetch products and user role
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(apiUrl, { withCredentials: true });
  
        // Filter unique products by _id
        const uniqueProducts = data.filter(
          (product: Product, index: number, self: Product[]) =>
            index === self.findIndex((p) => p._id === product._id)
        );
  
        setProducts(uniqueProducts);
  
        const userResponse = await axios.get("http://localhost:7000/api/v1/auth/status", {
          withCredentials: true,
        });
        setIsAdmin(userResponse.data.data.roles.includes("admin"));
      } catch (err) {
        console.error("Error fetching products or user data:", err);
      }
    };
  
    fetchProducts();
  }, []);
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddOrEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
  
    // Ensure `form.price` is a valid number
    const payload = { ...form, price: parseFloat(form.price) };
    console.log("Payload being sent:", payload);
  
    try {
      if (editingId) {
        await axios.put(`${apiUrl}/${editingId}`, payload, { withCredentials: true });
      } else {
        await axios.post(apiUrl, payload, { withCredentials: true });
      }
  
      // Fetch the updated product list
      const { data } = await axios.get(apiUrl, { withCredentials: true });
      setProducts(data);
  
      // Reset the form
      setForm({ name: "", description: "", category: "", price: "", size: "", image: "" });
    } catch (err: any) {
      console.error("Error saving product:", err);
  
      // Log server error details if available
      if (err.response) {
        console.log("Server response data:", err.response.data);
      }
  
      // Handle validation errors
      if (err.response && err.response.status === 400) {
        setErrors(err.response.data.errors || ["Unknown error occurred."]);
      }
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await axios.delete(`${apiUrl}/${id}`, { withCredentials: true });
      setProducts(products.filter((product) => product._id !== id));
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  const handleLikeToggle = async (productId: string, isLiked: boolean) => {
    try {
      const endpoint = isLiked ? "unlike" : "like";
      const { data } = await axios.post(
        `${apiUrl}/${productId}/${endpoint}`,
        {},
        { withCredentials: true }
      );

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === productId
            ? {
                ...product,
                liked: data.liked,
                usersLiked: isLiked
                  ? product.usersLiked.filter((email) => email !== user)
                  : user
                  ? [...product.usersLiked, user] // Ensure user is not null
                  : product.usersLiked,
              }
            : product
        )
      );
    } catch (err: any) {
      console.error(`Error ${isLiked ? "unliking" : "liking"} product:`, err.response?.data?.message || err.message);
    }
  };

  const handleAddToCart = async (productId: string) => {
    try {
      await axios.post(
        "http://localhost:7000/api/v1/cart/cart/add",
        { productId, quantity: 1 },
        { withCredentials: true }
      );
  
      alert("Product added to cart successfully!");
    } catch (err: any) {
      console.error("Error adding product to cart:", err.response?.data?.message || err.message);
      alert("Failed to add product to cart. Please try again.");
    }
  };
  
  const startEditing = (product: Product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price.toString(),
      size: product.size,
      image: product.image,
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setForm({ name: "", description: "", category: "", price: "", size: "", image: "" });
    setErrors([]);
  };



  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Our Products</h1>

      {isAdmin && (
        <form className="bg-white shadow-lg rounded-lg p-6 mb-8 max-w-2xl mx-auto" onSubmit={handleAddOrEditProduct}>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">{editingId ? "Edit Product" : "Add Product"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="name"
              value={form.name}
              onChange={handleInputChange}
              placeholder="Name"
              required
            />
            <input
              className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="category"
              value={form.category}
              onChange={handleInputChange}
              placeholder="Category"
              required
            />
            <input
              className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="price"
              type="number"
              value={form.price}
              onChange={handleInputChange}
              placeholder="Price"
              required
            />
            <input
              className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="size"
              value={form.size}
              onChange={handleInputChange}
              placeholder="Size"
              required
            />
            <input
              className="p-3 border border-gray-300 rounded-lg shadow-sm col-span-1 md:col-span-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="image"
              value={form.image}
              onChange={handleInputChange}
              placeholder="Image URL"
            />
          </div>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm mt-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            name="description"
            value={form.description}
            onChange={handleInputChange}
            placeholder="Description"
            required
          ></textarea>
          <div className="mt-4">
            {errors.map((error) => (
              <p key={error.param} className="text-red-500 text-sm">
                {error.msg}
              </p>
            ))}
          </div>
          <div className="mt-6 flex justify-between items-center">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {editingId ? "Save Changes" : "Add Product"}
            </button>
            {editingId && (
              <button
                type="button"
                className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
                onClick={cancelEditing}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow flex flex-col justify-between"
          >
            <img
              className="w-full h-48 object-cover rounded-md"
              src={product.image}
              alt={product.name}
            />
            <div className="mt-4 flex-grow">
              <h2 className="text-xl font-semibold text-gray-800">{product.name}</h2>
              <p className="text-gray-600 mt-2">{product.description}</p>
              <p className="text-lg font-semibold text-green-600 mt-2">${product.price}</p>
              <p className="text-sm text-gray-500 mt-1">Size: {product.size}</p>
              <p className="text-sm text-gray-500">Category: {product.category}</p>
              <div className="flex items-center justify-between mt-4">
                <p className="text-gray-700">Likes: {product.liked}</p>
                {user ? (
                  <button
                    className={`px-4 py-2 rounded-lg text-white ${product.usersLiked.includes(user)
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-blue-500 hover:bg-blue-600"}`}
                    onClick={() => handleLikeToggle(product._id, product.usersLiked.includes(user))}
                  >
                    {product.usersLiked.includes(user) ? "Unlike" : "Like"}
                  </button>
                ) : (
                  <p className="text-red-500">Log in to like products</p>
                )}
              </div>
            </div>
          
            {/* Flex container for Edit, Delete, and Add to Cart buttons */}
            <div className="mt-4 flex justify-between items-center">
              <div className="flex space-x-4">
                {isAdmin && (
                  <>
                    <button
                      className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
                      onClick={() => startEditing(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                      onClick={() => handleDeleteProduct(product._id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
          
              {user ? (
                <button
                  className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
                  onClick={() => handleAddToCart(product._id)}
                >
                  Add to Cart
                </button>
              ) : (
                <p className="text-red-500">Log in to add products to cart</p>
              )}
            </div>
          </div>                
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;

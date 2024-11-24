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
        setProducts(data);

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
    const payload = { ...form, price: parseFloat(form.price) };

    try {
      if (editingId) {
        await axios.put(`${apiUrl}/${editingId}`, payload, { withCredentials: true });
      } else {
        await axios.post(apiUrl, payload, { withCredentials: true });
      }

      const { data } = await axios.get(apiUrl, { withCredentials: true });
      setProducts(data);
      setForm({ name: "", description: "", category: "", price: "", size: "", image: "" });
    } catch (err: any) {
      console.error("Error saving product:", err);

      if (err.response && err.response.status === 400) {
        setErrors(err.response.data.errors);
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

      // Update the local state of the specific product
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === productId
            ? {
                ...product,
                liked: data.liked,
                usersLiked: isLiked
                  ? product.usersLiked.filter((email) => email !== user)
                  : user
                  ? [...product.usersLiked, user] // Ensure `user` is not null
                  : product.usersLiked,
              }
            : product
        )
      );
    } catch (err: any) {
      console.error(`Error ${isLiked ? "unliking" : "liking"} product:`, err.response?.data?.message || err.message);
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
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-4">Products</h1>

      {isAdmin && (
        <form className="bg-white shadow-md rounded p-4 mb-6" onSubmit={handleAddOrEditProduct}>
          <h2 className="text-xl font-bold mb-4">{editingId ? "Edit Product" : "Add Product"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="p-2 border rounded"
              name="name"
              value={form.name}
              onChange={handleInputChange}
              placeholder="Name"
              required
            />
            <input
              className="p-2 border rounded"
              name="category"
              value={form.category}
              onChange={handleInputChange}
              placeholder="Category"
              required
            />
            <input
              className="p-2 border rounded"
              name="price"
              type="number"
              value={form.price}
              onChange={handleInputChange}
              placeholder="Price"
              required
            />
            <input
              className="p-2 border rounded"
              name="size"
              value={form.size}
              onChange={handleInputChange}
              placeholder="Size"
              required
            />
            <input
              className="p-2 border rounded col-span-1 md:col-span-2"
              name="image"
              value={form.image}
              onChange={handleInputChange}
              placeholder="Image URL"
            />
          </div>
          <textarea
            className="w-full p-2 border rounded mt-4"
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
          <div className="mt-4 flex justify-between">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              {editingId ? "Save Changes" : "Add Product"}
            </button>
            {editingId && (
              <button
                type="button"
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                onClick={cancelEditing}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          const isLiked = !!(user && product.usersLiked?.includes(user)); // Ensures `isLiked` is strictly boolean
          return (
            <div key={product._id} className="bg-white shadow-md rounded p-4">
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover mb-4" />
              <h2 className="text-xl font-bold">{product.name}</h2>
              <p className="text-gray-600">{product.category}</p>
              <p className="text-gray-800 font-semibold">${product.price}</p>
              <p className="text-sm text-gray-500">{product.description}</p>
              <div className="flex items-center justify-between mt-4">
                <p className="text-gray-700">Likes: {product.liked}</p>
                {user ? (
                  <button
                    className={`px-4 py-2 rounded ${
                      isLiked ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
                    } text-white`}
                    onClick={() => handleLikeToggle(product._id, isLiked)}
                  >
                    {isLiked ? "Unlike" : "Like"}
                  </button>
                ) : (
                  <p className="text-red-500">Log in to like products</p>
                )}
              </div>
              {isAdmin && (
                <div className="mt-4 flex justify-between">
                  <button
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                    onClick={() => startEditing(product)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    onClick={() => handleDeleteProduct(product._id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductsPage;

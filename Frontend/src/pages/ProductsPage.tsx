import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

// Define the product interface
interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  size: string;
  image?: string;
  liked?: number;
}

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    size: '',
    image: '',
  });

  // Fetch the products from the API and check user role (admin or not)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:7000/api/v1/products/products', { withCredentials: true });
        setProducts(res.data.products);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchProducts();

    // Get the token from cookies
    const token = Cookies.get('token');
    console.log('Token:', token);  // Debugging the token

    if (token) {
      // Decode the JWT token to extract the role (assuming role is in the payload)
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode the JWT
      console.log('Decoded Token:', decodedToken); // For debugging

      // Check if the role is 'admin'
      if (decodedToken.roles && decodedToken.roles.includes('admin')) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } else {
      console.log('No token found in cookies');
    }
  }, []);

  // Handle creating a new product
  const handleCreateProduct = async () => {
    try {
      const res = await axios.post('http://localhost:7000/api/v1/products/products', newProduct, {
        headers: { Authorization: `Bearer ${Cookies.get('token')}` },
        withCredentials: true,
      });
      setProducts([...products, res.data.product]);
      setNewProduct({
        name: '',
        description: '',
        category: '',
        price: '',
        size: '',
        image: '',
      });
    } catch (error) {
      console.error('Failed to create product:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Products</h1>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg shadow-md p-4 bg-white flex flex-col items-center"
          >
            <img
              src={product.image || '/placeholder.png'}
              alt={product.name}
              className="w-full h-40 object-cover rounded-lg mb-4"
            />
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-gray-500 text-sm">{product.description}</p>
            <p className="text-sm mt-2">Category: {product.category}</p>
            <p className="text-sm">Price: ${product.price}</p>
            <p className="text-sm">Size: {product.size}</p>
          </div>
        ))}

        {/* Render the "Add Product" form only if the user is an admin */}
        {isAdmin && (
          <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 border-2 border-dashed rounded-lg shadow-md p-4 flex flex-col bg-gray-50 items-center space-y-4">
            <h3 className="text-lg font-semibold mb-4">Add Product</h3>
            <input
              type="text"
              placeholder="Product Name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              className="w-full p-2 border rounded-md"
            />
            <textarea
              placeholder="Description"
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              className="w-full p-2 border rounded-md"
            />
            <input
              type="text"
              placeholder="Category"
              value={newProduct.category}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              className="w-full p-2 border rounded-md"
            />
            <input
              type="number"
              placeholder="Price"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              className="w-full p-2 border rounded-md"
            />
            <input
              type="text"
              placeholder="Size"
              value={newProduct.size}
              onChange={(e) => setNewProduct({ ...newProduct, size: e.target.value })}
              className="w-full p-2 border rounded-md"
            />
            <input
              type="text"
              placeholder="Image URL"
              value={newProduct.image}
              onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
              className="w-full p-2 border rounded-md"
            />
            <button
              onClick={handleCreateProduct}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Create
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;

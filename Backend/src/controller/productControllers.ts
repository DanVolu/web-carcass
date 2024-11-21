import { Request, Response, NextFunction } from "express";
import Product, { ProductInterface } from "../models/productModel";

const productController = {
  // View all products

  getAllProducts: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const products = await Product.find(); // Fetch all products from the database
      res.status(200).json({ products });
    } catch (error) {
      console.error("Error fetching products:", error);
      next(error);
    }
  },
    
  // Create a new product
  createProduct: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, name, description, category, price, size, image, liked, options }: ProductInterface = req.body;

      // Check if a product with the same ID already exists
      const existingProduct = await Product.findOne({ id });
      if (existingProduct) {
        return res.status(400).json({ message: "Product with this ID already exists." });
      }

      // Create the new product
      const newProduct = new Product({
        id,
        name,
        description,
        category,
        price,
        size,
        image,
        liked: liked || 0, // Default value for likes
        options: options || [], // Default empty array for options
      });

      // Save to the database
      const savedProduct = await newProduct.save();

      res.status(201).json({
        message: "Product created successfully",
        product: savedProduct,
      });
    } catch (error) {
      console.error("Error creating product:", error);
      next(error);
    }
  },

  // Update an existing product
  patchProduct: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params; // Get the product ID from the request parameters
      const updates = req.body; // Get the fields to update from the request body

      // Find and update the product
      const updatedProduct = await Product.findOneAndUpdate(
        { id }, // Filter by product ID
        updates, // Update fields
        { new: true, runValidators: true } // Return the updated product and run validators
      );

      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.status(200).json({
        message: "Product updated successfully",
        product: updatedProduct,
      });
    } catch (error) {
      console.error("Error updating product:", error);
      next(error);
    }
  },

  // Delete a product
  deleteProduct: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params; // Get the product ID from the request parameters

      // Find and delete the product
      const deletedProduct = await Product.findOneAndDelete({ id });

      if (!deletedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.status(200).json({
        message: "Product deleted successfully",
        product: deletedProduct,
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      next(error);
    }
  },
};

export default productController;

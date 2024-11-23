import { Request, Response, NextFunction } from "express";
import Product from "../models/productModel";

const productController = {
  getAllProducts: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const products = await Product.find({});
      res.status(200).json(products);
    } catch (err) {
      next(err);
    }
  },

  addProduct: async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("Incoming request body:", req.body); // Log the request payload
  
      const { name, description, category, price, size, image } = req.body;
      const product = new Product({ name, description, category, price, size, image });
  
      const savedProduct = await product.save();
      res.status(201).json(savedProduct);
    } catch (err: any) {
      console.error("Error saving product:", err); // Log the error
      if (err.code === 11000) {
        // Duplicate key error
        return res.status(400).json({ message: "Duplicate value error", field: err.keyValue });
      }
      if (err.name === "ValidationError") {
        // Validation error
        return res.status(400).json({ message: "Validation error", errors: err.errors });
      }
      next(err); // Forward other errors to the global error handler
    }
  },
  

  editProduct: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true });
      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found." });
      }

      res.status(200).json(updatedProduct);
    } catch (err) {
      next(err);
    }
  },

  deleteProduct: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const deletedProduct = await Product.findByIdAndDelete(id);
      if (!deletedProduct) {
        return res.status(404).json({ message: "Product not found." });
      }

      res.status(200).json({ message: "Product deleted successfully." });
    } catch (err) {
      next(err);
    }
  },
};

export default productController;

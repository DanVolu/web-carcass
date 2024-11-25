import { Request, Response, NextFunction } from "express";
import Product from "../models/productModel";
import User from "../models/userModel";

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
      const { name, description, category, price, size, image } = req.body;
      const product = new Product({ name, description, category, price, size, image });

      const savedProduct = await product.save();
      res.status(201).json(savedProduct);
    } catch (err: any) {
      if (err.code === 11000) {
        return res.status(400).json({ message: "Duplicate value error", field: err.keyValue });
      }
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: "Validation error", errors: err.errors });
      }
      next(err);
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

  likeProduct: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ message: "Only logged-in users can like products." });
      }

      const { id } = req.params;
      const product = await Product.findById(id);

      if (!product) {
        return res.status(404).json({ message: "Product not found." });
      }

      if (product.usersLiked.includes(user.email)) {
        return res.status(400).json({ message: "You have already liked this product." });
      }

      product.usersLiked.push(user.email);
      product.liked += 1;

      await product.save();

      res.status(200).json({ liked: product.liked });
    } catch (err) {
      next(err);
    }
  },

  unlikeProduct: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ message: "Only logged-in users can unlike products." });
      }

      const { id } = req.params;
      const product = await Product.findById(id);

      if (!product) {
        return res.status(404).json({ message: "Product not found." });
      }

      if (!product.usersLiked.includes(user.email)) {
        return res.status(400).json({ message: "You haven't liked this product." });
      }

      product.usersLiked = product.usersLiked.filter(email => email !== user.email);
      product.liked -= 1;

      await product.save();

      res.status(200).json({ liked: product.liked });
    } catch (err) {
      next(err);
    }
  },
};

export default productController;

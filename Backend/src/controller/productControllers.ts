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
      const { name, description, category, price, size } = req.body;
  
      // Save the image URL relative to /uploads
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
      if (!imageUrl) {
        return res.status(400).json({ message: "Image is required" });
      }
  
      const product = new Product({
        name,
        description,
        category,
        price,
        size,
        image: imageUrl, // Save only the relative path
      });
  
      const savedProduct = await product.save();
      res.status(201).json(savedProduct);
    } catch (err) {
      next(err);
    }
  },
  

  editProduct: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { name, description, category, price, size } = req.body;

      // Handle new image file upload
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

      const updates: any = {
        name,
        description,
        category,
        price,
        size,
      };

      if (imageUrl) {
        updates.image = imageUrl; // Update image only if a new file is uploaded
      }

      const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true });
      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
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
        return res.status(404).json({ message: "Product not found" });
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

      product.usersLiked = product.usersLiked.filter((email) => email !== user.email);
      product.liked -= 1;

      await product.save();
      res.status(200).json({ liked: product.liked });
    } catch (err) {
      next(err);
    }
  },
};

export default productController;

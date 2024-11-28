import { Request, Response, NextFunction } from "express";
import Product from "../models/productModel";
import User from "../models/userModel";

const cartController = {
  // Add item to cart
  addToCart: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { productId, quantity } = req.body;

      if (!productId || !quantity) {
        return res.status(400).json({ message: "Product ID and quantity are required." });
      }

      const user = await User.findById(req.user.id); // Ensure `req.user` is populated via middleware
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found." });
      }

      const cartItem = user.cart.items.find(item => item.productId === productId);

      if (cartItem) {
        cartItem.quantity += quantity;
      } else {
        user.cart.items.push({
          productId,
          name: product.name, // Include the product name here
          price: product.price,
          quantity,
        } as any);
      }

      user.cart.count = user.cart.items.reduce((sum, item) => sum + item.quantity, 0);
      user.cart.subtotal = user.cart.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
      user.cart.total = user.cart.subtotal; // Add discount logic here if needed

      await user.save();

      res.status(200).json({ message: "Item added to cart", cart: user.cart });
    } catch (err) {
      next(err);
    }
  },

  // Remove item from cart
  removeFromCart: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { productId } = req.params;

      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      const itemIndex = user.cart.items.findIndex(item => item.productId === productId);
      if (itemIndex === -1) {
        return res.status(404).json({ message: "Item not found in cart." });
      }

      user.cart.items.splice(itemIndex, 1);

      user.cart.count = user.cart.items.reduce((sum, item) => sum + item.quantity, 0);
      user.cart.subtotal = user.cart.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
      user.cart.total = user.cart.subtotal; // Adjust total as needed

      await user.save();

      res.status(200).json({ message: "Item removed from cart", cart: user.cart });
    } catch (err) {
      next(err);
    }
  },

  // Clear all items in the cart
  clearCart: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      user.cart.items = [];
      user.cart.count = 0;
      user.cart.subtotal = 0;
      user.cart.total = 0;

      await user.save();

      res.status(200).json({ message: "Cart cleared", cart: user.cart });
    } catch (err) {
      next(err);
    }
  },

  // Get cart details
  getCart: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      const cart = {
        ...user.cart,
        subtotal: parseFloat(user.cart.subtotal?.toString() || "0"),
        total: parseFloat(user.cart.total?.toString() || "0"),
      };

      res.status(200).json({ cart });
    } catch (err) {
      next(err);
    }
  },
};

export default cartController;

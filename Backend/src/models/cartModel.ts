import mongoose, { Schema, Document } from "mongoose";

// Define the interface for a cart item
export interface CartInterface extends Document {
  productId: string; // Add productId field
  quantity: number;
  price: number; // Add price field if needed for cart calculations
}

// Define the cart item schema
export const cartItemSchema: Schema<CartInterface> = new Schema({
  productId: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  price: {
    type: Number,
    required: true,
  },
});


// Updated CartItemInterface
export interface CartItemInterface {
  productId: mongoose.Schema.Types.ObjectId; // Use ObjectId for referencing Product
  quantity: number;
  total: mongoose.Types.Decimal128;
}

// Updated CartInterface
export interface CartInterface extends mongoose.Document {
  items: CartItemInterface[];
  code?: string; // Optional as it may not always be present
  count?: number; // Optional as it may depend on cart state
  total?: mongoose.Types.Decimal128; // Optional for uninitialized cart
  subtotal?: mongoose.Types.Decimal128; // Optional for uninitialized cart
  discount?: mongoose.Types.Decimal128; // Optional for uninitialized cart
  percentage?: number; // Optional for uninitialized cart
}

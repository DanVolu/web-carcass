import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    liked: {
      type: Number,
      default: 0,
    },
  },

);

export default mongoose.model<ProductInterface>("Product", productSchema);

export interface ProductInterface extends mongoose.Document {
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
  size: string;
  liked: number;
}

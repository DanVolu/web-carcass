import mongoose, { Document, Schema } from "mongoose";
import { cartItemSchema, CartInterface } from "./cartModel";

// Define an interface for the User document
export interface UserInterface extends Document {
  username: string;
  email: string;
  password: string;
  roles: string[];  // Add roles property
}

// Define the user schema
const userSchema: Schema<UserInterface> = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    roles: {
      type: [String],
      default: ["user"], // Every user starts with the "user" role
    },
    cart: {
      items: {
        type: [cartItemSchema], // Reference the updated schema here
      },
      code: {
        type: String,
      },
      count: {
        type: Number,
      },
      total: {
        type: mongoose.Schema.Types.Decimal128,
      },
      subtotal: {
        type: mongoose.Schema.Types.Decimal128,
      },
      discount: {
        type: mongoose.Schema.Types.Decimal128,
      },
      percentage: {
        type: Number,
      },
    },
  },
  {
    timestamps: true, 
  }
);


const User = mongoose.model<UserInterface>("User", userSchema);

export default User;

export interface UserInterface extends Document {
  username: string;
  email: string;
  password: string;
  roles: string[];
  cart: { // Add cart property
    items: CartInterface[];
    code: string;
    count: number;
    total: any; // Assuming total is of type Decimal128
    subtotal: any; // Assuming subtotal is of type Decimal128
    discount: any; // Assuming discount is of type Decimal128
    percentage: number;
  }
}

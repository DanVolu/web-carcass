import mongoose, { Document, Schema } from "mongoose";

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
  },
  {
    timestamps: true, 
  }
);

const User = mongoose.model<UserInterface>("User", userSchema);

export default User;

import mongoose from "mongoose";
import dotenv from "dotenv"; // Import dotenv to manage environment variables

// Load environment variables from .env file
dotenv.config();

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/template'; // Use environment variable or default URI

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1); // Exit process with failure
  }
};

// Export the connectDB function for use in other files
export default connectDB;

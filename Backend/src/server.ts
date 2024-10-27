import express from "express";
import cors from "cors"; // Import CORS
import routes from "./routes/index"; // Import your routes
import connectDB from "./DB/MongoDB"; // Import the MongoDB connection module

const app = express();

// Connect to MongoDB
connectDB();

// Define the port
const port = process.env.PORT || 7001; // Make sure to use the correct environment variable for the port

// Enable CORS for your application
app.use(cors({
    origin: "http://localhost:5173", // Replace with your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed methods
    credentials: true, // Enable credentials if needed
}));

app.use(express.json()); // Middleware to parse JSON bodies
app.use("/api/v1/", routes); // Use your routes

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

export default app;

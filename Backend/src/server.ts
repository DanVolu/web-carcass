import express from "express";
import cors from "cors"; // Import CORS
import cookieParser from "cookie-parser"; // Import cookie-parser
import routes from "./routes/index"; // Import your routes
import connectDB from "./DB/MongoDB"; // MongoDB connection

const app = express();

// Connect to MongoDB
connectDB();

// Define the port
const port = process.env.PORT || 7001;

// Enable CORS for your application
app.use(cors({
    origin: "http://localhost:5173", // Your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Allow credentials (cookies) in cross-origin requests
}));

// Enable cookie parsing
app.use(cookieParser()); // This should be before any routes that need `req.cookies`

// Middleware to parse JSON bodies
app.use(express.json()); // Parse JSON body in requests

// Define routes
app.use("/api/v1/", routes); // Use your routes for "/api/v1/"

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

export default app;

import express from "express";
import cors from "cors"; // Import CORS
import cookieParser from "cookie-parser"; // Import cookie-parser
import routes from "./routes/index"; // Import your routes
import connectDB from "./DB/MongoDB"; // MongoDB connection
import path from "path"; // Import path for static file serving
import fs from "fs";


const app = express();

// Connect to MongoDB
connectDB();

// Define the port
const port = process.env.PORT || 7000;

// Enable CORS for your application
app.use(cors({
    origin: "http://localhost:5173", // Your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true, // Allow credentials (cookies) in cross-origin requests
}));

// Enable cookie parsing
app.use(cookieParser()); // This should be before any routes that need `req.cookies`

// Middleware to parse JSON bodies
app.use(express.json()); // Parse JSON body in requests

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir); // Create the uploads directory if it doesn't exist
}


// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Define routes
app.use("/api/v1/", routes); // Use your routes for "/api/v1/"

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

export default app;

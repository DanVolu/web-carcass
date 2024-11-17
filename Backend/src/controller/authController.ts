import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import User, { UserInterface } from "../models/userModel";
import jwt from "jsonwebtoken";

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  repeat_password: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

const authControllers = {
  register: async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, password, repeat_password }: RegisterRequest = req.body;

    try {
      const existingUser: UserInterface | null = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          message: "User with this email already exists.",
        });
      }

      if (password !== repeat_password) {
        return res.status(400).json({
          message: "Passwords do not match.",
        });
      }

      const hashedPassword: string = await bcrypt.hash(password, 10);

      const newUser: UserInterface = new User({
        username,
        email,
        password: hashedPassword,
      });

      await newUser.save();

      res.status(201).json({
        message: "Registration successful.",
      });
      
    } catch (err: unknown) {
      next(err);
    }
  },

  login: async (req: Request, res: Response, next: NextFunction) => {
    const { email, password }: LoginRequest = req.body;

    try {
      const user: UserInterface | null = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({
          message: "Invalid credentials: Provided email is not registered",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          message: "Invalid credentials: Incorrect password",
        });
      }

      // Generate a JWT token (you need a secret key in .env, e.g., JWT_SECRET)
      const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: "1h", // Token expires in 1 hour
      });

      res.status(200).json({
        message: "Login successful",
        token, // Send the token to the frontend
        user: { email: user.email, username: user.username },
      });
    } catch (err) {
      next(err);
    }
  },

  logout: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).json({
        message: "Logout successful",
      });
    } catch (err) {
      next(err);
    }
  },

  status: async (req: Request, res: Response, next: NextFunction) => {
    // Status function is not needed without authentication
    res.status(200).json({
      message: "No authentication implemented.",
    });
  },

  // New 'me' endpoint to get the currently authenticated user's details
  me: async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from the 'Authorization' header

    if (!token) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    try {
      // Verify token and extract the user ID
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

      // Find the user using the extracted user ID
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      // Send the user's email and nickname (you can add other fields as needed)
      res.status(200).json({
        email: user.email,
        nickname: user.username, // Assuming 'username' is used as 'nickname' here
      });

    } catch (err) {
      console.error("Error fetching user data:", err);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  },
};

export default authControllers;

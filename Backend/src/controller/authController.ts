import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel";
import { generateToken, TokenInterface } from "../utils/token";

interface RegisterInterface {
  username: string;
  email: string;
  password: string;
  repeat_password: string;
}

interface LoginInterface {
  email: string;
  password: string;
}

const authControllers = {
  //^ POST /api/v1/auth/register - Register a new user
  register: async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, password, repeat_password }: RegisterInterface = req.body;

    try {
      // Ensure passwords match
      if (password !== repeat_password) {
        return res.status(400).json({
          message: "Passwords do not match.",
        });
      }

      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          message: "User with this email already exists.",
        });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create and save the new user
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
      });

      await newUser.save();

      res.status(201).json({
        message: "Registration successful.",
      });
    } catch (err) {
      next(err);
    }
  },

  //^ POST /api/v1/auth/login - Authenticate user and issue JWT
  login: async (req: Request, res: Response, next: NextFunction) => {
    const { email, password }: LoginInterface = req.body;
  
    try {
      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({
          message: "Invalid credentials: Provided email is not registered",
        });
      }
  
      // Verify the password
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return res.status(401).json({
          message: "Invalid credentials: Incorrect password",
        });
      }
  
      // Generate JWT token
      const token = generateToken(user.email, user.username, user.roles); // Use user.email instead of hardcoded value
  
      // Set JWT as a cookie
      const isProduction = process.env.NODE_ENV === "production";
      res.cookie("jwt", token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "strict",
      });
  
      // Return token in the response body
      res.status(200).json({
        message: "Login successful",
        token, // Include the token in the response
      });
    } catch (err) {
      next(err);
    }
  },
  
  //^ POST /api/v1/auth/logout - Clear the JWT cookie
  logout: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      res.clearCookie("jwt"); // Remove the JWT cookie
      res.status(200).json({
        message: "Logout successful",
      });
    } catch (err) {
      next(err);
    }
  },

  //^ GET /api/v1/auth/status - Check if user is logged in
  status: async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt; // Read the cookie

    try {
      if (!token) {
        return res.status(401).json({
          message: "Unauthorized",
          authorized: false,
        });
      }

      // Decode the token (without verifying the signature)
      const decoded = jwt.decode(token) as TokenInterface;

      // Ensure the decoded token contains the necessary information
      if (!decoded || !decoded.email) {
        return res.status(401).json({
          message: "Invalid token",
          authorized: false,
        });
      }

      // Retrieve user information from the database based on decoded token
      const user = await User.findOne({ email: decoded.email });
      if (!user) {
        return res.status(404).json({
          message: "User not found",
          authorized: false,
        });
      }

      res.status(200).json({
        message: "Successfully authenticated",
        authorized: true,
        data: user, // Include user data like email and username
      });
    } catch (err) {
      next(err);
    }
  },
};

export default authControllers;




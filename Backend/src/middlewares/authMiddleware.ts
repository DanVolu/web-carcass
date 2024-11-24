import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { UserInterface } from "../models/userModel";

declare global {
  namespace Express {
    interface Request {
      user?: UserInterface; // Add user type to Express Request
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt;

  if (!token) {
    console.log("No token provided.");
    return res.status(401).json({ message: "Unauthorized. No token provided." });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    console.log("Decoded token:", decoded);

    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      console.log("User not found:", decoded.email);
      return res.status(401).json({ message: "Unauthorized. User not found." });
    }

    console.log("Authenticated user:", user.email);
    req.user = user; // Attach user to req.user
    next();
  } catch (err) {
    console.error("Authentication error:", err);
    res.status(401).json({ message: "Invalid token." });
  }
};

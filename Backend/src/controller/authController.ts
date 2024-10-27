import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import User, { UserInterface } from "../models/userModel";

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

      // No JWT token is generated or returned here
      res.status(200).json({
        message: "Login successful",
        user: { email: user.email, username: user.username } // Send user info if needed
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
};

export default authControllers;

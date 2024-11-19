import { NextFunction, Request, Response } from "express";
import User, { UserInterface } from "../models/userModel";

const userControllers = {
  // Get all users
  getUsers: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const users: UserInterface[] = await User.find();
      res.status(200).json({
        status: "success",
        message: "All Users successfully retrieved",
        data: users,
      });
    } catch (err: unknown) {
      next(err);
    }
  },

  // Get a single user by email (or identifier)
  getUser: async (req: Request, res: Response, next: NextFunction) => {
    const param: string = req.params.identifier;
    let user: UserInterface;

    try {
      user = await User.findOne({ email: param });
      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "User not found",
        });
      }

      res.status(200).json({
        status: "success",
        message: "User retrieved successfully",
        data: user,
      });
    } catch (err: unknown) {
      next(err);
    }
  },

  // Add admin role to a user
  addAdmin: async (req: Request, res: Response, next: NextFunction) => {
    const email = req.params.identifier;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!user.roles.includes("user")) {
        return res.status(400).json({ message: "User is not verified" });
      }

      if (user.roles.includes("admin")) {
        return res.status(400).json({ message: "User is already an admin" });
      }

      user.roles.push("admin");
      await user.save();

      res.status(200).json({ message: "User added to administrator role successfully" });
    } catch (err) {
      next(err);
    }
  },

  // Remove admin role from a user
  removeAdmin: async (req: Request, res: Response, next: NextFunction) => {
    const email = req.params.identifier;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!user.roles.includes("admin")) {
        return res.status(400).json({ message: "User is not an admin" });
      }

      user.roles = user.roles.filter((role: string) => role !== "admin");
      await user.save();

      res.status(200).json({ message: "User removed from administrator role successfully" });
    } catch (err) {
      next(err);
    }
  },

  // Get all users with "admin" role
  getAdmins: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await User.find({ roles: { $in: ["admin"] } });

      if (!users.length) {
        return res.status(400).json({ message: "No admins found" });
      }

      res.status(200).json({
        status: "success",
        message: "All Admins successfully retrieved",
        data: users,
      });
    } catch (err) {
      next(err);
    }
  },
};

export default userControllers;

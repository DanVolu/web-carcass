import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function generateToken(email: string, username: string, roles: string[], remember?: boolean) {
  return jwt.sign({ email, username, roles }, process.env.JWT_SECRET, {
    expiresIn: remember ? "30d" : "1h",
  });
}






export interface TokenInterface {
  email: string;
  username: string;
  roles?: string[];
}
import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

const authValidator = {
  register: [
    body("email") // Validates email
      .isEmail()
      .withMessage("Invalid email format.")
      .notEmpty()
      .withMessage("Email must not be empty."),
    
    body("password") // Validates password
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password must meet the following requirements.")
      .notEmpty()
      .withMessage("Password must not be empty."),
    
    body("username") // Validates first name
      .notEmpty()
      .withMessage("Username must not be empty.")
      .matches(/^[A-Za-z]+$/)
      .withMessage("Username cannot contain any symbols."),
    
    body("repeat_password") // Validates repeat password
      .notEmpty()
      .withMessage("Repeat password must not be empty")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords must match");
        }
        return true;
      }),

    // Handle validation errors
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ],

  login: [
    body("email") // Validates email
      .isEmail()
      .withMessage("Invalid email format")
      .notEmpty()
      .withMessage("Email must not be empty"),
    
    body("password") // Validates password
      .notEmpty()
      .withMessage("Password must not be empty.")
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password must meet the following requirements."),
    
    // Handle validation errors
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ],
};

export default authValidator ;

import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

const productValidator = {
  addOrEditProduct: [
    body("name")
      .notEmpty()
      .withMessage("Product name is required.")
      .isLength({ min: 3 , max: 25 })
      .withMessage("Product name must be at least 3 characters long."),
    body("description")
      .notEmpty()
      .withMessage("Product description is required.")
      .isLength({ min: 10 , max: 150 })
      .withMessage("Description must be at least 10 characters long."),
    body("category")
      .notEmpty()
      .withMessage("Category is required.")
      .isLength({ min: 5 , max: 25 })
      .withMessage("Category must be at least 10 characters long."),
    body("price")
      .isFloat({ gt: 0, lt: 500.01 })
      .withMessage("Price must be a number greater than 0 and no more than 500.")
      .matches(/^\d+(\.\d{1,2})?$/)
      .withMessage("Price can only have up to two decimal places.")
      .notEmpty()
      .withMessage("Price is required."),
    body("size")
      .notEmpty()
      .withMessage("Size is required.")
      .isIn(["S", "M", "L", "XL"])
      .withMessage("Size must be one of: S, M, L, XL."),
    // body("image")
    //   .optional()
    //   .isURL()
    //   .withMessage("Image must be a valid URL."),
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ],
};

export default productValidator;

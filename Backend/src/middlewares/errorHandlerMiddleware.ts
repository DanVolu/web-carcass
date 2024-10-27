import { Request, Response, NextFunction } from "express";

const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction): void => {
  res.status(500).json({
    status: "error",
    message: `Internal Server Error: ${err instanceof Error ? err.message : 'Unknown error'}`,
  });
};

export default errorHandler;

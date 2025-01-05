import type { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError.js";
import { MongooseError } from "mongoose";

export default (
  error: ApiError | MongooseError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof ApiError) {
    console.log(error.message);
    res.status(error.statusCode).json({
      message: error.message,
      errors: error.errors,
      stack: error.stack,
    });
    return;
  }
  if (error instanceof MongooseError) {
    console.log(error.message);
    res.status(500).json({
      message: "Something went wrong",
      errors: error.message,
    });
    return;
  }
  if (error instanceof Error) {
    console.log(error.message);
  }

  res.status(500).json({
    message: "Something went wrong",
  });
};

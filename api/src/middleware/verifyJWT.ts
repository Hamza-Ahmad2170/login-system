import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import env from "../config/env.js";
import ApiError from "../utils/ApiError.js";

const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return next(new ApiError("Unauthorized: Missing or invalid token", 401));
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      // if (err.name === "TokenExpiredError") {
      //   return next(new ApiError("Token has expired", 401));
      // }
      // return next(new ApiError("Invalid token", 401));
      return next(new ApiError("Token has expired", 401));
    }

    // Type assertion for decoded JWT payload
    const payload = decoded as jwt.JwtPayload;
    req.user = {
      _id: payload._id,
      email: payload.email,
    };

    next();
  });
};
export default verifyJWT;

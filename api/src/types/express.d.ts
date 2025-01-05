import "express";
import { ObjectId } from "mongoose";

// declare module "express" {
//   interface Request {
//     user: {
//       _id: ObjectId;
//       email: string;
//     };
//   }
// }

declare global {
  namespace Express {
    interface Request {
      user: {
        _id: ObjectId;
        email: string;
      };
    }
  }
}

import mongoose from "mongoose";
import argon from "argon2";
import jwt from "jsonwebtoken";
import env from "../config/env.js";

export interface User extends mongoose.Document {
  email: string;
  password: string;
  refreshToken: string[];
  // refreshToken: {
  //   token: string;
  //   userAgent: {
  //     browser: string;
  //     os: string;
  //   };
  //   // expiresAt: Date;
  // }[];

  isPasswordCorrect(password: string): Promise<boolean>;
  generateRefreshToken(): string;
  generateAccessToken(): string;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  password: {
    type: String,
    required: true,
    trim: true,
  },

  refreshToken: [
    {
      type: String,
      trim: true,
    },
  ],
  // refreshToken: [
  //   {
  //     token: {
  //       type: String,
  //       required: true, // Ensure tokens are not empty
  //     },
  //     userAgent: {
  //       browser: {
  //         type: String,
  //         required: true, // Makes sure browser details are always logged
  //       },
  //       os: {
  //         type: String,
  //         required: true, // Makes sure OS details are always logged
  //       },
  //     },
  //     // expiresAt: {
  //     //   type: Date,
  //     //   required: true, // Ensures tokens have expiration dates
  //     // },
  //   },
  // ],
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await argon.hash(this.password);
  next();
});

// In your user model
userSchema.methods.isPasswordCorrect = async function (
  candidatePassword: string
): Promise<boolean> {
  try {
    return await argon.verify(this.password, candidatePassword);
  } catch (error) {
    console.error("Password verification error:", error);
    return false;
  }
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
    },
    env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: env.ACCESS_TOKEN_EXPIRY,
      // expiresIn: "10s",
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
    },
    env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

const User = mongoose.model<User>("User", userSchema);

export default User;

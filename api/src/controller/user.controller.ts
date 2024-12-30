import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import type { NextFunction, Request, Response } from "express";
import { userValidation } from "../validations/user.js";
import ApiError from "../utils/ApiError.js";
import User from "../model/user.js";
import { generateToken } from "../utils/generateToken.js";
import jwt from "jsonwebtoken";

import env from "../config/env.js";
import { type RefreshTokenPayload } from "../types/types.js";
import { getUserAgent } from "../utils/utils.js";
import { EXPIRE } from "../utils/constant.js";

const register = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const registerUser = userValidation.safeParse(req.body);

    if (!registerUser.success) {
      const error = registerUser.error.flatten().fieldErrors;
      return next(new ApiError("Validation failed", 400, error));
    }

    const oldUser = await User.findOne({ email: registerUser.data.email });
    if (oldUser) {
      return next(
        new ApiError("Email is already taken", 409, {
          email: registerUser.data.email,
        })
      );
    }

    const newUser = new User({
      email: registerUser.data.email,
      password: registerUser.data.password,
    });

    await newUser.save();
    return res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  }
);

const login = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const loginUser = userValidation.safeParse(req.body);

    if (!loginUser.success) {
      const error = loginUser.error.flatten().fieldErrors;
      return next(new ApiError("Validation failed", 400, error));
    }

    const { email, password } = loginUser.data;
    const userFound = await User.findOne({ email });

    if (!userFound || !(await userFound.isPasswordCorrect(password))) {
      return next(new ApiError("Authentication failed", 401));
    }

    // const refreshToken = req.cookies?.refreshToken || null;

    // if (refreshToken) {
    //   userFound.refreshToken = userFound.refreshToken.filter(
    //     (rt) => rt !== refreshToken
    //   );

    //   res.clearCookie("refreshToken");
    // }

    // const userAgent = getUserAgent();

    // const delete1 = await User.updateOne(
    //   { email: userFound.email }, // Match the user by email
    //   {
    //     $pull: {
    //       refreshToken: {
    //         userAgent: {
    //           browser: userAgent.browser,
    //           os: userAgent.os,
    //         },
    //       },
    //     },
    //   }
    // );

    // console.clear();
    // console.log("delete1", delete1);

    // userFound.save();

    const { accessToken, refreshToken } = await generateToken(userFound);
    // userFound.refreshToken = [];
    // await userFound.save();

    res.cookie("refreshToken", refreshToken, {
      expires: EXPIRE,
      httpOnly: true, // prevents javascript access
      sameSite: "strict",
      // secure: true,
      path: "/",
      // maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
    });
  }
);

const refreshTokenHandler = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const existingRefreshToken = req.cookies.refreshToken || null;
    console.log("existingRefreshToken", existingRefreshToken);

    if (!existingRefreshToken) {
      return next(new ApiError("no refresh token found", 401));
    }

    // Find user with this refresh token
    const foundUser = await User.findOne({
      refreshToken: existingRefreshToken,
    });

    // const foundUser = await User.findOne({
    //   "refreshToken.token": existingRefreshToken, // Match the token field inside objects
    // });

    // Handle potential token reuse
    if (!foundUser) {
      jwt.verify(
        existingRefreshToken,
        env.REFRESH_TOKEN_SECRET,
        async (
          error: jwt.VerifyErrors | null,
          decoded: string | jwt.JwtPayload | undefined
        ) => {
          if (error) {
            return next(new ApiError("Invalid refresh token", 401));
          }

          console.log("Detected refresh token reuse!");
          const { _id, email } = decoded as RefreshTokenPayload;

          const hackedUser = await User.findOne({ email });
          if (hackedUser) {
            hackedUser.refreshToken = [];
            await hackedUser.save();
          }
        }
      );
      return next(new ApiError("Token reuse detected", 403));
    }
    const useragent = getUserAgent();

    // Filter out the current refresh token
    const newRefreshTokenArray = foundUser.refreshToken.filter(
      (rt) => rt !== existingRefreshToken
    );
    foundUser.refreshToken = newRefreshTokenArray;
    console.log("token array", (foundUser.refreshToken = newRefreshTokenArray));

    await foundUser.save({ validateBeforeSave: false });

    // Verify the existing token
    jwt.verify(
      existingRefreshToken,
      env.REFRESH_TOKEN_SECRET,
      async (
        error: jwt.VerifyErrors | null,
        decoded: string | jwt.JwtPayload | undefined
      ) => {
        if (error) {
          console.log("expired refresh token");
          foundUser.refreshToken = [...newRefreshTokenArray];
          await foundUser.save();
          return next(new ApiError("Refresh token expired", 401));
        }

        const { _id, email } = decoded as RefreshTokenPayload;
        if (foundUser.email !== email) {
          return next(new ApiError("Invalid refresh token", 403));
        }

        // Generate new tokens
        const { accessToken, refreshToken: newRefreshToken } =
          await generateToken(foundUser);
        // await foundUser.save();

        // Set new refresh token cookie
        res.cookie("refreshToken", newRefreshToken, {
          expires: EXPIRE,
          httpOnly: true,
          sameSite: "strict",
          // secure: true, // Enable in production
          path: "/",
        });

        return res.status(200).json({
          success: true,
          message: "Refresh token updated successfully",
          accessToken,
        });
      }
    );
  }
);

export { register, login, refreshTokenHandler };

import type { User } from "../model/user.js";
import ApiError from "./ApiError.js";
import { EXPIRE } from "./constant.js";
import { getUserAgent } from "./utils.js";
import type { Request } from "express";

export const generateToken = async (user: User, request: Request) => {
  try {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    const userAgent = getUserAgent(request);

    user.refreshToken.push({
      token: refreshToken,
      deviceInfo: {
        browser: userAgent.browser,
        os: userAgent.os,
      },
      // expiresAt: EXPIRE,
    });
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Token generation error:", error);
    throw new ApiError(
      "Something went wrong while generating refresh and access token",
      500
    );
  }
};

import env from "../config/env.js";

class ApiError extends Error {
  statusCode: number;
  errors: unknown;

  constructor(message: string, statusCode: number, errors?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;

    if (env.NODE_ENV === "development ") {
      // Remove space after "development"
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;

import env from "../config/env.js";

class ApiError extends Error {
  statusCode: number;
  errors: unknown;
  // status: string;
  //   isOperational: boolean = true;

  constructor(message: string, statusCode: number, errors?: unknown) {
    super(message);
    this.statusCode = statusCode;
    // this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
    this.errors = errors;
    console.log("stackError", Error.captureStackTrace(this, this.constructor));
    if (env.NODE_ENV === "development ") {
      const stackError = Error.captureStackTrace(this, this.constructor);

      this.stack = stackError as unknown as string;
    }
  }
}

export default ApiError;

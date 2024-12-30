import express from "express";
import globalErrorHandler from "./middleware/error..js";
import morgan from "morgan";
import env from "./config/env.js";
import userRouter from "./routes/user.routes.js";
import connectDB from "./db/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

if (env.NODE_ENV === "development ") {
  app.use(morgan("dev"));
}

app.use("/api/user", userRouter);

app.use(globalErrorHandler);

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`started on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });

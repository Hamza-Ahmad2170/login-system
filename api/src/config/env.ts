import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  MONGODB_URI: z.string().url(),
  DB_NAME: z.string(),
  NODE_ENV: z.enum(["development ", "production"]),
  ACCESS_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_EXPIRY: z.string(),
  ACCESS_TOKEN_EXPIRY: z.string(),
});

const env = envSchema.parse(process.env);
export type Env = z.infer<typeof envSchema>;

export default env;

import { type ObjectId } from "mongoose";

interface RefreshTokenPayload {
  _id: ObjectId;
  email: string;
}

interface AccessTokenPayload {
  _id: ObjectId;
  email: string;
}

export type { RefreshTokenPayload, AccessTokenPayload };

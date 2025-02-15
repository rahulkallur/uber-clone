declare module "../models/userModel.js" {
  import { Document, Model } from "mongoose";

  export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
  }

  export const User: Model<IUser>;
}

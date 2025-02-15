import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { User, IUser } from "../models/userModel.js";
import { BlockListToken } from "../models/blockListTokenModel.js";
import { CustomError } from "./errorMiddleware.js";

interface AuthenticatedRequest extends Request {
  user?: IUser;
}

export const userAuth = async (
  req: AuthenticatedRequest,
  _: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new CustomError({
        code: 401,
        status: "UNAUTHORIZED",
        remarks: "Unauthorized access, please pass a valid token in the header",
      });
    }
    const token = req.cookies.token || authHeader.split(" ")[1];

    const isBlacklisted = await BlockListToken.find({ token });

    if (isBlacklisted.length) {
      throw new CustomError({
        code: 401,
        status: "UNAUTHORIZED",
        remarks: "Invalid token. Please login again",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    const user = await User.findById(decoded.id as string);
    if (!user) {
      throw new CustomError({
        code: 401,
        status: "UNAUTHORIZED",
        remarks: "Invalid token. Please login again",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    const err = error as Error;
    throw new CustomError({
      code: 500,
      status: "INTERNAL_ERROR",
      remarks: err.message,
    });
  }
};

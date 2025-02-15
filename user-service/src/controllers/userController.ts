import { RequestHandler } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import { User } from "../models/userModel.js";
import { BlockListToken } from "../models/blockListTokenModel.js";

export const registerController: RequestHandler = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      res.status(400).json({ message: "User already exists" });
    }

    const hash = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hash });

    await newUser.save();

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET || "F@lCon$ev",
      {
        expiresIn: "1h",
      },
    );

    res.cookie("token", token);

    res.send({ token, newUser });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

export const loginController: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      res.status(400).json({ message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials" });
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "F@lCon$ev",
      {
        expiresIn: "1h",
      },
    );
    res.cookie("token", token);
    res.send({ token, user });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

export const logoutController: RequestHandler = async (req, res) => {
  try {
    const token = req.cookies.token;
    await BlockListToken.create({ token });
    res.clearCookie("token");
    res.send({ message: "User logged out successfully" });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

export const profileController: RequestHandler = async (req, res) => {
  try {
    res.send(req.user);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

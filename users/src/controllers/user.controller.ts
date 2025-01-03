import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response } from "express";
dotenv.config();

interface LoginRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const user = await userModel.findOne({ email: email });

    if (user) {
      res.status(400).json({ message: "User already exists" });
    }

    const hasPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({ name, email, password: hasPassword });
    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id },
      process.env.SECRET_KEY as string,
      { expiresIn: "1h" }
    );

    res.cookie("token", token);

    res.send({ message: "User registered successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const loginUser = async (
    req: LoginRequest,
    res: Response
  ): Promise<Response> => {
    try {
      const { email, password } = req.body;
  
      // Find user by email and include password in the query
      const user = await userModel.findOne({ email }).select("+password");
  
      if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
  
      // Compare provided password with stored hashed password
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
  
      // Generate JWT token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
        expiresIn: "1h",
      });
  
      // Convert Mongoose document to plain JavaScript object
      const userData = user.toObject();
  
      // Set token as a cookie
      res.cookie("token", token, {
        httpOnly: true, // Ensures the cookie can't be accessed by JavaScript on the client
        secure: process.env.NODE_ENV === "production", // Ensures the cookie is sent only over HTTPS in production
      });
  
      // Send token and user data as the response
      return res.send({ token, user: userData });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Something went wrong" });
    }
  };

export const logoutUser = async (req: Request, res: Response) => {};

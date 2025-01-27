import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import User from "../models/user.js";


interface RegisterRequest extends Request {
    body: {
      name: string;
      email: string;
      password: string;
    };
  }

export const register = async (req: RegisterRequest, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    const user = await User.findOne({ email: email });

    if (user) {
      res.status(400).send({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token);

    res.status(201).send({ message: "User registered successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
};

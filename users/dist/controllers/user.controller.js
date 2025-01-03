import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await userModel.findOne({ email: email });
        if (user) {
            res.status(400).json({ message: "User already exists" });
        }
        const hasPassword = await bcrypt.hash(password, 10);
        const newUser = new userModel({ name, email, password: hasPassword });
        await newUser.save();
        const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY, { expiresIn: "1h" });
        res.cookie("token", token);
        res.send({ message: "User registered successfully" });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Something went wrong" });
    }
};

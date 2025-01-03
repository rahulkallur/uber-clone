import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connect = () => {
  mongoose
    .connect(process.env.MONGO_URL as string)
    .then(function () {
      console.log("User Service Connected to MongoDB");
    })
    .catch(function (error) {
      console.log(error);
    });
};

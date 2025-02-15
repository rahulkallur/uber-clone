import mongoose from "mongoose";

export const connect = () => {
  mongoose
    .connect(process.env.MONGO_URI || "mongodb://localhost:27017/uber-clone")
    .then(function () {
      console.log("connected to database");
    })
    .catch(function (err) {
      console.log(err);
    });
};

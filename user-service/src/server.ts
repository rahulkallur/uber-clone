import express from "express";
import cors from "cors";
import { router } from "./routes.js";
import { connect } from "./db/db.js";

connect();
const app = express();
if (process.env.NODE_ENV !== "production") app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", router);

app.listen(parseInt(process.env.PORT || "80"), () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

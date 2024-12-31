import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";

const app = express();
app.use(cors());
app.use(morgan("dev"));

app.get("/", (req: Request, res: Response) => {
  for(let i = 0; i < 100000000; i++) {}
  res.send("Hello World!");
});

app.get("/stress-test", (req: Request, res: Response) => {
  for(let i = 0; i < 100000000; i++) {}
  res.send("Stress Test!");
});

app.listen("3000", () => {
  console.log("Server is running on port 3000");
});

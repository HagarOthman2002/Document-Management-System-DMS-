import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
dotenv.config();
import express from "express";
import userRouter from "./routes/userRoutes";
import workspaceRoutes from "./routes/workSpaceRoutes";

const app = express();

const DBSTRING = process.env.DataBase;
const dbPassword = process.env.DataBasePassword;


if (!DBSTRING || !dbPassword) {
  throw new Error("Missing environment variables: DataBase or DataBasePassword");
}

const DB = DBSTRING.replace("<PASSWORD>", dbPassword);
console.log("Final Mongo URI:", DB);

mongoose
  .connect(DB)
  .then(() => console.log("DB connection successful!"))
  .catch((err) => console.error("DB connection error:", err));


app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/api/v1", userRouter);
app.use("/api/v1/workspaces", workspaceRoutes);

export default app;




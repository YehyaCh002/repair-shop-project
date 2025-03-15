import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import requestRoutes from "./routes/requestRoutes.js";
import authRoutes  from "./routes/authRoutes.js";
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/requests", requestRoutes);

app.get("/", (req, res) => res.send("Hello from the backend!"));
app.use("/auth", authRoutes);
app.listen(5000, () => console.log("Server running on port 5000"));

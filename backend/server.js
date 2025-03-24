import express from "express";
import cors from "cors";
import clientRoutes from "./routes/clientRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/get",clientRoutes);
app.get("/", (req, res) => res.send("Hello from the backend!"));

app.listen(5000, () => console.log("Server running on port 5000"));

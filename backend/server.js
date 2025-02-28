import express from "express";
import cors from "cors";
import requestRoutes from "./routes/requestRoutes.js";
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/requests", requestRoutes);

app.get("/", (req, res) => res.send("Hello from the backend!"));

app.listen(5000, () => console.log("Server running on port 5000"));

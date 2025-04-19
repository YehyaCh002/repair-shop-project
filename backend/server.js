import express from "express";
import cors from "cors";
import session from "express-session";
import authRoutes from "./routes/authRoutes.js";
import dotenv from "dotenv";
import technicianRoutes from "./routes/technicianRoutes.js";
import repairRoutes from "./routes/repairRoutes.js";
import bodyParser from "body-parser";
dotenv.config();

const app = express();

app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true, 
}));

app.use(
    session({
      secret: process.env.SECRET_KEY, 
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false, 
        httpOnly: true,   
        sameSite: "strict", 
        maxAge: 1000 * 60 * 60 

      },
    })
);

app.use(express.json());
app.use(bodyParser.json());

app.use("/auth", authRoutes);
app.use('/api', repairRoutes);
app.use("/technician", technicianRoutes);
app.get("/", (req, res) => res.send("Hello from the backend!"));

app.listen(5000, () => console.log("Server running on port 5000"));

import express from "express";
import cors from "cors";
import session from "express-session";
import authRoutes from "./routes/authRoutes.js";
import dotenv from "dotenv";
import technicianRoutes from "./routes/technicianRoutes.js";
import repairRoutes from "./routes/repairRoutes.js";
import workshopRoutes from "./routes/workshopRoute.js";
import fixRoutes from "./routes/fixRoutes.js";
import bodyParser from "body-parser";
dotenv.config();

const app = express();

app.use(cors({
  origin: true,     
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
        sameSite: "lax", 
        maxAge: 1000 * 60 * 60 

      },
    })
);

app.use(express.json());
app.use(bodyParser.json());

app.use("/auth", authRoutes);
app.use('/api', repairRoutes);
app.use("/technician", technicianRoutes);
app.use("/workshop", workshopRoutes);
app.use("/fix",fixRoutes); 
app.get("/", (req, res) => res.send("Hello from the backend!"));

app.listen(5000, '0.0.0.0', () => console.log("Server running on port 5000"));

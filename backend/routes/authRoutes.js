import express from "express";
import { registerWorkshop, loginWorkshop , checkSession } from "../controllers/authController.js";
const router = express.Router();
router.post('/register', (req, res) => {
    
    if (!req.body) {
        return res.status(400).json({ error: "Middleware didn't process request body!" });
    }

    registerWorkshop(req, res);
});

router.post("/login", (req, res) => {
    if (!req.body) {
        return res.status(400).json({ error: "Middleware didn't process request body!" });
    }
    loginWorkshop(req, res);

});
router.get("/check-session", checkSession);


export default router;

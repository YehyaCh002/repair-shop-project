import express from "express";
import { registerWorkshop, loginWorkshop } from "../controllers/authController.js";
import { verifyToken } from "../middelwares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerWorkshop);
router.post("/login", loginWorkshop);
router.get("/protected", verifyToken, (req, res) => {
    res.json({ message: "Access granted!", workshop: req.workshop });
});

export default router;

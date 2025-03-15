import express from "express";
import { register,login } from "../controllers/authController.js";
import { verifyToken } from "../middelwares/authMiddleware.js";

 const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", verifyToken, (req, res) => {
  res.json({ message: "Accès autorisé", userId: req.user.id });
});
export default router;


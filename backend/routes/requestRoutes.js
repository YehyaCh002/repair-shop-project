import express from "express";
import {
  fetchRequests,
  getOneRequest,
  createRequest,
  updateRepair,
  removeRequest
} from "../controllers/requestController.js";

const router = express.Router();

router.get("/", fetchRequests); // ✅ Matches "/requests"
router.get("/:id", getOneRequest); // ✅ Matches "/requests/:id"
router.post("/", createRequest); // ✅ Matches "/requests"
router.put("/:id", updateRepair); // ✅ Matches "/requests/:id"
router.delete("/:id", removeRequest); // ✅ Matches "/requests/:id"

export default router;

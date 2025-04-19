import express from 'express';
import { createRepairRequest ,getRepairsByWorkshop,deleteRepairRequest } from '../controllers/repairController.js';
const router = express.Router();

router.post('/post-repairs', createRepairRequest);
router.get("/get-repairs", getRepairsByWorkshop);
router.delete("/delete-repairs/:id_repair", deleteRepairRequest);

export default router;

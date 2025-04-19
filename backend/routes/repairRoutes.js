import express from 'express';
import {
  createRepairRequest,
  downloadTicket,
  deleteRepairRequest,
  getRepairsByWorkshop
} from '../controllers/repairController.js';

const router = express.Router();

router.post('/post-repairs', createRepairRequest);
router.get('/ticket/:id_repair', downloadTicket);
router.delete('/delete/:id_repair', deleteRepairRequest);
router.get('/get-repairs', getRepairsByWorkshop);

export default router;

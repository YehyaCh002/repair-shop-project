import express from 'express';
import {
  createRepairRequest,
  downloadTicket,
  deleteRepairRequest,
  getRepairsByWorkshop,
  updateRepairRequest,
  getOneRequest,
} from '../controllers/repairController.js';

const router = express.Router();

router.post('/post-repairs', createRepairRequest);
router.get('/ticket/:id_repair', downloadTicket);
router.delete('/delete-repairs/:id_repair', deleteRepairRequest);
router.get('/get-repairs', getRepairsByWorkshop);
router.get('/get-repairs/:id_repair', getOneRequest);
router.put('/update-repairs/:id_repair', updateRepairRequest);
router.get    ('/repair/ticket/:id_repair', downloadTicket);

export default router;

import express from 'express';
import { fetchClients } from '../controllers/clientController.js';

const router = express.Router();
router.get("/", fetchClients);
 
export default router;
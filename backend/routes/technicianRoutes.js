import {createTechnician,fetchTechniciansByWorkshop,deleteTechnician} from '../controllers/technicianController.js'; 
import express from 'express';

const router = express.Router();

router.post('/add-technician', createTechnician);
router.get('/get-technician', fetchTechniciansByWorkshop);
router.delete('/delete-technician/:id_technicien', deleteTechnician);
export default router;
import {createTechnician,
    fetchTechniciansByWorkshop,
    deleteTechnician,
    updateTech,
    getOneTechnician,
    getRepairsByTech
} from '../controllers/technicianController.js'; 
import express from 'express';

const router = express.Router();


router.post('/add-technician', createTechnician);
router.get('/get-technician', fetchTechniciansByWorkshop);
router.delete('/delete-technician/:id_technicien', deleteTechnician);
router.get('/get-technician-byID/:id_technicien', getOneTechnician);
router.put('/update-technician/:id_technicien', updateTech)
router.get('/get-repairs-by-tech/:id_technicien', getRepairsByTech);

export default router
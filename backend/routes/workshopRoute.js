import express from 'express';
import { getSettings, updateSettings } from '../controllers/workshopController.js';

const router = express.Router();

// Get current workshop settings
router.get( '/settings',getSettings
);

// Update workshop settings
router.put(
  '/settings',updateSettings
);

export default router;
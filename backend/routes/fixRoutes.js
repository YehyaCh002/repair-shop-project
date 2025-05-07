import express from 'express';
import { getFixedRepairs, receiveDevice } from '../controllers/fixController.js';

const router = express.Router();

router.get(
  '/get',
  getFixedRepairs
);

router.post(
  '/receive',  receiveDevice
);

export default router;
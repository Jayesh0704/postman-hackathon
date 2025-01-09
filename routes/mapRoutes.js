import express from 'express';
import { findNearestHospitals } from '../controllers/mapController.js';

const router = express.Router();

router.get('/nearest-hospitals', findNearestHospitals);

export default router;

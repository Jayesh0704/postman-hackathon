import express from 'express';
import { findNearestHospitalsAndFilter } from '../controllers/hospitalController.js';

const router = express.Router();

router.post('/find-nearest-hospitals', findNearestHospitalsAndFilter);

export default router;

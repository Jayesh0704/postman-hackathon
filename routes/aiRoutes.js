import express from 'express';
import { appendPromptAndProcess } from '../controllers/aiController.js';

const router = express.Router();

router.post('/append', appendPromptAndProcess);

export default router;

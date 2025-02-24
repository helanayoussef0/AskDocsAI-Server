import express from 'express';
import { handleChat, healthCheck } from '../controllers/chatController.js';

const router = express.Router();

router.get('/', healthCheck);

router.post('/api/chat', handleChat);

export default router;
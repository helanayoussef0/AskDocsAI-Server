import express from 'express';
import { handleChat, healthCheck } from '../controllers/chatController.js';
import { analyzeDocument } from '../controllers/documentController.js';

const router = express.Router();

router.get('/', healthCheck);

router.post('/api/analyze', analyzeDocument);

router.post('/api/chat', handleChat);

export default router;
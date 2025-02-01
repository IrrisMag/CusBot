import express from 'express';
const router = express.Router();

import { showHome, handleChatbotQuery } from '../controllers/home.controller.js';

router.get('/home', showHome);

router.post('/chat', handleChatbotQuery);

export default router;
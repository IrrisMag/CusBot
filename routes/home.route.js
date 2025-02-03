import express from 'express';

const router = express.Router();

import { showHome, handleChatbotQuery, fetchFaqs } from '../controllers/home.controller.js';

router.get('/home', showHome);

router.post('/chat', handleChatbotQuery);


router.get('/faqs',fetchFaqs);



export default router;
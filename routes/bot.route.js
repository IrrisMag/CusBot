import express from 'express';
const router = express.Router();



import { showBot, responseBot } from '../controllers/home.controller.js';


router.get('/', showBot);

router.post('/', responseBot);

export default router;
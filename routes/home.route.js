import express from 'express';
const router = express.Router();



import { showHome } from '../controllers/home.controller.js';

router.get('/', showHome);





export default router;
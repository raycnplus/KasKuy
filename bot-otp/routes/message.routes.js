import { Router } from 'express';
import { sendWA } from '../controllers/message.controller.js'; 

const router = Router(); 

router.post('/send-message', sendWA);

export default router;
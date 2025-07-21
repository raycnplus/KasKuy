import { Router } from 'express';
import { sendOtp } from '../controllers/otp.controller.js'; 

const router = Router(); 

router.post('/send-otp', sendOtp);

export default router;
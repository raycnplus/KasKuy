import { Router } from 'express';
import multer from 'multer';
import { ocrWithGemini } from '../controllers/ocr.controller.js';

const router = Router();

const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('image'), ocrWithGemini);

export default router; 
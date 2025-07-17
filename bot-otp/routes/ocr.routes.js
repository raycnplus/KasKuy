import { Router } from 'express';
import multer from 'multer';
import { handleOCR, OCR } from '../controllers/ocr.controller.js';

const router = Router();

const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('image'), handleOCR);
router.post('/struk', upload.single('image'), OCR);

export default router; 
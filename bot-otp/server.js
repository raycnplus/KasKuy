import express from 'express';
import connectDB from './config/db.js';
import { PORT } from './config/env.js';
import Middleware from './middleware/middleware.js';
import otpRoutes from './routes/otp.routes.js';
import ocrRoutes from './routes/ocr.routes.js';


const app = express();
const port = PORT || 5000;

Middleware.Middleware(app);

app.use('/api', otpRoutes);
app.use('/api/ocr', ocrRoutes);

app.listen(port, async () => {
    await connectDB();
    console.log(`🚀 Server berjalan di http://localhost:${port}`);
});

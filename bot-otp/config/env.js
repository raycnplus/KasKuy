import { config } from "dotenv";

config({ path: `.env`});
export const {
    FRONTEND_URL, PORT, MONGO_URI, DATABASE_NAME,
    CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET,
    GEMINI_API_KEY,
} = process.env;

import { config } from "dotenv";

config({ path: `.env`});
export const {
    FRONTEND_URL, PORT, MONGO_URI, DATABASE_NAME,
    TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM
} = process.env;

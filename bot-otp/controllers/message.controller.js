import { sendWaMessage } from '../utils/send.js';

export const sendWA = async (req, res) => {
    
    const { phone, message } = req.body;

    const chatId = phone + '@c.us';

    await sendWaMessage(chatId, message);

    res.send({ success: true, status: 'sent' });

};
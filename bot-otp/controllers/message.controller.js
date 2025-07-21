import { sendWaMessage } from '../utils/send.js';

// export const sendWA = async (req, res) => {
    
//     const { phone, message } = req.body;

//     const chatId = phone + '@c.us';

//     await sendWaMessage(chatId, message);

//     res.send({ success: true, status: 'sent' });

// };


export const sendWA = async (req, res) => {
  try {
    const { phone, message } = req.body;
    const chatId = phone.endsWith('@c.us') ? phone : phone + '@c.us';

    await sendWaMessage(chatId, message);

    res.send({ success: true, status: 'sent' });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
};
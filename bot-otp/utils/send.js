import { client } from '../config/whatsapp.js';

export async function sendWaMessage(phone, message) {
    
  if (message.fromMe) return;

  if (message.id.remote === 'status@broadcast') return;

    const number = phone.endsWith('@c.us') ? phone : phone + '@c.us';
    console.log(number, message);
    return await client.sendMessage(number, message);
}

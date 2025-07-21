import { client } from '../config/whatsapp.js';

// export async function sendWaMessage(phone, message) {
    
//   if (message.fromMe) return;

//   if (message.id.remote === 'status@broadcast') return;

//   if (phone.endsWith('@g.us') || message.id.remote.endsWith('@g.us')) return;

//     const number = phone.endsWith('@c.us') ? phone : phone + '@c.us';
//     console.log(number, message);
//     return await client.sendMessage(number, message);
// }


export async function sendWaMessage(chatId, message) {
  if (!chatId.endsWith('@c.us')) return console.log('❌ Bukan nomor pribadi.');

  try {
    const result = await client.sendMessage(chatId, message);
    console.log('✅ Pesan terkirim:', result);
    return result;
  } catch (err) {
    console.error('❌ Gagal kirim pesan:', err.message);
    throw err;
  }
}
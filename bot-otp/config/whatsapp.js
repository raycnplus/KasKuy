import pkg from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import axios from 'axios';

const { Client, LocalAuth } = pkg;

export const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true, // Ganti ke false kalau ingin lihat browser-nya
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', (qr) => {
    console.log('Scan QR Code berikut untuk login:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ WhatsApp Bot sudah siap!');
});

client.on('authenticated', () => {
    console.log('🔐 Bot berhasil login.');
});

client.on('auth_failure', msg => {
    console.error('❌ Gagal login:', msg);
});

client.initialize();


// client.on('message', async (msg) => {
  
//   if (msg.hasMedia) {
//     const media = await msg.downloadMedia();
//     if (!media) return;

//     const payload = {
//       chatId: msg.from,
//       type: media.mimetype,              // contoh: image/jpeg, audio/ogg
//       filename: media.filename || 'file',
//       caption: msg.body || '',           
//       base64: media.data,               
//       timestamp: msg.timestamp,
//     };

//     try {
//       await axios.post('https://n8n.jcode.my.id/webhook-test/kaskuy', payload);
//       console.log("📤 Media terkirim ke n8n");
//     } catch (error) {
//       console.error("❌ Gagal kirim media ke n8n:", error.message);
//     }

//   } else if (msg.type === 'chat') {
//     // Pesan teks biasa
//     const payload = {
//       chatId: msg.from,
//       type: 'chat',               
//       message: msg.body,
//       timestamp: msg.timestamp,
//     };

//     try {
//       await axios.post('https://n8n.jcode.my.id/webhook-test/kaskuy', payload);
//       console.log("📤 Teks terkirim ke n8n");
//     } catch (error) {
//       console.error("❌ Gagal kirim teks ke n8n:", error.message);
//     }
//   }
// });



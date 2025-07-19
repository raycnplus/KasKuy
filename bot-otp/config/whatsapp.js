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

client.on('message', async msg => {
  const { from, body } = msg;
 
  try {

    await axios.post('https://n8n.jcode.my.id/webhook/kaskuy', {
      chatId: from,
      body: body,
      timestamp: msg.timestamp
    });

  } catch (err) {
    console.error('❌ Gagal kirim ke n8n webhook:', err.message);
  }
});

client.initialize();

import pkg from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';

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

import fs from 'fs';
import axios from 'axios';
import { GEMINI_API_KEY } from '../config/env.js';


const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`

export const ocrWithGemini = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    const imageBuffer = fs.readFileSync(file.path);
    const base64Image = imageBuffer.toString('base64');

    const mimeType = file.mimetype; // e.g., image/jpeg or image/png

    const response = await axios.post(GEMINI_API_URL, {
      contents: [
        {
          parts: [
            {     
              text: `
                Bantu ekstrak dan kembalikan data dari gambar struk ini dalam format JSON dengan struktur seperti berikut:

                {
                  "store_name": "",
                  "store_address": "",
                  "type": "pengeluaran",
                  "date": "",
                  "items": [
                    {
                      "name": "",
                      "unit_price": 0,
                      "quantity": 0,
                      "total_price": 0
                    }
                  ],
                  "subtotal": 0,
                  "tax": 0,
                  "total": 0,
                  "paid": 0,
                  "change": 0
                }

                Pastikan:
                - Harga tanpa pemisah ribuan (misalnya 15000, bukan 15.000)
                - Tanggal dalam format YYYY-MM-DD HH:mm:ss
                - Nama toko dan alamat diambil dari bagian paling atas
                - Semua nilai numerik dikembalikan sebagai angka (bukan string)
                - Jika ada diskon atau promo per item, tetap masukkan ke "total_price"

                Berikut adalah gambar struk yang ingin diekstrak:
                    `
            },
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Image,
              },
            },
          ],
        },
      ],
    });

    const result = response.data.candidates?.[0]?.content?.parts?.[0]?.text;

    fs.unlinkSync(file.path);

    return res.json({
      result: result || 'No text extracted from image.',
    });

  } catch (error) {
    console.error('Gemini OCR Error:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to perform OCR with Gemini',
      details: error.response?.data || error.message,
    });
  }
};

import Tesseract from 'tesseract.js';
import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';

export const OCR = async (req, res) => {
  const imagePath = req.file.path; // ambil path dari file upload

  try {
    // Buat form data dan lampirkan file
    const form = new FormData();
    form.append('image', fs.createReadStream(imagePath));

    // Kirim ke server Python PaddleOCR
    const response = await axios.post('http://localhost:5001/ocr', form, {
      headers: form.getHeaders()
    });

    fs.unlinkSync(imagePath); // hapus file sementara
    res.json(response.data);  // kirim hasil ke Laravel

  } catch (err) {
    console.error('OCR Error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Gagal menghubungi Python OCR' });
  }
};

export const handleOCR = async (req, res) => {
  const imagePath = req.file.path;

  try {
    const result = await Tesseract.recognize(imagePath, 'eng', {
      logger: m => console.log(m),
    });

    const text = result.data.text;
    fs.unlinkSync(imagePath); // hapus file sementara

    console.log('=== OCR Output ===');
    console.log(text);
    console.log('==================');

    const lines = text.split('\n').filter(line => line.trim() !== '');
    const items = [];

    for (let line of lines) {
      // Hilangkan koma dari angka (misal: 39,800 jadi 39800)
      line = line.replace(/,/g, '');

      // Match format: NAMA   QTY   HARGA_SATUAN   TOTAL
      const match = line.match(/^(.+?)\s+(\d{1,3})\s+(\d{3,6})\s+(\d{3,6})$/);
      if (match) {
        items.push({
          name: match[1].trim(),
          quantity: parseInt(match[2]),
          unit_price: parseInt(match[3]),
          total_price: parseInt(match[4]),
        });
        continue;
      }

      // Match fallback: nama + total (tanpa qty/harga satuan)
      const simpleMatch = line.match(/^(.+?)\s+(\d{3,6})$/);
      if (simpleMatch) {
        items.push({
          name: simpleMatch[1].trim(),
          quantity: 1,
          unit_price: parseInt(simpleMatch[2]),
          total_price: parseInt(simpleMatch[2]),
        });
      }
    }

    res.json({ items });
  } catch (err) {
    res.status(500).json({ error: 'OCR failed', detail: err.message });
  }
};





// import Tesseract from 'tesseract.js';
// import fs from 'fs';
// import sharp from 'sharp';
// import path from 'path';

// export const handleOCR = async (req, res) => {
//   const imagePath = req.file.path;

//   // Buat nama file hasil pre-processing
//   const fileExt = path.extname(imagePath);
//   const fileName = path.basename(imagePath, fileExt);
//   const dir = path.dirname(imagePath);
//   const processedPath = path.join(dir, `${fileName}_processed${fileExt}`);

//   try {
//     // Preprocessing: ubah ke grayscale + normalisasi kontras
//     await sharp(imagePath)
//       .grayscale()
//       .normalize()
//       .toFile(processedPath);

//     // Jalankan OCR
//     const result = await Tesseract.recognize(processedPath, 'eng', {
//       logger: m => console.log(m),
//     });

//     // Cleanup file
//     fs.unlinkSync(imagePath);
//     fs.unlinkSync(processedPath);

//     const text = result.data.text;
//     console.log('=== OCR Output ===');
//     console.log(text);
//     console.log('==================');

//     const lines = text.split('\n').filter(line => line.trim() !== '');
//     const items = [];

//     for (let line of lines) {
//       line = line.replace(/,/g, '').trim();

//       // Format: NAMA   QTY   HARGA_SATUAN   TOTAL
//       const fullMatch = line.match(/^(.+?)\s+(\d{1,3})\s+(\d{3,7})\s+(\d{3,7})$/);
//       if (fullMatch) {
//         items.push({
//           name: fullMatch[1].trim(),
//           quantity: parseInt(fullMatch[2]),
//           unit_price: parseInt(fullMatch[3]),
//           total_price: parseInt(fullMatch[4]),
//         });
//         continue;
//       }

//       // Fallback: NAMA + TOTAL
//       const simpleMatch = line.match(/^(.+?)\s+(\d{3,7})$/);
//       if (simpleMatch) {
//         items.push({
//           name: simpleMatch[1].trim(),
//           quantity: 1,
//           unit_price: parseInt(simpleMatch[2]),
//           total_price: parseInt(simpleMatch[2]),
//         });
//       }
//     }

//     res.json({ items });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'OCR failed', detail: err.message });
//   }
// };

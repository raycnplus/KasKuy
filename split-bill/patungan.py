from flask import Flask, request, jsonify
from paddleocr import PaddleOCR
import tempfile
import os
import re
import cv2

app = Flask(__name__)
ocr = PaddleOCR(use_textline_orientation=True, lang='id')  # ✅ Tidak pakai cls=True

# 🔧 Preprocessing (opsional)
def preprocess_image(image_path):
    image = cv2.imread(image_path, cv2.IMREAD_COLOR)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    _, thresh = cv2.threshold(gray, 180, 255, cv2.THRESH_BINARY)
    cv2.imwrite(image_path, thresh)
    return image_path

@app.route('/ocr', methods=['POST'])
def ocr_struk():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    file = request.files['image']
    with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
        filepath = tmp.name
        file.save(filepath)
        preprocess_image(filepath)

        result = ocr.ocr(filepath)
        os.remove(filepath)

    if not result:
        return jsonify({'error': 'OCR failed'}), 500

    # Ekstrak teks dari hasil OCR
    text_lines = [line[1][0] for box in result for line in box]
    items = []
    total = 0

    for line in text_lines:
        line = line.strip()

        # 🔍 Parsing item: contoh "2x Indomie Goreng 6.000"
        match = re.match(r'(\d+)x\s+(.+?)\s+([\d.,]+)', line)
        if match:
            qty = int(match.group(1))
            name = match.group(2).strip()
            price_str = match.group(3).replace('.', '').replace(',', '')  # Hapus pemisah ribuan
            try:
                price = int(price_str)
                items.append({"nama": name, "jumlah": qty, "harga": price})
            except ValueError:
                pass  # Abaikan jika format angka tidak valid

        # 🔍 Parsing total
        elif re.search(r'total', line, re.IGNORECASE):
            num = re.findall(r'[\d.,]+', line)
            if num:
                total_str = num[-1].replace('.', '').replace(',', '')
                try:
                    total = int(total_str)
                except ValueError:
                    pass

    return jsonify({
        "total": total,
        "items": items,
        "raw": text_lines  # Debugging hasil OCR mentah
    })

if __name__ == '__main__':
    app.run(debug=True)

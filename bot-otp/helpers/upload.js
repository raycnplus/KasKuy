import cloudinary from '../config/cloudinary.js';

export function uploadFromBuffer(buffer, folder = 'kaskuy') {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder },
            (error, result) => error ? reject(error) : resolve(result)
        );
        stream.end(buffer);
    });
}

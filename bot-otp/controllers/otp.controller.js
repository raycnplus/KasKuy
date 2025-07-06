import Otp from '../models/otp.model.js';
import User from '../models/user.model.js';
import { sendWaMessage } from '../utils/send.js';

export const sendOtp = async (req, res) => {
    const { phoneNumber } = req.body;
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 menit

    await Otp.create({ phoneNumber, code, expiresAt });

    await sendWaMessage(phoneNumber, `Kode OTP kamu adalah: ${code}`);

    res.json({ success: true, message: 'OTP dikirim' });
};

export const verifyOtp = async (req, res) => {
    const { phoneNumber, code } = req.body;

    const otpRecord = await Otp.findOne({
        phoneNumber,
        code,
        expiresAt: { $gt: new Date() },
        isUsed: false
    });

    if (!otpRecord) {
        return res.status(400).json({ success: false, message: 'OTP tidak valid atau kadaluarsa' });
    }

    otpRecord.isUsed = true;
    await otpRecord.save();

    let user = await User.findOne({ phoneNumber });

    if (!user) {
        user = await User.create({ phoneNumber, isVerified: true });
    } else if (!user.isVerified) {
        user.isVerified = true;
        await user.save();
    }

    res.json({ success: true, message: 'Verifikasi berhasil', user });
};
  

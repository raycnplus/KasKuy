import { sendWaMessage } from '../utils/send.js';

export const sendOtp = async (req, res) => {
    const { phone, message } = req.body;

    const chatId = phone.endsWith('@c.us') ? phone : phone + '@c.us';

    await sendWaMessage(chatId, message);

    res.json({ success: true, message: 'OTP dikirim' });
};


// ada di laravel jadinya
// export const verifyOtp = async (req, res) => {
//     const { phoneNumber, code } = req.body;

//     const otpRecord = await Otp.findOne({
//         phoneNumber,
//         code,
//         expiresAt: { $gt: new Date() },
//         isUsed: false
//     });

//     if (!otpRecord) {
//         return res.status(400).json({ success: false, message: 'OTP tidak valid atau kadaluarsa' });
//     }

//     otpRecord.isUsed = true;
//     await otpRecord.save();

//     let user = await User.findOne({ phoneNumber });

//     if (!user) {
//         user = await User.create({ phoneNumber, isVerified: true });
//     } else if (!user.isVerified) {
//         user.isVerified = true;
//         await user.save();
//     }

//     res.json({ success: true, message: 'Verifikasi berhasil', user });
// };
  

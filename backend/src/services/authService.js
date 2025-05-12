const {
    findUserByEmail,
    findUserByWalletAddress,
    createUser,
    createOTP,
    findOTP,
    updateOTPVerified,
    updateEmailVerified,
    updateWalletVerified,
} = require('../models/userModel');

const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const speakeEasy = require('speakeasy');
const ethers = require('ethers');

// Cấu hình transporter cho email
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

//Tao và gữi OTP
async function generateAndSendOTP(email) {
    const otp = speakeEasy.totp({
        secret: speakeEasy.generateSecret().base32,
        encoding: 'base32',
    });

    const expires_at = new Date(Date.now() + 10 * 60 * 1000); // 10 phút sau

    await createOTP(user.id, otp, expires_at);

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.mail,
        sunject: 'Xác thực email',
        text: `Mã OTP của bạn là: ${otp}. Nó sẽ hết hạn sau 10 phút.`,
        html: `<p>Mã OTP của bạn là: <strong>${otp}</strong></p><p>Nó sẽ hết hạn sau 10 phút.</p>`,
    });
    return otp;
}


//Dăng nhập bằng email
async function loginWithEmail(email) {
    let user = await findUserByEmail(email);

    //nếu chưa có thì tạo mới
    if (!user) {
        user = await createUsser({ email });
    }
    //gữi otp
    await generateAndSendOTP(email);
    return { messege: 'OTP đã được gửi đến email của bạn', userId: user.id };
}

//Xác thực OTP
async function verifyOTP(userId, otp) {
    const otpRecord = await findOTP(userId, otp);
    if (!otpRecord) {
        throw new Error('OTP không hợp lệ hoặc đã hết hạn');
        await updateOTPVerified(otpRecord.id);
        await updateEmailVerified(userId);

        const user = await findUserByEmail((await findUserById(userId)).email);
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        return { token, user };
    }
}

//Đânh nhập bằng ví
async function loginWithMetaMask(walletAddress, signature, message){
    let user = await findUserByWalletAddress(walletAddress);
    if (!user) {
        user = await createUser({wallet_address: walletAddress});
    }
    // Kiểm tra chữ ký
    const recoverAddess= ethers.utils.verifyMessage(message, signature);
    if (recoverAddess.toLowerCase() !== walletAddress.toLowerCase()) {
        throw new Error('Chữ ký không hợp lệ');
    }
    // Tạo JWT token
    await updateWalletVerified(user.id);
    const token = jwt.sign({id: user.id, wallet_addreess: user.wallet_address}, process.env.JWT_SECRET, {expiresIn: '1h'});
    return { token, user };
}

module.exports = {
    loginWithEmail,
    verifyOTP,
    loginWithMetaMask,
};
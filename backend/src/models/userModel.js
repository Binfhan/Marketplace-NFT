const db = require('../config/db');

// Hàm lấy người dùng theo email
async function findUserByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
}

// Hàm lấy người dùng theo wallet_address
async function findUserByWalletAddress(walletAddress) {
  const [rows] = await pool.query('SELECT * FROM users WHERE wallet_address = ?', [walletAddress]);
  return rows[0];
}

// Hàm tạo người dùng mới
async function createUser({ email, full_name, phone_number, wallet_address }) {
  const [result] = await pool.query(
    `INSERT INTO users (email, full_name, phone_number, wallet_address, role)
     VALUES (?, ?, ?, ?, 'user')`,
    [email, full_name || null, phone_number || null, wallet_address || null]
  );
  return { id: result.insertId, email, full_name, phone_number, wallet_address, role: 'user' };
}

// Hàm tạo OTP
async function createOTP(user_id, otp_code, expires_at) {
  const [result] = await pool.query(
    `INSERT INTO email_otps (user_id, otp_code, expires_at)
     VALUES (?, ?, ?)`,
    [user_id, otp_code, expires_at]
  );
  return { id: result.insertId, user_id, otp_code, expires_at };
}

// Hàm lấy OTP theo user_id và otp_code
async function findOTP(user_id, otp_code) {
  const [rows] = await pool.query(
    `SELECT * FROM email_otps
     WHERE user_id = ? AND otp_code = ? AND verified = FALSE AND expires_at > NOW()`,
    [user_id, otp_code]
  );
  return rows[0];
}

// Hàm cập nhật trạng thái OTP
async function updateOTPVerified(otp_id) {
  await pool.query('UPDATE email_otps SET verified = TRUE WHERE id = ?', [otp_id]);
}

// Hàm cập nhật trạng thái email_verified
async function updateEmailVerified(user_id) {
  await pool.query('UPDATE users SET is_email_verified = TRUE WHERE id = ?', [user_id]);
}

// Hàm cập nhật trạng thái wallet_verified
async function updateWalletVerified(user_id) {
  await pool.query('UPDATE users SET is_wallet_verified = TRUE WHERE id = ?', [user_id]);
}

module.exports = {
  findUserByEmail,
  findUserByWalletAddress,
  createUser,
  createOTP,
  findOTP,
  updateOTPVerified,
  updateEmailVerified,
  updateWalletVerified,
};

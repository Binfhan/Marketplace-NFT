module.exports = (otp, full_name) => `
    Xin Chào ${full_name},

    Mã OTP của bạn là: ${otp}. Nó sẽ hết hạn vào ${new Date(Date.now() + 10 * 60 * 1000).
        toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}.
    
    Vui lòng không chia sẻ mã này với bất kỳ ai khác.
    Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.
    Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.
    Trân trọng,
    Đội ngũ hỗ trợ khách hàng
    `;

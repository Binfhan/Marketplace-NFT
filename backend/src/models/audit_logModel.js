const pool = require('../config/db');

// Ghi nhật ký log
async function createAuditLog(user_id, action, ip_address, user_agent, meta_data) {
    const [result] = await pool.query(
        `INSERT INTO audit_logs (user_id, action, ip_address, user_agent, meta_data, created_at)
        VALUES (?, ?, ?, ?, ?, NOW())`,
        [user_id, action, ip_address, user_agent, JSON.stringify(meta_data)]
    );
    return { id: result.insertId, user_id, action, ip_address, user_agent, meta_data };
}

module.exports = {
    createAuditLog,
}
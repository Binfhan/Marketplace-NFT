const pool = require('../config/db');

// Ghi lại giao dịch
async function createTransaction(user_id, from_user_id, to_user_id, price, tx_hash) {
    const [result] = await pool.query(
        `INSERT INTO transactions (nft_id, from_user_id, to_user_id, price, tx_hash, timestamp)
        VALUES (?, ?, ?, ?, ?, NOW())`,
        [nft_id, from_user_id, to_user_id, price, tx_hash]
    );
    return { id: result.insertId, nft_id, from_user_id, to_user_id, price, tx_hash };
}

module.exports = { createTransaction };
const pool = require('../config/db');

// Tạo NFT 
async function createNFT(title, description, image_url, meta_data, token_id, contract_address, creator_id, attributes) {
    const [result] = await pool.query(
        `INSERT INTO nfts (title, description, image_url, meta_data, token_id, contract_address, creator_id, attributes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [title, description, image_url, meta_data, token_id, contract_address, creator_id, JSON.stringify(attributes)]
    );
    return {
        id: result.insertId, title, description, image_url, meta_data, token_id, contract_address,
        creator_id, attributes
    };
}

// Lấy NFT theo ID
async function findNFTById(id) {
    const [rows] = await pool.query(
        `SELECT * FROM nfts WHERE ID = ?`, [id]
    );
    return rows[0];
}
//Tạo danh mục 
async function createCategory(name, description) {
    const [result] = await pool.query(
        `INSERT INTO categories (name, description)
         VALUES (?, ?)`,
        [name, description]
    );
    return { id: result.insertId, name, description };
}
// Tạo Tag
async function createTag({ name }) {
    const [result] = await pool.query(
        `INSERT INTO tags (name)
         VALUES (?)`,
        [name]
    );
    return { id: result.insertId, name };
}

//Them danh mục cho NFT
async function addCategoryToNFT(nft_id, category_id) {
    await pool.query(
        `INSERT INTO nft_categories (nft_id, category_id)
        VALUES (?, ?)`,
        [nft_id, category_id]
    );
}
//Thêm tag cho NFT
async function addTagToNFT(nft_id, tag_id) {
    await pool.query(
        `INSERT INTO nft_tag_map(nft_id,  tag_id)
        VALUES (?, ?)`,
        [nft_id, tag_id]
    );
}
//Update quyển sở hữu NFT
async function updateNFTOwner(nft_id, owner_id) {
    const [result] = await pool.query(
        `INSERT INTO nft_owners (nft_id, owner_id, updated_at)
     VALUES (?, ?, NOW())`,
        [nft_id, owner_id]
    );
    return { id: result.insertId, nft_id, owner_id };
}
// Tạo danh sách NFT
async function createListing(nft_id, seller_id, price) {
    const [result] = await pool.query(
        `INSERT INTO listings (nft_id, seller_id, price, is_active)
        VALUES (?, ?, ?, TRUE)`,
        [nft_id, seller_id, price]
    );
    return { id: result.insertID, nft_id, seller_id, price };
}

//Hủy danh sách NFT
async function cancelListing(id) {
    await pool.query(
        `UPDATE listings SET is_active = FALSE WHERE id = ?`,
        [id]
    );
}
//Like NFT
async function likeNFT(nft_id, user_id) {
    const [result] = await pool.query(
        `INSERT INTO nft_likes (nft_id, user_id, liked_at)
        VALUES (?, ?, NOW())`,
        [nft_id, user_id]
    );
    return { id: result.insertId, nft_id, user_id };
}
//Comment NFT
async function commentNFT(nft_id, user_id, content) {
    const [result] = await pool.query(
        `INSERT INTO nft_comments (nft_id, user_id, content, commented_at)
        VALUES (?, ?, ?, NOW())`,
        [nft_id, user_id, content]
    );
    return { id: result.insertId, nft_id, user_id, content };
}


module.exports = {
    createNFT,
    findNFTById,
    createCategory,
    createTag,
    addCategoryToNFT,
    addTagToNFT,
    updateNFTOwner,
    createListing,
    cancelListing,
    likeNFT,
    commentNFT,
};

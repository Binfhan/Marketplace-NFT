const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, createUser, updateUser, deleteUser } = require('../controllers/userController');
const { restrictTo } = require('../middlewares/authMiddleware');
const { loginWithEmail, verifyOTP } = require('../services/authService');

router.post('/login/email', async (req, res) => {
    try {
        const { email } = req.body;
        const result = await loginWithEmail(email);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: 'Internal server error', error: error.message });
    }
});

router.post('/login/wallet', async (req, res) => {
    try {
        const { walletAddress, signature, message } = req.body;
        const result = await loginWithMetaMask(walletAddress, signature, message);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: 'Internal server error', error: error.message });
    }
});

router.post('/login/otp', async (req, res) => {
    try {
        const { userId, otp } = req.body;
        const result = await verifyOTP(userId, otp);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: 'Internal server error', error: error.message });
    }
});

router.get('/user-profile', restrictTo('user'), async (req, res) => {
    res.json({ message: 'User profile', user: req.user });
});

router.get('/admin-dashboard', restrictTo('admin'), async (req, res) => {
    res.json({ message: 'Admin dashboard', user: req.user });
});

router.get('/generate-info', restrictTo('user', 'admin'), async (req, res) => {
    res.json({ message: 'Generate info', user: req.user });
});

module.exports = router;

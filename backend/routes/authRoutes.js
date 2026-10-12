// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login, getUserProfile } = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

// Public Routes (မည်သူမဆို ဝင်ခွင့်ရှိသည်)
router.post('/register', register);
router.post('/login', login);

// Protected Route (Token ရှိမှသာ ဝင်ခွင့်ပြုမည်)
router.get('/profile', verifyToken, getUserProfile);

module.exports = router;
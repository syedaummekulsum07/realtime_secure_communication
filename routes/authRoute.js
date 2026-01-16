const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware'); 
const { signup, verifyOtp, signin, refresh, logout } = require('../controller/authController');
const router = express.Router();

router.post('/signup', signup);
router.post('/verify', verifyOtp);
router.post('/signin', signin);

router.use(authenticateToken);  
router.post('/refresh', refresh);
router.post('/logout', logout);

module.exports = router;

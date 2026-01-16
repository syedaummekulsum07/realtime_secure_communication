require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/userModel');
const redisClient = require('../config/redis');
const crypto = require('crypto');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.NODEMAILER_EMAIL, pass: process.env.NODEMAILER_PASS }
});

exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPw = await bcrypt.hash(password, 12);
    const user = new User({ email, password: hashedPw });
    await user.save();

    const otp = crypto.randomBytes(3).toString('hex');
    await redisClient.setEx(`otp:${email}`, 300, otp);
    await transporter.sendMail({
      to: email,
      subject: 'Your OTP',
      text: `Your OTP is ${otp}`
    });
    res.status(201).json({ message: 'User created, OTP sent' });
  } catch (err) { res.status(400).json({ error: err.message }); }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const storedOtp = await redisClient.get(`otp:${email}`);
    if (storedOtp !== otp) return res.status(400).json({ error: 'Invalid OTP' });
    
    await User.updateOne({ email }, { status: 'Verified' });
    await redisClient.del(`otp:${email}`);
    res.json({ message: 'Verified' });
  } catch (err) { res.status(400).json({ error: err.message }); }
};

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if(!user) return res.status(404).json({messgae:"User not found, proceed to signup"})
    if (user.status !== 'Verified') return res.status(403).json({ error: 'Unverified' });
    if (!await bcrypt.compare(password, user.password)) return res.status(401).json({ error: 'Invalid credentials' });

    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_SECRET, { expiresIn: '7d' });
    const jti = crypto.randomBytes(16).toString('hex');
    await redisClient.setEx(`refresh:${jti}`, 7*24*60*60, refreshToken);
    
    res.json({ accessToken, refreshToken, jti });
  } catch (err) { res.status(400).json({ error: err.message }); }
};

exports.refresh = async (req, res) => {
  const { refreshToken, jti } = req.body;
  const stored = await redisClient.get(`refresh:${jti}`);
  if (stored !== refreshToken) return res.status(403).json({ error: 'Invalid refresh' });
  
  const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
  const newAccess = jwt.sign({ userId: decoded.userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
  res.json({ accessToken: newAccess });
};

exports.logout = async (req, res) => {
  const { jti } = req.body;
  await redisClient.del(`refresh:${jti}`);
  res.json({ message: 'Logged out' });
};

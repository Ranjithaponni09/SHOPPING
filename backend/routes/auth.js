const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');

const JWT_SECRET = process.env.JWT_SECRET || 'verysecret_jwt_key_here';
const REFRESH_TOKEN_EXP_DAYS = 30;

function signAccessToken(payload){
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
}
function generateRefreshToken(){
  return crypto.randomBytes(40).toString('hex');
}

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if(!name || !email || !password) return res.status(400).json({ msg: 'Missing fields' });
    const existing = await User.findOne({ email });
    if(existing) return res.status(400).json({ msg: 'User exists' });
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const user = new User({ name, email, passwordHash, role: role || 'user' });
    await user.save();
    res.json({ msg: 'User created' });
  } catch(err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if(!email || !password) return res.status(400).json({ msg: 'Missing fields' });
    const user = await User.findOne({ email });
    if(!user) return res.status(400).json({ msg: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if(!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = { id: user._id, name: user.name, email: user.email, role: user.role };
    const accessToken = signAccessToken(payload);

    const tokenString = generateRefreshToken();
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXP_DAYS * 24 * 3600 * 1000);
    await RefreshToken.create({ token: tokenString, userId: user._id, expiresAt });

    res.json({ accessToken, refreshToken: tokenString, user: payload });
  } catch(err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Refresh
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if(!refreshToken) return res.status(400).json({ msg: 'Missing refresh token' });

    const stored = await RefreshToken.findOne({ token: refreshToken });
    if(!stored) return res.status(401).json({ msg: 'Invalid refresh token' });
    if(stored.expiresAt < new Date()) {
      await stored.deleteOne();
      return res.status(401).json({ msg: 'Refresh token expired' });
    }

    const user = await User.findById(stored.userId);
    if(!user) return res.status(401).json({ msg: 'Invalid token owner' });

    const payload = { id: user._id, name: user.name, email: user.email, role: user.role };
    const newAccessToken = signAccessToken(payload);

    // rotate refresh token
    const newRefresh = generateRefreshToken();
    stored.token = newRefresh;
    stored.expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXP_DAYS * 24 * 3600 * 1000);
    await stored.save();

    res.json({ accessToken: newAccessToken, refreshToken: newRefresh, user: payload });
  } catch(err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Logout
router.post('/logout', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if(refreshToken) await RefreshToken.deleteOne({ token: refreshToken });
    res.json({ msg: 'Logged out' });
  } catch(e) {
    console.error(e);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Me
const auth = require('../middleware/auth');
router.get('/me', auth, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;

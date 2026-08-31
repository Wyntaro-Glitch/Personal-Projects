const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        error: 'Username or email already exists' 
      });
    }

    // Create user
    const user = new User({ username, email, password });
    await user.save();

    res.status(201).json({ 
      message: 'User created successfully',
      userId: user._id
    });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// POST /api/auth/guest
router.post('/guest', async (req, res) => {
  try {
    const { displayName } = req.body;
    console.log('Guest request:', displayName);

    if (!displayName || displayName.trim().length < 2) {
      return res.status(400).json({ error: 'Name must be at least 2 characters' });
    }

    // Create guest user in database
    const guestUser = new User({
      username: `guest_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      isGuest: true
    });
    console.log('Saving guest user...');
    await guestUser.save();
    console.log('Guest user saved:', guestUser._id);

    // Generate JWT for guest
    const token = jwt.sign(
      { userId: guestUser._id, username: displayName.trim(), isGuest: true },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      userId: guestUser._id,
      username: displayName.trim(),
      isGuest: true
    });
  } catch (err) {
    console.error('Guest error:', err.message);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      userId: user._id,
      username: user.username
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// GET /api/auth/me
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Handle guest users
    if (decoded.isGuest) {
      return res.json({
        _id: decoded.userId,
        username: decoded.username,
        isGuest: true
      });
    }

    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;

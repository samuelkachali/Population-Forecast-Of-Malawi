const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();

// Signup Route
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Please provide all required fields.' });
  }
  // Strong validation
  const strongPw = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(password);
  const validEmail = /^[^@\s]+@[^@\s]+\.[a-zA-Z]{2,}$/.test(email);
  const validName = /^[A-Za-z][A-Za-z\s\.'-]+$/.test(username) && username.trim().split(/\s+/).length >= 2 && !/\d/.test(username);
  if (!validName) {
    return res.status(400).json({ message: 'Please enter your full name (at least two words, no numbers).' });
  }
  if (!validEmail) {
    return res.status(400).json({ message: 'Please enter a valid email address.' });
  }
  if (!strongPw) {
    return res.status(400).json({ message: 'Password must be at least 8 characters, include uppercase, lowercase, number, and special character.' });
  }

  try {
    // Check if any users exist to determine role
    const existingUsers = await db.query('SELECT id FROM users LIMIT 1');
    const role = existingUsers.rows.length === 0 ? 'admin' : 'user';

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const result = await db.query(
      'INSERT INTO users (username, email, password_hash, role, last_login) VALUES ($1, $2, $3, $4, NOW()) RETURNING id, username, email, role',
      [username, email, password_hash, role]
    );

    const user = result.rows[0];

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(201).json({ token, user });
  } catch (error) {
    console.error(error);
    if (error.code === '23505') { // Unique constraint violation
      return res.status(409).json({ message: 'Username or email already exists.' });
    }
    res.status(500).json({ message: 'Server error during signup.' });
  }
});

// Signin Route
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password.' });
  }

  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Prevent login if user is deactivated
    if (user.status && user.status.toLowerCase() === 'inactive') {
      return res.status(403).json({ message: 'Your account has been deactivated. Please contact an administrator.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Update the last_login timestamp and get the updated user
    const updatedUserResult = await db.query(
      'UPDATE users SET last_login = NOW() WHERE id = $1 RETURNING id, username, email, role, last_login',
      [user.id]
    );
    const updatedUser = updatedUserResult.rows[0];

    const token = jwt.sign({ id: updatedUser.id, role: updatedUser.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    
    res.status(200).json({ token, user: updatedUser });
  } catch (error) {
    console.error('Server error during signin:', error);
    res.status(500).json({ message: 'Server error during signin.', detail: error.message });
  }
});

module.exports = router; 
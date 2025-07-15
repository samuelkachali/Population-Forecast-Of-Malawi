const express = require('express');
const router = express.Router();
const cors = require('cors');
const db = require('../db');
const { protect, admin } = require('../middleware/auth');
const bcrypt = require('bcryptjs');

// Handle CORS preflight for all /api/users endpoints
router.options('/', cors());
router.options('/:id', cors());
router.options('/:id/make-admin', cors());

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const { rows } = await db.query('SELECT id, username, email, role, created_at, last_login FROM users ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
});

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  const userIdToDelete = req.params.id;
  const requestingUserId = req.user.id;

  // Prevent admin from deleting themselves
  if (userIdToDelete == requestingUserId) {
    return res.status(400).json({ message: 'You cannot delete your own account.' });
  }

  // Prevent the first admin (user with id 1) from being deleted
  if (userIdToDelete == 1) {
    return res.status(403).json({ message: 'The primary admin account cannot be deleted.' });
  }

  try {
    const deleteResult = await db.query('DELETE FROM users WHERE id = $1 RETURNING id', [userIdToDelete]);
    if (deleteResult.rowCount === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error deleting user.' });
  }
});

// @desc    Promote a user to admin
// @route   PUT /api/users/:id/make-admin
// @access  Private/Admin
router.put('/:id/make-admin', protect, admin, async (req, res) => {
  try {
    const result = await db.query(
      "UPDATE users SET role = 'admin' WHERE id = $1 AND role = 'user' RETURNING id, username, role",
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found or is already an admin.' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error promoting user:', error);
    res.status(500).json({ message: 'Server error promoting user.' });
  }
});

// Change password endpoint
router.post('/change-password', protect, async (req, res) => {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Current and new password are required.' });
  }
  // Enforce strong password
  const strongPw = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(newPassword);
  if (!strongPw) {
    return res.status(400).json({ message: 'Password must be at least 8 characters, include uppercase, lowercase, number, and special character.' });
  }
  try {
    const result = await db.query('SELECT password_hash FROM users WHERE id = $1', [userId]);
    if (!result.rows.length) {
      return res.status(404).json({ message: 'User not found.' });
    }
    const user = result.rows[0];
    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect.' });
    }
    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newPassword, salt);
    await db.query('UPDATE users SET password_hash = $1 WHERE id = $2', [newHash, userId]);
    res.json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Server error changing password.' });
  }
});

// Get current user profile
router.get('/profile', protect, async (req, res) => {
  try {
    const result = await db.query('SELECT id, username, email, role, created_at, last_login FROM users WHERE id = $1', [req.user.id]);
    if (!result.rows.length) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching profile.' });
  }
});

// Update current user profile
router.patch('/profile', protect, async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let updateFields = [];
    let values = [];
    let idx = 1;
    if (name) { updateFields.push(`username = $${idx++}`); values.push(name); }
    if (email) { updateFields.push(`email = $${idx++}`); values.push(email); }
    if (password) {
      // Enforce strong password
      const strongPw = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(password);
      if (!strongPw) {
        return res.status(400).json({ message: 'Password must be at least 8 characters, include uppercase, lowercase, number, and special character.' });
      }
      const bcrypt = require('bcryptjs');
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(password, salt);
      updateFields.push(`password_hash = $${idx++}`);
      values.push(password_hash);
    }
    if (updateFields.length === 0) {
      return res.status(400).json({ message: 'No fields to update.' });
    }
    values.push(req.user.id);
    const updateQuery = `UPDATE users SET ${updateFields.join(', ')} WHERE id = $${idx} RETURNING id, username, email, role, last_login`;
    const result = await db.query(updateQuery, values);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating profile.' });
  }
});

// Delete current user
router.delete('/profile', protect, async (req, res) => {
  try {
    await db.query('DELETE FROM users WHERE id = $1', [req.user.id]);
    res.json({ message: 'Account deleted.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting account.' });
  }
});

module.exports = router; 
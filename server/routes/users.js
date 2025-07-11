const express = require('express');
const router = express.Router();
const cors = require('cors');
const db = require('../db');
const { protect, admin } = require('../middleware/auth');

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

module.exports = router; 
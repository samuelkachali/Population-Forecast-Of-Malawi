const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { protect } = require('../middleware/auth');

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
      return res.status(403).json({ message: 'Your account has been deactivated. Please recreate your account to continue.' });
    }

    // Migration enforcement for legacy accounts (no supabase_id)
    // Uses migration_deadline column to enforce a short cutoff.
    if (!user.supabase_id) {
      try {
        if (user.migration_deadline) {
          const deadline = new Date(user.migration_deadline).getTime();
          if (!Number.isNaN(deadline) && Date.now() > deadline) {
            const originalEmail = user.email || '';
            const atIndex = originalEmail.indexOf('@');
            const local = atIndex > -1 ? originalEmail.slice(0, atIndex) : originalEmail;
            const domain = atIndex > -1 ? originalEmail.slice(atIndex + 1) : 'example.com';
            const safeLocal = (local || 'user').replace(/[^a-zA-Z0-9._+-]/g, '');
            const freedEmail = `${safeLocal}+deactivated-${user.id}-${Date.now()}@${domain}`;

            try {
              await db.query(
                "UPDATE users SET status = 'Inactive', migration_completed = TRUE, email = $2, supabase_id = NULL WHERE id = $1",
                [user.id, freedEmail]
              );
            } catch (e) {
              await db.query(
                "UPDATE users SET status = 'Inactive', email = $2, supabase_id = NULL WHERE id = $1",
                [user.id, freedEmail]
              );
            }

            return res.status(403).json({ message: 'Your account has been deactivated. Please recreate your account to continue.' });
          }
        } else {
          await db.query(
            "UPDATE users SET migration_deadline = NOW() + INTERVAL '30 seconds' WHERE id = $1",
            [user.id]
          );
        }
      } catch (e) {
        // ignore if migration_deadline column doesn't exist
      }
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Update the last_login timestamp and get the updated user
    const updatedUserResult = await db.query(
      'UPDATE users SET last_login = NOW() WHERE id = $1 RETURNING id, username, email, role, last_login, supabase_id, status, migration_deadline',
      [user.id]
    );
    const updatedUser = updatedUserResult.rows[0];

    // Migration notice for legacy accounts (no supabase_id)
    let migration = null;
    if (!updatedUser.supabase_id) {
      const deadlineIso = updatedUser.migration_deadline
        ? new Date(updatedUser.migration_deadline).toISOString()
        : new Date(Date.now() + 30 * 1000).toISOString();
      migration = {
        required: true,
        deadline: deadlineIso,
        message: 'Action required: Please recreate your account to verify your email. Legacy accounts will be deactivated in 30 seconds.',
      };

      // Best-effort persistence if you added a migration_deadline column.
      // If the column does not exist, this will fail silently and the countdown will be client-only.
      try {
        await db.query(
          "UPDATE users SET migration_deadline = COALESCE(migration_deadline, NOW() + INTERVAL '30 seconds') WHERE id = $1",
          [updatedUser.id]
        );
      } catch (e) {
        // ignore
      }
    }

    const token = jwt.sign({ id: updatedUser.id, role: updatedUser.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    
    res.status(200).json({ token, user: updatedUser, migration });
  } catch (error) {
    console.error('Server error during signin:', error);
    res.status(500).json({ message: 'Server error during signin.', detail: error.message });
  }
});

// Supabase Auth sync route
// Called by frontend after Supabase login to link/create the Neon user.
// Requires: Authorization: Bearer <supabase_access_token>
router.post('/supabase-sync', protect, async (req, res) => {
  try {
    if (!req.user || !req.user.supabase_id || !req.user.email) {
      return res.status(400).json({ message: 'Missing Supabase identity on request.' });
    }

    // If middleware already mapped to a Neon row, just return it.
    if (req.user.id) {
      // Migration notice after Supabase login (forced migration UX)
      // If you want this behavior only for certain cohorts, adjust this logic.
      let migration = null;

      // Read user row + determine if migration modal should be shown
      let userRow;
      try {
        const { rows } = await db.query(
          'SELECT id, username, email, role, last_login, supabase_id, status, migration_deadline, migration_completed FROM users WHERE id = $1',
          [req.user.id]
        );
        userRow = rows[0];
      } catch (e) {
        const { rows } = await db.query(
          'SELECT id, username, email, role, last_login, supabase_id, status, migration_deadline FROM users WHERE id = $1',
          [req.user.id]
        );
        userRow = rows[0];
      }

      const migrationCompleted = Boolean(userRow && userRow.migration_completed);

      if (!migrationCompleted) {
        try {
          await db.query(
            "UPDATE users SET migration_deadline = COALESCE(migration_deadline, NOW() + INTERVAL '30 seconds') WHERE id = $1",
            [req.user.id]
          );
        } catch (e) {
          // ignore if migration_deadline column doesn't exist
        }

        const d = userRow && userRow.migration_deadline
          ? new Date(userRow.migration_deadline)
          : new Date(Date.now() + 30 * 1000);
        if (d && !Number.isNaN(d.getTime())) {
          migration = {
            required: true,
            deadline: d.toISOString(),
            message: 'Action required: Please recreate your account to verify your email. This account will be deactivated in 30 seconds.',
          };
        }
      }

      return res.json({ user: userRow, migration });
    }

    // Create a new Neon user for Supabase-authenticated user
    const username = (req.body && typeof req.body.username === 'string' && req.body.username.trim())
      ? req.body.username.trim()
      : (req.user.email.split('@')[0] || 'user');

    const existingUsers = await db.query('SELECT id FROM users LIMIT 1');
    const role = existingUsers.rows.length === 0 ? 'admin' : 'user';

    // Create a random password hash to satisfy schemas that require password_hash
    const randomPassword = `${req.user.supabase_id}-${Date.now()}-${Math.random()}`;
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(randomPassword, salt);

    const result = await db.query(
      'INSERT INTO users (username, email, password_hash, role, last_login, supabase_id) VALUES ($1, $2, $3, $4, NOW(), $5) RETURNING id, username, email, role, last_login, supabase_id, status',
      [username, req.user.email, password_hash, role, req.user.supabase_id]
    );

    // New Supabase-created users should not see the forced migration modal
    try {
      await db.query('UPDATE users SET migration_completed = TRUE WHERE id = $1', [result.rows[0].id]);
    } catch (e) {
      // ignore if column does not exist
    }

    return res.status(201).json({ user: result.rows[0], migration: null });
  } catch (error) {
    console.error('Server error during supabase-sync:', error);
    return res.status(500).json({ message: 'Server error during supabase-sync.', detail: error.message });
  }
});

// Deactivate the currently authenticated account (Supabase or legacy JWT)
// Requires Authorization: Bearer <token>
router.post('/deactivate-account', protect, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { rows } = await db.query('SELECT id, email FROM users WHERE id = $1', [req.user.id]);
    const existing = rows[0];
    if (!existing) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const originalEmail = existing.email || '';
    const atIndex = originalEmail.indexOf('@');
    const local = atIndex > -1 ? originalEmail.slice(0, atIndex) : originalEmail;
    const domain = atIndex > -1 ? originalEmail.slice(atIndex + 1) : 'example.com';
    const safeLocal = (local || 'user').replace(/[^a-zA-Z0-9._+-]/g, '');
    const freedEmail = `${safeLocal}+deactivated-${existing.id}-${Date.now()}@${domain}`;

    let result;
    try {
      result = await db.query(
        "UPDATE users SET status = 'Inactive', migration_completed = TRUE, email = $2, supabase_id = NULL WHERE id = $1 RETURNING id, status",
        [req.user.id, freedEmail]
      );
    } catch (e) {
      // Fallback if migration_completed column doesn't exist yet
      result = await db.query(
        "UPDATE users SET status = 'Inactive', email = $2, supabase_id = NULL WHERE id = $1 RETURNING id, status",
        [req.user.id, freedEmail]
      );
    }

    if (!result.rowCount) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.json({ message: 'Account deactivated.', user: result.rows[0] });
  } catch (error) {
    console.error('Server error during deactivate-account:', error);
    return res.status(500).json({ message: 'Server error during deactivate-account.', detail: error.message });
  }
});

// Deactivate legacy account immediately
// Requires Authorization: Bearer <token>
router.post('/deactivate-legacy', protect, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { rows } = await db.query(
      'SELECT id, email FROM users WHERE id = $1 AND supabase_id IS NULL',
      [req.user.id]
    );
    const existing = rows[0];
    if (!existing) {
      return res.status(404).json({ message: 'Legacy user not found or already linked.' });
    }

    const originalEmail = existing.email || '';
    const atIndex = originalEmail.indexOf('@');
    const local = atIndex > -1 ? originalEmail.slice(0, atIndex) : originalEmail;
    const domain = atIndex > -1 ? originalEmail.slice(atIndex + 1) : 'example.com';
    const safeLocal = (local || 'user').replace(/[^a-zA-Z0-9._+-]/g, '');
    const freedEmail = `${safeLocal}+deactivated-${existing.id}-${Date.now()}@${domain}`;

    let result;
    try {
      result = await db.query(
        "UPDATE users SET status = 'Inactive', migration_completed = TRUE, email = $2, supabase_id = NULL WHERE id = $1 AND supabase_id IS NULL RETURNING id, status",
        [req.user.id, freedEmail]
      );
    } catch (e) {
      result = await db.query(
        "UPDATE users SET status = 'Inactive', email = $2, supabase_id = NULL WHERE id = $1 AND supabase_id IS NULL RETURNING id, status",
        [req.user.id, freedEmail]
      );
    }

    if (!result.rowCount) {
      return res.status(404).json({ message: 'Legacy user not found or already linked.' });
    }

    return res.json({ message: 'Account deactivated.', user: result.rows[0] });
  } catch (error) {
    console.error('Server error during deactivate-legacy:', error);
    return res.status(500).json({ message: 'Server error during deactivate-legacy.', detail: error.message });
  }
});

module.exports = router;
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');
const db = require('../db');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false } })
  : null;

const tryVerifyCustomJwt = (token) => {
  if (!process.env.JWT_SECRET) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
};

const tryVerifySupabaseToken = async (token) => {
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data || !data.user) return null;

  const user = data.user;

  // Map Supabase user -> Neon user (keep existing integer ids intact)
  try {
    const email = user.email;
    const supabaseId = user.id;
    const { rows } = await db.query(
      'SELECT id, role, status, supabase_id FROM users WHERE supabase_id = $1 OR email = $2 LIMIT 1',
      [supabaseId, email]
    );
    const neonUser = rows[0];

    if (neonUser) {
      // If matched by email but not linked yet, link it now
      if (!neonUser.supabase_id) {
        await db.query('UPDATE users SET supabase_id = $1 WHERE id = $2', [supabaseId, neonUser.id]);
      }
      return {
        id: neonUser.id,
        role: neonUser.role,
        email,
        supabase_id: supabaseId,
        status: neonUser.status,
      };
    }

    // If no Neon user exists yet, allow middleware to pass Supabase identity through.
    // You can create/link a Neon row in a dedicated endpoint.
    return {
      id: null,
      role: user.app_metadata?.role || user.user_metadata?.role,
      email,
      supabase_id: supabaseId,
    };
  } catch (e) {
    console.error('Supabase token verified but Neon lookup failed:', e);
    return {
      id: null,
      role: user.app_metadata?.role || user.user_metadata?.role,
      email: user.email,
      supabase_id: user.id,
    };
  }
};

const protect = async (req, res, next) => {
  if (req.method === 'OPTIONS') return next();
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      // 1) Try existing custom JWT first (backwards compatibility)
      const decodedCustom = tryVerifyCustomJwt(token);
      if (decodedCustom) {
        req.user = decodedCustom; // { id, role }
        return next();
      }

      // 2) Try Supabase access token
      const decodedSupabase = await tryVerifySupabaseToken(token);
      if (decodedSupabase) {
        req.user = decodedSupabase; // { id, role?, email? }
        return next();
      }

      return res.status(401).json({ message: 'Not authorized, token failed' });
    } catch (error) {
      console.error('Token verification failed:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const admin = (req, res, next) => {
  if (req.method === 'OPTIONS') return next();
  if (req.user && typeof req.user.role === 'string' && req.user.role.trim().toLowerCase() === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

module.exports = { protect, admin };
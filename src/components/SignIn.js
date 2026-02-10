import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  Link,
  Card,
  CardContent,
  Avatar,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { Fade } from '@mui/material';
import { useUser } from '../contexts/UserContext';
import { supabase } from '../supabaseClient';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [migration, setMigration] = useState(null);
  const [migrationDialogOpen, setMigrationDialogOpen] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(null);
  const deactivateStartedRef = useRef(false);
  const navigate = useNavigate();
  const { setUser } = useUser();

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://population-forecast-of-malawi.onrender.com";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1) Try Supabase login (verified users)
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!signInError) {
        const supaUser = signInData?.user;
        const accessToken = signInData?.session?.access_token;

        if (!accessToken) {
          setError('Sign-in failed: missing session. Please verify your email and try again.');
          return;
        }

        if (supaUser && supaUser.email_confirmed_at == null) {
          await supabase.auth.signOut();
          setError('Please verify your email before signing in. Check your inbox/spam.');
          return;
        }

        const syncRes = await fetch(`${API_BASE_URL}/api/auth/supabase-sync`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (!syncRes.ok) {
          const syncText = await syncRes.text();
          throw new Error(syncText || 'Failed to sync user with backend.');
        }

        const syncData = await syncRes.json();

        localStorage.setItem('token', accessToken);
        localStorage.setItem('user', JSON.stringify(syncData.user));
        setUser(syncData.user);

        if (syncData.migration && syncData.migration.required) {
          setMigration(syncData.migration);
          setMigrationDialogOpen(true);
          deactivateStartedRef.current = false;
        } else {
          navigate('/dashboard');
        }

        return;
      }

      // 2) Supabase failed - fall back to legacy Neon password auth
      // If the user hasn't recreated their account in Supabase yet, this enables a one-time login.
      if (signInError && signInError.name === 'AuthApiError') {
        const response = await fetch(`${API_BASE_URL}/api/auth/signin`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (response.ok) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          setUser(data.user);

          const migrationPayload = (data.migration && data.migration.required)
            ? data.migration
            : {
              required: true,
              deadline: new Date(Date.now() + 30 * 1000).toISOString(),
              message: 'Action required: Please recreate your account to verify your email. This account will be deactivated in 30 seconds.',
            };

          setMigration(migrationPayload);
          setMigrationDialogOpen(true);
          deactivateStartedRef.current = false;
        } else {
          const errorMessage = data.detail
            ? `${data.message} - ${data.detail}`
            : data.message || 'Invalid email or password.';
          setError(errorMessage);
        }

        return;
      }

      throw signInError;
    } catch (err) {
      console.error('SignIn: Error during sign-in:', err);
      const message = err?.message || 'Failed to sign in. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!migrationDialogOpen || !migration?.deadline) {
      setSecondsLeft(null);
      return;
    }

    const calc = () => {
      const ms = new Date(migration.deadline).getTime() - Date.now();
      const s = Math.max(0, Math.ceil(ms / 1000));
      setSecondsLeft(s);
      return s;
    };

    calc();
    const t = setInterval(() => {
      const s = calc();
      if (s <= 0) {
        clearInterval(t);
      }
    }, 500);

    return () => clearInterval(t);
  }, [migrationDialogOpen, migration?.deadline]);

  useEffect(() => {
    const doDeactivate = async () => {
      if (deactivateStartedRef.current) return;
      deactivateStartedRef.current = true;

      try {
        const token = localStorage.getItem('token');
        if (token) {
          await fetch(`${API_BASE_URL}/api/auth/deactivate-account`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
        }
      } catch (e) {
        // ignore
      } finally {
        try {
          await supabase.auth.signOut();
        } catch {
          // ignore
        }
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setMigrationDialogOpen(false);
        navigate('/signup', { state: { verificationSent: true } });
      }
    };

    if (migrationDialogOpen && secondsLeft === 0) {
      doDeactivate();
    }
  }, [migrationDialogOpen, secondsLeft, API_BASE_URL, navigate, setUser]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(120deg, #e8f5e9 0%, #f5f7fa 100%)',
        px: { xs: 2, sm: 3, md: 4 }, // horizontal padding only
      }}
    >
      <Fade in timeout={1000}>
        <Card
          sx={{
            maxWidth: 380,
            minHeight: 420,
            maxHeight: 540,
            borderRadius: { xs: 3, md: 5 },
            background: '#fff',
            boxShadow: '0 4px 24px 0 rgba(33,150,243,0.10)',
            border: '1px solid #e0e0e0',
            p: 1.5,
            pt: 1,
            pb: 1,
            mx: 'auto',
          }}
        >
          <CardContent sx={{ p: { xs: 1, md: 2 } }}>
            <Box sx={{ textAlign: 'center', mb: { xs: 2, md: 3 } }}>
              <Avatar
                sx={{
                  width: { xs: 60, md: 80 },
                  height: { xs: 60, md: 80 },
                  mx: 'auto',
                  mb: 2,
                  background: 'linear-gradient(135deg, #257a5a 60%, #f88070 100%)',
                  boxShadow: '0 2px 8px rgba(33,150,243,0.10)',
                }}
              >
                <LockIcon sx={{ fontSize: { xs: 30, md: 40 } }} />
              </Avatar>
              <Typography
                variant="h4"
                fontWeight={800}
                sx={{
                  color: '#257a5a',
                  mb: 1,
                  fontSize: { xs: '1.25rem', sm: '1.45rem', md: '1.7rem' },
                }}
              >
                Sign In
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: '#666',
                  fontSize: { xs: '0.85rem', md: '0.98rem' },
                }}
              >
                Sign in to access the Population Forecast Dashboard
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
                size="small"
                sx={{ mb: { xs: 1.5, md: 2 } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
                size="small"
                sx={{ mb: { xs: 1.5, md: 2 } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    color="primary"
                  />
                }
                label="Remember me"
                sx={{ mb: 1 }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 1,
                  mb: 1.5,
                  fontWeight: 700,
                  background: 'linear-gradient(90deg, #257a5a 60%, #f88070 100%)',
                  color: '#fff',
                  boxShadow: '0 2px 8px rgba(33,150,243,0.10)',
                  borderRadius: 3,
                  fontSize: '1.1rem',
                  transition: 'background 0.3s',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #257a5a 60%, #f88070 100%)',
                    opacity: 0.95,
                  },
                }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Sign In'}
              </Button>

              {error && (
                <Alert severity="error" sx={{ mb: { xs: 1.5, md: 2 } }}>
                  {error}
                </Alert>
              )}

              <Box sx={{ textAlign: 'center' }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
                >
                  Don't have an account?{' '}
                  <Link
                    component={RouterLink}
                    to="/signup"
                    sx={{
                      color: '#667eea',
                      textDecoration: 'none',
                      fontWeight: 600,
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Sign up
                  </Link>
                </Typography>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Fade>

      <Dialog
        open={migrationDialogOpen}
        onClose={() => {
          setMigrationDialogOpen(false);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Action Required: Recreate Your Account</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {migration?.message || 'Please recreate your account to verify your email.'}
          </Typography>
          {migration?.deadline && (
            <Typography variant="body2" color="text.secondary">
              Deactivation deadline: {new Date(migration.deadline).toLocaleString()}
            </Typography>
          )}
          {typeof secondsLeft === 'number' && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              This account will be deactivated in {secondsLeft}s.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => {
              setMigrationDialogOpen(false);
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              setUser(null);
              navigate('/signup', { state: { verificationSent: true } });
            }}
          >
            Create New Account
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SignIn;

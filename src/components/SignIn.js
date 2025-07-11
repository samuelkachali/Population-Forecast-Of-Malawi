import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CssBaseline,
  Alert,
  useMediaQuery,
  useTheme,
  InputAdornment,
  IconButton,
  Link,
  Divider,
  Card,
  CardContent,
  Avatar,
  FormControlLabel,
  Checkbox,
  CircularProgress
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { Fade } from '@mui/material';
import { useUser } from '../contexts/UserContext';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { setUser } = useUser();

  // Use relative path for API calls to leverage proxy
  const API_BASE_URL = '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/auth/signin`, {
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
        navigate('/dashboard');
      } else {
        const errorMessage = data.detail
          ? `${data.message} - ${data.detail}`
          : data.message || 'Invalid email or password.';
        setError(errorMessage);
      }
    } catch (err) {
      console.error('SignIn: Error during sign-in:', err);
      setError('Failed to connect to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
    </Box>
  );
};

export default SignIn;

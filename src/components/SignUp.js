import React, { useState } from 'react';
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
  Fade
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
  Person,
  PersonAdd
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const navigate = useNavigate();

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://population-forecast-of-malawi.onrender.com";

  const validateStrongPassword = (pw) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(pw);
  const validateEmail = (email) => /^[^@\s]+@[^@\s]+\.[a-zA-Z]{2,}$/.test(email);
  const validateName = (name) => /^[A-Za-z][A-Za-z\s\.'-]+$/.test(name) && name.trim().split(/\s+/).length >= 2 && !/\d/.test(name);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateName(username)) {
      setError('Please enter your full name (at least two words, no numbers).');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!validateStrongPassword(password)) {
      setError('Password must be at least 8 characters, include uppercase, lowercase, number, and special character.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!agreeToTerms) {
      setError('You must agree to the terms and conditions.');
      return;
    }
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/signin');
      } else {
        setError(data.message || 'An error occurred during sign up.');
      }
    } catch (err) {
      setError('Failed to connect to the server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(120deg, #e8f5e9 0%, #f5f7fa 100%)',
        px: 2,
      }}
    >
      <Fade in timeout={800}>
        <Card
          sx={{
            width: '100%',
            maxWidth: 360,
            borderRadius: 4,
            background: '#fff',
            boxShadow: '0 4px 18px rgba(0,0,0,0.08)',
            border: '1px solid #e0e0e0',
            px: 3,
            py: 4,
          }}
        >
          <CardContent>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  mx: 'auto',
                  mb: 2,
                  background: 'linear-gradient(135deg, #257a5a 60%, #f88070 100%)',
                  boxShadow: '0 2px 8px rgba(33,150,243,0.10)'
                }}
              >
                <PersonAdd sx={{ fontSize: 28 }} />
              </Avatar>
              <Typography variant="h5" fontWeight={700} color="#257a5a" mb={0.5}>
                Create Account
              </Typography>
              <Typography variant="body2" color="#666">
                Join the Population Forecast Dashboard
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Full Name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                margin="normal"
                required
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
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
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                margin="normal"
                required
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    color="primary"
                  />
                }
                label="I agree to the terms and conditions"
                sx={{ mt: 1, mb: 2 }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading || !agreeToTerms}
                sx={{
                  py: 1.2,
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #5a6fd8, #6a4190)',
                  },
                  mb: 2
                }}
              >
                {isLoading ? <CircularProgress size={22} /> : 'Sign Up'}
              </Button>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{' '}
                  <Link
                    component={RouterLink}
                    to="/signin"
                    sx={{
                      color: '#667eea',
                      textDecoration: 'none',
                      fontWeight: 600,
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Sign in
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

export default SignUp;

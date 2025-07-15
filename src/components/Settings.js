import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, TextField, Button, Switch, FormControlLabel, Divider, Fade, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate } from 'react-router-dom';
import { useThemeContext } from '../contexts/ThemeContext';

const Settings = ({ user, setUser }) => {
  const [profile, setProfile] = useState(user || { name: '', email: '' });
  const [theme, setTheme] = useState(user?.theme || 'light');
  const [notifications, setNotifications] = useState(user?.notifications ?? true);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordChangeLoading, setPasswordChangeLoading] = useState(false);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState("");
  const [passwordChangeError, setPasswordChangeError] = useState("");

  function validateStrongPassword(pw) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(pw);
  }

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordChangeSuccess("");
    setPasswordChangeError("");
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordChangeError("All fields are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordChangeError("New passwords do not match.");
      return;
    }
    if (!validateStrongPassword(newPassword)) {
      setPasswordChangeError("Password must be at least 8 characters, include uppercase, lowercase, number, and special character.");
      return;
    }
    setPasswordChangeLoading(true);
    try {
      const token = localStorage.getItem('token');
      const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://population-forecast-of-malawi.onrender.com";
      const res = await fetch(`${API_BASE_URL}/api/user/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (!res.ok) throw new Error('Failed to change password');
      setPasswordChangeSuccess('Password changed successfully!');
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (err) {
      setPasswordChangeError(err.message || 'Error changing password');
    } finally {
      setPasswordChangeLoading(false);
    }
  };
  const navigate = useNavigate();
  const { setTheme: setGlobalTheme } = useThemeContext();

  React.useEffect(() => {
    if (user) {
      setProfile(user);
      setTheme(user.theme || 'light');
      setNotifications(user.notifications ?? true);
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => setPassword(e.target.value);

  const updateUserField = async (fields) => {
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      const token = localStorage.getItem('token');
      const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://population-forecast-of-malawi.onrender.com";
      const res = await fetch(`${API_BASE_URL}/api/user/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(fields),
      });
      if (!res.ok) throw new Error('Failed to update profile');
      const updatedUser = await res.json();
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setSuccess('Settings updated!');
      return updatedUser;
    } catch (err) {
      setError(err.message || 'Error updating settings');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleThemeChange = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    setGlobalTheme(newTheme);
    try {
      await updateUserField({ theme: newTheme });
    } catch {}
  };

  const handleNotificationsChange = async () => {
    const newNotifications = !notifications;
    setNotifications(newNotifications);
    try {
      await updateUserField({ notifications: newNotifications });
    } catch {}
  };

  const handleSave = async () => {
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      const token = localStorage.getItem('token');
      const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://population-forecast-of-malawi.onrender.com";
      const res = await fetch(`${API_BASE_URL}/api/user/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: profile.name,
          email: profile.email,
          ...(password ? { password } : {}),
        }),
      });
      if (!res.ok) throw new Error('Failed to update profile');
      const updatedUser = await res.json();
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setSuccess('Profile updated successfully!');
      setPassword('');
    } catch (err) {
      setError(err.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteDialogOpen(false);
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      const token = localStorage.getItem('token');
      const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://population-forecast-of-malawi.onrender.com";
      const res = await fetch(`${API_BASE_URL}/api/user/profile`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to delete account');
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null);
      navigate('/signin');
    } catch (err) {
      setError(err.message || 'Error deleting account');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/signin');
  };

  return (
    <Box sx={{ mt: { xs: 1, md: 2 }, mb: { xs: 2, md: 4 }, px: { xs: 1, sm: 2, md: 4 } }}>
      <Fade in timeout={900}>
        <Box>
          <Typography 
            variant="h3" 
            fontWeight={800} 
            gutterBottom 
            sx={{ 
              letterSpacing: 1, 
              color: '#212B36', 
              textAlign: 'center', 
              mb: { xs: 1, md: 2 },
              fontSize: { xs: '1.75rem', sm: '2.125rem', md: '3rem' }
            }}
          >
            <SettingsIcon sx={{ 
              fontSize: { xs: 32, md: 40 }, 
              color: '#3366FF', 
              mb: -1, 
              mr: 1 
            }} />
            Settings
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: { xs: 2, md: 3 }, 
              maxWidth: 700, 
              mx: 'auto', 
              color: '#637381', 
              textAlign: 'center', 
              fontWeight: 400,
              fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' },
              px: { xs: 1, md: 0 }
            }}
          >
            Manage your profile, preferences, and account settings.
          </Typography>
          <Grid container spacing={{ xs: 2, md: 3 }} justifyContent="center">
            {/* Profile Section */}
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: { xs: 3, md: 5 }, mb: { xs: 2, md: 3 } }}>
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                  <Typography 
                    variant="subtitle1" 
                    fontWeight={700} 
                    mb={2}
                    sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}
                  >
                    Profile
                  </Typography>
                  <TextField
                    label="Name"
                    name="name"
                    value={profile.name}
                    onChange={handleProfileChange}
                    fullWidth
                    margin="normal"
                    size="small"
                  />
                  <TextField
                    label="Email"
                    name="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                    fullWidth
                    margin="normal"
                    size="small"
                  />
                  <TextField
                    label="Change Password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={handlePasswordChange}
                    fullWidth
                    margin="normal"
                    size="small"
                  />
                  <FormControlLabel
                    control={<Switch checked={showPassword} onChange={() => setShowPassword((s) => !s)} />}
                    label="Show Password"
                    sx={{ mt: 1 }}
                  />
                  <Button 
                    variant="contained" 
                    color="primary" 
                    sx={{ mt: 2 }} 
                    onClick={handleSave} 
                    disabled={loading}
                    fullWidth
                  >
                    {loading ? <CircularProgress size={24} /> : 'Save Changes'}
                  </Button>
                  {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
                  {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                </CardContent>
              </Card>
            </Grid>
            {/* Change Password Section */}
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: { xs: 3, md: 5 }, mb: { xs: 2, md: 3 } }}>
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                  <Typography variant="subtitle1" fontWeight={700} mb={2} sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>
                    Change Password
                  </Typography>
                  <form onSubmit={handleChangePassword}>
                    <TextField
                      label="Current Password"
                      type="password"
                      value={currentPassword}
                      onChange={e => setCurrentPassword(e.target.value)}
                      fullWidth
                      margin="normal"
                      size="small"
                    />
                    <TextField
                      label="New Password"
                      type="password"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      fullWidth
                      margin="normal"
                      size="small"
                    />
                    <TextField
                      label="Confirm New Password"
                      type="password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      fullWidth
                      margin="normal"
                      size="small"
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ mt: 2 }}
                      type="submit"
                      disabled={passwordChangeLoading}
                      fullWidth
                    >
                      {passwordChangeLoading ? <CircularProgress size={24} /> : 'Change Password'}
                    </Button>
                    {passwordChangeSuccess && <Alert severity="success" sx={{ mt: 2 }}>{passwordChangeSuccess}</Alert>}
                    {passwordChangeError && <Alert severity="error" sx={{ mt: 2 }}>{passwordChangeError}</Alert>}
                  </form>
                </CardContent>
              </Card>
            </Grid>
            {/* Preferences Section */}
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: { xs: 3, md: 5 }, mb: { xs: 2, md: 3 } }}>
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                  <Typography 
                    variant="subtitle1" 
                    fontWeight={700} 
                    mb={2}
                    sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}
                  >
                    Preferences
                  </Typography>
                  <FormControlLabel
                    control={<Switch checked={theme === 'dark'} onChange={handleThemeChange} />}
                    label="Dark Theme"
                  />
                  <FormControlLabel
                    control={<Switch checked={notifications} onChange={handleNotificationsChange} />}
                    label="Enable Notifications"
                  />
                </CardContent>
              </Card>
              {/* Account Actions */}
              <Card sx={{ borderRadius: { xs: 3, md: 5 }, background: 'rgba(255,0,0,0.04)' }}>
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                  <Typography 
                    variant="subtitle1" 
                    fontWeight={700} 
                    mb={2}
                    sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}
                  >
                    Account
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1 }}>
                    <Button 
                      variant="outlined" 
                      color="error" 
                      onClick={() => setDeleteDialogOpen(true)}
                      fullWidth={false}
                    >
                      Delete Account
                    </Button>
                    <Button 
                      variant="contained" 
                      color="secondary" 
                      onClick={handleSignOut}
                      fullWidth={false}
                    >
                      Sign Out
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete your account? This action cannot be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
                Cancel
              </Button>
              <Button onClick={handleDeleteAccount} color="error" variant="contained" autoFocus disabled={loading}>
                {loading ? <CircularProgress size={20} /> : 'Delete'}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Fade>
    </Box>
  );
};

export default Settings;

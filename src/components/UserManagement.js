import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  styled,
  useTheme,
  CircularProgress,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Fade,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import EditIcon from '@mui/icons-material/Edit';
import PeopleIcon from '@mui/icons-material/People';
import SearchIcon from '@mui/icons-material/Search';

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: '8px',
  boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
}));

const StatusChip = styled(Chip)(({ status, theme }) => ({
  backgroundColor: status === 'Active' ? theme.palette.success.light : theme.palette.error.light,
  color: status === 'Active' ? theme.palette.success.dark : theme.palette.error.dark,
  fontWeight: 600,
  fontSize: '0.75rem',
}));

const RoleChip = styled(Chip)(({ role, theme }) => ({
  backgroundColor: role === 'admin' ? theme.palette.primary.light : theme.palette.info.light,
  color: role === 'admin' ? theme.palette.primary.dark : theme.palette.info.dark,
  fontWeight: 600,
  fontSize: '0.75rem',
}));

const UserManagement = () => {
  const theme = useTheme();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [search, setSearch] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'User',
    status: 'Active',
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse current user from localStorage', e);
      }
    }

    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      console.log('UserManagement fetch token:', token);
      const url = '/api/users';
      console.log('UserManagement fetch URL:', url);
      
      if (!token) {
        setError("No authentication token found. Please log in.");
        setLoading(false);
        return;
      }
      
      try {
        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        console.log('UserManagement fetch response status:', response.status);

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Failed to fetch users');
        }

        const text = await response.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          setError('Server returned an invalid response. Please check your backend.');
          console.error('Invalid JSON from server:', text);
          setUsers([]);
          setFilteredUsers([]);
          return;
        }
        console.log('Fetched users:', data);
        setUsers(data);
        setFilteredUsers(data);
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleApiCall = async (url, options) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        setError('Server returned an invalid response. Please check your backend.');
        console.error('Invalid JSON from server:', text);
        return null;
      }
      if (!response.ok) {
        throw new Error(data.message || 'An API error occurred');
      }
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const result = await handleApiCall(`/api/users/${userId}`, { method: 'DELETE' });
      if (result) {
        setUsers(users.filter((user) => user.id !== userId));
        setFilteredUsers(filteredUsers.filter((user) => user.id !== userId));
      }
    }
  };

  const handleMakeAdmin = async (userId) => {
    if (window.confirm('Are you sure you want to make this user an admin?')) {
      const result = await handleApiCall(`/api/users/${userId}/make-admin`, { method: 'PUT' });
      if (result) {
        setUsers(users.map((user) => (user.id === userId ? { ...user, role: 'admin' } : user)));
        setFilteredUsers(filteredUsers.map((user) => (user.id === userId ? { ...user, role: 'admin' } : user)));
      }
    }
  };

  const calculateStatus = (lastLogin) => {
    if (!lastLogin) {
      return 'Inactive'; // Never logged in
    }
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    return new Date(lastLogin) > twoHoursAgo ? 'Active' : 'Inactive';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const result = await handleApiCall(`/api/users/${editingUser.id}`, {
      method: 'PUT',
      body: JSON.stringify(formData),
    });
    if (result) {
      setUsers(users.map((user) => (user.id === editingUser.id ? { ...user, ...formData } : user)));
      setFilteredUsers(filteredUsers.map((user) => (user.id === editingUser.id ? { ...user, ...formData } : user)));
      setDialogOpen(false);
    }
  };

  if (loading) {
    return <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: '60vh' }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: '60vh' }}><Typography color="error">{error}</Typography></Box>;
  }

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
            <PeopleIcon sx={{ 
              fontSize: { xs: 32, md: 40 }, 
              color: '#3366FF', 
              mb: -1, 
              mr: 1 
            }} />
            User Management
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
            Manage user accounts, permissions, and system access.
          </Typography>

          <Box sx={{ mb: { xs: 2, md: 3 }, display: 'flex', justifyContent: 'center' }}>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search users..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setFilteredUsers(users.filter(user => 
                  (user.name ? user.name.toLowerCase() : '').includes(e.target.value.toLowerCase()) ||
                  (user.email ? user.email.toLowerCase() : '').includes(e.target.value.toLowerCase())
                ));
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ 
                width: { xs: '100%', sm: 320 },
                maxWidth: '100%'
              }}
            />
          </Box>

          <Card sx={{ 
            borderRadius: { xs: 3, md: 5 }, 
            background: 'rgba(227,234,252,0.7)', 
            boxShadow: '0 4px 24px 0 rgba(51,102,255,0.08)', 
            p: { xs: 1, md: 2 } 
          }}>
            <CardContent>
              <Box sx={{ overflowX: 'auto' }}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ 
                          fontWeight: 600,
                          fontSize: { xs: '0.875rem', md: '1rem' }
                        }}>
                          Name
                        </TableCell>
                        <TableCell sx={{ 
                          fontWeight: 600,
                          fontSize: { xs: '0.875rem', md: '1rem' }
                        }}>
                          Email
                        </TableCell>
                        <TableCell sx={{ 
                          fontWeight: 600,
                          fontSize: { xs: '0.875rem', md: '1rem' }
                        }}>
                          Role
                        </TableCell>
                        <TableCell sx={{ 
                          fontWeight: 600,
                          fontSize: { xs: '0.875rem', md: '1rem' }
                        }}>
                          Status
                        </TableCell>
                        <TableCell sx={{ 
                          fontWeight: 600,
                          fontSize: { xs: '0.875rem', md: '1rem' }
                        }}>
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell sx={{ 
                            fontSize: { xs: '0.875rem', md: '1rem' }
                          }}>
                            {user.name || user.fullName || user.username || <span style={{color:'#bbb'}}>No Name</span>}
                          </TableCell>
                          <TableCell sx={{ 
                            fontSize: { xs: '0.875rem', md: '1rem' }
                          }}>
                            {user.email}
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={user.role} 
                              color={user.role === 'Admin' ? 'error' : 'primary'}
                              size="small"
                              sx={{ 
                                fontSize: { xs: '0.75rem', md: '0.875rem' }
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={user.status} 
                              color={user.status === 'Active' ? 'success' : 'default'}
                              size="small"
                              sx={{ 
                                fontSize: { xs: '0.75rem', md: '0.875rem' }
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: { xs: 0.5, md: 1 } }}>
                              <IconButton 
                                size="small" 
                                onClick={() => handleEdit(user)}
                                sx={{ 
                                  '& .MuiSvgIcon-root': {
                                    fontSize: { xs: 16, md: 20 }
                                  }
                                }}
                              >
                                <EditIcon />
                              </IconButton>
                              {user.role !== 'admin' && (
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleDelete(user.id)}
                                  color="error"
                                  sx={{ 
                                    '& .MuiSvgIcon-root': {
                                      fontSize: { xs: 16, md: 20 }
                                    }
                                  }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              )}
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </CardContent>
          </Card>

          <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle>
              {editingUser ? 'Edit User' : 'Add User'}
            </DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                margin="normal"
                size="small"
              />
              <TextField
                fullWidth
                label="Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                margin="normal"
                size="small"
              />
              <FormControl fullWidth margin="normal" size="small">
                <InputLabel>Role</InputLabel>
                <Select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <MenuItem value="User">User</MenuItem>
                  <MenuItem value="Admin">Admin</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal" size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} variant="contained">
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Fade>
    </Box>
  );
};

export default UserManagement;
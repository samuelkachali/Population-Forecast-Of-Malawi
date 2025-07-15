import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Box,
  useMediaQuery,
  useTheme,
  Popover,
  Badge,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tooltip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useNotification } from '../contexts/NotificationContext';
import { useCallback } from 'react';
import EmailJS from '@emailjs/browser';
import EmailIcon from '@mui/icons-material/Email';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Slide,
} from '@mui/material';

const drawerWidth = 300;

const SERVICE_ID = 'service_063woyg';
const TEMPLATE_ID = 'template_h6i7u08';
const PUBLIC_KEY = 'y0vKzQQa8G672Tlaw';

const DashboardHeader = ({ onToggleSidebar }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { user, loading } = useUser();
  const { notifications, unreadCount, markAllAsRead, removeNotification, clearAllNotifications } = useNotification();
  const handleNotificationClick = useCallback((notif) => {
    if (notif.link) {
      handleNotifClose();
      navigate(notif.link);
    }
  }, [navigate]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [notifAnchorEl, setNotifAnchorEl] = React.useState(null);
  const [contactOpen, setContactOpen] = React.useState(false);
  const [contactForm, setContactForm] = React.useState({ name: '', email: '', message: '' });
  const [contactLoading, setContactLoading] = React.useState(false);
  const [contactSuccess, setContactSuccess] = React.useState(false);
  const [contactError, setContactError] = React.useState('');

  const handleContactOpen = () => setContactOpen(true);
  const handleContactClose = () => {
    setContactOpen(false);
    setContactForm({ name: '', email: '', message: '' });
    setContactSuccess(false);
    setContactError('');
  };
  const handleContactChange = (e) => {
    setContactForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactLoading(true);
    setContactError('');
    setContactSuccess(false);
    try {
      await EmailJS.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          name: contactForm.name,
          email: contactForm.email,
          message: contactForm.message,
        },
        PUBLIC_KEY
      );
      setContactLoading(false);
      setContactSuccess(true);
      setContactForm({ name: '', email: '', message: '' });
    } catch (err) {
      setContactLoading(false);
      setContactError('Failed to send message. Please try again.');
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/signin');
  };

  // Get initial (first letter) from user name/email/username
  const getInitial = () => {
    if (!user) return '?';
    const name = user.username || user.email || '';
    return name.charAt(0).toUpperCase();
  };

  const getDisplayName = () => {
    if (!user) return 'Unknown User';
    return user.username || user.email || 'Unknown User';
  };

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'profile-popover' : undefined;

  // Notification popover
  const notifOpen = Boolean(notifAnchorEl);
  const notifId = notifOpen ? 'notification-popover' : undefined;
  const handleNotifClick = (event) => {
    setNotifAnchorEl(event.currentTarget);
  };
  const handleNotifClose = () => {
    setNotifAnchorEl(null);
  };

  console.log('DashboardHeader user context:', user);

  if (loading) return null;

  return (
    <AppBar
      position="fixed"
      color="default"
      elevation={1}
      sx={{
        zIndex: theme.zIndex.drawer + 1,
        background: '#fff',
        ml: { md: `${drawerWidth}px` },
        width: { md: `calc(100% - ${drawerWidth}px)` },
        borderBottom: '1px solid #e0e0e0',
      }}
    >
      <Toolbar sx={{ minHeight: 64, px: { xs: 1, sm: 3 } }}>
        {isMobile && (
          <IconButton edge="start" color="inherit" onClick={onToggleSidebar} sx={{ mr: 1 }}>
            <MenuIcon />
          </IconButton>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Typography
            variant="h5"
            fontWeight={900}
            color="#257a5a"
            sx={{ letterSpacing: 1, cursor: 'pointer' }}
            onClick={() => navigate('/dashboard/overview')}
          >
            PFOM
          </Typography>
        </Box>
        <Tooltip title="Contact Us" placement="bottom">
          <IconButton
            color="primary"
            sx={{ ml: 2 }}
            onClick={handleContactOpen}
          >
            <EmailIcon />
          </IconButton>
        </Tooltip>
        {/* Contact Modal */}
        <Dialog open={contactOpen} onClose={handleContactClose} TransitionComponent={Slide} TransitionProps={{ direction: 'down' }} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EmailIcon color="primary" /> Contact Us
          </DialogTitle>
          <DialogContent>
            {contactSuccess && <Alert severity="success" sx={{ mb: 2 }}>Thank you! Your message has been sent.</Alert>}
            {contactError && <Alert severity="error" sx={{ mb: 2 }}>{contactError}</Alert>}
            <Box component="form" onSubmit={handleContactSubmit}>
              <TextField
                label="Name"
                name="name"
                value={contactForm.name}
                onChange={handleContactChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                value={contactForm.email}
                onChange={handleContactChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Message"
                name="message"
                value={contactForm.message}
                onChange={handleContactChange}
                fullWidth
                margin="normal"
                required
                multiline
                minRows={4}
              />
              <DialogActions sx={{ px: 0, pt: 2 }}>
                <Button onClick={handleContactClose} color="secondary">Cancel</Button>
                <Button type="submit" variant="contained" color="primary" disabled={contactLoading}>
                  {contactLoading ? 'Sending...' : 'Send'}
                </Button>
              </DialogActions>
            </Box>
          </DialogContent>
        </Dialog>
        <IconButton color="inherit" sx={{ ml: 1 }} onClick={handleNotifClick}>
          <Badge badgeContent={unreadCount} color="error" overlap="circular">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <IconButton sx={{ ml: 2 }} color="inherit" onClick={handleAvatarClick}>
          <Avatar sx={{ bgcolor: '#257a5a', width: 36, height: 36 }}>
            {getInitial()}
          </Avatar>
        </IconButton>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handlePopoverClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{ sx: { p: 2, minWidth: 180 } }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {getDisplayName()}
          </Typography>
          <Typography variant="body2" sx={{ color: '#257a5a', fontWeight: 500, mt: 0.5 }}>
            {user && user.role ? (user.role.charAt(0).toUpperCase() + user.role.slice(1)) : ''}
          </Typography>
        </Popover>
        {/* Notification Popover */}
        <Popover
          id={notifId}
          open={notifOpen}
          anchorEl={notifAnchorEl}
          onClose={handleNotifClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{ sx: { p: 0, minWidth: 320, maxWidth: 360, maxHeight: 400, overflowY: 'auto' } }}
        >
          <Box sx={{ p: 2, borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="subtitle1" fontWeight={700}>Notifications</Typography>
            <Box>
              <IconButton size="small" onClick={markAllAsRead} title="Mark all as read">
                <DoneAllIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={clearAllNotifications} title="Clear all notifications">
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
          <List dense disablePadding>
            {notifications.length === 0 && (
              <ListItem>
                <ListItemText primary="No notifications yet." />
              </ListItem>
            )}
            {notifications.map((notif) => (
              <ListItem
                key={notif.id}
                sx={{
                  bgcolor: notif.read ? 'inherit' : 'rgba(33,150,243,0.07)',
                  cursor: notif.link ? 'pointer' : 'default',
                  '&:hover': notif.link ? { backgroundColor: 'rgba(33,150,243,0.13)' } : {},
                  transition: 'background 0.2s',
                }}
                onClick={() => handleNotificationClick(notif)}
                secondaryAction={
                  <IconButton edge="end" size="small" onClick={e => { e.stopPropagation(); removeNotification(notif.id); }}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                }
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <NotificationsIcon color={notif.read ? 'disabled' : 'primary'} fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={notif.message}
                  secondary={new Date(notif.time).toLocaleString()}
                  primaryTypographyProps={{ fontWeight: notif.read ? 400 : 700, fontSize: '0.98rem' }}
                  secondaryTypographyProps={{ fontSize: '0.82rem', color: 'text.secondary' }}
                />
              </ListItem>
            ))}
          </List>
        </Popover>
      </Toolbar>
    </AppBar>
  );
};

export default DashboardHeader;
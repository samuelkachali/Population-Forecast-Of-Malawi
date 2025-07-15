import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  styled,
  InputBase,
  useTheme,
  useMediaQuery,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Slide,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import EmailIcon from '@mui/icons-material/Email';
import { useNavigate } from 'react-router-dom';
import EmailJS from '@emailjs/browser';

const DARK_BG = '#257a5a';
const LIGHT_BG = '#fff';

const SERVICE_ID = 'service_063woyg';
const TEMPLATE_ID = 'template_h6i7u08';
const PUBLIC_KEY = 'y0vKzQQa8G672Tlaw';

const StyledAppBar = styled(AppBar)(({ theme, scrolled }) => ({
  backgroundColor: scrolled ? LIGHT_BG : 'transparent',
  color: scrolled ? '#222' : '#fff',
  boxShadow: scrolled ? '0 2px 12px 0 rgba(24,28,36,0.08)' : 'none',
  borderBottom: scrolled ? '1px solid #e0e0e0' : 'none',
  zIndex: theme.zIndex.drawer + 1,
  position: 'fixed',
  top: 0,
  width: '100%',
  transition: 'background-color 0.35s, color 0.35s, box-shadow 0.35s, border-bottom 0.35s',
}));

const NavLink = styled(Typography)(({ theme, scrolled }) => ({
  cursor: 'pointer',
  margin: '0 18px',
  fontWeight: 500,
  fontSize: '1rem',
  color: scrolled ? '#222' : '#fff',
  transition: 'color 0.45s',
  textDecoration: 'none',
  '&:hover': {
    // color: '#257a5a',
    textDecoration: 'underline',
    textDecorationColor: '#f88070',
    textUnderlineOffset: '4px',
    textDecorationThickness: '3px',
  },
}));

const BrandTypography = styled(Typography)(({ theme, scrolled }) => ({
  fontWeight: 700,
  fontSize: '1.35rem',
  letterSpacing: '0.03em',
  color: scrolled ? theme.palette.primary.main : '#fff',
  cursor: 'pointer',
  transition: 'color 0.35s',
}));

const Search = styled('div')(({ theme, scrolled }) => ({
  position: 'relative',
  borderRadius: '30px',
  backgroundColor: scrolled ? theme.palette.grey[100] : 'rgba(255,255,255,0.12)',
  marginLeft: 'auto',
  width: '220px',
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
  '&:hover': {
    backgroundColor: scrolled ? theme.palette.grey[200] : 'rgba(255,255,255,0.18)',
  },
  transition: 'background-color 0.35s',
}));

const SearchIconWrapper = styled('div')(({ theme, scrolled }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: scrolled ? theme.palette.text.secondary : '#fff',
  transition: 'color 0.35s',
}));

const StyledInputBase = styled(InputBase)(({ theme, scrolled }) => ({
  color: scrolled ? theme.palette.text.primary : '#fff',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1.5, 1.5, 1.5, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    width: '100%',
    fontSize: '0.95rem',
  },
  transition: 'color 0.35s',
}));

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Forecasts', path: '/signin' },
  { label: 'Data', path: '/data' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

const Header = ({ forceWhite, onToggleSidebar }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactError, setContactError] = useState('');

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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Use forceWhite if provided, otherwise use scroll state
  const effectiveScrolled = forceWhite ? true : scrolled;

  return (
    <StyledAppBar position="static" scrolled={effectiveScrolled ? 1 : 0} elevation={0}>
      <Toolbar sx={{ minHeight: 64, px: { xs: 1, sm: 3 } }}>
        <BrandTypography onClick={() => navigate('/')} scrolled={effectiveScrolled ? 1 : 0} sx={{ pl: { xs: 2, sm: 4 } }}>
          Population Forecast Of Malawi
        </BrandTypography>
        <Box sx={{ flexGrow: 1 }} />
        {!isMobile && navItems.map((item) => (
          <NavLink key={item.label} onClick={() => item.label === 'Contact' ? handleContactOpen() : navigate(item.path)} scrolled={effectiveScrolled ? 1 : 0}>
            {item.label}
          </NavLink>
        ))}
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
        <Search scrolled={effectiveScrolled ? 1 : 0}>
          <SearchIconWrapper scrolled={effectiveScrolled ? 1 : 0}>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase placeholder="Search…" inputProps={{ 'aria-label': 'search' }} scrolled={effectiveScrolled ? 1 : 0} />
        </Search>
        {isMobile && (
          <IconButton edge="end" color="inherit" onClick={onToggleSidebar}>
            <MenuIcon />
          </IconButton>
        )}
      </Toolbar>
    </StyledAppBar>
  );
};

export default Header; 
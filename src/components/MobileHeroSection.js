import React, { useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  useTheme,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  useScrollTrigger,
  Slide
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PeopleIcon from '@mui/icons-material/People';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import BusinessIcon from '@mui/icons-material/Business';
import { useNavigate } from 'react-router-dom';

const stats = [
  {
    label: 'Population (mid-year 2025)',
    value: '20,734,262',
    icon: <PeopleIcon sx={{ fontSize: 30, color: 'white' }} />,
  },
  {
    label: 'Headline Inflation (May 2025)',
    value: '27.7%',
    icon: <LocalOfferIcon sx={{ fontSize: 30, color: 'white' }} />,
  },
  {
    label: '2023 Real GDP at 2017 constant prices (million kwacha)',
    value: '7,808,389.1',
    icon: <CameraAltIcon sx={{ fontSize: 30, color: 'white' }} />,
  },
  {
    label: 'Trade Balance in billion Kwacha (March 2025)',
    value: '-359.7',
    icon: <BusinessIcon sx={{ fontSize: 30, color: 'white' }} />,
  },
];

const backgroundUrl = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80'; // Same as desktop hero

const menuItems = [
  { text: 'Home', path: '/' },
  { text: 'About', path: '/about' },
  { text: 'Dashboard', path: '/dashboard' },
  { text: 'Sign In', path: '/signin' },
];

function FixedPFOMBar({ onMenuOpen }) {
  return (
    <Slide appear={false} direction="down" in={useScrollTrigger({ threshold: 10 })}>
      <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, bgcolor: 'rgba(24,28,36,0.98)', zIndex: 1200, boxShadow: 1, px: 2, py: 1.2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#fff', fontSize: '1rem', letterSpacing: 0.5 }}>
          PFOM
        </Typography>
        <IconButton aria-label="menu" onClick={onMenuOpen} sx={{ color: '#fff', background: 'rgba(0,0,0,0.10)' }}>
          <MenuIcon fontSize="large" />
        </IconButton>
      </Box>
    </Slide>
  );
}

const MobileHeroSection = () => {
  const theme = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const trigger = useScrollTrigger({ threshold: 10 });
  const navigate = useNavigate();

  const handleMenuOpen = () => setMenuOpen(true);
  const handleMenuClose = () => setMenuOpen(false);
  const handleMenuClick = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundImage: `url(${backgroundUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Dark overlay for readability */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(120deg, rgba(24,28,36,0.92) 60%, rgba(24,28,36,0.85) 100%)',
          zIndex: 1,
        }}
      />
      {/* Top Bar (only at top) */}
      {!trigger && (
        <Box
          sx={{
            position: 'relative',
            zIndex: 2,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            pt: 2.5,
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <Typography
              variant="subtitle2"
              fontWeight={700}
              sx={{ color: '#fff', letterSpacing: 0.5, fontSize: '0.98rem', lineHeight: 1.1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
            >
              Population Forecast
            </Typography>
            <Typography
              variant="subtitle2"
              fontWeight={700}
              sx={{ color: '#fff', letterSpacing: 0.5, fontSize: '0.98rem', lineHeight: 1.1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
            >
              of Malawi
            </Typography>
          </Box>
          <IconButton
            aria-label="menu"
            onClick={handleMenuOpen}
            sx={{ color: '#fff', background: 'rgba(0,0,0,0.10)' }}
          >
            <MenuIcon fontSize="large" />
          </IconButton>
        </Box>
      )}
      {/* Fixed PFOM Bar (only when scrolling) */}
      <FixedPFOMBar onMenuOpen={handleMenuOpen} />
      {/* Drawer */}
      <Drawer
        anchor="right"
        open={menuOpen}
        onClose={handleMenuClose}
        PaperProps={{ sx: { width: 220, pt: 2 } }}
      >
        <Typography variant="h6" textAlign="center" fontWeight={700} sx={{ color: theme.palette.success.main, mb: 1 }}>
          Menu
        </Typography>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem button key={item.text} onClick={() => handleMenuClick(item.path)}>
              <ListItemText primary={item.text} primaryTypographyProps={{ textAlign: 'center', fontWeight: 500 }} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      {/* Main Content */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          minHeight: '80vh',
          px: 2,
          pt: 8, // Add more top padding for mobile
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="subtitle2"
          fontWeight={700}
          sx={{ color: theme.palette.success.light, letterSpacing: 1, mb: 1, textTransform: 'uppercase', fontSize: '0.9rem', textAlign: 'center' }}
        >
          Forecasting <span style={{ color: '#f88070' }}>Malawi's Future</span>—Powered by <span style={{ color: '#f88070' }}>Data</span>.
        </Typography>
        {/* Two-line centered heading */}
        <Typography
          variant="h5"
          fontWeight={800}
          sx={{
            color: '#fff',
            mb: 0.5,
            fontSize: { xs: '1.15rem', sm: '1.25rem' },
            lineHeight: 1.18,
            letterSpacing: 0.5,
            background: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 4px 16px rgba(33,150,243,0.13)',
            display: 'block',
            textAlign: 'center',
          }}
        >
          Accurate, accessible,
        </Typography>
        <Typography
          variant="h5"
          fontWeight={800}
          sx={{
            color: '#fff',
            mb: 2,
            fontSize: { xs: '1.15rem', sm: '1.25rem' },
            lineHeight: 1.18,
            letterSpacing: 0.5,
            background: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 4px 16px rgba(33,150,243,0.13)',
            display: 'block',
            textAlign: 'center',
          }}
        >
          and actionable population insights.
        </Typography>
      </Box>
    </Box>
  );
};

export default MobileHeroSection;

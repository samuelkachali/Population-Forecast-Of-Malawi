import React from 'react';
import { Box, Typography, Grid, useTheme, Button, Link as MuiLink } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import BusinessIcon from '@mui/icons-material/Business';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const backgroundUrl = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80'; // Malawi landscape

const HeroSection = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  return (
    <Box sx={{
      position: 'relative',
      width: '100%',
      minHeight: { xs: '100vh', md: '100vh' },
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      mb: 6,
      overflow: 'hidden',
    }}>
      {/* SVG Curvy Top */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 4, pointerEvents: 'none' }}>
        <svg viewBox="0 0 1440 180" width="100%" height="120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0,55 Q720,90 1440,55 L1440,0 L0,0 Z" fill="#f88070" fillOpacity="0.38"/>
          <path d="M0,80 Q720,160 1440,80 L1440,0 L0,0 Z" fill="#257a5a"/>
        </svg>
      </Box>
      {/* Floating Malawi Map SVG */}
      <Box sx={{ position: 'absolute', right: 40, bottom: 60, zIndex: 4, opacity: 0.18, pointerEvents: 'none', display: { xs: 'none', md: 'block' } }}>
        <motion.div
          animate={{ y: [0, -18, 0], rotate: [0, 2, -2, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg width="120" height="240" viewBox="0 0 120 240" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M60 10 Q80 60 60 120 Q40 180 60 230" stroke="#257a5a" strokeWidth="8" fill="none" />
            <circle cx="60" cy="10" r="10" fill="#43e97b" />
            <circle cx="60" cy="230" r="10" fill="#f88070" />
          </svg>
        </motion.div>
      </Box>
      {/* Background image with blur */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${backgroundUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 1,
          filter: 'blur(2px) scale(1.04)',
        }}
      />
      {/* Dark overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(120deg, rgba(24,28,36,0.88) 60%, rgba(24,28,36,0.80) 100%)',
          zIndex: 2,
        }}
      />
      {/* Blue gradient overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(120deg, rgba(33,150,243,0.18) 0%, rgba(24,28,36,0.0) 100%)',
          zIndex: 3,
        }}
      />
      {/* Content */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 5,
          width: '100%',
          maxWidth: 1200,
          mx: 'auto',
          pt: { xs: 7, md: 10 },
          pb: { xs: 4, md: 6 },
          textAlign: 'center',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h2"
            fontWeight={900}
            sx={{ color: '#fff', letterSpacing: 1, mb: 2, fontSize: { xs: '2.2rem', md: '3.5rem' }, textShadow: '0 2px 16px rgba(24,28,36,0.18)' }}
          >
            Welcome to PFOM – Malawi's Population Forecast Platform
          </Typography>
          <Typography
            variant="h5"
            fontWeight={400}
            sx={{ color: '#e3eafc', mb: 4, fontSize: { xs: '1.1rem', md: '1.5rem' }, textShadow: '0 2px 8px rgba(24,28,36,0.18)' }}
          >
            Empowering data-driven decisions for a brighter future.
          </Typography>
          {/* Animated CTA Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mb: 4 }}>
            <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="contained"
                size="large"
                color="success"
                sx={{ borderRadius: 3, fontWeight: 700, px: 4, py: 1.5, fontSize: { xs: '1rem', md: '1.15rem' }, boxShadow: '0 2px 12px rgba(33,150,243,0.13)' }}
                onClick={() => navigate('/signup')}
              >
                Sign Up
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outlined"
                size="large"
                color="inherit"
                sx={{ borderRadius: 3, fontWeight: 700, px: 4, py: 1.5, fontSize: { xs: '1rem', md: '1.15rem' }, color: '#fff', borderColor: '#fff', '&:hover': { borderColor: '#43e97b', color: '#43e97b' } }}
                onClick={() => navigate('/signin')}
              >
                Sign In
              </Button>
            </motion.div>
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
};

export default HeroSection; 
import React from 'react';
import { Box, Typography, Grid, useTheme } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import BusinessIcon from '@mui/icons-material/Business';
import { motion } from 'framer-motion';

const stats = [
  {
    label: 'Population (mid-year 2025)',
    value: '20,734,262',
    icon: <PeopleIcon fontSize="large" />,
  },
  {
    label: 'Headline Inflation (May 2025)',
    value: '27.7%',
    icon: <LocalOfferIcon fontSize="large" />,
  },
  {
    label: '2023 Real GDP at 2017 constant prices (million kwacha)',
    value: '7,808,389.1',
    icon: <CameraAltIcon fontSize="large" />,
  },
  {
    label: 'Trade Balance in billion Kwacha (March 2025)',
    value: '-359.7',
    icon: <BusinessIcon fontSize="large" />,
  },
];

const backgroundUrl = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80'; // Malawi landscape

const HeroSection = () => {
  const theme = useTheme();
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
          {/* Heading removed as requested */}
        </motion.div>
        <Grid
  container
  spacing={6}
  justifyContent="center"
  alignItems="center"
  sx={{ maxWidth: 1000, mx: 'auto', mt: 4 }}
>
  {/* LEFT COLUMN */}
  <Grid item xs={12} sm={6}>
    <Box display="flex" flexDirection="column" gap={4}>
      {[stats[0], stats[2]].map((stat) => (
        <Box
          key={stat.label}
          sx={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            transition: 'color 0.3s ease',
            '&:hover .iconCircle': {
              backgroundColor: '#f88070',
            },
            '&:hover .statText': {
              color: '#f88070',
            },
          }}
        >
          <Box
            className="iconCircle"
            sx={{
              width: 70,
              height: 70,
              borderRadius: '50%',
              background: theme.palette.success.main,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2,
              transition: 'background-color 0.3s ease',
            }}
          >
            {React.cloneElement(stat.icon, { fontSize: 'large', htmlColor: '#fff' })}
          </Box>
          <Box sx={{ textAlign: 'left' }}>
            <Typography
              variant="subtitle2"
              className="statText"
              fontWeight={600}
              sx={{
                mb: 0.5,
                lineHeight: 1.2,
                color: '#fff',
                transition: 'color 0.3s ease',
              }}
            >
              {stat.label}
          </Typography>
          <Typography
              variant="h5"
              className="statText"
              fontWeight={700}
              sx={{
                color: '#fff',
                transition: 'color 0.3s ease',
              }}
            >
              {stat.value}
          </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  </Grid>

  {/* RIGHT COLUMN */}
  <Grid item xs={12} sm={6}>
    <Box display="flex" flexDirection="column" gap={4}>
      {[stats[1], stats[3]].map((stat) => (
        <Box
          key={stat.label}
          sx={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            transition: 'color 0.3s ease',
            '&:hover .iconCircle': {
              backgroundColor: '#f88070',
            },
            '&:hover .statText': {
              color: '#f88070',
            },
          }}
        >
          <Box
            className="iconCircle"
                  sx={{
              width: 70,
              height: 70,
                    borderRadius: '50%',
              background: theme.palette.success.main,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
              mr: 2,
              transition: 'background-color 0.3s ease',
            }}
          >
            {React.cloneElement(stat.icon, { fontSize: 'large', htmlColor: '#fff' })}
                  </Box>
          <Box sx={{ textAlign: 'left' }}>
            <Typography
              variant="subtitle2"
              className="statText"
              fontWeight={600}
              sx={{
                mb: 0.5,
                lineHeight: 1.2,
                color: '#fff',
                transition: 'color 0.3s ease',
              }}
            >
              {stat.label}
            </Typography>
            <Typography
              variant="h5"
              className="statText"
              fontWeight={700}
              sx={{
                color: '#fff',
                transition: 'color 0.3s ease',
              }}
            >
                    {stat.value}
                  </Typography>
          </Box>
        </Box>
      ))}
    </Box>
            </Grid>
        </Grid>

      </Box>
    </Box>
  );
};

export default HeroSection; 
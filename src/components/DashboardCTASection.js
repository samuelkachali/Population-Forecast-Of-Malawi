import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import InsertChartIcon from '@mui/icons-material/InsertChart';

const backgroundUrl = 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1200&q=80';

const DashboardCTASection = () => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        my: 8,
        minHeight: 380,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: { xs: 2, md: 6 },
      }}
    >
      {/* Glassmorphism card */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 3,
          maxWidth: 540,
          width: '100%',
          mx: 'auto',
          px: { xs: 2, sm: 5 },
          py: { xs: 3, sm: 7 },
          borderRadius: 5,
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
          backdropFilter: 'blur(12px) saturate(160%)',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f3f7fa 100%)',
          border: '1.5px solid rgba(255,255,255,0.18)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <InsertChartIcon sx={{ fontSize: 32, color: 'primary.main', mb: 1, animation: 'pulse 1.6s infinite alternate' }} />
        <Typography
          variant="h5"
          fontWeight={800}
          mb={1.5}
          sx={{
            background: 'linear-gradient(90deg,rgb(63, 158, 93) 0%,rgb(52, 129, 98) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            color: '#257a5a',
            letterSpacing: 1,
            textShadow: '0 2px 8px rgba(24,28,36,0.18)',
            fontSize: { xs: '1.15rem', sm: '1.5rem', md: '2.2rem' },
          }}
        >
          Ready to Forecast the Future?
        </Typography>
        <Typography
          variant="body2"
          sx={{ mb: 2, color: '#333', fontSize: { xs: '0.95rem', sm: '1.05rem' } }}
        >
          Dive into our interactive dashboard to explore trends and forecast Malawi's population growth.
        </Typography>
        <Button
          variant="contained"
          size="large"
          sx={{
            mt: 2,
            px: 3,
            py: 1.2,
            fontSize: { xs: '1rem', sm: '1.1rem' },
            borderRadius: 3,
            fontWeight: 700,
            background: 'linear-gradient(90deg, #257a5a 0%, #43e97b 100%)',
            color: '#fff',
            boxShadow: '0 2px 8px rgba(33,150,243,0.10)',
            '&:hover': {
              background: 'linear-gradient(90deg, #43e97b 0%, #257a5a 100%)',
            },
          }}
          startIcon={<InsertChartIcon />}
          onClick={() => navigate('/dashboard')}
        >
          Explore the Dashboard
        </Button>
      </Box>
    </Box>
  );
};

export default DashboardCTASection; 
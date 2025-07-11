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
          px: { xs: 3, sm: 5 },
          py: { xs: 5, sm: 7 },
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
        <InsertChartIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2, animation: 'pulse 1.6s infinite alternate' }} />
        <Typography
          variant="h4"
          fontWeight={800}
          mb={2}
          sx={{
            background: 'linear-gradient(90deg,rgb(63, 158, 93) 0%,rgb(52, 129, 98) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            color: '#257a5a',
            letterSpacing: 1,
            textShadow: '0 2px 8px rgba(24,28,36,0.18)',
          }}
        >
          Ready to Forecast the Future?
        </Typography>
        <Typography
          variant="h6"
          sx={{ color: '#444', mb: 4, fontWeight: 400 }}
        >
          Dive into our interactive dashboard to explore trends and forecast Malawi's population growth.
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<InsertChartIcon />}
          sx={{
            fontWeight: 700,
            px: 5,
            py: 2,
            fontSize: '1.18rem',
            borderRadius: 3,
            boxShadow: 4,
            background: 'linear-gradient(90deg,#257a5a 60%, #43e97b 100%)',
            color: '#fff',
            transition: 'box-shadow 0.3s, background 0.3s',
            '&:hover': {
              background: 'linear-gradient(90deg,#257a5a 60%, #38f9d7 100%)',
              opacity: 0.95,
            },
          }}
          onClick={() => navigate('/dashboard/overview')}
        >
          Explore the Dashboard
        </Button>
      </Box>
    </Box>
  );
};

export default DashboardCTASection; 
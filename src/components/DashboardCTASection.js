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
        minHeight: 320,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: { xs: 3, md: 6 },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          zIndex: 3,
          maxWidth: 440,
          width: '100%',
          mx: 'auto',
          px: { xs: 3, sm: 4 },
          py: { xs: 3, sm: 6 },
          borderRadius: 5,
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.13)',
          backdropFilter: 'blur(10px) saturate(140%)',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f3f7fa 100%)',
          border: '1.5px solid rgba(255,255,255,0.13)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="h4"
          fontWeight={800}
          mb={1.5}
          sx={{
            background: 'linear-gradient(90deg,rgb(63, 158, 93) 0%,rgb(52, 129, 98) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            color: '#257a5a',
            letterSpacing: 1,
            textShadow: '0 2px 8px rgba(24,28,36,0.13)',
            fontSize: { xs: '1.15rem', sm: '1.5rem', md: '2rem' },
          }}
        >
          Ready to Explore?
        </Typography>
        <Typography
          variant="body1"
          sx={{ mb: 2, color: '#333', fontSize: { xs: '1rem', sm: '1.08rem' } }}
        >
          Jump into the dashboard and see Malawi’s population trends in action.
        </Typography>
        <Button
          variant="contained"
          size="large"
          sx={{
            mt: 2,
            px: 4,
            py: 1.3,
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
          Go to Dashboard
        </Button>
      </Box>
    </Box>
  );
};

export default DashboardCTASection; 
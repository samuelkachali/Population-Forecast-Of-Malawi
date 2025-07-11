import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  LinearProgress
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';

const InactivityWarning = ({ 
  isOpen, 
  onStayLoggedIn, 
  onLogout, 
  warningTime = 300000, // 5 minutes in milliseconds
  countdownTime = 60000  // 1 minute countdown
}) => {
  const [timeLeft, setTimeLeft] = useState(countdownTime);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(countdownTime);
      setProgress(100);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1000;
        const newProgress = (newTime / countdownTime) * 100;
        setProgress(newProgress);
        
        if (newTime <= 0) {
          onLogout();
          return countdownTime;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, countdownTime, onLogout]);

  const formatTime = (ms) => {
    const seconds = Math.ceil(ms / 1000);
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onLogout}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: { xs: 3, md: 4 },
          m: { xs: 2, md: 3 }
        }
      }}
    >
      <DialogTitle sx={{ 
        textAlign: 'center',
        fontSize: { xs: '1.25rem', md: '1.5rem' },
        fontWeight: 600
      }}>
        Session Timeout Warning
      </DialogTitle>
      <DialogContent>
        <Box sx={{ textAlign: 'center', py: { xs: 1, md: 2 } }}>
          <WarningIcon 
            sx={{ 
              fontSize: { xs: 48, md: 64 }, 
              color: 'warning.main', 
              mb: 2 
            }} 
          />
          <Typography 
            variant="body1" 
            sx={{ 
              mb: 2,
              fontSize: { xs: '0.875rem', md: '1rem' }
            }}
          >
            Your session will expire in {formatTime(timeLeft)} due to inactivity.
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              fontSize: { xs: '0.875rem', md: '1rem' }
            }}
          >
            Click "Stay Logged In" to continue your session, or you will be automatically signed out.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ 
        p: { xs: 2, md: 3 },
        justifyContent: 'center',
        gap: { xs: 1, md: 2 }
      }}>
        <Button 
          onClick={onLogout} 
          color="error" 
          variant="outlined"
          sx={{ 
            px: { xs: 2, md: 3 },
            py: { xs: 1, md: 1.5 },
            fontSize: { xs: '0.875rem', md: '1rem' }
          }}
        >
          Sign Out Now
        </Button>
        <Button 
          onClick={onStayLoggedIn} 
          variant="contained"
          sx={{ 
            px: { xs: 2, md: 3 },
            py: { xs: 1, md: 1.5 },
            fontSize: { xs: '0.875rem', md: '1rem' }
          }}
        >
          Stay Logged In
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InactivityWarning; 